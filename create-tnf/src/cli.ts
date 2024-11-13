import yargsParser from 'yargs-parser';
import { create } from './create.js';

async function run(cwd: string) {
  const argv = yargsParser(process.argv.slice(2));
  return create({
    cwd: cwd,
    name: argv._[0] as string | undefined,
    template: argv.template,
  });
}

run(process.cwd()).catch((err) => {
  console.error(err.message);
  process.exit(1);
});
