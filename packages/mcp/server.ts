import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  suiAddressTool,
  suiSwapTool,
  suiTransferTool,
  suiWalletBalanceTool,
} from "@suiware/ai-tools";

const server = new McpServer({
  name: "Sui AI Tools by Suiware",
  version: "1.0.0",
});

const tools = {
  "get-address": suiAddressTool,
  "get-wallet-balance": suiWalletBalanceTool,
  "swap-coin": suiSwapTool,
  "transfer-coin": suiTransferTool,
};

// Convert each Vercel AI tool to an MCP tool.
for (const [name, tool] of Object.entries(tools)) {
  server.tool(
    name,
    tool.description!,
    async (params: typeof tool.parameters) => {
      try {
        // @todo: Improve types.
        const result = await tool.execute(params as any, {} as any);

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
                error instanceof Error
                  ? error.message
                  : "Unknown error occurred",
            },
          ],
        };
      }
    }
  );
}

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main();
