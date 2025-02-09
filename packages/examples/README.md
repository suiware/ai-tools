# Examples for @suiware/ai-tools

Find source code of the examples in the [src](./src/) directory.

## How to work with examples

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
