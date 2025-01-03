import * as p from '@umijs/clack-prompts';
import assert from 'assert';
import fs from 'fs';
import path from 'path';
import { tools } from './ai/ai.js';
import * as logger from './fishkit/logger.js';
import { getNpmClient, installWithNpmClient } from './fishkit/npm.js';
import { type Context } from './types/index.js';

const CANCEL_TEXT = 'Operation cancelled.';

export async function chat({ context }: { context: Context }) {
  const { cwd } = context;
  p.intro('Welcome to TNF Chat!');
  try {
    // Check if @umijs/ai is installed
    while (true) {
      if (isUmijsAiExists(cwd)) {
        break;
      } else {
        p.log.error('@umijs/ai is not installed');
        const result = await p.confirm({
          message: 'Do you want to install @umijs/ai?',
        });
        if (p.isCancel(result)) {
          throw new Error(CANCEL_TEXT);
        }
        if (result) {
          // install @umijs/ai
          logger.debug('Installing @umijs/ai');
          addUmijsAiToPackageJson(cwd);
          const npmClient = await getNpmClient({ cwd });
          logger.debug(`Using npm client: ${npmClient}`);
          installWithNpmClient({
            npmClient,
            cwd,
          });
        } else {
          throw new Error('Process cancelled, please install @umijs/ai first');
        }
      }
    }

    // use @umijs/ai
    const docsDir = path.join(context.paths.tmpPath, 'docs');
    assert(
      fs.existsSync(docsDir),
      '.tnf/docs directory not found, please run tnf build/sync/dev first',
    );
    const tnfPath = path.join(docsDir, 'tnf.md');
    const generalPath = path.join(docsDir, 'general.md');
    const systemPrompts = [
      fs.readFileSync(tnfPath, 'utf-8'),
      fs.readFileSync(generalPath, 'utf-8'),
    ];
    const umijsAiPath = path.join(
      cwd,
      'node_modules',
      '@umijs',
      'ai',
      'dist',
      'index.js',
    );
    const ai = await import(umijsAiPath);
    await ai.chat({
      tools,
      verbose: context.argv.verbose,
      message: context.argv.message,
      systemPrompts,
      model: context.argv.model,
    });
    p.outro('Bye!');
  } catch (e: any) {
    p.cancel(e.message);
  }
}

function addUmijsAiToPackageJson(cwd: string) {
  const pkg = readPackageJson(cwd);
  pkg.dependencies['@umijs/ai'] = '^0.1.0';
  fs.writeFileSync(
    path.join(cwd, 'package.json'),
    JSON.stringify(pkg, null, 2),
  );
}

function readPackageJson(cwd: string) {
  const pkgPath = path.join(cwd, 'package.json');
  logger.debug(`Reading package.json from ${pkgPath}`);
  assert(fs.existsSync(pkgPath), 'package.json not found');
  return JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
}

function isUmijsAiExists(cwd: string) {
  const pkg = readPackageJson(cwd);
  return pkg.dependencies['@umijs/ai'] || pkg.devDependencies['@umijs/ai'];
}
