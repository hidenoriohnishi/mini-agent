import { z } from 'zod'
import type { Tool } from './tool'
import { lcm as calculateLcm } from '../lib/math'

export const lcmSchema = z.object({
  a: z.number().int().positive().describe('1つ目の正の整数'),
  b: z.number().int().positive().describe('2つ目の正の整数')
})

export const lcmTool: Tool = {
  name: 'lcm',
  description: '2つの正の整数の最小公倍数を計算します。',
  parameter: `
z.object({
  a: z.number().int().positive().describe('1つ目の正の整数'),
  b: z.number().int().positive().describe('2つ目の正の整数')
})`,
  execute: async (args: string) => {
    try {
      const validatedData = lcmSchema.parse(JSON.parse(args))
      const result = calculateLcm(validatedData.a, validatedData.b)
      return result.toString()
    } catch (error) {
      if (error instanceof z.ZodError) {
        return `計算エラー: ${error.errors.map(e => e.message).join(', ')}`
      }
      return `計算エラー: ${error}`
    }
  }
}
