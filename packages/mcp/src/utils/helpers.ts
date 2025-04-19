import { Tool } from "ai";
import { ZodOptional, ZodRawShape, ZodTypeAny } from "zod";
import { McpTool } from "../types/McpTool";

const mapZodSchemaToMCPSchema = (schema: ZodRawShape): ZodRawShape => {
  const shape = schema.shape;

  const mcpSchema: Record<string, ZodTypeAny> = {};

  for (const [key, value] of Object.entries(shape)) {
    mcpSchema[key] =
      schema instanceof ZodOptional ? (value as any).unwrap() : value;
  }

  return mcpSchema;
};

export const mapVercelToolToMcpTool = (tool: Tool): McpTool => {
  return {
    description: tool.description!,
    paramsSchema: mapZodSchemaToMCPSchema(tool.parameters),
    cb: async (params) => {
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
                error instanceof Error
                  ? error.message
                  : "Unknown error occurred",
            },
          ],
        };
      }
    },
  };
};
