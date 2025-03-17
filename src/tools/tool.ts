import { z } from 'zod'

import { calcTool } from './calc'
import { compareTool } from './compare'
import { lcmTool } from './lcm'
import { gcdTool } from './gcd'
import { fileReadTool } from './fileRead'
import { fileWriteTool } from './fileWrite'
import { responseTool } from './response'

export const ToolSchema = z.object({
  name: z.string().describe('ツール名'),
  description: z.string().describe('このツールの説明'),
  parameter: z.string().describe('ツールのパラメータ(zodスキーマによる表現)'),
  execute: z.function()
    .args(z.string())
    .returns(z.promise(z.string()))
    .describe('ツールの実行関数')
})

export type Tool = z.infer<typeof ToolSchema>

export const tools: Tool[] = [
  calcTool,
  compareTool,
  lcmTool,
  gcdTool,
  fileReadTool,
  fileWriteTool,
  responseTool
]
