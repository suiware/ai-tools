# Examples for @suiware/ai-tools

## Available examples

|Example| Model | Description |
|---|---|---|
|[Simple balance tool](./src/anthropic-simple-balance.ts)| Anthropic: claude-3-5-sonnet-latest | Gets Sui wallet balance, no interactivity |
|[Interactive agent (text streaming)](./src/anthropic-streaming.ts)| Anthropic: claude-3-5-sonnet-latest | Portfolio management agent with [all tools](../tools/README.md#available-tools) enabled |
|[Interactive agent (text streaming)](./src/openai-streaming.ts) | OpenAI: gpt-3.5-turbo | Portfolio management agent with [all tools](../tools/README.md#available-tools) enabled |
|[Interactive agent (text generating)](./src/openai-generating.ts)| OpenAI: gpt-3.5-turbo | Portfolio management agent with [all tools](../tools/README.md#available-tools) enabled |

## Usage

### 1. Install dependencies

```bash
pnpm install
```

### 2. Configure environment variables

```bash
cp .env.example .env
```

Then update the environment variables in the `.env` file.

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
