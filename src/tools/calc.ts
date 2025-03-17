import { z } from 'zod'
import type { Tool } from './tool'

export const calcSchema = z.object({
  a: z.number().describe('左オペランド'),
  b: z.number().describe('右オペランド'),
  ope: z.enum(['add', 'sub', 'mul', 'div', 'mod']).describe('オペレータ')
})

export const calcTool: Tool = {
  name: 'calc',
  description: '四則演算を実行します。',
  parameter: `
z.object({
  a: z.number().describe('左オペランド'),
  b: z.number().describe('右オペランド'),
  ope: z.enum(['add', 'sub', 'mul', 'div', 'mod']).describe('オペレータ')
})`,
  execute: async (args: string) => {
    try {
      const validatedData = calcSchema.parse(JSON.parse(args))
      const result = (() => {
        switch (validatedData.ope) {
          case 'add':
            return validatedData.a + validatedData.b
          case 'sub':
            return validatedData.a - validatedData.b
          case 'mul':
            return validatedData.a * validatedData.b
          case 'div':
            if (validatedData.b === 0) {
              return '計算エラー: 0での除算はできません'
            }
            return validatedData.a / validatedData.b
          case 'mod':
            return validatedData.a % validatedData.b
        }
      })()
      return result.toString()
    } catch (error) {
      if (error instanceof z.ZodError) {
        return `計算エラー: ${error.errors.map(e => e.message).join(', ')}`
      }
      return `計算エラー: ${error}`
    }
  }
}
