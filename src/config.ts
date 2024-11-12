import {
  loadConfig as loadC12Config,
  watchConfig as watchC12Config,
} from 'c12';
import { z } from 'zod';
import { CONFIG_FILE } from './constants';

const ConfigSchema = z.object({
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
  tailwindcss: z
    .union([
      z.object({
        content: z
          .union([
            z.array(
              z.union([
                z.string(),
                z.object({
                  raw: z.string(),
                  extension: z.string().optional(),
                }),
              ]),
            ),
            z.object({
              files: z.array(
                z.union([
                  z.string(),
                  z.object({
                    raw: z.string(),
                    extension: z.string().optional(),
                  }),
                ]),
              ),
              relative: z.boolean().optional(),
              extract: z
                .union([
                  z.function().args(z.string()).returns(z.array(z.string())),
                  z.record(
                    z.string(),
                    z.function().args(z.string()).returns(z.array(z.string())),
                  ),
                ])
                .optional(),
              transform: z
                .union([
                  z.function().args(z.string()).returns(z.string()),
                  z.record(
                    z.string(),
                    z.function().args(z.string()).returns(z.string()),
                  ),
                ])
                .optional(),
            }),
          ])
          .optional(),
        important: z.union([z.boolean(), z.string()]).optional(),
        prefix: z.string().optional(),
        separator: z.string().optional(),
        safelist: z
          .array(
            z.union([
              z.string(),
              z.object({
                pattern: z.instanceof(RegExp),
                variants: z.array(z.string()).optional(),
              }),
            ]),
          )
          .optional(),
        darkMode: z
          .union([
            z.literal('media'),
            z.literal('class'),
            z.tuple([z.literal('class'), z.string()]),
            z.literal('selector'),
            z.tuple([z.literal('selector'), z.string()]),
            z.tuple([
              z.literal('variant'),
              z.union([z.string(), z.array(z.string())]),
            ]),
          ])
          .optional(),
        theme: z.record(z.string(), z.any()).optional(),
        plugins: z.array(z.function()).optional(),
      }),
      z.record(z.string(), z.any()),
    ])
    .optional(),
});

export type Config = z.infer<typeof ConfigSchema>;

interface ConfigOpts {
  cwd: string;
  defaults?: Partial<Config>;
  overrides?: Partial<Config>;
}

export async function loadConfig(opts: ConfigOpts): Promise<Config> {
  const { config: rawConfig } = await loadC12Config(createLoadConfigOpts(opts));
  const result = ConfigSchema.safeParse(rawConfig);
  if (!result.success) {
    throw new Error(`Invalid configuration: ${result.error.message}`);
  }
  return result.data;
}

export function watchConfig(opts: ConfigOpts) {
  return watchC12Config({
    ...createLoadConfigOpts(opts),
    onWatch(event) {
      console.log(event);
    },
    onUpdate({ oldConfig, newConfig, getDiff }) {
      const result = ConfigSchema.safeParse(newConfig);
      if (!result.success) {
        console.error(`Invalid configuration: ${result.error.message}`);
        return;
      }
      console.log('onUpdate', oldConfig, result.data, getDiff());
    },
  });
}

function createLoadConfigOpts({ cwd, defaults, overrides }: ConfigOpts) {
  return {
    cwd,
    configFile: CONFIG_FILE,
    rcFile: false as const,
    globalRc: false as const,
    defaults,
    overrides,
  };
}
