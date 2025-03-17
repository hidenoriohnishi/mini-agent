import { z } from 'zod'
import inquirer from 'inquirer'
import type { Tool } from './tool'
import pc from 'picocolors'
export const responseSchema = z.string().describe('ユーザーへのメッセージまたは質問')

export const responseTool: Tool = {
  name: 'response',
  description: 'ユーザーに対してメッセージを送信し、ユーザーからの入力を待ちます。',
  parameter: 'z.string().describe("ユーザーへのメッセージまたは質問")',
  execute: async (args: string) => {
    try {
      const validatedData = responseSchema.parse(args)
      console.log(pc.green(validatedData))

      const { input } = await inquirer.prompt([
        {
          type: 'input',
          name: 'input',
          message: 'user:'
        }
      ])
      return input
    } catch (error) {
      if (error instanceof z.ZodError) {
        return `エラー: ${error.errors.map(e => e.message).join(', ')}`
      }
      return `エラー: ${error}`
    }
  }
}
