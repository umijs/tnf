import fs from 'fs';
import JSON from 'json5';
import path from 'pathe';
import 'zx/globals';
import { FRAMEWORK_NAME } from '../constants';
import { writeFileSync } from './fs';
import type { SyncOptions } from './sync';

function checkTsconfig(content: string) {
  const json = JSON.parse(content);
  const extendsPath = `./.${FRAMEWORK_NAME}/tsconfig.json`;
  if (json.extends !== extendsPath) {
    throw new Error(`tsconfig.json is not extending ${extendsPath}`);
  }
}

async function checkCssModulesPlugin(pluginName: string = '') {
  try {
    let pkgPath = './package.json';
    let pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
    let exist = pkg.devDependencies[pluginName];

    if (!exist) {
      console.log(`Updated ${pkgPath}`);
      await $`pnpm add -D ${pluginName}`;
      console.log(`Installed with pnpm`);
    }
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

export function writeTypes({ context }: SyncOptions) {
  const {
    paths: { tmpPath },
    cwd,
  } = context;

  // check user tsconfig
  const userTsconfigPath = path.join(cwd, 'tsconfig.json');
  checkTsconfig(fs.readFileSync(userTsconfigPath, 'utf-8'));

  // check css module plugin
  let pluginName = 'typescript-plugin-css-modules';
  checkCssModulesPlugin(pluginName);

  const tsconfigPath = path.join(tmpPath, 'tsconfig.json');
  // TODO: generate paths from aliases
  const tsconfigContent = `
{
  "compilerOptions": {
    "paths": {
      "@": ["../src"],
      "@/*": ["../src/*"]
    },
    "plugins": [
      {
        "name": "typescript-plugin-css-modules"
      }
    ],
    "rootDirs": [".."],
    "lib": ["esnext", "dom", "dom.iterable"],
    "jsx": "react-jsx",
    "verbatimModuleSyntax": true,
    "isolatedModules": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "noEmit": true,
    "strictNullChecks": true,
    "target": "esnext"
  },
  "include": [
    "client.tsx",
    "types/css.d.ts",
    "../.tnfrc.ts",
    "../typings.d.ts",
    "../src/**/*.js",
    "../src/**/*.ts",
    "../src/**/*.tsx",
    "../tests/**/*.js",
    "../tests/**/*.ts",
    "../tests/**/*.tsx"
  ],
  "exclude": [
    "../node_modules/**",
    "../dist/**"
  ]
}
  `;
  writeFileSync(tsconfigPath, tsconfigContent);

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
