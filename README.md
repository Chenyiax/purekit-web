# PureKit Web

PureKit 是一个基于 React 和 Ant Design 构建的简约风格在线工具箱。它旨在提供一个纯净、高效且无广告的工具使用环境。

## ✨ 功能特性

- 🖼️ **图片格式转换**：支持 PNG, JPEG, WebP, BMP, GIF 格式互转，提供质量参数调节。
- 🔐 **安全密码生成**：自定义长度和字符集，基于服务器端安全生成。
- 📝 **文本工具箱**：
  - 大小写转换、文本反转、去除首尾空格。
  - **缩减多余空格**：一键清理文本中连续的空白字符。
  - **中英文符号转换**：快速修复中英文标点符号混用问题。
  - 实时文本统计（字符数、词数、行数）。
- 📦 **JSON 工具箱**：支持 JSON 格式化（美化）、精简压缩、JSON 转义与去转义。
- 📱 **响应式设计**：完美适配移动端，提供侧边抽屉菜单。

## 🛠️ 技术栈

- **框架**: React 19
- **构建工具**: Vite
- **UI 组件库**: Ant Design 5.x
- **路由**: React Router 6
- **请求库**: Axios
- **图标**: Ant Design Icons

## 🚀 快速开始

### 安装依赖
```bash
npm install
```

### 运行开发服务器
```bash
npm run dev
```

### 编译生产环境
```bash
npm run build
```

## ⚙️ 开发配置

前端通过 `vite.config.js` 配置了接口代理，将 `/api` 请求转发至后端的 `http://localhost:8080`：

```javascript
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:8080',
      changeOrigin: true,
    },
  },
}
```
