# 动态签名验证系统

基于模式识别的手写签名身份验证应用程序，实现自动化识别与真伪鉴别功能。

## 功能特性

- 📝 **签名输入**：支持鼠标和触摸设备绘制签名
- 🧠 **模式识别**：模拟动态签名验证算法（静态页面演示）
- 📊 **实时反馈**：验证结果即时显示
- ⚙️ **参数配置**：可调节匹配阈值和验证模式
- 📋 **历史记录**：展示最近验证记录
- 🚀 **高性能渲染**：使用 requestAnimationFrame 优化绘图性能
- 🎯 **Retina 屏幕支持**：自动适配高分屏，解决模糊问题

## 技术栈

- **React 18** - 现代化前端框架
- **TypeScript** - 类型安全的 JavaScript
- **Tailwind CSS** - 实用优先的 CSS 框架
- **Vite** - 快速的构建工具
- **Canvas API** - 高性能签名绘制

## 架构特点

### 高性能绘图架构

本项目采用了多种优化技术来确保绘图性能：

1. **requestAnimationFrame 优化**
   - 使用 `requestAnimationFrame` 批量处理绘制操作
   - 避免频繁的 DOM 操作和重绘
   - 确保绘制与浏览器刷新率同步

2. **事件节流与批处理**
   - 将连续的绘制操作合并为单个帧
   - 减少不必要的计算和渲染
   - 提升整体响应速度

3. **优化的状态管理**
   - 使用 React Hooks 进行高效的状态管理
   - 最小化不必要的组件重新渲染
   - 使用 useCallback 和 useMemo 优化性能

### Retina/高分屏支持

通过以下技术解决高分屏模糊问题：

1. **devicePixelRatio 适配**
   - 自动检测设备的像素密度
   - 根据设备像素比缩放 Canvas 尺寸
   - 确保在高分屏上显示清晰

2. **坐标转换优化**
   - 精确计算鼠标/触摸坐标
   - 考虑 Canvas 的缩放比例
   - 保证绘制位置的准确性

## 快速开始

### 安装依赖

```bash
npm install
```

### 本地开发

```bash
npm run dev
```

应用将在 `http://localhost:3000` 启动

### 构建生产版本

```bash
npm run build
```

### 预览生产构建

```bash
npm run preview
```

## 使用说明

1. **绘制签名**：在签名输入区域使用鼠标或触摸设备绘制您的签名
2. **清除签名**：点击"清除签名"按钮可重置画布
3. **验证签名**：点击"验证签名"按钮进行签名验证
4. **调整参数**：使用滑块调整匹配阈值，选择验证模式

## 项目结构

```
signture/
├─ src/
│  ├─ components/
│  │  ├─ SignatureCanvas.tsx    # 高性能签名画布组件
│  │  └─ ToastContainer.tsx      # Toast 通知组件
│  ├─ types/
│  │  └─ index.ts                # TypeScript 类型定义
│  ├─ utils/
│  │  └─ canvas.ts               # Canvas 工具函数
│  ├─ App.tsx                    # 主应用组件
│  ├─ main.tsx                   # 应用入口
│  └─ index.css                  # 全局样式
├─ index.html                    # HTML 模板
├─ package.json                  # 项目配置
├─ tsconfig.json                 # TypeScript 配置
├─ vite.config.ts                # Vite 配置
├─ tailwind.config.js            # Tailwind CSS 配置
└─ README.md                     # 项目说明
```

## 核心组件说明

### SignatureCanvas 组件

高性能签名画布组件，实现了以下特性：

- **Retina 屏幕适配**：自动处理高分屏模糊问题
- **requestAnimationFrame 优化**：确保流畅的绘制体验
- **事件处理**：支持鼠标和触摸事件
- **性能监控**：实时计算绘制速度、压力等特征

### ToastContainer 组件

通知系统组件，提供用户反馈：

- **多种类型**：支持 info、success、warning、error 四种类型
- **自动关闭**：3 秒后自动消失
- **动画效果**：平滑的进入和退出动画

## 浏览器兼容性

- Chrome/Edge 80+
- Firefox 75+
- Safari 13+
- 移动端浏览器（支持触摸事件）

## 性能优化

### 绘制性能优化

1. 使用 `requestAnimationFrame` 批量处理绘制操作
2. 避免在绘制过程中进行 DOM 操作
3. 使用 `useCallback` 缓存事件处理函数
4. 最小化状态更新次数

### 内存优化

1. 及时清理不需要的引用
2. 使用 `useEffect` 清理函数释放资源
3. 避免内存泄漏

## 开发指南

### 添加新功能

1. 在 `src/components/` 中创建新组件
2. 在 `src/types/` 中定义类型
3. 在 `src/utils/` 中添加工具函数
4. 在 `App.tsx` 中集成新功能

### 样式定制

项目使用 Tailwind CSS，可以通过修改 `tailwind.config.js` 来自定义主题：

```javascript
export default {
  theme: {
    extend: {
      colors: {
        primary: '#3b82f6',
        // 添加自定义颜色
      }
    }
  }
}
```

## License

MIT
