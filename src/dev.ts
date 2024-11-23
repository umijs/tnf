import { build } from './build';
import { createBundler } from './bundler/bundler';
import { BundlerType } from './bundler/bundler';
import { createServer } from './fishkit/server';
import { PluginHookType } from './plugin/plugin_manager';
import type { Context } from './types';

export async function dev({ context }: { context: Context }) {
  const devServer = context.config?.devServer || {};
  const { port, host, server, app } = await createServer({
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
  const bundler = createBundler({ bundler: BundlerType.MAKO });
  await bundler.configDevServer({
    app,
    host,
    port,
    server,
  });
  await build({
    context,
    watch: true,
  });
}
