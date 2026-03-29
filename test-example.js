#!/usr/bin/env node

/**
 * 测试示例 - 验证 ai-zhipu-free-sdk 的功能
 * 
 * 使用方法：
 * 1. 复制此文件到项目根目录
 * 2. 替换 API_KEY 为您的智谱AI API Key
 * 3. 运行：node test-example.js
 */

import { createClient, ZHIPU_FREE_MODELS } from './dist/index.js'

// 替换为您的智谱AI API Key
const API_KEY = process.env.API_KEY 

if (!API_KEY || API_KEY === '') {
  console.error('❌ 请先设置 API_KEY')
  process.exit(1)
}

async function testClient() {
  console.log('🚀 开始测试 ai-zhipu-free-sdk...')
  console.log('='.repeat(60))

  try {
    // 1. 初始化客户端
    console.log('1. 测试客户端初始化...')
    const client = createClient({ apiKey: API_KEY })
    console.log('✅ 客户端初始化成功')

    // 2. 测试文本对话
    console.log('\n2. 测试文本对话...')
    const textResponse = await client.ask('你好，你是谁？')
    console.log('✅ 文本对话成功:')
    console.log(`   ${textResponse}`)

    // 3. 测试流式对话
    console.log('\n3. 测试流式对话...')
    process.stdout.write('   流式输出: ')
    for await (const chunk of client.askStream('请简单介绍一下你自己')) {
      process.stdout.write(chunk)
    }
    console.log('')
    console.log('✅ 流式对话成功')

    // 4. 测试不同模型
    console.log('\n4. 测试不同模型...')
    const modelResponse = await client.ask('什么是人工智能？', {
      model: ZHIPU_FREE_MODELS.GLM_4_FLASH,
      thinking: { type: 'enabled' }
    })
    console.log('✅ 模型切换成功:')
    console.log(`   ${modelResponse}`)

    // 5. 测试多模态能力（图片）
    console.log('\n5. 测试图片理解...')
    try {
      const visionResponse = await client.vision(
        '图片里有什么？',
        'https://cdn.bigmodel.cn/static/logo/register.png'
      )
      console.log('✅ 图片理解成功:')
      console.log(`   ${visionResponse}`)
    } catch (error) {
      console.log('⚠️  图片理解测试失败（可能是API限制）:', error.message)
    }

    // 6. 测试高级对话
    console.log('\n6. 测试高级对话...')
    const chatResponse = await client.chat({
      model: ZHIPU_FREE_MODELS.GLM_4_FLASH,
      messages: [
        { role: 'system', content: '你是一个友好的助手' },
        { role: 'user', content: '今天天气怎么样？' }
      ],
      temperature: 0.7
    })
    console.log('✅ 高级对话成功:')
    console.log(`   ${chatResponse.choices[0].message.content}`)

    console.log('\n' + '='.repeat(60))
    console.log('🎉 所有测试完成！')
    console.log('✅ 功能正常运行')

  } catch (error) {
    console.error('❌ 测试失败:', error.message)
    process.exit(1)
  }
}

// 运行测试
testClient()
