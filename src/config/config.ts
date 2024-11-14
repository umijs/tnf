import {
  loadConfig as loadC12Config,
  watchConfig as watchC12Config,
} from 'c12';
import { CONFIG_FILE } from '../constants';
import type { Config } from './types';
import { ConfigSchema } from './types';

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
