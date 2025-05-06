# @suiware/mcp

An stdio MCP server with built-in [@suiware/ai-tools](https://www.npmjs.com/package/@suiware/ai-tools) and API to use in your apps.

## SERVER

### Prerequisites

- [Node (>= 20)](https://nodejs.org/en/download/)
- [pnpm (>= 10)](https://pnpm.io/installation)

### Configuration

Create an `.env` file in your project folder with the following variables in it:

```environment
SUI_PRIVATE_KEY= # "suiprivkey...."
SUI_NETWORK= # "testnet" or "mainnet"
```

### Usage

#### 1. Run the server

When you run the server, supply the `--env-file="file/path/.env"` param with the `.env` file path.

```bash
pnpx @suiware/mcp --env-file="file/path/.env"
```

_You may omit the optional `--env-file` param if you're providing the config variables in any other way available to you._

#### 2. Connect to the Suiware MCP server 

Use Claude Desktop or any other tool which supports plugging in third-party MCP servers to connect to the Suiware MCP server.

Check out an [example config file](./claude_desktop_config.json) for Claude Desktop.

### Test

```bash
pnpx @modelcontextprotocol/inspector pnpx @suiware/mcp --env-file="file/path/.env"
```

## API

Currently the API is super-simple - it's just one function `startSuiwareMcpServer()` which lets you start the MCP server from your code. 

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
