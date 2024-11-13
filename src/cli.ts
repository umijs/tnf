import assert from 'assert';
import path from 'pathe';
import yargsParser from 'yargs-parser';
import { loadConfig } from './config.js';
import { FRAMEWORK_NAME, MIN_NODE_VERSION } from './constants.js';
import {
  checkVersion,
  setNoDeprecation,
  setNodeTitle,
} from './fishkit/node.js';
import type { Context } from './types/index.js';

async function buildContext(cwd: string): Promise<Context> {
  const argv = yargsParser(process.argv.slice(2));
  const cmd = argv._[0];
  const isDev = cmd === 'development';
  return {
    argv,
    config: await loadConfig({ cwd }),
    cwd,
    mode: isDev ? 'development' : 'production',
    paths: {
      tmpPath: path.join(cwd, `.${FRAMEWORK_NAME}`),
    },
  };
}

async function run(cwd: string) {
  const context = await buildContext(cwd);
  const cmd = context.argv._[0];
  assert(cmd, 'Command is required');
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
    default:
      throw new Error(`Unknown command: ${cmd}`);
  }
}

setNoDeprecation();
checkVersion(MIN_NODE_VERSION);
setNodeTitle(FRAMEWORK_NAME);

run(process.cwd()).catch((err) => {
  console.error(err.message);
  process.exit(1);
});
