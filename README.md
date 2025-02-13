# Sui tools for Vercel AI SDK (monorepo)

Pluggable tools for [Vercel AI SDK](https://sdk.vercel.ai/) which allow AI assistants to interact with Sui Network and perform various actions.

## Packages

- [@suiware/ai-tools](packages/tools/README.md) - a collection of pluggable [tools](https://sdk.vercel.ai/docs/foundations/tools) for [Vercel AI SDK](https://sdk.vercel.ai/), which allow AI assistants to interact with Sui Network and perform various actions.

- [Examples](packages/examples/README.md) - examples of AI assistants, demonstrating `@suiware/ai-tools` in action.

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

### suiSwapTool (mainnet only)

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

Check the [source code](./packages/tools/src/ai/tools) of the tools.

## Available examples

|Example|Model|Description|
|---|---|---|
|[Simple balance tool](./packages/examples/src/anthropic-simple-balance.ts)| Anthropic: claude-3-5-sonnet-latest | Gets Sui wallet balance, no interactivity |
|[Interactive agent (text streaming)](./packages/examples/src/anthropic-streaming.ts)| Anthropic: claude-3-5-sonnet-latest | Portfolio management agent with [all tools](#available-tools) enabled |
|[Interactive agent (text streaming)](./packages/examples/src/openai-streaming.ts) | OpenAI: gpt-3.5-turbo | Portfolio management agent with [all tools](#available-tools) enabled |
|[Interactive agent (text generating)](./packages/examples/src/openai-generating.ts)| OpenAI: gpt-3.5-turbo | Portfolio management agent with [all tools](#available-tools) enabled |


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
pnpm start:anthropic:simple:balance
# or
pnpm start || pnpm start:anthropic:streaming
# or 
pnpm start:openai:streaming
# or
pnpm start:openai:generating
```

## Future vision

- Improve suiTransferTool: SuiNS support, support for other tokens
- Add more tools: staking, lending, pools, etc.
- Add more services: Suilend, Bluefin, Cetus, DefiLlama, etc.
- Add more model providers: Atoma, local models
- Implement Command scheduling
- Add Web UI examples
- Create automated tests

## How to contribute

Learn the simple [packages/tools](./packages/tools/) package and contribute your own tool by sending a PR to this repository. 
It can be an integration with pools, lending protocols, or any other services that can be beneficial for building AI assistants for Sui.
