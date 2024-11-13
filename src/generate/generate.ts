import type yargsParser from 'yargs-parser';
import { generatePage } from './generate_page';

export interface GenerateOptions {
  cwd: string;
  argv: yargsParser.Arguments;
}

export async function generate(opts: GenerateOptions) {
  const type = opts.argv._[1] as string | undefined;
  // remove the first two elements
  // e.g.
  // tnf g page foo
  // after slice, opts.argv._ is ['foo']
  opts.argv._ = opts.argv._.slice(2);
  if (!type) {
    throw new Error('Not implemented');
  } else if (type === 'page') {
    return await generatePage(opts);
  } else {
    throw new Error(`Unknown type: ${type}`);
  }
}
