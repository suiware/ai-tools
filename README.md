# Sui tools for Vercel AI SDK (monorepo)

Pluggable tools for [Vercel AI SDK](https://sdk.vercel.ai/) which allow AI assistants to interact with Sui Network and perform various actions.

## Packages

- [@suiware/ai-tools](packages/tools/README.md) - a collection of pluggable [tools](https://sdk.vercel.ai/docs/foundations/tools) for [Vercel AI SDK](https://sdk.vercel.ai/), which allow AI assistants to interact with Sui Network and perform various actions.

- [Examples](packages/examples/README.md) - examples of AI assistants, demonstrating `@suiware/ai-tools` in action.

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

## Available examples

|Example|Model|Description|
|---|---|---|
|[Simple balance tool](/packages/examples/src/anthropic-simple-balance.ts)| Anthropic: claude-3-5-sonnet-latest | Gets Sui wallet balance, no interactivity |
|[Interactive agent (text streaming)](/packages/examples/src/anthropic-streaming.ts)| Anthropic: claude-3-5-sonnet-latest | Portfolio management agent with [all tools](#available-tools) enabled |
|[Interactive agent (text streaming)](/packages/examples/src/openai-streaming.ts) | OpenAI: gpt-3.5-turbo | Portfolio management agent with [all tools](#available-tools) enabled |
|[Interactive agent (text generating)](/packages/examples/src/openai-generating.ts)| OpenAI: gpt-3.5-turbo | Portfolio management agent with [all tools](#available-tools) enabled |
|[Interactive agent (text generating)](/packages/examples/src/google-streaming.ts)| Google: gemini-2.0-flash-001 | Portfolio management agent with [all tools](#available-tools) enabled |

## How to use examples

### 1. Install dependencies

```bash
pnpm install
```

### 2. Configure environment variables

```bash
cp packages/examples/.env.example packages/examples/.env
```

Then update the environment variables in the `packages/examples/.env` file.

### 3. Run examples

```bash
pnpm start || pnpm start:google:streaming
# or
pnpm start:anthropic:simple:balance
# or
pnpm start:anthropic:streaming
# or 
pnpm start:openai:streaming
# or
pnpm start:openai:generating
```

## How to contribute

Learn the simple [packages/tools](/packages/tools/) package and contribute your own tool by sending a PR to this repository. 
It can be an integration with pools, lending protocols, or any other services that can be beneficial for building AI assistants for Sui.
