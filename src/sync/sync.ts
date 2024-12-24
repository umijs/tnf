import fs from 'fs';
import { join, relative } from 'path';
import * as logger from '../fishkit/logger';
import type { Context } from '../types';
import { writeAi } from './write_ai';
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

  const shouldKeepPath = (path: string, tmpPath: string) => {
    const keepPaths = context.config.router?.routeFileSimplify
      ? ['routeTree.gen.ts', 'pages']
      : [];

    const relativePath = relative(tmpPath, path);

    return keepPaths.some((keepPath) => {
      return (
        relativePath === keepPath || relativePath.startsWith(`${keepPath}/`)
      );
    });
  };

  const removeDirectoryContents = (dirPath: string, rootPath: string) => {
    if (!fs.existsSync(dirPath)) return;

    const files = fs.readdirSync(dirPath);

    for (const file of files) {
      const currentPath = join(dirPath, file);

      if (shouldKeepPath(currentPath, rootPath)) {
        if (fs.statSync(currentPath).isDirectory()) {
          removeDirectoryContents(currentPath, rootPath);
        }
        continue;
      }

      if (fs.statSync(currentPath).isDirectory()) {
        fs.rmSync(currentPath, { recursive: true, force: true });
      } else {
        fs.unlinkSync(currentPath);
      }
    }
  };

  if (!runAgain) {
    removeDirectoryContents(tmpPath, tmpPath);
    fs.mkdirSync(tmpPath, { recursive: true });
  }

  await writeAi({ context });
  await writeTypes({ context });
  if (!context.config?.router?.routeFileSimplify) {
    await writeRouteTree({ context });
  }
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
