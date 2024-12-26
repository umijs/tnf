import type { Bundler } from './bundler.js';

export default {
  build: async (_opts) => {
    throw new Error('Not implemented');
  },
  configDevServer: async (_opts) => {
    throw new Error('Not implemented');
  },
} as Bundler;
