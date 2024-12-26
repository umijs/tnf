import type { Context } from '../types/index.js';
import { generateCursor } from './generate_cursor.js';
import { generatePage } from './generate_page.js';
import { generateTailwindcss } from './generate_tailwindcss.js';

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
  } else if (type === 'tailwindcss') {
    return await generateTailwindcss({ context });
  } else if (type === 'cursor') {
    return await generateCursor({ context, force: context.argv.force });
  } else {
    throw new Error(`Unknown type: ${type}`);
  }
}
