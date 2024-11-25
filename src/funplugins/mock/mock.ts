import type { Plugin } from '../../plugin/types';

interface MockOptions {
  paths: string[];
}

export function mock(opts: MockOptions): Plugin {
  return {
    name: 'mock',
    configureServer(server) {
      // server.middlewares.use(mockMiddleware(opts.paths));
    },
  };
}
