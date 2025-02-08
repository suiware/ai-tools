import { anthropic } from '@ai-sdk/anthropic'
import {
  CoreMessage,
  InvalidToolArgumentsError,
  NoSuchToolError,
  streamText,
  ToolExecutionError,
} from 'ai'
import { configDotenv } from 'dotenv'
import * as readline from 'node:readline/promises'
import { suiTransferTool } from './ai/tools/suiTransferTool'
import { suiWalletBalanceTool } from './ai/tools/suiWalletBalanceTool'
import { vixTool } from './ai/tools/vixTool'

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
        vix: vixTool,
      },
      maxSteps: 5,
      system: `You are a helpful financial assistant who manages user's Sui account. 
      Answer very briefly and concisely, straight to the point. 
      Every sentence on a separate line. 
      If you don't know, don't emulate.`,
      onError: ({ error }) => {
        if (NoSuchToolError.isInstance(error)) {
          process.stdout.write(`\nNo such tool: ${error.toolName}\n`)
        } else if (InvalidToolArgumentsError.isInstance(error)) {
          process.stdout.write(`\nInvalid arguments: ${error.toolName}\n`)
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
