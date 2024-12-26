import { expect, test } from 'vitest';
import { checkUnsupportedPackages } from './check_dependency.js';

test('checkUnsupportedPackages() - should throw error for monaco-editor', () => {
  expect(() =>
    checkUnsupportedPackages({
      pkg: {
        dependencies: {
          'monaco-editor': '^1.0.0',
        },
      },
    }),
  ).toThrow(
    '`monaco-editor` is not supported, please use `@monaco-editor/react` instead.',
  );

  expect(() =>
    checkUnsupportedPackages({
      pkg: {
        devDependencies: {
          'monaco-editor': '^1.0.0',
        },
      },
    }),
  ).toThrow(
    '`monaco-editor` is not supported, please use `@monaco-editor/react` instead.',
  );
});

test('checkUnsupportedPackages() - should throw error for old pdfjs-dist versions', () => {
  expect(() =>
    checkUnsupportedPackages({
      pkg: {
        dependencies: {
          'pdfjs-dist': '^1.0.0',
        },
      },
    }),
  ).toThrow(
    '`pdfjs-dist@1` or `pdfjs-dist@2` is not supported, please use `pdfjs-dist@3` or above instead.',
  );

  expect(() =>
    checkUnsupportedPackages({
      pkg: {
        dependencies: {
          'pdfjs-dist': '^2.9.0',
        },
      },
    }),
  ).toThrow(
    '`pdfjs-dist@1` or `pdfjs-dist@2` is not supported, please use `pdfjs-dist@3` or above instead.',
  );
});

test('checkUnsupportedPackages() - should pass for valid dependencies', () => {
  expect(() =>
    checkUnsupportedPackages({
      pkg: {
        dependencies: {
          '@monaco-editor/react': '^1.0.0',
          'pdfjs-dist': '^3.0.0',
        },
      },
    }),
  ).not.toThrow();

  expect(() =>
    checkUnsupportedPackages({
      pkg: {
        dependencies: {},
        devDependencies: {},
      },
    }),
  ).not.toThrow();
});
