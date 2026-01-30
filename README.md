# 动态签名验证系统 ✍️

基于模式识别的手写签名身份验证应用程序，实现自动化识别与真伪鉴别功能。

## 🎯 项目概览

这是一个完整的签名验证系统，从原生HTML/JS迁移到现代化的技术栈：**React 18 + TypeScript + Tailwind CSS**。系统提供高性能的Canvas签名绘制，支持Retina/高分屏适配，确保无卡顿的用户体验。

## ✨ 功能特性

- 🖌️ **高性能签名绘制**：优化的Canvas渲染，支持Retina/高分屏，无卡顿
- 📱 **多设备支持**：完美支持鼠标和触摸设备
- 🔍 **智能验证**：三种验证模式（动态/静态/混合），可调节阈值（50-95%）
- 📊 **实时分析**：签名特征实时分析（速度、压力、笔画数、时长）
- 💬 **友好反馈**：Toast通知系统，提供即时操作反馈
- 📈 **数据统计**：总验证数、通过/失败统计卡片
- 📋 **历史记录**：详细的验证记录列表和历史页面
- ⚙️ **系统设置**：阈值调整、模式选择、系统信息
- 🎨 **现代化UI**：使用Tailwind CSS构建的响应式设计

## 🛠️ 技术栈

- **React 18** - 现代化UI框架
- **TypeScript** - 类型安全的JavaScript
- **Tailwind CSS** - 实用优先的CSS框架
- **Vite** - 极速的前端构建工具
- **Canvas API** - 高性能签名绘制
- **React Context** - 全局状态管理

## 🚀 快速开始

### 前置要求

- Node.js 16+
- npm 或 yarn

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

访问 http://localhost:5173 查看应用

### 构建生产版本

```bash
npm run build
```

### 预览生产构建

```bash
npm run preview
```

## 📖 使用说明

### 基本操作

1. **绘制签名**：在Canvas区域使用鼠标或触摸绘制您的签名
2. **清除签名**：点击"清除签名"按钮重置画布
3. **验证签名**：点击"验证签名"按钮进行身份验证
4. **调整参数**：
   - 使用滑块调整验证阈值（50-95%）
   - 选择验证模式（动态/静态/混合）

### 页面导航

- **首页**：主要签名验证区域，包含绘制、验证、特征分析、统计卡片
- **签名管理**：签名模板管理（开发中）
- **历史记录**：查看所有验证记录的详细信息
- **系统设置**：调整验证参数和查看系统信息

## 📁 项目结构

```
signature-validation-system/
├─ src/
│  ├─ components/
│  │  ├─ SignatureCanvas.tsx    # Canvas签名绘制组件
│  │  ├─ ResultArea.tsx         # 验证结果展示组件
│  │  ├─ Features.tsx            # 签名特征分析组件
│  │  ├─ Records.tsx             # 验证记录列表组件
│  │  ├─ Toast.tsx               # Toast通知组件
│  │  └─ ToastContainer.tsx      # Toast容器和Context
│  ├─ types/
│  │  └─ index.ts                # TypeScript类型定义
│  ├─ App.tsx                    # 主应用组件
│  ├─ main.tsx                   # 应用入口
│  └─ index.css                  # 全局样式
├─ index.html                    # HTML模板
├─ package.json                  # 项目配置
├─ tsconfig.json                 # TypeScript配置
├─ tailwind.config.js            # Tailwind CSS配置
├─ vite.config.ts                # Vite配置
└─ README.md                     # 项目说明
```

## 🎨 核心技术实现

### 高性能Canvas绘制

- 使用devicePixelRatio适配Retina/高分屏
- 优化的事件处理，确保流畅的绘制体验
- 支持触摸和鼠标事件

### 签名特征分析

实时计算以下特征：
- **笔画速度**：px/s
- **笔画压力**：模拟压力值
- **笔画顺序**：笔画数量
- **签名时长**：秒

### 验证算法

- **动态模式**：基于绘制行为的验证
- **静态模式**：基于形状的验证
- **混合模式**：结合动态和静态特征

## 🌐 浏览器兼容性

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- 移动端浏览器（iOS Safari, Chrome Mobile）

## 📝 注意事项

1. **性能优化**：Canvas已针对Retina屏优化，确保清晰显示
2. **响应式设计**：适配桌面和移动设备
3. **类型安全**：全面使用TypeScript，确保代码质量
4. **状态管理**：使用React Context进行全局状态管理
5. **错误处理**：完善的空值检查和错误边界

## 🤝 贡献

欢迎提交Issue和Pull Request！

## 📄 License

MIT License

Copyright (c) 2024 签名验证系统开发团队

---

**由原生HTML/JS迁移至React 18 + TypeScript + Tailwind CSS**

✨ 打造现代化的签名验证体验 ✨
