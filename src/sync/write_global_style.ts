import fs from 'fs';
import path from 'pathe';
import type { SyncOptions } from './sync.js';

const supportedExtensions = ['.css', '.less'];

export function getStyleImportPath(basePath: string) {
  const ext = supportedExtensions.find((ext) =>
    fs.existsSync(path.join(basePath + ext)),
  );
  return ext ? `import '${basePath}${ext}';` : '';
}

export function writeGlobalStyle({ context }: SyncOptions) {
  const { cwd } = context;
  const globalStylePath = path.join(cwd, 'src/global');
  return getStyleImportPath(globalStylePath);
}
