import fs from 'fs-extra';
import path from 'pathe';
import { getNpmClient, installWithNpmClient } from '../fishkit/npm';

type Dependencies = Record<string, string>;

interface PackageJson {
  dependencies?: Dependencies;
  devDependencies?: Dependencies;
  [key: string]: unknown;
}

interface GeneratorHelperOptions {
  cwd: string;
}

export default class GeneratorHelper {
  private cwd: string;
  private packageJson: PackageJson;
  private packageJsonPath: string;

  constructor(options: GeneratorHelperOptions) {
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
