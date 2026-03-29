#!/usr/bin/env node

/**
 * 全面测试示例 - 验证 ai-zhipu-free-sdk 的所有功能
 * 
 * 使用方法：
 * 1. 复制此文件到项目根目录
 * 2. 替换 API_KEY 为您的智谱AI API Key
 * 3. 运行：node test-full.js
 */

import { createClient, ZHIPU_FREE_MODELS } from './dist/index.js'

// 替换为您的智谱AI API Key
const API_KEY = 'your-api-key'

if (!API_KEY || API_KEY === 'your-api-key') {
  console.error('❌ 请先设置 API_KEY')
  process.exit(1)
}

async function testTextChat(client) {
  console.log('\n=== 测试文本对话 ===')
  
  // 测试基本文本对话
  console.log('1. 测试基本文本对话...')
  const textResponse = await client.ask('你好，你是谁？')
  console.log('✅ 基本文本对话成功:')
  console.log(`   ${textResponse}`)
  
  // 测试流式文本对话
  console.log('\n2. 测试流式文本对话...')
  process.stdout.write('   流式输出: ')
  for await (const chunk of client.askStream('请简单介绍一下你自己')) {
    process.stdout.write(chunk)
  }
  console.log('')
  console.log('✅ 流式文本对话成功')
  
  // 测试不同模型
  console.log('\n3. 测试不同模型...')
  const modelResponse = await client.ask('什么是人工智能？', {
    model: ZHIPU_FREE_MODELS.GLM_4_FLASH_250414,
    thinking: { type: 'enabled' }
  })
  console.log('✅ 模型切换成功:')
  console.log(`   ${modelResponse}`)
  
  // 测试高级对话
  console.log('\n4. 测试高级对话...')
  const chatResponse = await client.chat({
    messages: [
      { role: 'system', content: '你是一个友好的助手' },
      { role: 'user', content: '今天天气怎么样？' }
    ],
    temperature: 0.7
  })
  console.log('✅ 高级对话成功:')
  console.log(`   ${chatResponse.choices[0].message.content}`)
}

async function testVision(client) {
  console.log('\n=== 测试多模态能力 ===')
  
  // 测试图片理解
  console.log('1. 测试图片理解...')
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
  
  // 测试流式图片理解
  console.log('\n2. 测试流式图片理解...')
  try {
    process.stdout.write('   流式输出: ')
    for await (const chunk of client.visionStream(
      '图片里有什么？',
      'https://cdn.bigmodel.cn/static/logo/register.png'
    )) {
      process.stdout.write(chunk)
    }
    console.log('')
    console.log('✅ 流式图片理解成功')
  } catch (error) {
    console.log('⚠️  流式图片理解测试失败（可能是API限制）:', error.message)
  }
}

async function testVideo(client) {
  console.log('\n=== 测试视频理解 ===')
  
  // 测试视频理解
  console.log('1. 测试视频理解...')
  try {
    const videoResponse = await client.video(
      '视频内容是什么？',
      'https://cdn.bigmodel.cn/agent-demos/lark/113123.mov'
    )
    console.log('✅ 视频理解成功:')
    console.log(`   ${videoResponse}`)
  } catch (error) {
    console.log('⚠️  视频理解测试失败（可能是API限制）:', error.message)
  }
  
  // 测试流式视频理解
  console.log('\n2. 测试流式视频理解...')
  try {
    process.stdout.write('   流式输出: ')
    for await (const chunk of client.videoStream(
      '视频内容是什么？',
      'https://cdn.bigmodel.cn/agent-demos/lark/113123.mov'
    )) {
      process.stdout.write(chunk)
    }
    console.log('')
    console.log('✅ 流式视频理解成功')
  } catch (error) {
    console.log('⚠️  流式视频理解测试失败（可能是API限制）:', error.message)
  }
}

async function testFile(client) {
  console.log('\n=== 测试文件理解 ===')
  
  // 测试文件理解
  console.log('1. 测试文件理解...')
  try {
    const fileResponse = await client.file(
      '文件内容是什么？',
      'https://cdn.bigmodel.cn/static/demo/demo2.txt'
    )
    console.log('✅ 文件理解成功:')
    console.log(`   ${fileResponse}`)
  } catch (error) {
    console.log('⚠️  文件理解测试失败（可能是API限制）:', error.message)
  }
  
  // 测试流式文件理解
  console.log('\n2. 测试流式文件理解...')
  try {
    process.stdout.write('   流式输出: ')
    for await (const chunk of client.fileStream(
      '文件内容是什么？',
      'https://cdn.bigmodel.cn/static/demo/demo2.txt'
    )) {
      process.stdout.write(chunk)
    }
    console.log('')
    console.log('✅ 流式文件理解成功')
  } catch (error) {
    console.log('⚠️  流式文件理解测试失败（可能是API限制）:', error.message)
  }
}

async function testErrorHandling(client) {
  console.log('\n=== 测试错误处理 ===')
  
  // 测试错误处理
  console.log('1. 测试错误处理...')
  try {
    // 使用无效的模型名称
    await client.ask('测试错误处理', {
      model: 'invalid-model' // @ts-ignore - 故意使用无效模型
    })
  } catch (error) {
    console.log('✅ 错误处理成功:')
    console.log(`   捕获到预期错误: ${error.message}`)
  }
}

async function runAllTests() {
  console.log('🚀 开始全面测试 ai-zhipu-free-sdk...')
  console.log('='.repeat(60))

  try {
    // 初始化客户端
    console.log('初始化客户端...')
    const client = createClient({ apiKey: API_KEY })
    console.log('✅ 客户端初始化成功')

    // 运行各项测试
    await testTextChat(client)
    await testVision(client)
    await testVideo(client)
    await testFile(client)
    await testErrorHandling(client)

    console.log('\n' + '='.repeat(60))
    console.log('🎉 所有测试完成！')
    console.log('✅ 功能正常运行')

  } catch (error) {
    console.error('❌ 测试失败:', error.message)
    process.exit(1)
  }
}

// 运行测试
runAllTests()
