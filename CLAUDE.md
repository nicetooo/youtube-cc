# CLAUDE.md - 项目指南

## 项目概述

**CC Plus** - YouTube 学习增强平台，包含浏览器扩展和配套网站。

- **扩展:** 交互式双语字幕、生词收藏、宽屏模式、广告移除、评论增强
- **网站:** 生词同步、复习系统、用户账号 (youtubecc.com)

## 技术栈

- **包管理:** pnpm workspace (monorepo)
- **扩展:** WXT 0.19 + Svelte 5 + TypeScript
- **网站:** SvelteKit + Vercel
- **样式:** Tailwind CSS 4
- **后端:** Firebase (Auth + Firestore)
- **共享:** TypeScript 类型定义

## 项目结构

```
aspect/
├── packages/
│   ├── extension/              # Chrome 扩展
│   │   ├── src/
│   │   │   ├── entrypoints/    # background.ts, content.ts, popup/
│   │   │   ├── features/       # caption/, ads/, comments/, player/
│   │   │   ├── shared/         # stores/, utils/, i18n/, components/
│   │   │   └── public/         # 图标、语言包
│   │   ├── wxt.config.ts
│   │   └── package.json
│   │
│   ├── web/                    # 网站 (SvelteKit)
│   │   ├── src/
│   │   │   ├── routes/         # +page.svelte, words/, review/
│   │   │   └── lib/            # 组件、工具
│   │   ├── svelte.config.js
│   │   └── package.json
│   │
│   └── shared/                 # 共享代码
│       └── src/
│           ├── types/          # Word, User, Settings 类型
│           └── firebase/       # Firebase 配置和方法
│
├── package.json                # 根配置
└── pnpm-workspace.yaml
```

## 常用命令

```bash
# 开发
pnpm dev:ext              # 开发扩展
pnpm dev:web              # 开发网站

# 构建
pnpm build:ext            # 构建扩展 → packages/extension/.output/chrome-mv3
pnpm build:web            # 构建网站 → packages/web/.svelte-kit
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
2. 访问 http://localhost:5173

## 架构模式

### 扩展状态管理

- **文件:** `packages/extension/src/shared/stores/settings.svelte.ts`
- 使用 Svelte 5 runes (`$state`, `$effect`) 与 `chrome.storage.local` 同步
- 设置项: `caption`, `skipAd`, `removeAds`, `wideScreen`, `sideComment`, `commentSearch`

### 扩展通信机制

- Background ↔ Content: 通过 `chrome.runtime.Port` 消息传递
- 消息类型: `timedtext_url` (字幕), `url_change` (SPA 导航)

### 共享类型

```typescript
// packages/shared/src/types/index.ts
interface Word {
  id: string;
  text: string;
  context: string; // 字幕原句
  translation?: string;
  videoId: string;
  timestamp: number; // 视频时间点
  createdAt: Date;
}
```

### 数据流

```
Chrome 扩展 (收藏生词)
      ↓
  Firebase Firestore
      ↓
网站 youtubecc.com (复习)
```

## 关键文件

### 扩展

- `packages/extension/wxt.config.ts` - 扩展配置
- `packages/extension/src/shared/stores/settings.svelte.ts` - 状态管理
- `packages/extension/src/shared/components/ContentMain.svelte` - 功能编排
- `packages/extension/src/features/caption/CaptionList.svelte` - 字幕面板

### 网站

- `packages/web/svelte.config.js` - SvelteKit 配置
- `packages/web/src/routes/+page.svelte` - 首页
- `packages/web/src/routes/words/+page.svelte` - 生词列表
- `packages/web/src/routes/review/+page.svelte` - 复习页面

### 共享

- `packages/shared/src/types/index.ts` - 类型定义
- `packages/shared/src/firebase/index.ts` - Firebase 配置

## 国际化

支持语言: 英语、简体中文、繁体中文、日语、韩语

- 语言文件: `packages/extension/src/public/_locales/*/messages.json`
- i18n 助手: `packages/extension/src/shared/i18n/i18n.ts`

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

### 网站

- Vercel 自动部署 (连接 GitHub)
- 域名: youtubecc.com
