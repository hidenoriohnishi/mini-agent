import { z } from 'zod'
import type { Tool } from './tool'

export const responseSchema = z.object({
  message: z.string().describe('ユーザーへのメッセージまたは質問')
})

export const responseTool: Tool = {
  name: 'response',
  description: 'ユーザーに対してメッセージを送信したり、質問を投げかけたりします。',
  parameter: `
z.object({
  message: z.string().describe('ユーザーへのメッセージまたは質問')
})`,
  execute: async (args: string) => {
    try {
      const validatedData = responseSchema.parse(JSON.parse(args))
      return `<response>${validatedData.message}</response>`
    } catch (error) {
      if (error instanceof z.ZodError) {
        return `エラー: ${error.errors.map(e => e.message).join(', ')}`
      }
      return `エラー: ${error}`
    }
  }
} 