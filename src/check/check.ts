import type { Context } from '../types';
import { checkReactConflicts } from './checkPkg';

interface CheckOptions {
  context: Context;
}

export async function check(opts: CheckOptions) {
  const { context } = opts;
  checkReactConflicts({
    pkg: context.pkg,
    reactPath:
      context.config.alias?.find(([key]) => key === 'react')?.[1] || '',
    reactDomPath:
      context.config.alias?.find(([key]) => key === 'react-dom')?.[1] || '',
  });
}
