# 动态签名验证系统

基于模式识别的手写签名身份验证应用程序，实现自动化识别与真伪鉴别功能。

## 功能特性

- 📝 **签名输入**：支持鼠标和触摸设备绘制签名
- 🧠 **模式识别**：模拟动态签名验证算法（静态页面演示）
- 📊 **实时反馈**：验证结果即时显示
- ⚙️ **参数配置**：可调节匹配阈值和验证模式
- 📋 **历史记录**：展示最近验证记录

## 技术栈

- **HTML5** - 页面结构
- **CSS3** - 样式设计
- **JavaScript** - 交互功能
- **Canvas API** - 签名绘制

## 快速开始

### 本地运行

1. 克隆或下载项目到本地：
   ```bash
   git clone <repository-url>
   ```

2. 进入项目目录：
   ```bash
   cd project-folder
   ```

3. 在浏览器中直接打开 `src/pages/index.html` 文件即可使用：
   ```bash
   # 使用默认浏览器打开
   open src/pages/index.html  # macOS
   start src/pages/index.html  # Windows
   xdg-open src/pages/index.html  # Linux
   ```

### 或使用本地服务器

```bash
# 使用 Python 3
python -m http.server 8000

# 使用 Node.js
npx serve
```

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
