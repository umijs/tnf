import path from 'pathe';
import { TNF_PKG } from '../constants';
import { sync as runSync } from '../sync/sync';
import type { Context } from '../types';
import { buildSrc } from './buildSrc';
import { checkPhantomDeps } from './checkPhantomDeps';
import { checkReactConflicts } from './checkPkg';

interface DoctorOptions {
  context: Context;
  sync?: boolean;
  verbose?: boolean;
}

export async function doctor(opts: DoctorOptions) {
  const { context, verbose = false, sync = false } = opts;
  if (sync) {
    await runSync({
      context,
    });
  }
  const buildSrcResult = await buildSrc({
    entry: path.join(context.paths.tmpPath, 'client-entry.tsx'),
    alias: context.config.alias || [],
    verbose,
  });
  const aliasKeys = context.config.alias?.map(([key]) => key) || [];
  checkPhantomDeps({
    usedPkgs: buildSrcResult.pkgs,
    exclude: Array.from(
      new Set([
        ...(context.config.doctor?.phantomDeps?.exclude || []),
        ...aliasKeys,
        TNF_PKG,
      ]),
    ),
    pkg: context.pkg,
  });
  checkReactConflicts({
    pkg: context.pkg,
    reactPath:
      context.config.alias?.find(([key]) => key === 'react')?.[1] || '',
    reactDomPath:
      context.config.alias?.find(([key]) => key === 'react-dom')?.[1] || '',
  });
}
