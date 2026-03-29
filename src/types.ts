

import type { ZhipuFreeModel } from './models'

export type { ZhipuFreeModel }

/**
 * 智谱的免费模型消息类型
 * @description 消息类型，user、assistant、system 三者之一
 * @param role 消息角色
 * @param content 消息内容
 */
export interface ZhipuFreeMessage {
  /**
   * 消息角色
   * @description 消息角色，user、assistant、system 三者之一
   */
  role: 'user' | 'assistant' | 'system'
  /**
   * 消息内容
   * @description 消息内容，可以是文本、图片、视频、文件等
   */
  content: string | ZhipuFreeContentPart[]
}

/**
 * 智谱的免费模型消息内容部分类型
 * @description 消息内容部分，可以是文本、图片、视频、文件等
 * @param type 内容类型
 * @param text 文本内容
 * @param image_url 图片 URL
 * @param video_url 视频 URL
 * @param file_url 文件 URL
 */
export interface ZhipuFreeContentPart {
  /**
   * 内容类型
   * @description 内容类型，text、image_url、video_url、file_url 四者之一
   */
  type: 'text' | 'image_url' | 'video_url' | 'file_url'
  /**
   * 文本内容
   * @description 文本内容，当 type 为 text 时必填
   */
  text?: string
  /**
   * 图片 URL
   * @description 图片 URL，当 type 为 image_url 时必填
   */
  image_url?: {
    url: string
  }
  /**
   * 视频 URL
   * @description 视频 URL，当 type 为 video_url 时必填
   */
  video_url?: {
    url: string
  }
  /**
   * 文件 URL
   * @description 文件 URL，当 type 为 file_url 时必填
   */
  file_url?: {
    url: string
  }
}

/**
 * 智谱的免费模型聊天选项类型
 * @description 聊天选项，包括模型名称、消息列表、采样温度等
 * @param model 免费模型名称
 * @param messages 消息列表
 * @param stream 是否流式输出
 * @param thinking 是否开启思考模式
 * @param do_sample 是否开启采样模式
 * @param temperature 采样温度
 * @param top_p 核采样温度
 * @param max_tokens 最大令牌数
 */
export interface ZhipuFreeChatOptions {
  /**
   * 免费模型名称
   * @description 模型名称，默认值为 GLM_4_7_FLASH
   */
  model?: ZhipuFreeModel
  /**
   * 消息列表
   */
  messages: ZhipuFreeMessage[]
  /**
   * 采样温度
   */
  temperature?: number
  top_p?: number
  max_tokens?: number
  stream?: boolean
  thinking?: {
    type: 'enabled' | 'disabled'
  }
}

/**
 * 智谱的免费模型聊天响应类型
 */
export interface ZhipuFreeChatResponse {
  id: string
  created: number
  model: string
  choices: {
    index: number
    finish_reason: string
    message: {
      role: string
      content: string
    }
  }[]
  usage: {
    prompt_tokens: number
    completion_tokens: number
    total_tokens: number
  }
}

/**
 * 智谱的免费模型聊天流响应类型
 */
export interface ZhipuFreeStreamChunk {
  id: string
  created: number
  model: string
  choices: {
    index: number
    finish_reason: string | null
    delta: {
      role?: string
      content?: string
    }
  }[]
}

/**
 * 智谱的免费模型客户端选项类型
 */
export interface ZhipuFreeClientOptions {
  /**
   * API Key，优先使用此参数，如未提供则从环境变量 API_KEY 读取
   */
  apiKey?: string
  baseUrl?: string
}

/**
 * 智谱的免费模型客户端错误类型
 */
export interface ZhipuFreeError {
  code: string
  message: string
}
