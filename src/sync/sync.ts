import fs from 'fs';
import type { Context } from '../types';
import { writeClientEntry } from './write_client_entry';
import { writeGlobalStyle } from './write_global_style';
import { writeRouteTree } from './write_route_tree';
import { writeTailwindcss } from './write_tailwindcss';
import { writeTypes } from './write_types';

export interface SyncOptions {
  context: Context;
  runAgain?: boolean;
}

export async function sync(opts: SyncOptions) {
  const { context, runAgain } = opts;
  const { tmpPath } = context.paths;

  if (!runAgain) {
    fs.rmSync(tmpPath, { recursive: true, force: true });
    fs.mkdirSync(tmpPath, { recursive: true });
  }

  await writeTypes({ context });
  await writeRouteTree({ context });
  const globalStyleImportPath = writeGlobalStyle({ context });
  const tailwindcssPath = await writeTailwindcss({ context });
  writeClientEntry({
    opts,
    globalStyleImportPath,
    tailwindcssPath,
  });

  console.log('Synced');
}
