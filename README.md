# Suiware AI Tools and MCP Server (monorepo)

Pluggable tools for [Vercel AI SDK](https://sdk.vercel.ai/) which allow AI assistants to interact with Sui Network and perform various actions, and an MCP server to use within your AI app, like Claude Desktop.

## Packages

- [@suiware/ai-tools](packages/tools/README.md) - a collection of pluggable [tools](https://sdk.vercel.ai/docs/foundations/tools) for [Vercel AI SDK](https://sdk.vercel.ai/), which allow AI assistants to interact with Sui Network and perform various actions.

- [Examples](packages/examples/README.md) - examples of AI assistants, demonstrating `@suiware/ai-tools` in action.

- [@suiware/mcp](packages/mcp/README.md) - An stdio MCP server with built-in [@suiware/ai-tools](packages/tools/README.md) and API to use in your apps.


## Available tools

- suiAddressTool
- suiWalletBalanceTool
- suiTransferTool
- suiSwapTool (mainnet only)
- suiStakeTool
- suiUnstakeTool

To get all available tools, use `getSuiwareAiTools()`.

Check out the [@suiware/ai-tools](packages/tools/README.md) package docs for more details.

## Available examples

|Example|Model|Description|
|---|---|---|
|[Simple balance tool](/packages/examples/src/anthropic-simple-balance.ts)| Anthropic: claude-3-5-sonnet-latest | Gets Sui wallet balance, no interactivity |
|[Interactive agent (text streaming)](/packages/examples/src/anthropic-streaming.ts)| Anthropic: claude-3-5-sonnet-latest | Portfolio management agent with [all tools](#available-tools) enabled |
|[Interactive agent (text streaming)](/packages/examples/src/openai-streaming.ts) | OpenAI: gpt-3.5-turbo | Portfolio management agent with [all tools](#available-tools) enabled |
|[Interactive agent (text generating)](/packages/examples/src/openai-generating.ts)| OpenAI: gpt-3.5-turbo | Portfolio management agent with [all tools](#available-tools) enabled |
|[Interactive agent (text generating)](/packages/examples/src/google-streaming.ts)| Google: gemini-2.0-flash-001 | Portfolio management agent with [all tools](#available-tools) enabled |

Check out the [examples](packages/examples/README.md) package docs for more details.

## MCP server

Please refer to the MCP package docs [@suiware/mcp](packages/mcp/README.md) to see how to use the server.

## How to contribute

Learn the simple [@suiware/ai-tools](/packages/tools/) package and contribute your own tool by sending a PR to this repository. 
It can be an integration with pools, lending protocols, or any other services that can be beneficial for building AI assistants for Sui.
