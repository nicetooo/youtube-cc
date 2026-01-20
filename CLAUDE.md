# CLAUDE.md - 项目指南

## 项目概述

**CC Plus** - YouTube 学习增强平台，包含浏览器扩展和配套网站。

- **扩展:** 交互式双语字幕、生词收藏、划词翻译、宽屏模式、广告移除、评论增强
- **网站:** 生词管理、复习系统、用户账号 (youtube-cc.com)

## 技术栈

- **包管理:** pnpm workspace (monorepo)
- **扩展:** WXT 0.19 + Svelte 5 + TypeScript
- **网站:** SvelteKit + Vercel
- **样式:** Tailwind CSS 4
- **后端:** Firebase (Auth + Firestore)
- **本地存储:** chrome.storage.local (扩展) + IndexedDB (网站)
- **共享:** TypeScript 类型定义

## 项目结构

```
packages/
├── extension/                    # Chrome 扩展
│   ├── src/
│   │   ├── entrypoints/
│   │   │   ├── background.ts     # 后台脚本、同步服务
│   │   │   ├── content.ts        # YouTube 页面注入
│   │   │   ├── website-auth.content.ts  # 网站桥接脚本
│   │   │   ├── selection.content.ts     # 划词翻译
│   │   │   └── popup/            # 弹出页面
│   │   ├── features/             # caption/, ads/, comments/, player/
│   │   ├── shared/
│   │   │   ├── stores/
│   │   │   │   ├── settings.svelte.ts   # 设置状态
│   │   │   │   ├── words.svelte.ts      # 本地生词存储
│   │   │   │   └── sync.ts              # Firebase 同步服务
│   │   │   └── i18n/             # 多语言
│   │   └── public/               # 图标、语言包
│   └── wxt.config.ts
│
├── web/                          # 网站 (SvelteKit)
│   ├── src/
│   │   ├── routes/
│   │   │   ├── +page.svelte      # 首页
│   │   │   ├── words/            # 生词列表
│   │   │   └── review/           # 复习页面
│   │   └── lib/
│   │       ├── stores/
│   │       │   ├── auth.svelte.ts        # 认证状态
│   │       │   ├── words.svelte.ts       # 生词状态 (IndexedDB + Firebase)
│   │       │   ├── indexeddb.ts          # IndexedDB 操作
│   │       │   └── extension-sync.svelte.ts  # 扩展同步
│   │       └── components/
│   └── vite.config.ts            # 端口配置: 5188
│
└── shared/                       # 共享代码
    └── src/
        ├── types/index.ts        # Word, User, Settings 类型
        ├── firebase/             # Firebase 配置和方法
        └── constants/            # 存储键常量
```

## 常用命令

```bash
# 开发
pnpm dev:ext              # 开发扩展 (热重载)
pnpm dev:web              # 开发网站 → http://localhost:5188

# 构建
pnpm build:ext            # 构建扩展 → packages/extension/.output/chrome-mv3
pnpm build:web            # 构建网站
pnpm build:all            # 构建全部

# 检查
pnpm check                # 类型检查
pnpm lint                 # ESLint
pnpm format               # Prettier 格式化
```

## 开发流程

### 扩展开发

1. `pnpm build:ext` 创建初始构建
2. Chrome 加载 `packages/extension/.output/chrome-mv3`
3. `pnpm dev:ext` 启动热重载
4. `Cmd+Shift+R` 刷新 YouTube 页面

### 网站开发

1. `pnpm dev:web` 启动开发服务器
2. 访问 http://localhost:5188

## 数据同步架构

### 核心原则：本地优先

```
┌─────────────────────────────────────────────────────────────┐
│                        数据流                                │
├─────────────────────────────────────────────────────────────┤
│  扩展 chrome.storage.local                                   │
│           ↓ (postMessage)                                    │
│  网站 IndexedDB ←→ 显示                                      │
│           ↓ (登录用户，后台静默)                               │
│       Firebase (云端同步)                                     │
└─────────────────────────────────────────────────────────────┘
```

### 用户类型行为差异

| 操作       | 游客（匿名） | 登录用户                                 |
| ---------- | ------------ | ---------------------------------------- |
| 数据读取   | IndexedDB    | IndexedDB (优先显示) + Firebase 后台同步 |
| 添加生词   | IndexedDB    | IndexedDB + Firebase (后台)              |
| 更新/删除  | IndexedDB    | IndexedDB + Firebase (后台)              |
| 跨设备同步 | 不支持       | 支持                                     |

### 扩展 ↔ 网站通信

通过 `website-auth.content.ts` 桥接脚本实现：

```typescript
// 网站 → 扩展
window.postMessage({ source: "ccplus-web", type: "ping" }, "*");
window.postMessage(
  { source: "ccplus-web", type: "request-extension-words" },
  "*"
);
window.postMessage({ source: "ccplus-web", type: "login", user, token }, "*");

// 扩展 → 网站
window.postMessage({ source: "ccplus-extension", type: "pong" }, "*");
window.postMessage(
  { source: "ccplus-extension", type: "extension-words-response", words },
  "*"
);
```

