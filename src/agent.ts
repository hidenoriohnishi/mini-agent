import { openai } from '@ai-sdk/openai'
import { CoreMessage, generateText } from 'ai'
import pc from 'picocolors'
import 'dotenv/config'

import { SYSTEM_PROMPT } from './prompt'
import { tools } from './tools/tool'

import { MODEL } from './constant'

const model = openai(MODEL)

const toolCallRegex = /<tool[^>]*type="(?<name>[^"]+)"[^>]*>(?<parameters>[\s\S]*?)<\/tool>(?:\s*)$/

async function processToolCalls (text: string): Promise<string | undefined> {
  const match = text.match(toolCallRegex)
  const name = match?.groups?.name
  const parameters = match?.groups?.parameters?.trim()
  const tool = tools.find((t: { name: string }) => t.name === name)
  if (tool && parameters) {
    const toolResult = await tool.execute(parameters)
    return `<tool-result>${toolResult}</tool-result>`
  }
  return undefined
}

async function main () {
  const messages: CoreMessage[] = []
  messages.push({ role: 'system', content: SYSTEM_PROMPT })
  while (true) {
    try {
      while (true) {
        const { text } = await generateText({
          model,
          messages,
          temperature: 0.3
        })
        messages.push({ role: 'assistant', content: text })
        console.log(pc.yellow(text))
        const result = await processToolCalls(text)
        if (result) {
          console.log(pc.cyan(result))
          messages.push({ role: 'system', content: result })
          if (result.includes('<tool-result>')) break
        }
      }
    } catch (error) {
      console.error(pc.red('エラー:'), error)
      break
    }
  }
}

if (!process.env.OPENAI_API_KEY) {
  console.error(pc.red('OPENAI_API_KEYが設定されていません。'))
  process.exit(1)
}

main().catch((error) => {
  console.error(pc.red('予期せぬエラー:'), error)
  process.exit(1)
})
