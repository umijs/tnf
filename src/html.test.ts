import fs from 'fs';
import path from 'pathe';
import { afterEach, beforeEach, expect, test, vi } from 'vitest';
import { buildHtml } from './html';
import { PluginHookType } from './plugin/plugin_manager';
import type { Context } from './types';

vi.mock('fs');
vi.mock('pathe');

const mockCwd = '/mock/cwd';
const mockHtmlPath = path.join(mockCwd, 'src', 'document.html');
const mockCustomHtml = `
<!doctype html>
<html>
  <head>
    <title>Custom HTML</title>
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>
`;

beforeEach(() => {
  vi.resetAllMocks();
  (path.join as any).mockImplementation((...args: string[]) => args.join('/'));
});

afterEach(() => {
  vi.clearAllMocks();
});

test('should use default HTML when document.html does not exist', async () => {
  (fs.existsSync as any).mockReturnValue(false);
  const mockContext: Context = {
    cwd: mockCwd,
    pluginManager: {
      apply: vi.fn().mockImplementation(({ memo }) => Promise.resolve(memo)),
    },
    pluginContext: {},
  } as any;
  const result = await buildHtml(mockContext);
  expect(result).toContain('<div id="root"></div>');
});

// test('should use custom HTML when document.html exists', async () => {
//   (fs.existsSync as any).mockReturnValue(true);
//   const mockContext: Context = {
//     cwd: mockCwd,
//     pluginManager: {
//       apply: vi.fn().mockImplementation(({ memo }) => Promise.resolve(memo)),
//     },
//     pluginContext: {},
//   } as any;
//   const result = await buildHtml(mockContext);
//   expect(result).toContain('<title>Custom HTML</title>');
// });

// test('should transform HTML through plugins', async () => {
//   (fs.existsSync as any).mockReturnValue(true);
//   (fs.readFileSync as any).mockReturnValue(mockCustomHtml);

//   const transformedHtml = '<transformed>html</transformed>';
//   const mockContext: Context = {
//     cwd: mockCwd,
//     pluginManager: {
//       apply: vi.fn().mockResolvedValue(transformedHtml),
//     },
//     pluginContext: { foo: 'bar' },
//   } as any;

//   const result = await buildHtml(mockContext);

//   expect(result).toBe(transformedHtml);
//   expect(mockContext.pluginManager.apply).toHaveBeenCalledWith({
//     hook: 'transformIndexHtml',
//     memo: mockCustomHtml,
//     args: [{ path: mockHtmlPath, filename: 'document.html' }],
//     pluginContext: { foo: 'bar' },
//     type: PluginHookType.SeriesLast,
//   });
// });
