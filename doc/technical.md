# Technical

## 1. 技术栈

- 游戏：The Midnight Dinner
- 类型：other
- 简述：V1 框架 —— 红绒幕私人餐厅, 长桌远端坐着一个黑人女剪影; 你这头散着 5 件物事 (中学笔记本/咖啡杯/红酒杯/烟灰缸/银锁), 各属于一个年龄的你 (18/25/32/40/50)。点物事, 那个年龄的你现身说一句。5 句说完, 远端剪影起身走来——到面前已是 50 岁的你。视觉血脉 Sin City 黑白 + 红。约 1-2 分钟。
- 框架 / 语言 / 构建：React, TypeScript, Vite, Less
- 渲染方式：DOM/CSS
- 依赖摘录：@types/react@^18.2.0, @types/react-dom@^18.2.0, @vitejs/plugin-react@^4.2.1, less@^4.2.0, react@^18.2.0, react-dom@^18.2.0, typescript@^5.3.3, vite@^5.1.0
- 平台元信息：meta.title=The Midnight Dinner；cover_url=/poster.png；category=other；uuid=8c049aa5-eaea-47c3-8b62-86d6fd100dd5

## 2. 目录结构

- `index.html`：Vite/浏览器入口，挂载根节点和基础 meta。
- `package.json`：定义 npm 脚本、依赖和工程名称。
- `vite.config.ts`：配置构建、插件和相对路径 base。
- `meta.json`：平台发布元信息，包含标题和封面。
- `src/App.tsx`：React 组件和交互界面。
- `src/main.tsx`：React 组件和交互界面。
- `src/index.less`：视觉样式、布局、动画和响应式规则。
- `src/vite-env.d.ts`：游戏源码模块。
- `src/game-id.ts`：游戏源码模块。
- `src/Bidding/i18n.ts`：中英文或多语言文案。
- `src/Bidding/BiddingEngine.tsx`：React 组件和交互界面。
- `src/Bidding/content.ts`：游戏源码模块。
- `src/Bidding/types.ts`：游戏源码模块。
- `src/Bidding/BiddingEngine.less`：视觉样式、布局、动画和响应式规则。
- `src/Bidding/primitives/IntroOverlay.tsx`：React 组件和交互界面。
- `src/Bidding/primitives/VideoStage.tsx`：React 组件和交互界面。
- `src/Bidding/primitives/VideoStage.less`：视觉样式、布局、动画和响应式规则。
- `src/Bidding/primitives/ChoiceList.less`：视觉样式、布局、动画和响应式规则。

关键源码模块：

- `src/App.tsx`
- `src/main.tsx`
- `src/index.less`
- `src/vite-env.d.ts`
- `src/game-id.ts`
- `src/Bidding/i18n.ts`
- `src/Bidding/BiddingEngine.tsx`
- `src/Bidding/content.ts`
- `src/Bidding/types.ts`
- `src/Bidding/BiddingEngine.less`
- `src/Bidding/primitives/IntroOverlay.tsx`
- `src/Bidding/primitives/VideoStage.tsx`
- `src/Bidding/primitives/VideoStage.less`
- `src/Bidding/primitives/ChoiceList.less`
- `src/Bidding/primitives/EndingCard.tsx`
- `src/Bidding/primitives/HotspotPin.less`
- `src/Bidding/primitives/EndingCard.less`
- `src/Bidding/primitives/ChoiceList.tsx`
- `src/Bidding/primitives/HotspotPin.tsx`
- `src/Bidding/primitives/IntroOverlay.less`
- `src/Bidding/primitives/SceneTitle.tsx`
- `src/Bidding/primitives/SceneTitle.less`

## 3. 核心模块

- 状态管理与节奏：通过 React 状态与定时器处理倒计时、阶段推进或生成节奏。
- 渲染方式：DOM/CSS，样式由 CSS/Less 和组件结构共同完成。
- 碰撞 / 更新：源码包含命中、距离、边界或重叠判断，结果会影响得分、生命或阶段。
- 音频：未发现独立音频模块，当前以视觉和文案反馈为主。
- 多语言：包含 i18n / locale 检测或 `t()` 文案函数。
- 存储：使用 localStorage、useGameSave 或 persist 保存分数、收藏、墙数据或本地状态。
- Aigram 运行时：接入 `@shared/runtime` 或平台桥接能力，用于用户、资料页、分享、通知或平台 API。

## 4. 扩展点

- 改玩法参数：优先查找 `src/` 内大写常量、hooks、主组件顶部配置或关卡数组。
- 换素材：替换 `public/`、`src/img/` 或源码 import 的图片/音频文件，并保持相对路径。
- 调视觉：修改主样式文件中的颜色、间距、动画时长、网格尺寸和响应式规则。
- 改文案：修改 i18n 字典、组件内标题按钮文案，保持 zh/en 同步。
- 加平台能力：在已有 `@shared/runtime`、useGameSave、排行榜、墙或通知调用附近扩展，避免另起一套存储。
