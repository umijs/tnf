import { resolve } from 'pathe';
import sirv from 'sirv';
import { createServer } from './fishkit/server';
import { PluginHookType } from './plugin/plugin_manager';
import type { Context } from './types';

export async function preview({ context }: { context: Context }) {
  const devServer = context.config?.devServer || {};
  const { app } = await createServer({
    devServer,
    configureServer: () => {
      context.pluginManager.apply({
        hook: 'configureServer',
        args: [],
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
