# 动态签名验证系统

基于 React 18 + TypeScript + Tailwind CSS 的现代化签名验证系统，采用高性能绘图架构，支持 Retina 高分屏显示，实现自动化识别与真伪鉴别功能。

## 功能特性

- 🚀 **高性能绘图**：优化的 Canvas 绘图架构，无卡顿现象
- 🖥️ **高分屏支持**：完美支持 Retina/高分屏显示，解决模糊问题
- 📝 **签名输入**：支持鼠标和触摸设备绘制签名
- 🧠 **模式识别**：模拟动态签名验证算法（静态页面演示）
- 📊 **实时反馈**：验证结果即时显示
- ⚙️ **参数配置**：可调节匹配阈值和验证模式
- 📋 **历史记录**：展示最近验证记录
- 🎨 **响应式设计**：适配各种屏幕尺寸

## 技术栈

- **React 18** - 现代化 UI 框架
- **TypeScript** - 类型安全的 JavaScript
- **Tailwind CSS** - 实用优先的 CSS 框架
- **Vite** - 快速的构建工具
- **Canvas API** - 高性能签名绘制

## 快速开始

### 环境要求

- Node.js 16.0 或更高版本
- npm 或 yarn 包管理器

### 安装依赖

```bash
npm install
# 或
yarn install
```

### 开发模式

```bash
npm run dev
# 或
yarn dev
```

应用将在 `http://localhost:5173` 启动（Vite 默认端口）

### 构建生产版本

```bash
npm run build
# 或
yarn build
```

### 预览生产版本

```bash
npm run preview
# 或
yarn preview
```

## 使用说明

1. **绘制签名**：在签名输入区域使用鼠标或触摸设备绘制您的签名
2. **清除签名**：点击"清除签名"按钮可重置画布
3. **验证签名**：点击"验证签名"按钮进行签名验证
4. **调整参数**：使用滑块调整匹配阈值，选择验证模式
5. **查看特征**：签名绘制完成后可查看提取的特征数据
6. **查看记录**：底部显示历史验证记录

## 项目结构

```
project-folder/
├─ public/                   # 静态资源
├─ src/
│  ├─ components/           # React 组件
│  │  ├─ SignatureCanvas.tsx    # 签名画布组件
│  │  ├─ VerificationParams.tsx # 验证参数组件
│  │  ├─ VerificationResult.tsx # 验证结果组件
│  │  ├─ SignatureFeatures.tsx # 签名特征组件
│  │  ├─ VerificationRecords.tsx # 验证记录组件
│  │  └─ Toast.tsx              # 通知组件
│  ├─ hooks/                # 自定义 React Hooks
│  │  ├─ useSignatureCanvas.ts  # 签名画布逻辑
│  │  └─ useToast.ts            # 通知逻辑
│  ├─ types/                # TypeScript 类型定义
│  │  └─ index.ts
│  ├─ utils/                # 工具函数
│  │  └─ verification.ts        # 验证相关工具
│  ├─ App.tsx               # 主应用组件
│  ├─ main.tsx              # 应用入口
│  └─ index.css             # 全局样式
├─ index.html               # HTML 模板
├─ package.json             # 项目配置
├─ tsconfig.json            # TypeScript 配置
├─ vite.config.js           # Vite 配置
├─ tailwind.config.js       # Tailwind CSS 配置
└─ README.md                # 项目说明
```

## 高性能实现

### 高分屏支持

系统通过以下方式解决了 Canvas 在 Retina/高分屏上的模糊问题：

1. **设备像素比检测**：自动检测设备像素比（DPR）
2. **Canvas 尺寸调整**：根据 DPR 调整 Canvas 实际尺寸
3. **上下文缩放**：按 DPR 缩放绘图上下文
4. **CSS 尺寸设置**：保持 CSS 像素尺寸不变

```typescript
// 获取设备像素比
const dpr = window.devicePixelRatio || 1;

// 设置实际尺寸，考虑设备像素比
canvas.width = rect.width * dpr;
canvas.height = rect.height * dpr;

// 缩放上下文以匹配设备像素比
ctx.scale(dpr, dpr);
```

### 高性能绘图架构

1. **事件优化**：使用 requestAnimationFrame 优化绘制性能
2. **内存管理**：合理管理签名数据，避免内存泄漏
3. **组件解耦**：通过自定义 Hook 封装绘图逻辑，提高代码复用性
4. **状态管理**：使用 React 状态管理，确保 UI 与数据同步

## 浏览器兼容性

- Chrome/Edge 88+
- Firefox 85+
- Safari 14+

## License

MIT