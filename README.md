# ai-zhipu-free-sdk

智谱AI免费模型快捷接入库 - 支持文本对话、多模态看图、视频和文件理解，浏览器与Node.js通用。

[![NPM Version](https://img.shields.io/npm/v/ai-zhipu-free-sdk)](https://www.npmjs.com/package/ai-zhipu-free-sdk)
[![License](https://img.shields.io/npm/l/ai-zhipu-free-sdk)](LICENSE)

## ✨ 特性

- **填 API Key 直接调用**
- **完整支持 TypeScript + ES 模块**
- **专业的 changesets 发布流程**
- **严格的版本兼容规范**
- **仅支持智谱免费模型**
- **无任何依赖**
- **浏览器 + Node.js 通用**
- **文本对话**
- **免费看图（多模态）**
- **视频理解**
- **文件理解**

## 📦 安装

```bash
npm install ai-zhipu-free-sdk
# 或
yarn add ai-zhipu-free-sdk
# 或
pnpm add ai-zhipu-free-sdk
```

## 🚀 快速开始

### 基础用法

```typescript
import { createClient, ZHIPU_FREE_MODELS } from 'ai-zhipu-free-sdk'

// 初始化客户端
const client = createClient({ 
  apiKey: 'your-api-key' 
})

// 简单对话
const answer = await client.ask('你好！')
console.log(answer)

// 流式对话
for await (const text of client.askStream('讲个故事')) {
  process.stdout.write(text)
}

// 多模态看图
const visionResult = await client.vision('图片里有什么？', 'https://example.com/image.jpg')
console.log(visionResult)

// 视频理解
const videoResult = await client.video('视频内容是什么？', 'https://example.com/video.mp4')
console.log(videoResult)

// 文件理解
const fileResult = await client.file('文档内容总结', 'https://example.com/document.pdf')
console.log(fileResult)
```

## 📡 支持的模型

所有模型名称都集中在 `ZHIPU_FREE_MODELS` 常量中，便于后续维护：

| 模型名称                      | 类型     | 用途         |
| ------------------------- | ------ | ---------- |
| `GLM_4_FLASH_250414`             | 文本模型   | 通用文本对话 |
| `GLM_4_7_FLASH`           | 文本模型   | 增强编码能力（默认） |
| `GLM_4V_FLASH`            | 多模态模型  | 图片理解       |
| `GLM_4_6V_FLASH`          | 多模态模型  | 图片/视频/文件理解 |
| `GLM_4_1V_THINKING_FLASH` | 多模态模型  | 带思考模式的视觉理解 |
| `COGVIEW_3_FLASH`         | 图像生成模型 | 图片生成       |
| `COGVIDEOX_FLASH`         | 视频生成模型 | 视频生成       |

## 🔧 API 参考

### 创建客户端

```typescript
// 方式1：通过参数传入（优先）
const client1 = createClient({ 
  apiKey: 'your-api-key',  // 智谱AI API Key
  baseUrl: 'https://open.bigmodel.cn/api/paas/v4'  // 可选，默认值 
})

// 方式2：从环境变量读取
// 需要设置环境变量 API_KEY=your-api-key
const client2 = createClient()

// 方式3：参数为空对象（同样从环境变量读取）
const client3 = createClient({})
```

### 文本对话

#### `ask(content, options)`

- **参数**:
  - `content`: `string` - 对话内容
  - `options`:
    - `model`: `ZhipuFreeModel` - 模型名称
    - `system`: `string` - 系统提示
    - `temperature`: `number` - 温度
    - `max_tokens`: `number` - 最大令牌数
    - `thinking`: `{ type: 'enabled' | 'disabled' }` - 思考模式
- **返回**: `Promise<string>` - 对话回复

#### `askStream(content, options)`

- **参数**: 同 `ask`
- **返回**: `AsyncGenerator<string>` - 流式回复

### 多模态能力

#### `vision(text, imageUrl, options)`

- **参数**:
  - `text`: `string` - 问题文本
  - `imageUrl`: `string` - 图片 URL
  - `options`: 同 `ask`
- **返回**: `Promise<string>` - 图片理解结果

#### `visionStream(text, imageUrl, options)`

- **参数**: 同 `vision`
- **返回**: `AsyncGenerator<string>` - 流式图片理解结果

#### `video(text, videoUrl, options)`

- **参数**:
  - `text`: `string` - 问题文本
  - `videoUrl`: `string` - 视频 URL
  - `options`: 同 `ask`
- **返回**: `Promise<string>` - 视频理解结果

#### `videoStream(text, videoUrl, options)`

- **参数**: 同 `video`
- **返回**: `AsyncGenerator<string>` - 流式视频理解结果

#### `file(text, fileUrl, options)`

- **参数**:
  - `text`: `string` - 问题文本
  - `fileUrl`: `string` - 文件 URL
  - `options`: 同 `ask`
- **返回**: `Promise<string>` - 文件理解结果

#### `fileStream(text, fileUrl, options)`

- **参数**: 同 `file`
- **返回**: `AsyncGenerator<string>` - 流式文件理解结果

### 高级对话

#### `chat(options)`

- **参数**:
  - `model`: `ZhipuFreeModel` - 模型名称
  - `messages`: `ZhipuFreeMessage[]` - 对话历史
  - `temperature`: `number` - 温度
  - `top_p`: `number` - 采样参数
  - `max_tokens`: `number` - 最大令牌数
  - `stream`: `boolean` - 是否流式
  - `thinking`: `{ type: 'enabled' | 'disabled' }` - 思考模式
- **返回**: `Promise<ZhipuFreeChatResponse>` - 完整对话响应

#### `chatStream(options)`

- **参数**: 同 `chat`
- **返回**: `AsyncGenerator<ZhipuFreeStreamChunk>` - 流式对话响应

## 📝 类型定义

```typescript
// 模型类型
export type ZhipuFreeModel = 'glm-4-flash' | 'glm-4.7-flash' | 'glm-4v-flash' | 'glm-4.6v-flash' | 'glm-4.1v-thinking-flash' | 'cogview-3-flash' | 'cogvideox-flash'

// 消息类型
export interface ZhipuFreeMessage {
  role: 'user' | 'assistant' | 'system'
  content: string | ZhipuFreeContentPart[]
}

// 内容部分
export interface ZhipuFreeContentPart {
  type: 'text' | 'image_url' | 'video_url' | 'file_url'
  text?: string
  image_url?: { url: string }
  video_url?: { url: string }
  file_url?: { url: string }
}

// 对话选项
export interface ZhipuFreeChatOptions {
  model?: ZhipuFreeModel
  messages: ZhipuFreeMessage[]
  temperature?: number
  top_p?: number
  max_tokens?: number
  stream?: boolean
  thinking?: { type: 'enabled' | 'disabled' }
}
```

## 模型文档

将官网的免费模型文档提取到了项目的`docs`目录下，同时版本号与项目保持一致。

## 🔄 发布流程

项目使用 changesets 进行版本管理：

1. **创建变更记录**:
   ```bash
   npm run changeset
   ```
2. **更新版本号**:
   ```bash
   npm run version
   ```
3. **发布到 npm**:
   ```bash
   npm run release
   ```

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License

## 📞 支持

- [智谱AI开放平台](https://open.bigmodel.cn/)
- [API文档](https://docs.bigmodel.cn/)
- [模型速率限制](https://www.bigmodel.cn/usercenter/proj-mgmt/rate-limits)

