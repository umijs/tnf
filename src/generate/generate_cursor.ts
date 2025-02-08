import assert from 'assert';
import fs from 'fs-extra';
import path from 'pathe';
import { fileURLToPath } from 'url';
import type { Context } from '../types/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const CURSOR_RULES_FILE = { old: '.cursorrules', new: '.cursor/rules' };
interface GenerateCursorOpts {
  context: Context;
  force?: boolean;
}

export async function generateCursor(opts: GenerateCursorOpts) {
  const { context, force } = opts;
  const cwd = context.cwd;
  const deprecatedPath = path.join(cwd, CURSOR_RULES_FILE.old);
  const rulePath = path.join(cwd, CURSOR_RULES_FILE.new);
  const isRulesFileExists = fs.existsSync(deprecatedPath);
  if (!force) {
    assert(
      !isRulesFileExists,
      `${CURSOR_RULES_FILE.old} is deprecated and will be removed in the future, please use ${CURSOR_RULES_FILE.new} instead`,
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

  fs.copySync(path.join(__dirname, './cursor'), rulePath);
}
