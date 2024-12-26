import assert from 'assert';
import fs from 'fs';
import path from 'pathe';
import type { Context } from '../types/index.js';

interface GenerateCursorOpts {
  context: Context;
  force?: boolean;
}

export async function generateCursor(opts: GenerateCursorOpts) {
  const { context, force } = opts;
  const cwd = context.cwd;
  const cursorRulesPath = path.join(cwd, '.cursorrules');
  if (!force) {
    assert(
      !fs.existsSync(cursorRulesPath),
      `Cursor rules file already exists at ${cursorRulesPath}`,
    );
  }
  const generalFilePath = path.join(
    context.paths.tmpPath,
    'docs',
    'general.md',
  );
  assert(
    fs.existsSync(generalFilePath),
    `General file not found at ${generalFilePath}, please run \`tnf sync\` first.`,
  );
  const general = fs.readFileSync(generalFilePath, 'utf-8');
  fs.writeFileSync(cursorRulesPath, general, 'utf-8');
}
