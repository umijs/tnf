import type { Bundler } from './bundler';
import path from 'path';
import { pathToFileURL } from 'url';

export default {
  build: async (opts) => {
    const { bundlerConfig, cwd } = opts;
    try {
      // 直接定位到 vite 包的 ESM 入口
      const viteModulePath = pathToFileURL(
        path.join(cwd, 'node_modules', 'vite', 'dist', 'node', 'index.js')
      ).href;

      const { build } = await import(viteModulePath).catch((e) => {
        throw new Error('Failed to import Vite, please install first vite@^6');
      });

      // 转换 alias 格式
      const aliasConfig: Record<string, string> = {};
      if (bundlerConfig.alias?.length) {
        bundlerConfig.alias.forEach(([key, value]) => {
          aliasConfig[key] = value;
        });
      }

      await build({
        resolve: {
          alias: aliasConfig,
        },
        mode: bundlerConfig.mode,
        build: {
          rollupOptions: {
            output: {
              entryFileNames: '[name].js',
              chunkFileNames: '[name].css',
              assetFileNames: (assetInfo: any) => {
                if (assetInfo.name && /\.(js|css)$/.test(assetInfo.name)) {
                  return '[name].[ext]';
                }
                return '[name]-[hash].[ext]';
              }
            },
            input: bundlerConfig.entry,
          }
        },
        css: {
          preprocessorOptions: {
            less: bundlerConfig.less
          },
        },
      });
    } catch (err) {
      if (err instanceof Error && err.message.includes('Cannot find module')) {
        throw new Error('Failed to import Vite, please install first vite@^6');
      }
      throw err;
    }
  },
  configDevServer: async (_opts) => {
    throw new Error('Not implemented');
  },
} as Bundler;
