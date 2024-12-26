import fs from 'fs';
import path from 'pathe';
import { expect, test } from 'vitest';
import { reactCompiler } from './react_compiler.js';

test('should compile react code', async () => {
  const plugin = reactCompiler({});
  const transform = plugin.configureBundler!()[0]!.transform!;
  const filePath = path.join(__dirname, 'fixtures/normal.tsx');
  const content = fs.readFileSync(filePath, 'utf-8');
  const result = await transform(content, filePath);
  expect(result).toBeDefined();
  expect(result?.content).toBeDefined();
  expect(result?.type).toBe('tsx');
  expect(result?.content).toContain('Symbol.for("react.memo_cache_sentinel")');
  expect(result?.content).toContain('react/compiler-runtime');
});
