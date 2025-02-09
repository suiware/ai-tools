# @suiware/ai-tools Monorepo

## Packages

- [@suiware/ai-tools](packages/tools/README.md) - a collection of pluggable [Tools](https://sdk.vercel.ai/docs/foundations/tools) for [Vercel AI SDK](https://sdk.vercel.ai/), which allow AI assistants to interact with Sui Network and perform various actions.

- [Examples](packages/examples/README.md) - example of AI assistants, demonstrating `@suiware/ai-tools` in action.


## To Work with Examples

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

#### Anthropic example

```bash
pnpm start || pnpm start:anthropic:streaming
```

#### OpenAI streaming example

```bash
pnpm start:openai:streaming
```

#### OpenAI generating example

```bash
pnpm start:openai:generating
```


## Available Tools

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
