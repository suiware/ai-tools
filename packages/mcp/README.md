# @suiware/mcp

An stdio MCP server with built-in [@suiware/ai-tools](https://www.npmjs.com/package/@suiware/ai-tools) and API to use in your apps.

## Available Tools

- `get-address` (e.g. "show my address")
- `get-wallet-balance` (e.g. "my balances")
- `swap-coin` (e.g. "swap 1 sui to wal")
- `transfer-coin` (e.g. "send 1 sui to @suiware")
- `stake-sui` (e.g. "stake 1 sui")
- `unstake-sui` (e.g. "unstake sui")

## MCP SERVER

### Prerequisites

- [Node (>= 20)](https://nodejs.org/en/download/)

### Configuration

Create an `.env` file in your project folder with the following variables in it:

```environment
SUI_PRIVATE_KEY= # "suiprivkey...."
SUI_NETWORK= # "testnet" or "mainnet"
```

### Usage

#### Option 1. Run the Suiware MCP server directly

When you run the server, supply the `--env-config-file="file/path/.env"` param with the `.env` file path.

```bash
pnpx @suiware/mcp --env-config-file="file/path/.env"
```

_You may omit the optional `--env-config-file` param if you're providing the config variables in any other way available to you._

#### Option 2. Connect to the Suiware MCP server through your AI app

Use Claude Code or any other app which supports plugging in third-party MCP servers to connect to the Suiware MCP server.

Check out [claude_config.example.json](./claude_config.example.json) for Claude apps.
And make sure your `--env-config-file` value in it to the location of your `.env` file which contains `SUI_PRIVATE_KEY` and `SUI_NETWORK` variables.

With Claude Code:

```bash
claude -p "get my balances and address" --mcp-config packages/mcp/claude_config.example.json --allowedTools "mcp__suiware-mcp__get-wallet-balance,mcp__suiware-mcp__get-address"
```

List the tools you want to use through the `--allowedTools` param (comma-separated).

With Claude Desktop:

I haven't manage to connect the MCP to Claude Desktop on Linux because it doesn't support this OS but you can follow
the [official MCP usage guide for Claude Desktop](https://modelcontextprotocol.io/quickstart/user#mac-os-linux) to make it work for you.

### Test

```bash
pnpx @modelcontextprotocol/inspector pnpx @suiware/mcp --env-config-file="file/path/.env"
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
  // Assuming you have .env file with Sui account access details in the same folder.
  await startSuiwareMcpServer({ name: 'Suiware MCP Server', version: '0.1.0' })
}

main().catch(console.error)
```

## Changelog

Find the [detailed changelog](./CHANGELOG.md) in the package root.
