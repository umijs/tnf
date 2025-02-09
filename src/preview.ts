import { resolve } from 'pathe';
import sirv from 'sirv';
import { createServer } from './fishkit/server.js';
import { PluginHookType } from './plugin/plugin_manager.js';
import type { Context } from './types/index.js';

export async function preview({ context }: { context: Context }) {
  const devServer = context.config?.devServer || {};
  const { app } = await createServer({
    devServer,
    configureServer: (server) => {
      context.pluginManager.apply({
        hook: 'configureServer',
        args: [server],
        type: PluginHookType.Series,
        pluginContext: context.pluginContext,
      });
    },
  });
  const distDir = resolve(context.cwd, 'dist');

  app.use(
    '/',
    sirv(distDir, {
      etag: true,
      dev: true,
      single: true,
    }),
  );
}
