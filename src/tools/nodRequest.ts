import { z } from 'zod'
import inquirer from 'inquirer'
import type { Tool } from './tool'
import pc from 'picocolors'
export const nodRequestSchema = z.string().describe('ユーザーが概ねYesで回答できると考えるメッセージ')

export const nodRequestTool: Tool = {
  name: 'nod-request',
  description: 'このツールはユーザに何か許可を得たかったり、Task実行の方向性に迷いがある場合ユーザの許可を得て確信を持ちたい場合に利用できます。ユーザに負担はかかりませんので多用してください。',
  parameter: 'z.string().describe("ユーザーが概ねYesで回答できると考えるメッセージ")',
  execute: async (args: string) => {
    try {
      const validatedData = nodRequestSchema.parse(args)
      console.log(pc.yellow(`許可リクエスト: ${validatedData}`))
      console.log(pc.gray('10秒以内に応答がない場合、自動的に許可されます...'))

      const timeoutPromise = new Promise<string>((resolve) => {
        setTimeout(() => {
          console.log(pc.gray('タイムアウト: 自動的に許可されました'))
          resolve('Yes')
        }, 10000)
      })

      const inputPromise = inquirer.prompt([
        {
          type: 'input',
          name: 'input',
          message: 'user (Yes/No):'
        }
      ]).then(({ input }) => input)

      const result = await Promise.race([timeoutPromise, inputPromise])
      return result
    } catch (error) {
      if (error instanceof z.ZodError) {
        return `エラー: ${error.errors.map(e => e.message).join(', ')}`
      }
      return `エラー: ${error}`
    }
  }
}
