import yargsParser from 'yargs-parser';

const argv = yargsParser(process.argv.slice(2));
const cmd = argv._[0];

switch (cmd) {
  case 'create':
    import('./create.js').then(({ create }) => {
      create({
        cwd: process.cwd(),
        name: argv._[1] as string | undefined,
        template: argv.template,
      }).catch(console.error);
    });
    break;
  case 'build':
    import('./build.js').then(({ build }) => {
      build({
        cwd: process.cwd(),
      }).catch(console.error);
    });
    break;
  case 'dev':
    import('./dev.js').then(({ dev }) => {
      dev({
        cwd: process.cwd(),
      }).catch(console.error);
    });
    break;
  default:
    console.error(`Unknown command: ${cmd}`);
    process.exit(1);
}
