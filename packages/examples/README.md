# Examples for @suiware/ai-tools

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
pnpm start:anthropic:streaming
```

#### OpenAI streaming example

```bash
pnpm start:openai:streaming
```

#### OpenAI generating example

```bash
pnpm start:openai:generating
```

