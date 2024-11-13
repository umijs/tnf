import assert from 'assert';
import yargsParser from 'yargs-parser';
import { FRAMEWORK_NAME, MIN_NODE_VERSION } from './constants.js';
import { create } from './create.js';
import {
  checkVersion,
  setNoDeprecation,
  setNodeTitle,
} from './fishkit/node.js';

async function run(cwd: string) {
  const argv = yargsParser(process.argv.slice(1));
  const cmd = argv._[0];
  assert(cmd, 'Command is required');

  return create({
    cwd: cwd,
    name: argv._[1] as string | undefined,
    template: argv.template,
  });
}

setNoDeprecation();
checkVersion(MIN_NODE_VERSION);
setNodeTitle(FRAMEWORK_NAME);

run(process.cwd()).catch((err) => {
  console.error(err.message);
  process.exit(1);
});
