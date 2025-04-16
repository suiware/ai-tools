# @suiware/ai-tools

Pluggable tools for [Vercel AI SDK](https://sdk.vercel.ai/) which allow AI assistants to interact with Sui Network and perform various actions.

## Installation

```bash
pnpm add @suiware/ai-tools
```

## Configuration

To use the tools, you need to add a [few environment variables](/packages/examples/.env.example) to your `.env` file,
such as `SUI_PRIVATE_KEY` and `SUI_NETWORK` as well as `ANTHROPIC_API_KEY` and `OPENAI_API_KEY` for Anthropic and OpenAI respectively.

## Usage

```ts
// Source: https://github.com/suiware/ai-tools/blob/main/packages/examples/src/anthropic-simple-balance.ts
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
      // Plug a tool this way:
      balance: suiWalletBalanceTool,
    },
    maxSteps: 5,
  })

  console.log(text)
}

main().catch(console.error)
```

See more **[usage examples](/packages/examples/README.md)**.

## Available tools

### suiAddressTool

Gets user address.

Examples:
- `get my address`

### suiWalletBalanceTool

Gets non-zero wallet balances.

Examples:
- `get my wallet balances`
- `my balances`

### suiTransferTool

Transfer the amount of the specified coin to the specified address.

Examples:
- `transfer 1 sui to 0x1234567890abcdef`
- `send 10 wal to 0x1234567890abcdef`
- `donate 1 sui to @abcdef1234567890`
- `throw 1 sui to abcdef1234567890.sui`

Supported coins are listed [here](/packages/tools/src/core/config/coins.ts)

### suiSwapTool (mainnet only)

Performs coin swap. Supported coins are listed [here](/packages/tools/src/core/config/coins.ts)

Examples:
- `swap 1 sui for usdc`
- `convert 10 usdc to sui`
- `swap 1 sui for weth`

Check the [source code](/packages/tools/src/ai/tools) of the tools.

## Links

- [Vercel AI SDK](https://sdk.vercel.ai/)
- [Vercel AI SDK Tools: Docs](https://sdk.vercel.ai/docs/foundations/tools)
