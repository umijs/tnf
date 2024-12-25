import yargsParser from 'yargs-parser';
import * as p from './clack/prompt/index.js';
import { create } from './create.js';

async function run(cwd: string) {
  const argv = yargsParser(process.argv.slice(2), {
    alias: {
      version: ['v'],
      help: ['h'],
      template: ['t'],
    },
    boolean: ['version', 'help'],
  });

  // Check if the version flag is set
  if (argv.version) {
    const { name, version } = require('../package.json');
    console.log(`${name}@${version}`);
    return;
  }

  // Check if the help flag is set
  if (argv.help) {
    console.log(`Usage: create-tnf [project-name] [options]

Options:
  --version, -v     Show version number
  --help, -h        Show help
  --template, -t    Specify a template for the project
  --npm-client, -n  Specify the npm client to use (pnpm, yarn, npm)

Examples:
  create-tnf                          Create a new project
  create-tnf my-app                   Create a new project named 'my-app'
  create-tnf my-app --template=simple Create a new project named 'my-app' using the 'simple' template`);
    return;
  }

  p.intro('Creating a new TNF project...');
  create({
    cwd: cwd,
    name: argv._[0] as string | undefined,
    template: argv.template,
  })
    .then(() => {
      p.outro('Create success!');
    })
    .catch((err) => {
      p.cancel(`Create failed, ${err.message}`);
      process.exit(1);
    });
}

run(process.cwd()).catch((err) => {
  console.error(err);
  process.exit(1);
});
