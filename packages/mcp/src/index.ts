import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { Implementation } from '@modelcontextprotocol/sdk/types.js'
import { getSuiwareAiTools } from '@suiware/ai-tools'
import { mapVercelToolToMcpTool } from './utils/mappers'

export interface SuiwareMcpServerOptions extends Implementation {}

export const startSuiwareMcpServer = async (
  options: SuiwareMcpServerOptions
): Promise<McpServer> => {
  const server = createSuiwareMcpServer(options)
  const transport = new StdioServerTransport()

  await server.connect(transport)

  return server
}

const createSuiwareMcpServer = (
  options: SuiwareMcpServerOptions
): McpServer => {
  const server = new McpServer(options)

  for (const [name, tool] of Object.entries(getSuiwareAiTools())) {
    // Hope we will have a native Tool type soon https://github.com/modelcontextprotocol/typescript-sdk/issues/369
    const mcpTool = mapVercelToolToMcpTool(tool)
    server.tool(name, mcpTool.description, mcpTool.paramsSchema, mcpTool.cb)
  }

  return server
}
