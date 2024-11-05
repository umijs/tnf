import assert from 'assert';
import { HttpResponse, http } from 'msw';

export const VALID_METHODS = [
  'GET',
  'POST',
  'PUT',
  'DELETE',
  'PATCH',
  'HEAD',
  'OPTIONS',
];
export const DEFAULT_METHOD = 'GET';
export const MOCK_FILE_GLOB = '**/*.[jt]s';

export interface IMock {
  method: string;
  path: string;
  handler: Function;
  file?: string;
}

function getMock(opts: { key: string; obj: any }): IMock {
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
    const [method = 'GET', path] = spliced;
    const upperCaseMethod = method.toUpperCase();
    assert(
      VALID_METHODS.includes(upperCaseMethod),
      `method ${method} is not supported`,
    );
    assert(path, `${key}, path is undefined`);

    return { method: upperCaseMethod, path };
  }
}

export const umimock2msw = (umiMock: any) => {
  const handlers = [];
  for (const key of Object.keys(umiMock)) {
    const mock = getMock({ key, obj: umiMock });
    if (typeof mock.handler === 'function') {
      // handler
      const upperCaseMethod = mock.method.toLowerCase();
      handlers.push(
        // @ts-ignore
        http[upperCaseMethod](mock.path, async ({ request }) => {
          const data = await request.json();
          // FIXME: 这里只是做了兼容
          const req = {
            body: data,
          };
          return mock.handler(req, HttpResponse);
        }),
      );
    } else {
      handlers.push(
        http.get(mock.path, () => {
          return HttpResponse.json(mock.handler);
        }),
      );
    }
  }
  return handlers;
};
