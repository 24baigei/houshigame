# 后室 (The Backrooms) 网页文字游戏设计文档

## 1. 核心理念
打造一个沉浸式的、基于Web的后室体验。通过纯文本、复古UI和心理恐怖元素，还原后室的压抑感与未知感。核心机制是“文本探索”与“故障切入”。

## 2. 技术架构
- **核心框架**: React 18 + TypeScript
- **样式处理**: Tailwind CSS (用于布局) + Custom CSS (用于CRT、扫描线、辉光等特效)
- **动画库**: Framer Motion (处理文字浮现、场景切换动画)
- **状态管理**: React Context API / Zustand (管理SAN值、生命值、物品栏、当前剧情节点)
- **构建工具**: Vite

## 3. 视觉风格 (Visual Identity)
- **色调**: 昏黄 (Mono-yellow), 黑色背景, 亮绿色/琥珀色终端文字 (可选风格切换)
- **特效**: 
  - **CRT Monitor Effect**: 屏幕曲面、扫描线、色差 (Chromatic Aberration)。
  - **Text Glitch**: 关键剧情点文字出现乱码、抖动、替换。
  - **Dynamic Typography**: 文字大小、间距随SAN值降低而混乱。

## 4. 核心机制 (Game Mechanics)

### 4.1 交互系统
- **超链接探索**: 文本中嵌入可点击的词汇（如“查看墙壁”、“走廊深处”）。
- **切入 (No-clip)**: 
  - 特定词汇触发“故障”效果。
  - 屏幕剧烈闪烁，CSS 滤镜扭曲，随即跳转至新层级或隐藏房间。
- **实时反馈**: 
  - 玩家的SAN值直接影响文本的可读性（乱码增多）。
  - 背景音效随场景变化（低频嗡嗡声、脚步声）。

### 4.2 资源与状态
- **SAN值 (理智)**: 随时间/遭遇下降。过低导致幻觉（虚假选项）、死亡。
- **HP (生命)**: 遭遇实体时扣除。
- **物品**: 杏仁水 (Almond Water - 恢复SAN/HP)、手电筒、录音笔。

## 5. 剧情架构 (Plot Structure - 预计10w字)
采用模块化设计，初期实现 **序章 + Level 0**，后续通过JSON配置扩展。

### 5.1 章节规划
- **序章: 现实的裂缝**
  - 场景: 或者是办公室，或者是拍摄现场。
  - 目标: 引导玩家触发第一次“切入”。
- **Level 0: 大厅 (The Lobby)**
  - 特征: 无尽的黄色壁纸、潮湿的地毯、嗡嗡作响的荧光灯。
  - 玩法: 迷宫探索，建立压抑感，学习基础生存（寻找杏仁水）。
- **Level 1: 宜居地? (Habitable Zone)**
  - 特征: 混凝土墙，有物资，但开始出现实体。
- **Level !: 快跑 (Run For Your Life)**
  - 特征: 红色走廊，限时文字QTE（快速反应事件）。

### 5.2 实体 (Entities)
- **钝人 (Dullers)**: 远处的黑影，靠近扣除SAN值。
- **窃皮者 (Skin-Stealers)**: 伪装成流浪者的文本对话。

## 6. 数据结构设计 (Story Engine)
为了支持海量文本，我们将剧情存储为节点图 (Node Graph)。

```typescript
type StoryNode = {
  id: string;          // 节点唯一ID
  text: string;        // 剧情文本 (支持Markdown或HTML标签)
  type: 'normal' | 'combat' | 'puzzle' | 'ending';
  
  // 选项分支
  choices: {
    text: string;      // 按钮/链接文本
    nextNodeId: string; // 跳转节点ID
    
    // 触发条件 (可选)
    condition?: {
      minSanity?: number;
      hasItem?: string;
    };
    
    // 执行后果 (可选)
    effect?: {
      sanityChange?: number;
      addItem?: string;
      triggerGlitch?: boolean; // 是否触发切入特效
    };
  }[];
  
  // 环境配置
  environment: {
    bgm?: string;      // 背景音效ID
    visualStyle?: 'level0' | 'level1' | 'dark';
  };
};
```

## 7. 开发路线图
1. **脚手架**: 搭建React+Vite环境，配置Tailwind。
2. **组件库**: 开发`CRTContainer`, `GlitchText`, `Typewriter` (打字机效果)。
3. **引擎核心**: 实现`GameEngine`，解析上述JSON结构并渲染。
4. **内容填充**: 编写序章与Level 0的JSON数据。
5. **优化**: 添加音效与更多视觉细节。