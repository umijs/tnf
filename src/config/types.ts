import { z } from 'zod';
import { PluginSchema } from '../plugin/types.js';

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

export const ConfigSchema = z
  .object({
    alias: z.array(z.tuple([z.string(), z.string()])).optional(),
    bundler: z.enum(['webpack', 'mako']).optional(),
    clickToComponent: z
      .union([
        z.object({
          editor: z.enum(['vscode', 'vscode-insiders', 'cursor']).optional(),
        }),
        z.literal(false),
      ])
      .optional(),
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
    doctor: z
      .object({
        phantomDeps: z
          .object({
            exclude: z.array(z.string()).optional(),
          })
          .optional(),
      })
      .optional(),
    externals: z.record(z.string()).optional(),
    less: z
      .object({
        modifyVars: z.any().optional(),
        globalVars: z.any().optional(),
        math: z.any().optional(),
        sourceMap: z.any(),
        plugins: z.array(z.any()).optional(),
      })
      .optional(),
    mountElementId: z.string().optional(),
    plugins: z.array(PluginSchema).optional(),
    reactCompiler: z
      .object({
        target: z.enum(['17', '18', '19']).optional(),
        sources: z.function().optional(),
      })
      .optional(),
    reactScan: z.object({}).optional(),
    publicPath: z.string().optional(),
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
                  .enum([
                    'bottom-left',
                    'bottom-right',
                    'top-left',
                    'top-right',
                  ])
                  .optional(),
              }),
            }),
            z.literal(false),
          ])
          .optional(),
        convention: RouterGeneratorConfig,
      })
      .optional(),
    ssr: z
      .object({
        renderMode: z.enum(['stream', 'string']).optional(),
      })
      .optional(),
    mock: z
      .object({
        delay: z
          .union([
            z.number().optional(),
            z
              .string()
              .regex(/^\d+-\d+$/)
              .optional(),
          ])
          .optional(),
      })
      .optional(),
  })
  .strict();

export type Config = z.infer<typeof ConfigSchema>;
