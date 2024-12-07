import assert from 'assert';
import {
  loadConfig as loadC12Config,
  watchConfig as watchC12Config,
} from 'c12';
import { updateConfig } from 'c12/update';
import fs from 'fs';
import path from 'pathe';
import pc from 'picocolors';
import { CONFIG_FILE } from '../constants';
import * as logger from '../fishkit/logger';
import type { Context, Pkg } from '../types';
import type { Config } from './types';
import { ConfigSchema } from './types';

interface ConfigOpts {
  cwd: string;
  pkg?: Pkg;
  defaults?: Partial<Config>;
  overrides?: Partial<Config>;
}

export async function loadConfig(opts: ConfigOpts): Promise<Config> {
  const { config: rawConfig } = await loadC12Config(createLoadConfigOpts(opts));
  const result = ConfigSchema.safeParse(rawConfig);
  if (!result.success) {
    throw new Error(`Invalid configuration: ${result.error.message}`);
  }
  const config = result.data;
  const reactPath =
    resolveUserLib('react', opts.pkg || {}, opts.cwd) || resolveLib('react');
  const reactDomPath =
    resolveUserLib('react-dom', opts.pkg || {}, opts.cwd) ||
    resolveLib('react-dom');
  config.alias = [
    ['@', path.join(opts.cwd, 'src')],
    ['react', reactPath],
    ['react-dom', reactDomPath],
    ['@tanstack/react-router', resolveLib('@tanstack/react-router')],
    ['@tanstack/router-devtools', resolveLib('@tanstack/router-devtools')],
    ['click-to-react-component', require.resolve('click-to-react-component')],
    ...(config.alias || []),
  ];
  return config;
}

function resolveUserLib(lib: string, pkg: Record<string, any>, cwd: string) {
  const version = pkg.dependencies?.[lib] || pkg.devDependencies?.[lib];
  if (version) {
    const libPath = path.join(cwd, 'node_modules', lib);
    assert(
      fs.existsSync(libPath),
      `Library ${lib} is specified in package.json but not found.`,
    );
    return libPath;
  }
  return null;
}

function resolveLib(lib: string) {
  return path.dirname(require.resolve(`${lib}/package.json`));
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
        logger.error(`Invalid configuration: ${result.error.message}`);
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

export function list(config: Config, name?: string) {
  const getValue = (value: any) => {
    if (typeof value !== 'function') {
      return value;
    }
    return pc.yellow('The value data type does not support the view');
  };
  const print = (key: string) => {
    console.log(
      ` - ${pc.blue(`[key: ${key}]`)}`,
      getValue(config[key as keyof Config]),
    );
    console.log();
  };
  console.log();
  console.log(`  Configs:`);
  console.log();
  if (name) {
    if (
      !config[name as keyof Config] &&
      config[name as keyof Config] !== false
    ) {
      // current key not existed
      throw new Error(`key '${name}' not found`);
    }
    print(name as string);
  } else {
    // list all
    Object.keys(config).forEach((key) => {
      print(key);
    });
  }

  console.log();
}

export async function setConfig({
  cwd,
  name,
  value,
  type = 'set',
}: {
  cwd: string;
  name: string | number | undefined;
  value: any;
  type?: string | 'set' | 'remove';
}) {
  const configOpts = createLoadConfigOpts({ cwd });
  await updateConfig({
    ...configOpts,
    onUpdate: (_config) => {
      if (!name) {
        console.log(pc.yellow(`key '${name}' not found`));
        return;
      }
      const _value = _config[name];
      if (type === 'remove') {
        if (_config.hasOwnProperty(name)) {
          delete _config[name];
        }
      } else {
        if (value) {
          let safeValue: string | number | boolean | undefined = value;
          if (safeValue === 'true') {
            safeValue = true;
          } else if (safeValue === 'false') {
            safeValue = false;
          }
          _config[name] = safeValue as string | number | undefined;
        }
      }
      const result = ConfigSchema.safeParse(_config);
      if (!result.success) {
        console.log(
          pc.yellow(`Invalid configuration: ${result.error.message}`),
        );
        // Verification failed, recall modification
        _config[name] = _value;
      } else {
        console.log(
          pc.green(`${type} config:${name} on ${configOpts.configFile}`),
        );
      }
    },
  });
}

export async function config({ context }: { context: Context }) {
  const { _ } = context.argv;
  const [, command, name, value] = _;

  switch (command) {
    case 'list':
      list(context.config);
      break;
    case 'get':
      list(context.config, `${name}`);
      break;
    case 'set':
    case 'remove':
      setConfig({ cwd: context.cwd, name, value, type: command });
      break;
    default:
      throw new Error(`Unsupported sub command ${command} for tnf config.`);
  }
}
