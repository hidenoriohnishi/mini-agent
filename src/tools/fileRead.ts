import { z } from 'zod'
import fs from 'fs'
import type { Tool } from './tool'
import { validateFilePath, addLineNumbers } from '../lib/file'

export const fileReadSchema = z.object({
  filename: z.string().describe('読み込むファイル名')
})

export const fileReadTool: Tool = {
  name: 'fileRead',
  description: 'ファイルを読み込みます。TEMP_DIR配下のファイルのみ読み込み可能です。',
  parameter: `
z.object({
  filename: z.string().describe('読み込むファイル名')
})`,
  execute: async (args: string) => {
    try {
      const validatedData = fileReadSchema.parse(JSON.parse(args))
      const filePath = validateFilePath(validatedData.filename)

      if (!fs.existsSync(filePath)) {
        return `エラー: ファイル ${validatedData.filename} が存在しません`
      }

      const content = fs.readFileSync(filePath, 'utf-8')
      const numberedContent = addLineNumbers(content)
      return numberedContent
    } catch (error) {
      if (error instanceof z.ZodError) {
        return `エラー: ${error.errors.map(e => e.message).join(', ')}`
      }
      return `エラー: ${error}`
    }
  }
}
