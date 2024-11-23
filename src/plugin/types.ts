import { z } from 'zod';

export const PluginSchema = z.object({
  enforce: z.enum(['pre', 'post']).optional(),
  name: z.string().optional(),
  buildStart: z
    .function(
      z.tuple([z.object({ command: z.string() })]),
      z.union([z.any(), z.promise(z.any())]),
    )
    .optional(),
  buildEnd: z
    .function(
      z.tuple([z.object({ command: z.string(), err: z.any().optional() })]),
      z.union([z.any(), z.promise(z.any())]),
    )
    .optional(),
  config: z
    .function(
      // TODO: fix z.any()
      z.tuple([z.any(), z.object({ command: z.string() })]),
      z.union([z.any(), z.promise(z.any()), z.null()]),
    )
    .optional(),
  configureServer: z
    .function(
      z.tuple([z.object({ middlewares: z.any() })]),
      z.union([z.any(), z.promise(z.any()), z.null()]),
    )
    .optional(),
});

export type Plugin = z.infer<typeof PluginSchema>;
