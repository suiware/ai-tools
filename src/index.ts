import { anthropic } from '@ai-sdk/anthropic'
import { CoreMessage, streamText } from 'ai'
import { configDotenv } from 'dotenv'
import * as readline from 'node:readline/promises'
import { suiTransferTool } from './ai/tools/suiTransferTool'
import { suiWalletBalanceTool } from './ai/tools/suiWalletBalanceTool'

configDotenv()

const terminal = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

const messages: CoreMessage[] = []

async function main() {
  while (true) {
    const userInput = await terminal.question('You: ')

    messages.push({ role: 'user', content: userInput })

    const result = streamText({
      model: anthropic('claude-3-5-sonnet-latest'),
      messages,
      tools: {
        balance: suiWalletBalanceTool,
        transfer: suiTransferTool,
      },
      maxSteps: 5,
      system: `You are a helpful financial assistant who manages user's Sui account. 
      Answer very briefly and concisely, straight to the point. 
      Every sentence on a separate lint.`,
    })

    let fullResponse = ''
    process.stdout.write('\nAssistant: ')
    for await (const delta of result.textStream) {
      fullResponse += delta
      process.stdout.write(delta)
    }
    process.stdout.write('\n\n')

    messages.push({ role: 'assistant', content: fullResponse })
  }
}

main().catch(console.error)
