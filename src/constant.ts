import { openai } from '@ai-sdk/openai'
type OpenAIChatModelId = Parameters<typeof openai>[0]

export const MODEL: OpenAIChatModelId = 'gpt-4o'
