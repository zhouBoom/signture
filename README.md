# 动态签名验证系统

基于模式识别的手写签名身份验证应用程序，实现自动化识别与真伪鉴别功能。

## 🚀 项目迁移说明

此项目已从原生 HTML/JS 迁移到 **React 18 + TypeScript + Tailwind CSS**，实现了以下关键优化：

### 核心改进

1. **高性能绘图架构**
   - 使用 Canvas API 实现流畅的签名绘制
   - 优化事件处理和渲染逻辑，消除卡顿现象
   - 支持鼠标和触摸设备的流畅操作

2. **Retina/高分屏支持**
   - 自动检测设备像素比 (DPR)
   - Canvas 画布按 DPR 缩放，确保在高分辨率屏幕上清晰显示
   - 使用 `window.devicePixelRatio` 适配各种屏幕密度

3. **现代化技术栈**
   - React 18 组件化架构
   - TypeScript 类型安全
   - Tailwind CSS 响应式设计
   - Vite 构建工具，快速开发体验

## 功能特性

- 📝 **签名输入**：支持鼠标和触摸设备绘制签名
- 🧠 **模式识别**：模拟动态签名验证算法（静态页面演示）
- 📊 **实时反馈**：验证结果即时显示
- ⚙️ **参数配置**：可调节匹配阈值和验证模式
- 📋 **历史记录**：展示最近验证记录
- 🎨 **美观界面**：现代化 UI 设计，支持响应式布局
- ⚡ **高性能**：优化的 Canvas 渲染，无卡顿体验
- 🖥️ **高清显示**：Retina 屏幕完美适配

## 技术栈

- **React 18** - 前端框架
- **TypeScript** - 类型安全
- **Tailwind CSS** - 样式框架
- **Vite** - 构建工具
- **Canvas API** - 高性能签名绘制
- **React Hooks** - 状态管理

## 快速开始

### 前置要求

- Node.js 16+
- npm 或 yarn

### 安装依赖

```bash
npm install
```

### 本地开发

```bash
npm run dev
```

应用将在 `http://localhost:3000` 启动。

### 构建生产版本

```bash
npm run build
```

构建产物将输出到 `dist` 目录。

### 预览生产版本

```bash
npm run preview
```

## 项目结构

```
src/
├── components/          # React 组件
│   ├── SignatureCanvas.tsx  # 签名画布组件
│   ├── Header.tsx          # 头部导航
│   ├── Footer.tsx          # 页脚
│   ├── Card.tsx            # 卡片容器
│   ├── ResultDisplay.tsx   # 结果展示
│   ├── SignatureFeatures.tsx # 特征展示
│   ├── VerificationRecords.tsx # 验证记录
│   └── Toast.tsx           # 通知组件
├── hooks/              # 自定义 Hooks
│   ├── useSignatureVerification.ts  # 验证逻辑
│   └── useToast.ts      # Toast 通知
├── types/              # TypeScript 类型定义
│   └── index.ts
├── utils/              # 工具函数
│   └── helpers.ts
├── styles/             # 样式文件
│   └── index.css
├── App.tsx             # 主应用组件
└── main.tsx            # 应用入口
```

## 核心实现

### 高性能 Canvas 渲染

```typescript
// 自动检测设备像素比
const dpr = window.devicePixelRatio || 1;

// 设置 Canvas 实际尺寸
canvas.width = width * dpr;
canvas.height = height * dpr;

// 应用缩放
ctx.scale(dpr, dpr);
```

### 流畅绘制体验

- 使用 `useCallback` 优化事件处理函数
- 实时记录绘制点坐标和时间戳
- 高效的重绘机制，只重绘必要内容

## 浏览器支持

- Chrome (推荐)
- Firefox
- Safari
- Edge
- 移动端浏览器

## 开发说明

### 添加新功能

1. 在 `src/components/` 创建新组件
2. 在 `src/types/` 定义相应的 TypeScript 类型
3. 在需要的地方导入和使用组件

### 样式定制

使用 Tailwind CSS 工具类进行样式定制，或在 `src/styles/index.css` 中添加自定义样式。

## 许可证

MIT License

## 贡献

欢迎提交 Issue 和 Pull Request！

---

**注意**：这是一个演示项目，签名验证算法为模拟实现。在实际应用中，需要接入真实的签名验证服务。

然后在浏览器中访问 `http://localhost:8000/src/pages/index.html`

## 使用说明

1. **绘制签名**：在签名输入区域使用鼠标或触摸设备绘制您的签名
2. **清除签名**：点击"清除签名"按钮可重置画布
3. **验证签名**：点击"验证签名"按钮进行签名验证
4. **调整参数**：使用滑块调整匹配阈值，选择验证模式

## 项目结构

```
project-folder/
├─ src/
│  ├─ pages/
│  │  └─ index.html        # 主页面
│  ├─ styles/
│  │  └─ main.css          # 样式文件
└─ README.md               # 项目说明
```

## 浏览器兼容性

- Chrome/Edge 80+
- Firefox 75+
- Safari 13+

## License

MIT
