import assert from 'assert';
import type { Pkg } from '../types/index.js';

export function checkPhantomDeps(opts: {
  usedPkgs: string[];
  exclude: string[];
  pkg: Pkg;
}) {
  const { usedPkgs, exclude, pkg } = opts;
  const { dependencies, devDependencies } = pkg;
  const deps = new Set([
    ...Object.keys(dependencies || {}),
    ...Object.keys(devDependencies || {}),
  ]);
  const phantomDeps = new Set<string>();
  for (const usedPkg of usedPkgs) {
    if (!exclude.includes(usedPkg) && !deps.has(usedPkg)) {
      phantomDeps.add(usedPkg);
    }
  }
  assert(
    phantomDeps.size === 0,
    `Phantom dependencies found: ${Array.from(phantomDeps).join(', ')}`,
  );
}
