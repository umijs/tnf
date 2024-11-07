import assert from 'assert';
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
  const argv = yargsParser(process.argv.slice(2), {
    alias: {
      g: 'generate',
    },
  });
  const cmd = argv._[0];
  assert(cmd, 'Command is required');
  switch (cmd) {
    case 'create':
      const { create } = await import('./create.js');
      return create({
        cwd: cwd,
        name: argv.name,
        template: argv.template,
      });
    case 'build':
      const { build } = await import('./build.js');
      return build({
        cwd,
        config: await loadConfig({ cwd }),
      });
    case 'dev':
      const { dev } = await import('./dev.js');
      return dev({
        cwd,
        config: await loadConfig({ cwd }),
      });
    case 'preview':
      const { preview } = await import('./preview.js');
      return preview({
        cwd,
        config: await loadConfig({ cwd }),
      });
    case 'generate':
      const type = argv._[1] as string;
      const name = argv._[2] as string;
      assert(type, 'Type is required');
      assert(name, 'Name is required');
      return generate({
        cwd,
        type,
        name,
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
