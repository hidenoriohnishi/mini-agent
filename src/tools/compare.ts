import { z } from 'zod'
import type { Tool } from './tool'

export const compareSchema = z.object({
  a: z.number().describe('左オペランド'),
  b: z.number().describe('右オペランド'),
  ope: z.enum(['eq', 'neq', 'gt', 'gte', 'lt', 'lte']).describe('比較オペレータ')
})

export const compareTool: Tool = {
  name: 'compare',
  description: '比較演算の結果を返します',
  parameter: `
z.object({
  a: z.number().describe('左オペランド'),
  b: z.number().describe('右オペランド'),
  ope: z.enum(['eq', 'neq', 'gt', 'gte', 'lt', 'lte']).describe('比較オペレータ')
})`,
  execute: async (args: string) => {
    try {
      const validatedData = compareSchema.parse(JSON.parse(args))
      const result = (() => {
        switch (validatedData.ope) {
          case 'eq':
            return validatedData.a === validatedData.b
          case 'neq':
            return validatedData.a !== validatedData.b
          case 'gt':
            return validatedData.a > validatedData.b
          case 'gte':
            return validatedData.a >= validatedData.b
          case 'lt':
            return validatedData.a < validatedData.b
          case 'lte':
            return validatedData.a <= validatedData.b
        }
      })()
      return result.toString()
    } catch (error) {
      if (error instanceof z.ZodError) {
        return `比較エラー: ${error.errors.map(e => e.message).join(', ')}`
      }
      return `比較エラー: ${error}`
    }
  }
}
