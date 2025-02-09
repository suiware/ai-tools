# @suiware/ai-tools Monorepo

## Packages

- [@suiware/ai-tools](packages/tools/README.md) - a collection of pluggable [Tools](https://sdk.vercel.ai/docs/foundations/tools) for [Vercel AI SDK](https://sdk.vercel.ai/), which allow AI assistants to interact with Sui Network and perform various actions.

- [Examples](packages/examples/README.md) - example of AI assistants, demonstrating `@suiware/ai-tools` in action.


## Demos

To work with demos/examples, follow the instructions below.

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

Check the [source code](./packages/tools/src/ai/tools) of the tools.

## How to contribute

Learn the simple [packages/tools](./packages/tools/) package and contribute your own tool by sending a PR to this repository. 
It can be an integration with pools, lending protocols, or any other services that can be beneficial for building AI assistants for Sui.
