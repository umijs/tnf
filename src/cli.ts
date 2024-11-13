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
import { generate } from './generate';

async function run(cwd: string) {
  const argv = yargsParser(process.argv.slice(2));
  const cmd = argv._[0];
  assert(cmd, 'Command is required');
  switch (cmd) {
    case 'build':
      const { build } = await import('./build.js');
      return build({
        config: await loadConfig({ cwd }),
        cwd,
        mode: 'production',
      });
    case 'dev':
      const { dev } = await import('./dev.js');
      return dev({
        config: await loadConfig({ cwd }),
        cwd,
      });
    case 'preview':
      const { preview } = await import('./preview.js');
      return preview({
        config: await loadConfig({ cwd }),
        cwd,
      });
    case 'generate':
    case 'g':
      const type = argv._[1] as string;
      const name = argv._[2] as string;
      assert(type, 'Type is required');
      assert(name, 'Name is required');
      return generate({
        cwd,
        type,
        name,
      });
    case 'sync':
      const { sync } = await import('./sync.js');
      const tmpPath = path.join(cwd, `src/.${FRAMEWORK_NAME}`);
      return sync({
        cwd,
        tmpPath,
        config: await loadConfig({ cwd }),
        mode: argv.mode || 'development',
      });
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
