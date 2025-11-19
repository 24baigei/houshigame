# 前端项目目录结构 (Project Structure)

```
/
├── public/
│   ├── assets/
│   │   ├── audio/          # 音效文件 (bgm, sfx)
│   │   └── images/         # 必要的纹理素材 (noise, texture)
│   └── favicon.ico
├── src/
│   ├── components/         # UI组件
│   │   ├── Layout/
│   │   │   ├── CRTContainer.tsx  # 全局CRT屏幕效果容器
│   │   │   └── Terminal.tsx      # 命令行/文本显示区域
│   │   ├── UI/
│   │   │   ├── GlitchText.tsx    # 故障文字特效组件
│   │   │   ├── StatusBar.tsx     # 状态栏 (SAN值, HP, 物品)
│   │   │   └── ChoiceButton.tsx  # 交互选项按钮
│   │   └── Effects/              # 视觉特效组件
│   ├── data/               # 剧情数据 (核心资产)
│   │   ├── prologue.json   # 序章剧情节点
│   │   ├── level0.json     # Level 0 剧情节点
│   │   └── items.json      # 物品定义
│   ├── hooks/              # 自定义Hooks
│   │   ├── useTypewriter.ts # 打字机效果
│   │   └── useGlitch.ts     # 故障效果逻辑
│   ├── store/              # 状态管理 (Zustand)
│   │   ├── gameStore.ts    # 核心游戏状态 (当前节点, 历史记录)
│   │   └── playerStore.ts  # 玩家状态 (SAN, HP, Inventory)
│   ├── types/              # TypeScript类型定义
│   │   └── story.ts        # 剧情节点接口定义
│   ├── utils/
│   │   ├── storyParser.ts  # 文本解析器 (处理变量替换, 样式标签)
│   │   └── audioManager.ts # 音频管理器
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css           # Tailwind directives & Custom CSS
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

## 关键开发步骤 (Implementation Steps)

1. **初始化**: 使用 Vite + React + TS 模板创建项目。
2. **样式基建**: 配置 Tailwind 和全局 CSS 变量 (CRT 扫描线, 荧光色)。
3. **类型定义**: 优先在 `src/types/story.ts` 中定义好 `StoryNode` 结构。
4. **核心组件**: 开发 `CRTContainer` 和 `Terminal`，确立视觉基调。
5. **状态逻辑**: 实现 `gameStore`，确保能加载并切换剧情节点。
6. **数据填充**: 创建 `src/data/prologue.json`，录入第一段测试剧情。