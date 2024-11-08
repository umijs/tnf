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
    })
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
