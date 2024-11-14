import { z } from 'zod';
import { PluginSchema } from '../plugin/types';

export const ConfigSchema = z.object({
  externals: z.record(z.string()).optional(),
  devServer: z
    .object({
      port: z.number().optional(),
      https: z
        .object({
          hosts: z.array(z.string()).optional(),
        })
        .optional(),
      ip: z.string().optional(),
      host: z.string().optional(),
    })
    .optional(),
  less: z
    .object({
      modifyVars: z.any().optional(),
      globalVars: z.any().optional(),
      math: z.any().optional(),
      sourceMap: z.any(),
      plugins: z.array(z.any()).optional(),
    })
    .optional(),
  plugins: z.array(PluginSchema).optional(),
  router: z
    .object({
      defaultPreload: z.enum(['intent', 'render', 'viewport']).optional(),
      defaultPreloadDelay: z.number().optional(),
      devtool: z
        .union([
          z.object({
            options: z.object({
              initialIsOpen: z.boolean().optional(),
              position: z
                .enum(['bottom-left', 'bottom-right', 'top-left', 'top-right'])
                .optional(),
            }),
          }),
          z.literal(false),
        ])
        .optional(),
    })
    .optional(),
  tailwindcss: z.boolean().optional(),
});

export type Config = z.infer<typeof ConfigSchema>;
