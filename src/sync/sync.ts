import fs from 'fs';
import * as logger from '../fishkit/logger';
import type { Context } from '../types';
import { writeClientEntry } from './write_client_entry';
import { writeGlobalStyle } from './write_global_style';
import { writeRouteTree } from './write_route_tree';
import { writeRouter } from './write_router';
import { writeServerEntry } from './write_server_entry';
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
  writeRouter({ opts });
  if (context.config?.ssr) {
    writeServerEntry({ opts });
  }
  writeClientEntry({
    opts,
    globalStyleImportPath,
    tailwindcssPath,
  });

  logger.info('Synced');
}
