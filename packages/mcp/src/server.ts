import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  suiAddressTool,
  suiSwapTool,
  suiTransferTool,
  suiWalletBalanceTool,
} from "@suiware/ai-tools";
import type { Tool } from "ai";
import { mapVercelToolToMcpTool } from "./utils/helpers";

const server = new McpServer({
  name: "Sui AI Tools by Suiware",
  version: "1.0.0",
});

const tools: Record<string, Tool> = {
  "get-address": suiAddressTool,
  "get-wallet-balance": suiWalletBalanceTool,
  "swap-coin": suiSwapTool,
  "transfer-coin": suiTransferTool,
};

for (const [name, tool] of Object.entries(tools)) {
  // Hope we will have a native Tool type soon https://github.com/modelcontextprotocol/typescript-sdk/issues/369
  const mcpTool = mapVercelToolToMcpTool(tool);
  server.tool(name, mcpTool.description, mcpTool.paramsSchema, mcpTool.cb);
}

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main();
