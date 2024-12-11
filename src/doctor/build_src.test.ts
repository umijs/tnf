import path from 'pathe';
import { expect, test } from 'vitest';
import { buildSrc } from './build_src';

test('buildSrc', async () => {
  const entry = path.join(__dirname, 'fixtures/build_src/index.tsx');
  const ret = await buildSrc({ entry, alias: [] });
  expect(Object.keys(ret.modules).length).toEqual(4);
  expect(ret.pkgs).toEqual(['@ant-design/icons', 'foo', 'hoooo']);
});
