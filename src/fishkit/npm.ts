import { sync } from 'cross-spawn';
import { existsSync, readFileSync } from 'fs';
import fs from 'fs-extra';
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

type Dependencies = Record<string, string>;

interface PackageJson {
  dependencies?: Dependencies;
  devDependencies?: Dependencies;
  [key: string]: unknown;
}

interface PackageManagerOptions {
  cwd: string;
}

export class PackageManager {
  private cwd: string;
  private packageJson: PackageJson;
  private packageJsonPath: string;

  constructor(options: PackageManagerOptions) {
    const { cwd } = options;
    this.cwd = cwd;
    this.packageJsonPath = path.join(cwd, 'package.json');
    this.packageJson = this.readPackageJson();
  }

  private readPackageJson(): PackageJson {
    try {
      return fs.readJSONSync(this.packageJsonPath);
    } catch (error) {
      throw new Error(`Failed to read package.json: ${error}`);
    }
  }

  private async writePackageJson(): Promise<void> {
    try {
      await fs.writeJSON(this.packageJsonPath, this.packageJson, { spaces: 2 });
    } catch (error) {
      throw new Error(`Failed to write package.json: ${error}`);
    }
  }

  public addDeps(deps: Dependencies): void {
    if (!this.packageJson.dependencies) {
      this.packageJson.dependencies = {};
    }

    Object.entries(deps).forEach(([name, version]) => {
      this.packageJson.dependencies![name] = version;
    });
  }

  public addDevDeps(deps: Dependencies): void {
    if (!this.packageJson.devDependencies) {
      this.packageJson.devDependencies = {};
    }

    Object.entries(deps).forEach(([name, version]) => {
      this.packageJson.devDependencies![name] = version;
    });
  }

  public async installDeps(): Promise<void> {
    try {
      await this.writePackageJson();

      const npmClient = getNpmClient({ cwd: this.cwd });
      await installWithNpmClient({
        npmClient,
      });

      console.info(`Dependencies installed with ${npmClient}`);
    } catch (error) {
      throw new Error(`Failed to install dependencies: ${error}`);
    }
  }

  public getDependencies(): Dependencies {
    return this.packageJson.dependencies || {};
  }

  public getDevDependencies(): Dependencies {
    return this.packageJson.devDependencies || {};
  }

  public hasDependency(name: string): boolean {
    const deps = this.getDependencies();
    const devDeps = this.getDevDependencies();
    return name in deps || name in devDeps;
  }
}
