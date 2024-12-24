import * as babel from '@babel/core';
import path from 'pathe';
import type { Plugin } from '../../plugin/types';

export function reactCompiler(compilerOpts: any): Plugin {
  return {
    name: 'react-compiler',
    configureBundler() {
      return [
        {
          name: 'react-compiler',
          transformInclude(filePath: string) {
            const isReactFile =
              filePath.endsWith('.jsx') || filePath.endsWith('.tsx');
            const isUnderNodeModules = filePath.includes('node_modules');
            return isReactFile && !isUnderNodeModules;
          },
          async transform(content: string, filePath: string) {
            const result = await babel.transformAsync(content, {
              filename: filePath,
              presets: [
                [
                  require.resolve('@babel/preset-react'),
                  { runtime: 'automatic' },
                ],
                [
                  require.resolve('@babel/preset-typescript'),
                  { isTSX: true, allExtensions: true },
                ],
              ],
              plugins: [
                [require.resolve('babel-plugin-react-compiler'), compilerOpts],
              ],
            });

            if (!result || !result.code) {
              throw new Error(`Failed to compile ${filePath}`);
            }

            const type = path.extname(filePath) === '.tsx' ? 'tsx' : 'jsx';
            return { content: result.code, type };
          },
        },
      ];
    },
  };
}
