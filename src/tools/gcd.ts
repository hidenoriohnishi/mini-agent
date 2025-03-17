import { z } from 'zod'
import type { Tool } from './tool'
import { gcd as calculateGcd } from '../lib/math'

export const gcdSchema = z.object({
  a: z.number().int().positive().describe('1つ目の正の整数'),
  b: z.number().int().positive().describe('2つ目の正の整数')
})

export const gcdTool: Tool = {
  name: 'gcd',
  description: '2つの正の整数の最大公約数を計算します。',
  parameter: `
z.object({
  a: z.number().int().positive().describe('1つ目の正の整数'),
  b: z.number().int().positive().describe('2つ目の正の整数')
})`,
  execute: async (args: string) => {
    try {
      const validatedData = gcdSchema.parse(JSON.parse(args))
      const result = calculateGcd(validatedData.a, validatedData.b)
      return result.toString()
    } catch (error) {
      if (error instanceof z.ZodError) {
        return `計算エラー: ${error.errors.map(e => e.message).join(', ')}`
      }
      return `計算エラー: ${error}`
    }
  }
}
