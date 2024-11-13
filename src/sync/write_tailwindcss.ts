import { generateTailwindcss } from '../fishkit/tailwindcss';
import type { SyncOptions } from './sync';

export async function writeTailwindcss(opts: SyncOptions) {
  const { cwd, tmpPath, config, mode, runAgain } = opts;

  let tailwindcssPath: string | undefined;
  if (config?.tailwindcss && !runAgain) {
    tailwindcssPath = await generateTailwindcss({
      cwd,
      tmpPath,
      mode,
    });
  }
  return tailwindcssPath;
}
