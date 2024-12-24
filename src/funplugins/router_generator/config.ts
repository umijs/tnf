import {
  type Config as baseConfig,
  configSchema as generatorConfigSchema,
  getConfig as getGeneratorConfig,
} from '@tanstack/router-generator';
import { z } from 'zod';

// 如果不这么做 TS会莫名其妙的报错
const configSchema: z.ZodType<
  baseConfig & { enableRouteGeneration?: boolean }
> = generatorConfigSchema.extend({
  enableRouteGeneration: z.boolean().optional(),
}) as z.ZodType<baseConfig & { enableRouteGeneration?: boolean }>;

export const getConfig = (
  inlineConfig: Partial<z.infer<typeof configSchema>>,
  root: string,
): z.infer<typeof configSchema> => {
  const config = getGeneratorConfig(inlineConfig, root);
  return configSchema.parse({ ...config, ...inlineConfig });
};

export type Config = z.infer<typeof configSchema>;
