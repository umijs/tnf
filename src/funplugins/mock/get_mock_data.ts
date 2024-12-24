import assert from 'assert';
import { glob } from 'glob';
import path from 'pathe';
import type { Mock, MockOptions } from './types';

const DEFAULT_METHOD = 'GET';
const VALID_METHODS = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'];

export function getMockData(opts: MockOptions) {
  const files = opts.paths.reduce<string[]>((acc, mockPath) => {
    const isPattern = mockPath.includes('*');
    const pattern = isPattern
      ? mockPath
      : `${mockPath.replace(/\*$/g, '')}/**/*.[jt]s`;
    acc.push(
      ...glob.sync(pattern, {
        cwd: opts.cwd,
        ignore: [
          '**/*.d.ts',
          '**/*.test.ts',
          '**/*.spec.ts',
          ...(opts.ignore || []),
        ],
      }),
    );
    return acc;
  }, []);

  const data: Record<string, Mock> = {};
  for (const file of files) {
    assert(!file.endsWith('.ts'), `.ts file is not supported in mock yet`);
    let absFile = path.resolve(opts.cwd, file);
    let m;
    try {
      delete require.cache[absFile];
      m = require(absFile);
    } catch (err) {
      throw new Error(`Error loading mock data from ${absFile}: ${err}`);
    }
    m = m?.default || m || {};
    for (const key of Object.keys(m)) {
      const mock = getMock({ key, obj: m });
      mock.file = absFile;
      const id = `${mock.method} ${mock.path}`;
      // Mock handler must be function or array or object
      assert(
        typeof mock.handler === 'function' ||
          Array.isArray(mock.handler) ||
          typeof mock.handler === 'object',
        `Mock handler must be function or array or object`,
      );
      // Check duplicate
      if (data[id]) {
        throw new Error(`Duplicate mock id: ${id}`);
      }
      data[id] = mock;
    }
  }
  return data;
}

function getMock(opts: { key: string; obj: any }): Mock {
  const { method, path } = parseKey(opts.key);
  const handler = opts.obj[opts.key];
  return { method, path, handler };
}

function parseKey(key: string) {
  const spliced = key.split(/\s+/);
  const len = spliced.length;
  if (len === 1) {
    return { method: DEFAULT_METHOD, path: key };
  } else {
    const [method, path] = spliced;
    const upperCaseMethod = method!.toUpperCase();
    assert(
      VALID_METHODS.includes(upperCaseMethod),
      `method ${method} is not supported`,
    );
    assert(path, `${key}, path is undefined`);
    return { method: upperCaseMethod, path };
  }
}
