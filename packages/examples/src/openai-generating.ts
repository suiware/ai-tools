import { openai } from '@ai-sdk/openai'
import { getSuiwareAiTools } from '@suiware/ai-tools'
import {
  CoreMessage,
  generateText,
  InvalidToolArgumentsError,
  NoSuchToolError,
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
  terminal.write(
    chalk.cyan(`\nThe agent is connected and awaiting your instructions...\n\n`)
  )

  while (true) {
    const userInput = await terminal.question(chalk.green('You: '))

    messages.push({ role: 'user', content: userInput })

    try {
      const { text } = await generateText({
        model: openai('gpt-3.5-turbo'),
        messages,
        tools: getSuiwareAiTools(),
        maxSteps: 5,
        system: `You are ${AGENT_NAME}, a financial assistant who manages user's portfolio on Sui blockchain network. 
      Answer very briefly and concisely. Every sentence of the answer should be on a separate line. 
      If user asks for balances, don't use the data from your memory and instead always request the balance tool.
      If you don't know, don't make it up.`,
      })

      terminal.write(`\n${chalk.cyan(`${AGENT_NAME}: `)}`)
      terminal.write(text)
      terminal.write('\n\n')

      messages.push({ role: 'assistant', content: text })
    } catch (error) {
      if (NoSuchToolError.isInstance(error)) {
        terminal.write(chalk.red(`\nNo such tool: ${error.toolName}\n`))
      } else if (InvalidToolArgumentsError.isInstance(error)) {
        terminal.write(
          chalk.red(
            `\nInvalid arguments: ${error.toolName}: ${error.message}\n`
          )
        )
      } else if (ToolExecutionError.isInstance(error)) {
        terminal.write(
          chalk.red(
            `\nTool execution error: ${error.toolName}: ${error.message}\n`
          )
        )
      } else {
        terminal.write(
          chalk.red(`\nUnknown error: ${(error as Error)?.message}\n`)
        )
      }
    }
  }
}

main().catch((error) => {
  console.error(chalk.red('🚨 Fatal error:'), error)
})
