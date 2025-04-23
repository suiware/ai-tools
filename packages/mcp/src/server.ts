import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { getSuiwareAiTools } from '@suiware/ai-tools'
import { mapVercelToolToMcpTool } from './utils/mappers'
import { getPackageMeta } from './utils/misc'

const packageMeta = getPackageMeta()

const server = new McpServer({
  name: packageMeta?.description || 'Sui AI Tools by Suiware',
  version: packageMeta?.version || '0.0.0',
})

for (const [name, tool] of Object.entries(getSuiwareAiTools())) {
  // Hope we will have a native Tool type soon https://github.com/modelcontextprotocol/typescript-sdk/issues/369
  const mcpTool = mapVercelToolToMcpTool(tool)
  server.tool(name, mcpTool.description, mcpTool.paramsSchema, mcpTool.cb)
}

async function main() {
  const transport = new StdioServerTransport()
  await server.connect(transport)
}

main()
