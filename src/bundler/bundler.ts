import express from 'express';
import type { Config } from '../config/types.js';
import type { Mode } from '../types/index.js';

interface BundlerOpts {
  bundler: BundlerType;
}

export enum BundlerType {
  MAKO = 'mako',
  WEBPACK = 'webpack',
}

export interface Bundler {
  build: (opts: BundlerBuildOptions) => Promise<any[]>;
  configDevServer: (opts: BundlerDevOptions) => Promise<void>;
}

export interface BundlerConfig {
  clean?: boolean;
  entry: Record<string, string>;
  mode: Mode;
  platform?: 'node' | 'browser';
  alias?: Config['alias'];
  externals?: Config['externals'];
  less?: Config['less'];
  publicPath?: Config['publicPath'];
  unplugins?: any[];
}

export interface BundlerBuildOptions {
  bundlerConfigs: BundlerConfig[];
  cwd: string;
  watch?: boolean;
}

export interface BundlerDevOptions {
  port: number;
  host: string;
  server: any;
  app: express.Application;
}

export function createBundler(opts: BundlerOpts): Bundler {
  async function getBundler() {
    if (opts.bundler === BundlerType.MAKO) {
      return (await import('./bundler_mako.js')).default;
    } else if (opts.bundler === BundlerType.WEBPACK) {
      return (await import('./bundler_webpack.js')).default;
    } else {
      throw new Error(`Unsupported bundler ${opts.bundler}`);
    }
  }

  return {
    build: async (opts: BundlerBuildOptions) => {
      const bundler = await getBundler();
      return await bundler.build(opts);
    },
    configDevServer: async (opts: BundlerDevOptions) => {
      const bundler = await getBundler();
      return await bundler.configDevServer(opts);
    },
  };
}
