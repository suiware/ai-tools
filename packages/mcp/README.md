# @suiware/mcp

An stdio MCP server with built-in [@suiware/ai-tools](https://www.npmjs.com/package/@suiware/ai-tools) and API to use in your apps.

## SERVER

### Configuration

Create an .env file in your project root with the following variables in it:

```env
SUI_PRIVATE_KEY= # "suiprivkey...."
SUI_NETWORK= # "testnet" or "mainnet"
```

When you run the server, supply the `--config="file/path/.env"` param with the `.env` file path.

### Usage

1. Run the server:

```bash
pnpx @suiware/mcp --config="file/path/.env"
```

_You may omit the `--config` param if you're supplying the config variables in any other way available to you._

2. Connect the MCP server to your Claude Desktop or any other program which supports plugging third-party MCP servers. 

### Test

```
pnpx @modelcontextprotocol/inspector pnpx @suiware/mcp --config="file/path/.env"
```

## API

### Installation

To create and start the server from your own codebase, add the `@suiware/mcp` package as a dependency.

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
