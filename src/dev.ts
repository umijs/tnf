import { build } from './build.js';
import { createBundler } from './bundler/bundler.js';
import { BundlerType } from './bundler/bundler.js';
import { createServer } from './fishkit/server.js';
import { buildHtml } from './html.js';
import { PluginHookType } from './plugin/plugin_manager.js';
import type { Context } from './types/index.js';

export async function dev({ context }: { context: Context }) {
  const devServer = context.config?.devServer || {};
  if (process.env.PORT) {
    devServer.port = parseInt(process.env.PORT);
  }
  if (process.env.HOST) {
    devServer.host = process.env.HOST;
  }
  const { port, host, server, app } = await createServer({
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
  const bundler = createBundler({ bundler: BundlerType.MAKO });
  app.use(async (req, res, next) => {
    if (req.url === '/') {
      const html = await buildHtml(context);
      res.send(html);
    }
    next();
  });
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
