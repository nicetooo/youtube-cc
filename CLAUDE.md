# CLAUDE.md - 项目指南

## 项目概述

**CC Plus** - 一个 YouTube 浏览器扩展，使用 WXT、Svelte 5 和 TypeScript 构建。提供交互式字幕、宽屏模式、广告移除和评论增强功能。

## 技术栈

- **框架:** WXT 0.19 (浏览器扩展框架, Manifest V3)
- **UI:** Svelte 5 (使用 runes 响应式状态)
- **样式:** Tailwind CSS 4
- **语言:** TypeScript 5.6
- **构建:** Vite (通过 WXT)

## 项目结构

```
src/
├── entrypoints/           # 扩展入口点
│   ├── background.ts      # Service Worker (API 拦截、消息传递)
│   ├── content.ts         # Content Script (将 UI 挂载到 YouTube)
│   └── popup/             # 扩展弹窗设置界面
├── features/              # 功能模块
│   ├── caption/           # 字幕/转录侧边栏
│   ├── ads/               # 广告移除和跳过
│   ├── comments/          # 侧边评论、评论搜索
│   └── player/            # 宽屏模式
├── shared/
│   ├── components/        # 共享 Svelte 组件
│   ├── stores/            # 响应式状态 (settings.svelte.ts)
│   ├── utils/             # DOM 工具 (wait.ts, observe.ts)
│   └── i18n/              # 国际化
└── public/                # 静态资源、语言包、图标
```

## 常用命令

```bash
npm run dev          # 开发模式，支持热重载
npm run build        # 生产构建，输出到 .output/chrome-mv3
npm run check        # Svelte/TypeScript 类型检查
npm run lint         # ESLint 检查
npm run lint:fix     # 自动修复 lint 问题
npm run format       # Prettier 格式化
```

## 开发流程

1. 运行 `npm run build` 创建初始构建
2. 在 Chrome 中加载 `.output/chrome-mv3` 作为未打包扩展
3. 运行 `npm run dev` 启动文件监听
4. 编辑代码后，使用 `Cmd+Shift+R` 刷新 YouTube 页面

## 架构模式

### 状态管理
- **文件:** `src/shared/stores/settings.svelte.ts`
- 使用 Svelte 5 runes (`$state`, `$effect`) 与 `chrome.storage.local` 同步
- 设置项: `caption`, `skipAd`, `removeAds`, `wideScreen`, `sideComment`, `commentSearch`

### 通信机制
- Background ↔ Content: 通过 `chrome.runtime.Port` 消息传递
- 消息类型: `timedtext_url` (字幕), `url_change` (SPA 导航)

### UI 挂载
- Content Script 挂载到 YouTube 的 `#secondary` div
- 使用 MutationObserver 检测 SPA 导航并重新挂载

### 样式规范
- 所有组件在 `.cc-plus-style-root` 作用域下
- 使用 YouTube 深色主题颜色 (#0f0f0f, #1a1a1a, #f1f1f1)

## 关键文件

- `wxt.config.ts` - 扩展清单、权限、构建配置
- `src/shared/stores/settings.svelte.ts` - 中央状态管理
- `src/shared/components/ContentMain.svelte` - 功能编排器
- `src/features/ads/ad-selectors.ts` - 动态广告选择器获取

## 国际化

支持语言: 英语、简体中文、繁体中文、日语、韩语
- 语言文件: `src/public/_locales/*/messages.json`
- i18n 助手: `src/shared/i18n/i18n.ts`

## 代码规范

- 使用 Svelte 5 runes 语法 (`$state`, `$derived`, `$effect`)
- 组件按功能放在 `src/features/` 目录
- 共享工具放在 `src/shared/utils/`
- 使用 TypeScript 严格模式
- 样式遵循现有 Tailwind 模式

## 升级兼容性

添加新的 settings 字段时，需要考虑升级用户的兼容性：

1. **在 store 中定义默认值** (`settings.svelte.ts`)
2. **在使用处添加空值合并** - 因为旧用户的 storage 中没有新字段，会导致值为 `undefined`

```svelte
<!-- 错误：旧用户 captionFontSize 为 undefined，会覆盖组件默认值 -->
<Component fontSize={$appStore.settings.captionFontSize} />

<!-- 正确：使用 ?? 确保有默认值 -->
<Component fontSize={$appStore.settings.captionFontSize ?? 14} />
```

原因：storage 合并逻辑 `{...默认值, ...存储值}` 不会自动添加新字段到旧用户的存储中。
