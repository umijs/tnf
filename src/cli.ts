import assert from 'assert';
import yargsParser from 'yargs-parser';
import { loadConfig } from './config.js';
import { FRAMEWORK_NAME, MIN_NODE_VERSION } from './constants.js';
import {
  checkVersion,
  setNoDeprecation,
  setNodeTitle,
} from './fishkit/node.js';

interface RunOptions {
  cwd: string;
  name?: string;
  template?: string;
}

async function run(cmd: string, options: RunOptions) {
  switch (cmd) {
    case 'create':
      const { create } = await import('./create.js');
      return create(options);
    case 'build':
      const { build } = await import('./build.js');
      return build({
        cwd: options.cwd,
        config: await loadConfig({ cwd: options.cwd }),
      });
    case 'dev':
      const { dev } = await import('./dev.js');
      return dev({
        cwd: options.cwd,
        config: await loadConfig({ cwd: options.cwd }),
      });
    default:
      throw new Error(`Unknown command: ${cmd}`);
  }
}

setNoDeprecation();
checkVersion(MIN_NODE_VERSION);
setNodeTitle(FRAMEWORK_NAME);

const argv = yargsParser(process.argv.slice(2));
const cmd = argv._[0];

assert(cmd, 'Command is required');
run(cmd as string, {
  cwd: process.cwd(),
  name: argv._[1] as string | undefined,
  template: argv.template as string | undefined,
}).catch((err) => {
  console.error(err.message);
  process.exit(1);
});
