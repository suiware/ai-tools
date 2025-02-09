# @suiware/ai-tools Monorepo

This is a monorepo for the `@suiware/ai-tools` project, which includes:
- [@suiware/ai-tools](packages/tools/README.md) - a collection of [Tools](https://sdk.vercel.ai/docs/foundations/tools) for [Vercel AI SDK](https://sdk.vercel.ai/), which is intended for Sui use cases.
- [Examples](packages/examples/README.md) - example of AI assistants, demonstrating `@suiware/ai-tools` in action.

---

TBC: move tools and examples docs to specific repos

---

## Tools

### suiSwapTool

Swaps SUI for USDC or vice versa.  
Uses [Navi SDK](https://github.com/naviprotocol/navi-sdk) for swapping.

Examples:
- `swap 1 sui for usdc`
- `convert 10 usdc for sui`

### suiTransferTool

Transfers the specified amount of SUI to the specified address.

Examples:
- `transfer 1 sui to 0x1234567890abcdef`
- `send 10 sui to 0x1234567890abcdef`

### suiWalletBalanceTool

Gets the balance of the wallet.

Examples:
- `get my sui wallet balance`
- `my sui balance`

### vixTool

Gets the current CBOE Volatility Index (VIX) index value.

Examples:
- `get current cboe vix`
- `get vix`

## How to run examples

### 1. Install dependencies

```bash
pnpm install
```

### 2. Configure examples

```bash
cp packages/examples/.env.example packages/examples/.env
```

Then update the environment variables in the `packages/examples/.env` file.

### 3. Run examples

#### Anthropic example

```bash
pnpm start || pnpm start:anthropic
```

#### OpenAI example

```bash
pnpm start:openai
```
