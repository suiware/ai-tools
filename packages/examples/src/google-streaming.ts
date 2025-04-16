import { google } from '@ai-sdk/google'
import {
  suiAddressTool,
  suiSwapTool,
  suiTransferTool,
  suiWalletBalanceTool,
} from '@suiware/ai-tools'
import {
  CoreMessage,
  InvalidToolArgumentsError,
  NoSuchToolError,
  streamText,
  ToolExecutionError,
} from 'ai'
import chalk from 'chalk'
import { configDotenv } from 'dotenv'
import * as readline from 'node:readline/promises'

configDotenv()

const terminal = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

const messages: CoreMessage[] = []

const AGENT_NAME = 'Charlie'

async function main() {
  process.stdout.write(
    chalk.cyan(`\nThe agent is connected and awaiting your instructions...\n\n`)
  )

  while (true) {
    const userInput = await terminal.question(chalk.green('You: '))

    messages.push({ role: 'user', content: userInput })

    const result = streamText({
      model: google('gemini-2.0-flash-001'),
      messages,
      tools: {
        address: suiAddressTool,
        balance: suiWalletBalanceTool,
        transfer: suiTransferTool,
        swap: suiSwapTool,
      },
      maxSteps: 5,
      system: `You are ${AGENT_NAME}, a financial assistant who manages user's portfolio on Sui blockchain network. 
      Answer very briefly and concisely. Every sentence of the answer should be on a separate line. 
      If you don't know, don't make it up.`,
      onError: ({ error }) => {
        if (NoSuchToolError.isInstance(error)) {
          process.stdout.write(chalk.red(`\nNo such tool: ${error.toolName}\n`))
        } else if (InvalidToolArgumentsError.isInstance(error)) {
          process.stdout.write(
            chalk.red(
              `\nInvalid arguments: ${error.toolName}: ${error.message}\n`
            )
          )
        } else if (ToolExecutionError.isInstance(error)) {
          process.stdout.write(
            chalk.red(
              `\nTool execution error: ${error.toolName}: ${error.message}\n`
            )
          )
        } else {
          process.stdout.write(
            chalk.red(`\nUnknown error: ${(error as Error)?.message}\n`)
          )
        }
      },
    })

    let fullResponse = ''
    process.stdout.write(`\n${chalk.cyan(`${AGENT_NAME}: `)}`)
    for await (const delta of result?.textStream ?? []) {
      fullResponse += delta
      process.stdout.write(delta)
    }
    process.stdout.write('\n\n')

    messages.push({ role: 'assistant', content: fullResponse })
  }
}

main().catch((error) => {
  console.error(chalk.red('🚨 Fatal error:'), error)
})
