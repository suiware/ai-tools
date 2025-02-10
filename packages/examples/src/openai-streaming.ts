import { openai } from '@ai-sdk/openai'
import {
  suiSwapTool,
  suiTransferTool,
  suiWalletBalanceTool,
  vixTool,
} from '@suiware/ai-tools'
import {
  CoreMessage,
  InvalidToolArgumentsError,
  NoSuchToolError,
  streamText,
  ToolExecutionError,
} from 'ai'
import { configDotenv } from 'dotenv'
import * as readline from 'node:readline/promises'

configDotenv()

const terminal = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

const messages: CoreMessage[] = []

async function main() {
  process.stdout.write(
    `The agent is connected and awaiting your instructions...\n\n`
  )

  while (true) {
    const userInput = await terminal.question('You: ')

    messages.push({ role: 'user', content: userInput })

    const result = streamText({
      model: openai('gpt-3.5-turbo'),
      messages,
      tools: {
        balance: suiWalletBalanceTool,
        transfer: suiTransferTool,
        vix: vixTool,
        swap: suiSwapTool,
      },
      maxSteps: 5,
      system: `You are Charlie, a financial assistant who manages user's portfolio on Sui blockchain network. 
      Answer very briefly and concisely. Every sentence of the answer should be on a separate line. 
      If you don't know, don't make it up.`,
      onError: ({ error }) => {
        if (NoSuchToolError.isInstance(error)) {
          process.stdout.write(`\nNo such tool: ${error.toolName}\n`)
        } else if (InvalidToolArgumentsError.isInstance(error)) {
          process.stdout.write(
            `\nInvalid arguments: ${error.toolName}: ${error.message}\n`
          )
        } else if (ToolExecutionError.isInstance(error)) {
          process.stdout.write(
            `\nTool execution error: ${error.toolName}: ${error.message}\n`
          )
        } else {
          process.stdout.write(
            `\nUnknown error: ${(error as Error)?.message}\n`
          )
        }
      },
    })

    let fullResponse = ''
    process.stdout.write('\nAssistant: ')
    for await (const delta of result?.textStream ?? []) {
      fullResponse += delta
      process.stdout.write(delta)
    }
    process.stdout.write('\n\n')

    messages.push({ role: 'assistant', content: fullResponse })
  }
}

main().catch(console.error)
