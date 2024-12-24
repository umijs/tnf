import { expect } from 'vitest';
import type { E2EContext } from '../../types';

export async function run(context: E2EContext) {
  const res = await fetch(`${context.origin}/api/foo`);
  const data = await res.json();
  console.log(data);
  throw new Error('Not implemented');
  expect(data).toEqual(['foo', 'xbar']);
}
