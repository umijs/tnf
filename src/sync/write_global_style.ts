import fs from 'fs';
import path from 'pathe';
import type { SyncOptions } from './sync';

const supportedExtensions = ['.css', '.less'];

export function getStyleImportPath(basePath: string) {
  const ext = supportedExtensions.find((ext) =>
    fs.existsSync(path.join(basePath + ext)),
  );
  return ext ? `import '${basePath}${ext}';` : '';
}

export function writeGlobalStyle(opts: SyncOptions) {
  const { cwd } = opts;
  const globalStylePath = path.join(cwd, 'src/global');
  return getStyleImportPath(globalStylePath);
}
