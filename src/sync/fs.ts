import fs from 'fs-extra';
import path from 'path';

export function writeFileSync(filePath: string, content: string) {
  fs.ensureDirSync(path.dirname(filePath));

  // don't write the same content to the same file
  // to avoid unnecessary rebuilds
  if (fs.existsSync(filePath)) {
    const originalContent = fs.readFileSync(filePath, 'utf8');
    if (originalContent === content) return;
  }
  fs.writeFileSync(filePath, content);
}
