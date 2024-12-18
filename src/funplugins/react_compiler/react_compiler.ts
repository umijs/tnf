import assert from 'assert';
import type { Plugin } from '../../plugin/types';

export function reactCompiler(): Plugin {
  return {
    name: 'react-compiler',
    configureBundler() {
      return [];
    },
  };
}
