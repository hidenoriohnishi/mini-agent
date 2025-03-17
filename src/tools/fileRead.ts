import { z } from 'zod'
import fs from 'fs'
import path from 'path'
import type { Tool } from './tool'
import 'dotenv/config'

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
      const tempDir = process.env.TEMP_DIR || './temp'
      const filePath = path.join(tempDir, validatedData.filename)

      const normalizedFilePath = path.normalize(filePath)
      const normalizedTempDir = path.normalize(tempDir)

      if (!normalizedFilePath.startsWith(normalizedTempDir)) {
        return 'エラー: TEMP_DIR外のファイルにはアクセスできません'
      }

      if (!fs.existsSync(filePath)) {
        return `エラー: ファイル ${validatedData.filename} が存在しません`
      }

      const content = fs.readFileSync(filePath, 'utf-8')
      const lines = content.split('\n')

      const numberedLines = lines.map((line, index) => `${index + 1}: ${line}`).join('\n')

      return numberedLines
    } catch (error) {
      if (error instanceof z.ZodError) {
        return `エラー: ${error.errors.map(e => e.message).join(', ')}`
      }
      return `エラー: ${error}`
    }
  }
}
