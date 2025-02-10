# @suiware/ai-tools

Pluggable [Tools](https://sdk.vercel.ai/docs/foundations/tools) for [Vercel AI SDK](https://sdk.vercel.ai/) which allow AI assistants to interact with Sui Network and perform various actions.

## Installation

```bash
pnpm add @suiware/ai-tools
```

# Configuration

To use the tools, you need to a [few environment variables](https://github.com/suiware/ai-tools/blob/main/packages/examples/.env.example) to your `.env` file,
such as `SUI_PRIVATE_KEY` and `SUI_NETWORK` as well as `ANTHROPIC_API_KEY` and `OPENAI_API_KEY` for Anthropic and OpenAI respectively.

## Usage

Make sure you have the corresponding model adapter and `dotenv` installed:

```bash
pnpm add @ai-sdk/anthropic dotenv
```

```ts
// src/index.ts
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
```

See **[examples](https://github.com/suiware/ai-tools/blob/main/packages/examples/README.md)** for more usage examples.

## Available tools

### suiWalletBalanceTool

Gets Sui wallet balance.

Examples:
- `get my sui wallet balance`
- `my sui balance`

### suiTransferTool

Transfers the specified amount of SUI to the specified address.

Examples:
- `transfer 1 sui to 0x1234567890abcdef`
- `send 10 sui to 0x1234567890abcdef`

### suiSwapTool

Swaps SUI for USDC or vice versa.  
Uses [Navi SDK](https://github.com/naviprotocol/navi-sdk) for swapping.

Examples:
- `swap 1 sui for usdc`
- `convert 10 usdc to sui`

### vixTool

Gets the current CBOE Volatility Index (VIX) index value.

Examples:
- `get current cboe vix`
- `get vix`

Check the [source code](https://github.com/suiware/ai-tools/tree/main/packages/tools/src/ai/tools) of the tools.
