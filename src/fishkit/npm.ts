import { sync } from 'cross-spawn';
import { existsSync, readFileSync } from 'fs';
import path from 'pathe';

export type NpmClient = 'npm' | 'cnpm' | 'tnpm' | 'yarn' | 'pnpm';

export const getNpmClient = (opts: { cwd: string }): NpmClient => {
  const tnpmRegistries = ['.alibaba-inc.', '.antgroup-inc.'];
  const tcnpmLockPath = path.join(
    opts.cwd,
    'node_modules',
    '.package-lock.json',
  );

  // 检查 tcnpm lock 文件
  if (existsSync(tcnpmLockPath)) {
    const tcnpmLock = readFileSync(tcnpmLockPath, 'utf-8');
    return tnpmRegistries.some((r) => tcnpmLock.includes(r)) ? 'tnpm' : 'cnpm';
  }

  // 检查 pnpm
  const chokidarPath = require.resolve('chokidar');
  if (
    chokidarPath.includes('.pnpm') ||
    existsSync(path.join(opts.cwd, 'node_modules', '.pnpm'))
  ) {
    return 'pnpm';
  }

  // 检查 yarn
  if (
    existsSync(path.join(opts.cwd, 'yarn.lock')) ||
    existsSync(path.join(opts.cwd, 'node_modules', '.yarn-integrity'))
  ) {
    return 'yarn';
  }

  // 默认使用 npm
  return 'npm';
};

export const installWithNpmClient = ({
  npmClient,
  cwd,
}: {
  npmClient: NpmClient;
  cwd?: string;
}): void => {
  const { NODE_ENV: _, ...env } = process.env;
  const npm = sync(npmClient, [npmClient === 'yarn' ? '' : 'install'], {
    stdio: 'inherit',
    cwd,
    env,
  });
  if (npm.error) {
    throw npm.error;
  }
};
