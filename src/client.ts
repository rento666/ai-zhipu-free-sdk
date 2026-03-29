import type {
  ZhipuFreeChatOptions,
  ZhipuFreeChatResponse,
  ZhipuFreeClientOptions,
  ZhipuFreeContentPart,
  ZhipuFreeMessage,
  ZhipuFreeModel,
  ZhipuFreeStreamChunk,
} from './types'
import { ZHIPU_FREE_MODELS } from './models'

const DEFAULT_BASE_URL = 'https://open.bigmodel.cn/api/paas/v4'
const DEFAULT_MODEL: ZhipuFreeModel = ZHIPU_FREE_MODELS.GLM_4_7_FLASH

/**
 * 智谱的免费模型客户端类
 */
export class ZhipuFreeClient {
  private apiKey: string
  private baseUrl: string

  constructor(options: ZhipuFreeClientOptions = {}) {
    const apiKey = options.apiKey ?? process.env.API_KEY
    if (!apiKey || apiKey === '' || apiKey === '<your-api-key>') {
      throw new Error('❌ 请先设置 API_KEY')
    }
    this.apiKey = apiKey
    this.baseUrl = options.baseUrl ?? DEFAULT_BASE_URL
  }

  /**
   * 调用智谱的免费模型聊天接口
   * @param options 聊天选项
   * @returns 聊天响应
   * @throws {ZhipuFreeError} 聊天失败时抛出错误
   */
  async chat(options: ZhipuFreeChatOptions): Promise<ZhipuFreeChatResponse> {
    const model = options.model ?? DEFAULT_MODEL
    const url = `${this.baseUrl}/chat/completions`

    const body = JSON.stringify({
      model,
      messages: options.messages,
      temperature: options.temperature,
      top_p: options.top_p,
      max_tokens: options.max_tokens,
      stream: options.stream ?? false,
      thinking: options.thinking,
    })

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
      },
      body,
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      throw new ZhipuFreeError(
        error.error?.message ?? `HTTP ${response.status}: ${response.statusText}`,
        error.error?.code ?? 'UNKNOWN_ERROR'
      )
    }

    return response.json()
  }

  async *chatStream(
    options: ZhipuFreeChatOptions
  ): AsyncGenerator<ZhipuFreeStreamChunk, void, unknown> {
    const model = options.model ?? DEFAULT_MODEL
    const url = `${this.baseUrl}/chat/completions`

    const body = JSON.stringify({
      model,
      messages: options.messages,
      temperature: options.temperature,
      top_p: options.top_p,
      max_tokens: options.max_tokens,
      stream: true,
      thinking: options.thinking,
    })

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
      },
      body,
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      throw new ZhipuFreeError(
        error.error?.message ?? `HTTP ${response.status}: ${response.statusText}`,
        error.error?.code ?? 'UNKNOWN_ERROR'
      )
    }

    const reader = response.body?.getReader()
    if (!reader) {
      throw new ZhipuFreeError('No response body', 'NO_BODY')
    }

    const decoder = new TextDecoder()
    let buffer = ''

    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      buffer += decoder.decode(value, { stream: true })
      const lines = buffer.split('\n')
      buffer = lines.pop() ?? ''

      for (const line of lines) {
        const trimmed = line.trim()
        if (!trimmed || trimmed === 'data: [DONE]') continue
        if (!trimmed.startsWith('data: ')) continue

        const json = trimmed.slice(6)
        try {
          const chunk: ZhipuFreeStreamChunk = JSON.parse(json)
          yield chunk
        } catch {
          // Skip invalid JSON
        }
      }
    }
  }

  async ask(
    content: string | ZhipuFreeContentPart[],
    options?: {
      model?: ZhipuFreeModel
      system?: string
      temperature?: number
      max_tokens?: number
      thinking?: {
        type: 'enabled' | 'disabled'
      }
    }
  ): Promise<string> {
    const messages: ZhipuFreeMessage[] = []

    if (options?.system) {
      messages.push({ role: 'system', content: options.system })
    }

    messages.push({ role: 'user', content })

    const response = await this.chat({
      model: options?.model,
      messages,
      temperature: options?.temperature,
      max_tokens: options?.max_tokens,
      thinking: options?.thinking,
    })

    return response.choices[0]?.message.content ?? ''
  }

  async *askStream(
    content: string | ZhipuFreeContentPart[],
    options?: {
      model?: ZhipuFreeModel
      system?: string
      temperature?: number
      max_tokens?: number
      thinking?: {
        type: 'enabled' | 'disabled'
      }
    }
  ): AsyncGenerator<string, void, unknown> {
    const messages: ZhipuFreeMessage[] = []

    if (options?.system) {
      messages.push({ role: 'system', content: options.system })
    }

    messages.push({ role: 'user', content })

    for await (const chunk of this.chatStream({
      model: options?.model,
      messages,
      temperature: options?.temperature,
      max_tokens: options?.max_tokens,
      thinking: options?.thinking,
    })) {
      const delta = chunk.choices[0]?.delta?.content
      if (delta) yield delta
    }
  }

  async vision(
    text: string,
    imageUrl: string,
    options?: {
      model?: ZhipuFreeModel
      temperature?: number
      max_tokens?: number
      thinking?: {
        type: 'enabled' | 'disabled'
      }
    }
  ): Promise<string> {
    const content: ZhipuFreeContentPart[] = [
      { type: 'text', text },
      { type: 'image_url', image_url: { url: imageUrl } },
    ]

    return this.ask(content, {
      model: options?.model ?? ZHIPU_FREE_MODELS.GLM_4V_FLASH,
      temperature: options?.temperature,
      max_tokens: options?.max_tokens,
      thinking: options?.thinking,
    })
  }

  async *visionStream(
    text: string,
    imageUrl: string,
    options?: {
      model?: ZhipuFreeModel
      temperature?: number
      max_tokens?: number
      thinking?: {
        type: 'enabled' | 'disabled'
      }
    }
  ): AsyncGenerator<string, void, unknown> {
    const content: ZhipuFreeContentPart[] = [
      { type: 'text', text },
      { type: 'image_url', image_url: { url: imageUrl } },
    ]

    yield* this.askStream(content, {
      model: options?.model ?? ZHIPU_FREE_MODELS.GLM_4V_FLASH,
      temperature: options?.temperature,
      max_tokens: options?.max_tokens,
      thinking: options?.thinking,
    })
  }

  async video(
    text: string,
    videoUrl: string,
    options?: {
      model?: ZhipuFreeModel
      temperature?: number
      max_tokens?: number
      thinking?: {
        type: 'enabled' | 'disabled'
      }
    }
  ): Promise<string> {
    const content: ZhipuFreeContentPart[] = [
      { type: 'text', text },
      { type: 'video_url', video_url: { url: videoUrl } },
    ]

    return this.ask(content, {
      model: options?.model ?? ZHIPU_FREE_MODELS.GLM_4_6V_FLASH,
      temperature: options?.temperature,
      max_tokens: options?.max_tokens,
      thinking: options?.thinking,
    })
  }

  async *videoStream(
    text: string,
    videoUrl: string,
    options?: {
      model?: ZhipuFreeModel
      temperature?: number
      max_tokens?: number
      thinking?: {
        type: 'enabled' | 'disabled'
      }
    }
  ): AsyncGenerator<string, void, unknown> {
    const content: ZhipuFreeContentPart[] = [
      { type: 'text', text },
      { type: 'video_url', video_url: { url: videoUrl } },
    ]

    yield* this.askStream(content, {
      model: options?.model ?? ZHIPU_FREE_MODELS.GLM_4_6V_FLASH,
      temperature: options?.temperature,
      max_tokens: options?.max_tokens,
      thinking: options?.thinking,
    })
  }

  async file(
    text: string,
    fileUrl: string,
    options?: {
      model?: ZhipuFreeModel
      temperature?: number
      max_tokens?: number
      thinking?: {
        type: 'enabled' | 'disabled'
      }
    }
  ): Promise<string> {
    const content: ZhipuFreeContentPart[] = [
      { type: 'text', text },
      { type: 'file_url', file_url: { url: fileUrl } },
    ]

    return this.ask(content, {
      model: options?.model ?? ZHIPU_FREE_MODELS.GLM_4_6V_FLASH,
      temperature: options?.temperature,
      max_tokens: options?.max_tokens,
      thinking: options?.thinking,
    })
  }

  async *fileStream(
    text: string,
    fileUrl: string,
    options?: {
      model?: ZhipuFreeModel
      temperature?: number
      max_tokens?: number
      thinking?: {
        type: 'enabled' | 'disabled'
      }
    }
  ): AsyncGenerator<string, void, unknown> {
    const content: ZhipuFreeContentPart[] = [
      { type: 'text', text },
      { type: 'file_url', file_url: { url: fileUrl } },
    ]

    yield* this.askStream(content, {
      model: options?.model ?? ZHIPU_FREE_MODELS.GLM_4_6V_FLASH,
      temperature: options?.temperature,
      max_tokens: options?.max_tokens,
      thinking: options?.thinking,
    })
  }
}

export class ZhipuFreeError extends Error {
  code: string

  constructor(message: string, code: string) {
    super(message)
    this.name = 'ZhipuFreeError'
    this.code = code
  }
}

export function createClient(options: ZhipuFreeClientOptions): ZhipuFreeClient {
  return new ZhipuFreeClient(options)
}
