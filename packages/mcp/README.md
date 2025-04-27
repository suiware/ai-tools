# @suiware/mcp

An stdio MCP server with built-in [@suiware/ai-tools](https://www.npmjs.com/package/@suiware/ai-tools) and API to use in your apps.

## SERVER

### Configuration

!!! TBU

```bash
cp .env.example .env
```

Then update the environment variables in the `.env` file.

### Usage

Run the server:

```bash
pnpx @suiware/mcp
```

And connect the MCP server to your Claude Desktop or any other program which supports plugging third-party MCP servers. 

### Test

```
pnpx @modelcontextprotocol/inspector pnpx @suiware/mcp
```

## API

### Installation

```bash
pnpm add @suiware/mcp
```

### Usage

```ts
import { startSuiwareMcpServer } from '@suiware/mcp'

async function main() {
  await startSuiwareMcpServer({ name: 'Suiware MCP Server', version: '0.1.0' })
}

main().catch(console.error)
```
