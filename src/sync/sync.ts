import fs from 'fs';
import type { Config as TnfConfig } from '../config';
import { writeClientEntry } from './write_client_entry';
import { writeGlobalStyle } from './write_global_style';
import { writeRouteTree } from './write_route_tree';
import { writeTailwindcss } from './write_tailwindcss';

interface BaseOptions {
  cwd: string;
  tmpPath: string;
  config?: TnfConfig;
  mode: 'development' | 'production';
}

export interface SyncOptions extends BaseOptions {
  runAgain?: boolean;
}

export async function sync(opts: SyncOptions) {
  const { tmpPath } = opts;

  if (!opts.runAgain) {
    fs.rmSync(tmpPath, { recursive: true, force: true });
    fs.mkdirSync(tmpPath, { recursive: true });
  }

  await writeRouteTree(opts);
  const globalStyleImportPath = writeGlobalStyle(opts);
  const tailwindcssPath = await writeTailwindcss(opts);
  writeClientEntry({
    opts,
    globalStyleImportPath,
    tailwindcssPath,
  });

  console.log('Synced');
}
