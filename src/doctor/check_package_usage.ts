import assert from 'assert';

export function checkPackageUsage(opts: { usedPkgs: string[] }) {
  const { usedPkgs } = opts;
  assert(
    !usedPkgs.includes('@tanstack/react-router'),
    '@tanstack/react-router should not be used, use @umijs/tnf/router instead',
  );
}
