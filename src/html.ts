import assert from 'assert';
import fs from 'fs';
import path from 'pathe';
import { PluginHookType } from './plugin/plugin_manager';
import type { Context } from './types';

const DEFAULT_HTML = `
<!doctype html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title></title>
    <link rel="stylesheet" href="/client.css" />
  </head>
  <body>
    <div id="root"></div>
    <script src="/client.js"></script>
  </body>
</html>
`;

export async function buildHtml(ctx: Context) {
  const { cwd } = ctx;
  const publicIndexHtmlPath = path.join(cwd, 'public', 'index.html');
  assert(
    !fs.existsSync(publicIndexHtmlPath),
    `public/index.html is not allowed, please use src/index.html instead`,
  );
  // TODO: support index.ejs
  const htmlPath = path.join(cwd, 'src', 'index.html');
  const html = fs.existsSync(htmlPath)
    ? fs.readFileSync(htmlPath, 'utf-8')
    : DEFAULT_HTML;
  // TODO: support HtmlTagDescriptor[] & { html: string, tags: HtmlTagDescriptor[] }
  const result = await ctx.pluginManager.apply({
    hook: 'transformIndexHtml',
    memo: html,
    args: [{ path: htmlPath, filename: 'index.html' }],
    pluginContext: ctx.pluginContext,
    type: PluginHookType.SeriesLast,
  });
  return result;
}
