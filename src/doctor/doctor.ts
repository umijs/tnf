import path from 'pathe';
import * as logger from '../fishkit/logger';
import { sync as runSync } from '../sync/sync';
import type { Context } from '../types';
import { buildSrc } from './buildSrc';
import { checkPackageUsage } from './checkPackageUsage';
import { checkPhantomDeps } from './checkPhantomDeps';
import { checkReactConflicts } from './checkPkg';

interface DoctorOptions {
  context: Context;
  sync?: boolean;
}

export async function doctor(opts: DoctorOptions) {
  const { context, sync = false } = opts;

  if (sync) {
    await runSync({
      context,
    });
  }

  const buildSrcResultStart = new Date();
  const buildSrcResult = await buildSrc({
    entry: path.join(context.paths.tmpPath, 'client-entry.tsx'),
    alias: context.config.alias || [],
  });
  logger.debug(
    `buildSrc took ${new Date().getTime() - buildSrcResultStart.getTime()}ms`,
  );

  // TODO: don't check when using pnpm
  const aliasKeys = context.config.alias?.map(([key]) => key) || [];
  checkPhantomDeps({
    usedPkgs: buildSrcResult.pkgs,
    exclude: Array.from(
      new Set([
        ...(context.config.doctor?.phantomDeps?.exclude || []),
        ...aliasKeys,
      ]),
    ),
    pkg: context.pkg,
  });
  checkPackageUsage({
    usedPkgs: buildSrcResult.pkgs,
  });
  checkReactConflicts({
    pkg: context.pkg,
    reactPath:
      context.config.alias?.find(([key]) => key === 'react')?.[1] || '',
    reactDomPath:
      context.config.alias?.find(([key]) => key === 'react-dom')?.[1] || '',
  });
}
