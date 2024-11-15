import express from 'express';
import type { Config } from '../config/types';
import type { Mode } from '../types';

interface BundlerOpts {
  bundler: BundlerType;
}

export enum BundlerType {
  MAKO = 'mako',
  WEBPACK = 'webpack',
  VITE = 'vite',
}

export interface Bundler {
  build: (opts: BundlerBuildOptions) => Promise<void>;
  configDevServer: (opts: BundlerDevOptions) => Promise<void>;
}

export interface BundlerConfig {
  entry: Record<string, string>;
  mode: Mode;
  alias?: Config['alias'];
  externals?: Config['externals'];
  less?: Config['less'];
}

export interface BundlerBuildOptions {
  bundlerConfig: BundlerConfig;
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
    // TODO: why need double .default?
    if (opts.bundler === BundlerType.MAKO) {
      // @ts-expect-error
      return (await import('./bundler_mako.js')).default.default;
    } else if (opts.bundler === BundlerType.WEBPACK) {
      // @ts-expect-error
      return (await import('./bundler_webpack.js')).default.default;
    } else if (opts.bundler === BundlerType.VITE) {
      // @ts-expect-error
      return (await import('./bundler_vite.js')).default.default;
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
