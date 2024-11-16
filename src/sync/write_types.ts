import fs from 'fs';
import JSON5 from 'json5';
import path from 'pathe';
import { FRAMEWORK_NAME } from '../constants';
import { writeFileSync } from './fs';
import type { SyncOptions } from './sync';
import { PackageManager } from '../fishkit/npm';

function checkTsconfig(content: string) {
  const json = JSON5.parse(content);
  const extendsPath = `./.${FRAMEWORK_NAME}/tsconfig.json`;
  if (json.extends !== extendsPath) {
    throw new Error(`tsconfig.json is not extending ${extendsPath}`);
  }
}

async function installTypescriptPluginCssModules(context: { cwd: string }) {
  const pm = new PackageManager({ cwd: context.cwd });
  pm.addDevDeps({ 'typescript-plugin-css-modules': '^5.1.0' });

  await pm.installDeps().catch(() => {
    throw new Error('Failed to install typescript-plugin-css-modules');
  });
}

export function generatePathsFromAlias(
  targetDir: string,
  alias: [string, string][],
) {
  const paths: Record<string, string[]> = {};
  for (const [key, val] of alias) {
    const relativeVal = relativePath(val);
    paths[key] = [relativeVal];
    const isDir = fs.statSync(val).isDirectory();
    if (isDir) {
      paths[addSlashStarPrefix(key)] = [addSlashStarPrefix(relativeVal)];
    }
  }

  function relativePath(val: string) {
    const relativeVal = path.relative(targetDir, val);
    if (relativeVal.startsWith('..')) {
      return relativeVal;
    }
    return `./${relativeVal}`;
  }

  function addSlashStarPrefix(key: string) {
    if (key.endsWith('/')) {
      return `${key}*`;
    } else {
      return `${key}/*`;
    }
  }

  return paths;
}

export async function writeTypes({ context }: SyncOptions) {
  const {
    paths: { tmpPath },
    cwd,
    config,
  } = context;

  // check user tsconfig
  const userTsconfigPath = path.join(cwd, 'tsconfig.json');
  checkTsconfig(fs.readFileSync(userTsconfigPath, 'utf-8'));

  await installTypescriptPluginCssModules(context);

  const tsconfigPath = path.join(tmpPath, 'tsconfig.json');
  const paths = generatePathsFromAlias(tmpPath, config.alias || []);
  const tsconfig = {
    compilerOptions: {
      paths,
      rootDirs: ['..'],
      lib: ['esnext', 'dom', 'dom.iterable'],
      jsx: 'react-jsx',
      verbatimModuleSyntax: true,
      isolatedModules: true,
      module: 'esnext',
      moduleResolution: 'bundler',
      noEmit: true,
      strictNullChecks: true,
      target: 'esnext',
      plugins: [{ name: 'typescript-plugin-css-modules' }],
    },
    include: [
      'client.tsx',
      'types/css.d.ts',
      '../.tnfrc.ts',
      '../typings.d.ts',
      '../src/**/*.js',
      '../src/**/*.ts',
      '../src/**/*.tsx',
      '../tests/**/*.js',
      '../tests/**/*.ts',
      '../tests/**/*.tsx',
    ],
    exclude: ['../node_modules/**', '../dist/**'],
  };
  writeFileSync(tsconfigPath, JSON.stringify(tsconfig, null, 2) + '\n');

  // generate types
  const typesPath = path.join(tmpPath, 'types/css.d.ts');
  const typesContent = `
declare module '*.less' {
  const classes: { [key: string]: string };
  export default classes;
}
declare module '*.css' {
  const classes: { [key: string]: string };
  export default classes;
}
  `;
  writeFileSync(typesPath, typesContent);
}
