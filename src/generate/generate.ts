import type { Context } from '../types';
import { generatePage } from './generate_page';

export async function generate({ context }: { context: Context }) {
  const type = context.argv._[1] as string | undefined;
  // remove the first two elements
  // e.g.
  // generate page foo
  // after slice, opts.argv._ is ['foo']
  context.argv._ = context.argv._.slice(2);
  if (!type) {
    throw new Error('Not implemented');
  } else if (type === 'page') {
    return await generatePage({ context });
  } else {
    throw new Error(`Unknown type: ${type}`);
  }
}
