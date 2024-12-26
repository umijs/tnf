import { expect, test, vi } from 'vitest';
import { generatePathsFromAlias } from './write_types.js';

// Mock fs.statSync
vi.mock('fs', () => ({
  default: {
    statSync: vi.fn((path: string) => ({
      isDirectory: () => path.endsWith('dir'),
    })),
  },
}));

test('generatePathsFromAlias should generate correct paths configuration', () => {
  const alias: [string, string][] = [
    ['/components', '/project/root/src/components/dir'],
    ['@utils', '/project/root/src/utils/index.ts'],
    ['@config/', '/project/root/config/dir'],
  ];
  expect(generatePathsFromAlias('/project/root', alias)).toEqual({
    '/components': ['./src/components/dir'],
    '/components/*': ['./src/components/dir/*'],
    '@utils': ['./src/utils/index.ts'],
    '@config/': ['./config/dir'],
    '@config/*': ['./config/dir/*'],
  });
  expect(generatePathsFromAlias('/project/root/foo', alias)).toEqual({
    '/components': ['../src/components/dir'],
    '/components/*': ['../src/components/dir/*'],
    '@utils': ['../src/utils/index.ts'],
    '@config/': ['../config/dir'],
    '@config/*': ['../config/dir/*'],
  });
});
