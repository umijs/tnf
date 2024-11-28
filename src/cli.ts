import assert from 'assert';
import path from 'pathe';
import yargsParser from 'yargs-parser';
import { loadConfig } from './config/config';
import { FRAMEWORK_NAME, MIN_NODE_VERSION } from './constants';
import { debug, error, info, warn } from './fishkit/logger';
import * as logger from './fishkit/logger';
import { checkVersion, setNoDeprecation, setNodeTitle } from './fishkit/node';
import { mock } from './funplugins/mock/mock';
import { PluginHookType, PluginManager } from './plugin/plugin_manager';
import { type Context, Mode } from './types';

async function buildContext(cwd: string): Promise<Context> {
  const argv = yargsParser(process.argv.slice(2));
  const command = argv._[0];
  const isDev = command === 'dev';
  const config = await loadConfig({ cwd });
  const plugins = [...(config.plugins || []), mock({ paths: ['mock'], cwd })];
  const pluginManager = new PluginManager(plugins);
  const pluginContext = {
    command: command as string | undefined,
    config,
    cwd,
    // TODO: diff config and userConfig
    userConfig: config,
    debug,
    error,
    info,
    warn,
    // TODO: watcher
  };
  return {
    argv,
    config,
    pluginManager,
    pluginContext,
    cwd,
    mode: isDev ? Mode.Development : Mode.Production,
    paths: {
      tmpPath: path.join(cwd, `.${FRAMEWORK_NAME}`),
    },
  };
}

async function run(cwd: string) {
  const context = await buildContext(cwd);
  const cmd = context.argv._[0];
  assert(cmd, 'Command is required');

  if (cmd === 'build' || cmd === 'dev') {
    await context.pluginManager.apply({
      hook: 'buildStart',
      args: [{ command: cmd }],
      type: PluginHookType.Parallel,
      pluginContext: context.pluginContext,
    });
  }

  switch (cmd) {
    case 'build':
      const { build } = await import('./build.js');
      return build({ context });
    case 'dev':
      const { dev } = await import('./dev.js');
      return dev({ context });
    case 'preview':
      const { preview } = await import('./preview.js');
      return preview({ context });
    case 'generate':
    case 'g':
      const { generate } = await import('./generate/generate.js');
      return generate({ context });
    case 'sync':
      const { sync } = await import('./sync/sync.js');
      return sync({ context });
    case 'config':
      const { config } = await import('./config/config.js');
      return config({ context });
    default:
      throw new Error(`Unknown command: ${cmd}`);
  }
}

setNoDeprecation();
checkVersion(MIN_NODE_VERSION);
setNodeTitle(FRAMEWORK_NAME);

run(process.cwd()).catch((err) => {
  logger.error(err.message);
  process.exit(1);
});
