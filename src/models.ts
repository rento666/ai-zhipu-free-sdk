/**
 * 智谱的免费模型列表
 */
export const ZHIPU_FREE_MODELS = {
  // 文本模型
  GLM_4_FLASH_250414: 'glm-4-flash-250414',
  GLM_4_7_FLASH: 'glm-4.7-flash',
  
  // 多模态模型
  GLM_4V_FLASH: 'glm-4v-flash',
  GLM_4_6V_FLASH: 'glm-4.6v-flash',
  GLM_4_1V_THINKING_FLASH: 'glm-4.1v-thinking-flash',
  
  // 图像生成模型
  COGVIEW_3_FLASH: 'cogview-3-flash',
  
  // 视频生成模型
  COGVIDEOX_FLASH: 'cogvideox-flash',
} as const

/**
 * 智谱的免费模型键值类型
 */
export type ZhipuFreeModelKey = keyof typeof ZHIPU_FREE_MODELS
/**
 * 智谱的免费模型类型
 */
export type ZhipuFreeModel = typeof ZHIPU_FREE_MODELS[ZhipuFreeModelKey]
