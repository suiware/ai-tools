# @suiware/mcp

An stdio MCP server with [@suiware/ai-tools](https://www.npmjs.com/package/@suiware/ai-tools) built-in and API to use in your apps.

## SERVER

### Configuration

!!!! TBD

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
import { createSuiwareMcpServer, startSuiwareMcpServer } from '@suiware/mcp'

const server = createSuiwareMcpServer()

async function main() {
  await startSuiwareMcpServer(server)
}

main().catch(console.error)
```
