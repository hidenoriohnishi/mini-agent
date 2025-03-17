import fs from 'fs'
import path from 'path'
import 'dotenv/config'

export const getTempDir = () => process.env.TEMP_DIR || './temp'

export const validateFilePath = (filename: string) => {
  const tempDir = getTempDir()
  const filePath = path.join(tempDir, filename)
  const normalizedFilePath = path.normalize(filePath)
  const normalizedTempDir = path.normalize(tempDir)

  if (!normalizedFilePath.startsWith(normalizedTempDir)) {
    throw new Error('TEMP_DIR外のファイルにはアクセスできません')
  }

  return filePath
}

export const addLineNumbers = (content: string): string => {
  const lines = content.split('\n')
  return lines.map((line, index) => `${index + 1}: ${line}`).join('\n')
}

export const ensureFileExists = (filePath: string) => {
  if (!fs.existsSync(filePath)) {
    const dirPath = path.dirname(filePath)
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true })
    }
    fs.writeFileSync(filePath, '')
  }
}
