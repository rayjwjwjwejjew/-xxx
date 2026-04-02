# 云谷高中·凌云大富翁

一个基于云谷高中《凌云积分制度》设计的校园桌游项目，当前同时支持 **地图编辑模式** 与 **本地热座游玩模式**。

## 当前支持的功能

### 1. 地图编辑模式
- 拖拽特殊格与七维素养格到棋盘外圈
- 选中格子后编辑名称、描述、积分与 FC/AC
- 导入 / 导出 JSON
- 导出 PNG、A3 PDF、拼图版 PDF
- 中央雷达图展示七维素养结构

### 2. 本地热座游玩模式
- 支持 2 至 4 名玩家开局
- 玩家自定义昵称与棋子颜色
- 掷骰、逐格移动、自动结算
- 支持事件格、惩罚格、自习室、公益格、食堂格
- 支持素养格认领与 AC 特殊路径
- 记录积分、等级、T 状态、停留回合
- 记录最近日志并显示当前领先玩家
- 按回合数结束并自动判定胜者

## 技术栈
- React 18
- TypeScript（严格模式）
- Vite
- Tailwind CSS
- SVG / CSS 棋盘布局
- 原生 HTML5 Drag and Drop
- html2canvas
- jsPDF

## 目录结构

```txt
src/
├── components/
│   ├── play/
│   │   ├── DicePanel.tsx
│   │   ├── GameHUD.tsx
│   │   ├── GameLog.tsx
│   │   ├── GameModal.tsx
│   │   ├── PlayerSidebar.tsx
│   │   ├── PlayerToken.tsx
│   │   └── SetupPanel.tsx
│   ├── BoardTile.tsx
│   ├── Canvas.tsx
│   ├── ExportButtons.tsx
│   ├── Layout.tsx
│   ├── Navbar.tsx
│   ├── PropertyPanel.tsx
│   ├── RadarChart.tsx
│   ├── RulesModal.tsx
│   └── Sidebar.tsx
├── game/
│   ├── engine.ts
│   ├── helpers.ts
│   ├── rules.ts
│   └── setup.ts
├── hooks/
│   ├── useBoard.ts
│   ├── useDragAndDrop.ts
│   ├── useExport.ts
│   └── useGameState.ts
├── data/
├── styles/
├── utils/
└── types/
```

## 安装运行

```bash
npm install
npm run dev
```

生产构建：

```bash
npm run build
```

## 核心玩法说明
- 每位玩家初始 100 凌云积分
- 每回合点击“掷骰前进”推进棋子
- 事件格会触发 PA 奖励或消 T 选择
- 惩罚格可能带来 T1 / T2 / T3 记录
- 自习室会让 A1 或有 T 的玩家停留 1 回合
- 公益格会给出志愿服务奖励
- 素养格可认领，AC 支持“先集齐 FC”或“直升 AC”两条路径
- 默认 12 轮后结算，积分最高者获胜

## 视觉风格
当前版本采用 **清爽校园感** 的轻视觉小说风：
- 浅色玻璃卡片
- 蓝白紫渐变背景
- 轻量粒子与柔和阴影
- 保留游戏感，但避免过重的幻想 RPG 菜单风

## 联机扩展方向
当前版本是本地热座模式，但代码已经为联机拆好了基础层：
- `game/engine.ts` 负责规则推进
- `useGameState.ts` 负责游戏状态
- 已定义 `RoomState` 作为后续房间状态基础

后续建议继续扩展：
- 房间创建 / 加入
- 房主开始游戏
- 服务端权威同步
- 断线重连
- 聊天与快捷表情

## 已知限制
- 当前为同屏轮流操作，不是真实在线联机
- 事件卡仍为基础随机池，可继续扩写内容
- 素养格认领更偏“教学桌游化”而非完整商业桌游经济系统
- 结算动画和音效仍可继续增强
