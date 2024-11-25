import type { Plugin } from '../../plugin/types';
import { createMockMiddleware } from './createMockMiddleware';
import { getMockData } from './getMockData';
import type { MockOptions } from './types';

export function mock(opts: MockOptions): Plugin {
  return {
    name: 'mock',
    configureServer(server) {
      const mocks = getMockData(opts);
      server.middlewares.use(
        createMockMiddleware({
          mocks,
        }),
      );
    },
  };
}
