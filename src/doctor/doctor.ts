import path from 'pathe';
import * as logger from '../fishkit/logger.js';
import { sync as runSync } from '../sync/sync.js';
import type { Context } from '../types/index.js';
import { buildSrc } from './build_src.js';
import {
  checkReactConflicts,
  checkUnsupportedPackages,
} from './check_dependency.js';
import { checkPackageUsage } from './check_package_usage.js';
import { checkPhantomDeps } from './check_phantom_deps.js';

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
  checkUnsupportedPackages({
    pkg: context.pkg,
  });
}
