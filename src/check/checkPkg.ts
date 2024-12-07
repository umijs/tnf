import assert from 'assert';
import path from 'pathe';
import type { Pkg } from '../types';

export function checkReactConflicts(opts: {
  pkg: Pkg;
  reactPath: string;
  reactDomPath: string;
}) {
  const { pkg, reactPath, reactDomPath } = opts;
  const reactVersion = require(path.join(reactPath, 'package.json')).version;
  const reactDomVersion = require(
    path.join(reactDomPath, 'package.json'),
  ).version;
  const reactMajorVersion = reactVersion.split('.')[0];
  const reactDomMajorVersion = reactDomVersion.split('.')[0];
  assert(
    reactMajorVersion === reactDomMajorVersion,
    'react and react-dom have different major versions',
  );

  const { dependencies, devDependencies } = pkg;
  const reactTypesVersion =
    dependencies?.['@types/react'] || devDependencies?.['@types/react'];
  const reactDomTypesVersion =
    dependencies?.['@types/react-dom'] || devDependencies?.['@types/react-dom'];
  if (reactTypesVersion && reactDomTypesVersion) {
    const reactTypesMajorVersion = reactTypesVersion.split('.')[0];
    const reactDomTypesMajorVersion = reactDomTypesVersion.split('.')[0];
    assert(
      reactTypesMajorVersion === reactDomTypesMajorVersion,
      'react and react-dom have different @types major versions',
    );
    assert(
      reactTypesMajorVersion === reactMajorVersion,
      'react and @types/react have different major versions',
    );
  }
}
