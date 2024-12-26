import { expect, test } from 'vitest';
import type { Pkg } from '../types/index.js';
import { checkPhantomDeps } from './check_phantom_deps.js';

test('checkPhantomDeps - no phantom dependencies', () => {
  const pkg: Pkg = {
    dependencies: {
      'pkg-a': '^1.0.0',
      'pkg-b': '^2.0.0',
    },
    devDependencies: {
      'pkg-c': '^3.0.0',
    },
  };

  expect(() =>
    checkPhantomDeps({
      usedPkgs: ['pkg-a', 'pkg-b', 'pkg-c'],
      exclude: [],
      pkg,
    }),
  ).not.toThrow();
});

test('checkPhantomDeps - with excluded packages', () => {
  const pkg: Pkg = {
    dependencies: {
      'pkg-a': '^1.0.0',
    },
  };

  expect(() =>
    checkPhantomDeps({
      usedPkgs: ['pkg-a', 'pkg-b'],
      exclude: ['pkg-b'],
      pkg,
    }),
  ).not.toThrow();
});

test('checkPhantomDeps - with phantom dependencies', () => {
  const pkg: Pkg = {
    dependencies: {
      'pkg-a': '^1.0.0',
    },
  };

  expect(() =>
    checkPhantomDeps({
      usedPkgs: ['pkg-a', 'pkg-b', 'pkg-c'],
      exclude: [],
      pkg,
    }),
  ).toThrow('Phantom dependencies found: pkg-b, pkg-c');
});

test('checkPhantomDeps - with empty dependencies', () => {
  const pkg: Pkg = {};

  expect(() =>
    checkPhantomDeps({
      usedPkgs: ['pkg-a'],
      exclude: [],
      pkg,
    }),
  ).toThrow('Phantom dependencies found: pkg-a');
});