### 同步流程

1. **网站加载时**
   - 自动匿名登录 (Firebase Auth)
   - 检测扩展是否安装 (ping/pong)
   - 从扩展获取本地生词 → 存入 IndexedDB
   - 显示 IndexedDB 数据

2. **用户登录后**
   - 后台将 IndexedDB 数据上传到 Firebase
   - 从 Firebase 下载云端数据合并到 IndexedDB
   - 去重逻辑：按 ID 和 text 判断

## 共享类型

```typescript
// packages/shared/src/types/index.ts

// 生词来源
type WordSource =
  | {
      type: "youtube-caption";
      videoId: string;
      videoTitle?: string;
      timestamp: number;
    }
  | { type: "webpage"; url: string; pageTitle?: string };

// 生词
interface Word {
  id: string;
  text: string;
  context: string; // 上下文句子
  translation?: string;
  source: WordSource; // 来源信息

  // SM-2 间隔重复
  easeFactor: number; // 默认 2.5
  interval: number; // 天数
  repetitions: number;
  nextReview: Date;
  status: "new" | "learning" | "mastered";

  createdAt: Date;
  updatedAt?: Date;
}
```

## 关键文件

### 扩展

| 文件                                  | 说明                         |
| ------------------------------------- | ---------------------------- |
| `entrypoints/background.ts`           | 后台脚本、消息处理、同步触发 |
| `entrypoints/website-auth.content.ts` | 网站桥接、认证状态同步       |
| `entrypoints/popup/App.svelte`        | 弹出页面 UI                  |
| `shared/stores/words.svelte.ts`       | 本地生词 CRUD                |
| `shared/stores/sync.ts`               | Firebase 同步服务            |
| `shared/stores/settings.svelte.ts`    | 设置状态管理                 |
| `shared/i18n/i18n.ts`                 | 多语言支持                   |

### 网站

| 文件                                  | 说明                                |
| ------------------------------------- | ----------------------------------- |
| `lib/stores/auth.svelte.ts`           | 认证状态、自动匿名登录              |
| `lib/stores/words.svelte.ts`          | 生词状态、IndexedDB + Firebase 同步 |
| `lib/stores/indexeddb.ts`             | IndexedDB 操作封装                  |
| `lib/stores/extension-sync.svelte.ts` | 扩展检测和数据同步                  |
| `routes/words/+page.svelte`           | 生词列表页                          |
| `routes/review/+page.svelte`          | 复习页面                            |

### 共享

| 文件                        | 说明                          |
| --------------------------- | ----------------------------- |
| `types/index.ts`            | Word, User, Settings 类型定义 |
| `firebase/config.ts`        | Firebase 配置                 |
| `firebase/auth.ts`          | 认证方法                      |
| `firebase/firestore.ts`     | Firestore CRUD                |
| `constants/storage-keys.ts` | 存储键常量                    |

## 国际化

支持语言: 英语、简体中文、繁体中文、日语、韩语

- 扩展语言文件: `packages/extension/src/public/_locales/*/messages.json`
- 扩展 i18n: `packages/extension/src/shared/i18n/i18n.ts`
- 网站 i18n: `packages/web/src/lib/i18n/`

## 代码规范

- 使用 Svelte 5 runes 语法 (`$state`, `$derived`, `$effect`)
- 扩展组件按功能放在 `packages/extension/src/features/`
- 共享类型放在 `packages/shared/src/types/`
- 使用 TypeScript 严格模式
- 样式遵循 Tailwind + YouTube 深色主题 (#0f0f0f, #1a1a1a, #f1f1f1)

## 升级兼容性

添加新的 settings 字段时，需要考虑升级用户的兼容性：

1. **在 store 中定义默认值** (`settings.svelte.ts`)
2. **在使用处添加空值合并** - 因为旧用户的 storage 中没有新字段

```svelte
<!-- 正确：使用 ?? 确保有默认值 -->
<Component fontSize={$appStore.settings.captionFontSize ?? 14} />
```

## 部署

### 扩展

- Chrome Web Store 发布
- `pnpm build:ext && pnpm --filter @aspect/extension zip`
- 发布前改 popup 跳转链接为生产地址

### 网站

- Vercel 自动部署 (连接 GitHub)
- 域名: youtube-cc.com

## 开发注意事项

1. **端口配置**: 网站开发端口为 `5188`，扩展中相关匹配规则已配置
2. **扩展调试**: 使用 `pnpm build:ext` 而非 `dev:ext`，因为 content script 需要完整构建
3. **同步调试**: 打开 DevTools Console 查看 `[CC Plus]` 前缀的日志
4. **IndexedDB 查看**: DevTools → Application → IndexedDB → `ccplus-words`
