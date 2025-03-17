import { z } from 'zod'
import fs from 'fs'
import path from 'path'
import type { Tool } from './tool'
import 'dotenv/config'

export const fileWriteSchema = z.object({
  filename: z.string().describe('書き込むファイル名'),
  startLine: z.number().int().min(1).describe('編集開始行'),
  endLine: z.number().int().min(1).describe('編集終了行'),
  content: z.string().describe('書き込む内容（複数行の場合は改行で区切る）')
})

export const fileWriteTool: Tool = {
  name: 'fileWrite',
  description: 'ファイルを編集します。TEMP_DIR配下のファイルのみ編集可能です。ファイル名、開始行数、終了行数、書き込み内容を指定して修正します。開始行と終了行の範囲が書き込み内容の行数と異なる場合、削除や挿入が行われます。例：開始行1、終了行2、内容2行なら単純修正。例：開始行1、終了行3、内容1行なら2・3行目は削除。例：開始行1、終了行1、内容3行なら2行追加される。応答は行番号付きで編集後の全内容を返します。',
  parameter: `
z.object({
  filename: z.string().describe('書き込むファイル名'),
  startLine: z.number().int().min(1).describe('編集開始行'),
  endLine: z.number().int().min(1).describe('編集終了行'),
  content: z.string().describe('書き込む内容（複数行の場合は改行で区切る）')
})`,
  execute: async (args: string) => {
    try {
      const validatedData = fileWriteSchema.parse(JSON.parse(args))
      const tempDir = process.env.TEMP_DIR || './temp'
      const filePath = path.join(tempDir, validatedData.filename)

      const normalizedFilePath = path.normalize(filePath)
      const normalizedTempDir = path.normalize(tempDir)

      if (!normalizedFilePath.startsWith(normalizedTempDir)) {
        return 'エラー: TEMP_DIR外のファイルにはアクセスできません'
      }

      if (!fs.existsSync(filePath)) {
        if (!fs.existsSync(path.dirname(filePath))) {
          fs.mkdirSync(path.dirname(filePath), { recursive: true })
        }
        fs.writeFileSync(filePath, '')
      }

      const content = fs.readFileSync(filePath, 'utf-8')
      const lines = content.split('\n')

      const startIndex = validatedData.startLine - 1
      const endIndex = validatedData.endLine - 1

      if (startIndex < 0) {
        return 'エラー: 開始行は1以上である必要があります'
      }

      const newContentLines = validatedData.content.split('\n')

      if (startIndex > lines.length) {
        while (lines.length < startIndex) {
          lines.push('')
        }
        lines.splice(startIndex, 0, ...newContentLines)
      } else {
        lines.splice(startIndex, endIndex - startIndex + 1, ...newContentLines)
      }

      fs.writeFileSync(filePath, lines.join('\n'))

      const updatedContent = fs.readFileSync(filePath, 'utf-8')
      const updatedLines = updatedContent.split('\n')
      const numberedLines = updatedLines.map((line, index) => `${index + 1}: ${line}`).join('\n')

      return numberedLines
    } catch (error) {
      if (error instanceof z.ZodError) {
        return `エラー: ${error.errors.map(e => e.message).join(', ')}`
      }
      return `エラー: ${error}`
    }
  }
}
