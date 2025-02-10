import { anthropic } from '@ai-sdk/anthropic'
import { suiWalletBalanceTool } from '@suiware/ai-tools'
import { generateText } from 'ai'
import { configDotenv } from 'dotenv'

configDotenv()

async function main() {
  const { text } = await generateText({
    model: anthropic('claude-3-5-sonnet-latest'),
    prompt: 'get my sui wallet balance',
    tools: {
      balance: suiWalletBalanceTool,
    },
    maxSteps: 5,
  })

  console.log(text)
}

main().catch(console.error)
