---
"ai-zhipu-free-sdk": minor
---

首次发布：智谱AI免费模型快捷接入库

## ✨ 特性

- 填 API Key 直接调用
- 完整支持 TypeScript + ES 模块
- 专业的 changesets 发布流程
- 严格的版本兼容规范
- 仅支持智谱免费模型
- 无任何依赖
- 浏览器 + Node.js 通用
- 文本对话
- 免费看图（多模态）
- 视频理解
- 文件理解

## 📡 支持的模型

- GLM-4-Flash-250414 - 文本模型
- GLM-4.7-Flash - 文本模型（增强编码能力）
- GLM-4V-Flash - 多模态模型（图片理解）
- GLM-4.6V-Flash - 多模态模型（图片/视频/文件理解）
- GLM-4.1V-Thinking-Flash - 多模态模型（带思考模式）
- CogView-3-Flash - 图像生成模型
- CogVideoX-Flash - 视频生成模型

## 🔧 API 方法

- `ask()` / `askStream()` - 文本对话
- `vision()` / `visionStream()` - 图片理解
- `video()` / `videoStream()` - 视频理解
- `file()` / `fileStream()` - 文件理解
- `chat()` / `chatStream()` - 高级对话
