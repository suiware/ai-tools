import { z } from "zod";

export const mapZodSchemaToMCPSchema = (schema: z.ZodTypeAny) => {
  const shape = schema.shape;

  const mcpSchema: Record<string, z.ZodTypeAny> = {};
  
  for (const [key, value] of Object.entries(shape)) {
    mcpSchema[key] =
      schema instanceof z.ZodOptional ? (value as any).unwrap() : value;
  }

  return mcpSchema;
};
