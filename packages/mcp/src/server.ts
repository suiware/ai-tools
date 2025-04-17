import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  suiAddressTool,
  suiSwapTool,
  suiTransferTool,
  suiWalletBalanceTool,
} from "@suiware/ai-tools";
import type { Tool } from "ai";
import { mapZodSchemaToMCPSchema } from "./utils/helpers";

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
  const mcpSchema = mapZodSchemaToMCPSchema(tool.parameters);

  server.tool(name, tool.description!, mcpSchema, async (params) => {
    try {
      // @todo: Improve parameter types.
      let result;
      if (tool.execute instanceof Function) {
        result = await tool.execute(params as any, {} as any);
      }

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(result, null, 2),
          },
        ],
      };
    } catch (error) {
      console.error("error", error);
      return {
        isError: true,
        content: [
          {
            type: "text",
            text:
              error instanceof Error ? error.message : "Unknown error occurred",
          },
        ],
      };
    }
  });
}

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main();
