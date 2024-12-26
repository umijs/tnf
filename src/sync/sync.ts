import fs from 'fs';
import * as logger from '../fishkit/logger.js';
import type { Context } from '../types/index.js';
import { writeClientEntry } from './write_client_entry.js';
import { writeDocs } from './write_docs.js';
import { writeGlobalStyle } from './write_global_style.js';
import { writeRouteTree } from './write_route_tree.js';
import { writeRouter } from './write_router.js';
import { writeServerEntry } from './write_server_entry.js';
import { writeTailwindcss } from './write_tailwindcss.js';
import { writeTypes } from './write_types.js';

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

  await writeDocs({ context });
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
