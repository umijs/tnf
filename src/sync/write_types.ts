import fs from 'fs';
import JSON from 'json5';
import path from 'pathe';
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

export function writeTypes({ context }: SyncOptions) {
  const {
    paths: { tmpPath },
    cwd,
  } = context;

  // check user tsconfig
  const userTsconfigPath = path.join(cwd, 'tsconfig.json');
  checkTsconfig(fs.readFileSync(userTsconfigPath, 'utf-8'));

  const tsconfigPath = path.join(tmpPath, 'tsconfig.json');
  // TODO: generate paths from aliases
  const tsconfigContent = `
{
  "compilerOptions": {
    "paths": {
      "@": ["../src"],
      "@/*": ["../src/*"]
    },
    "rootDirs": [".."],
    "lib": ["esnext", "dom", "dom.iterable"],
    "jsx": "react-jsx",
    "verbatimModuleSyntax": true,
    "isolatedModules": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "noEmit": true,
    "strictNullChecks": true,
    "target": "esnext",
    "plugins": [
      {
        "name": "typescript-plugin-css-modules"
      }
    ],
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
