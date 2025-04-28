import { ToolCallback } from '@modelcontextprotocol/sdk/server/mcp.js'
import { ZodRawShape } from 'zod'

export type McpTool = {
  description: string
  paramsSchema: ZodRawShape
  cb: ToolCallback<ZodRawShape>
}
