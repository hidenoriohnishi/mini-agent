import inquirer from 'inquirer'
import { openai } from '@ai-sdk/openai'
import { CreateMessage, generateText } from 'ai'
import pc from 'picocolors'

type Message = CreateMessage;

async function main () {
  console.log(pc.cyan('ChatGPT CLI へようこそ！'))
  console.log(pc.gray('終了するには "exit" と入力してください。\n'))

  const history: Message[] = []

  while (true) {
    const { input } = await inquirer.prompt([
      {
        type: 'input',
        name: 'input',
        message: pc.green('あなた:'),
        validate: (input: string) => {
          if (input.trim() === '') {
            return 'メッセージを入力してください。'
          }
          return true
        }
      }
    ])

    if (input === 'exit') {
      console.log(pc.yellow('\nさようなら！'))
      break
    }

    try {
      history.push({ role: 'user', content: input })
      console.log(pc.blue('\nChatGPT: '))

      const { text } = await generateText({
        model: openai('gpt-4'),
        system: 'あなたは親切で賢いAIアシスタントです。日本語で応答してください。',
        messages: history
      })

      console.log(text)
      console.log('\n')

      history.push({ role: 'assistant', content: text })
    } catch (error) {
      console.error(pc.red('\nエラーが発生しました:'), error)
      break
    }
  }
}

if (!process.env.OPENAI_API_KEY) {
  console.error(pc.red('エラー: OPENAI_API_KEY 環境変数が設定されていません。'))
  console.log(pc.yellow('以下のコマンドを実行してください:'))
  console.log(pc.gray('export OPENAI_API_KEY=your_api_key_here'))
  process.exit(1)
}

main().catch((error) => {
  console.error(pc.red('予期せぬエラーが発生しました:'), error)
  process.exit(1)
})
