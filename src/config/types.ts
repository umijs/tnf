import { z } from 'zod';
import { PluginSchema } from '../plugin/types';

// why no use { configSchema } from '@tanstack/router-generator';
// configSchema has default
const RouterGeneratorConfig = z
  .object({
    routeFileIgnorePrefix: z.string().optional(),
    routeFileIgnorePattern: z.string().optional(),
    routesDirectory: z.string().optional(),
    generatedRouteTree: z.string().optional(),
    quoteStyle: z.enum(['single', 'double']).optional(),
    semicolons: z.boolean().optional(),
    disableTypes: z.boolean().optional(),
    addExtensions: z.boolean().optional(),
    disableLogging: z.boolean().optional(),
    disableManifestGeneration: z.boolean().optional(),
    apiBase: z.string().optional(),
    routeTreeFileHeader: z.array(z.string()).optional(),
    routeTreeFileFooter: z.array(z.string()).optional(),
    indexToken: z.string().optional(),
    routeToken: z.string().optional(),
    experimental: z
      .object({
        enableCodeSplitting: z.boolean().optional(),
      })
      .optional(),
  })
  .optional();

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
      convention: RouterGeneratorConfig,
    })
    .optional(),
  tailwindcss: z.boolean().optional(),
});

export type Config = z.infer<typeof ConfigSchema>;
