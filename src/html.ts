import assert from 'assert';
import ejs from 'ejs';
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
  </head>
  <body>
    <div id="<%= config.mountElementId %>"></div>
  </body>
</html>
`;

export async function buildHtml(ctx: Context, stat?: any) {
  stat = stat || {};
  const css = buildAsset('client', 'css', ctx, stat);
  const js = buildAsset('client', 'js', ctx, stat);
  const { cwd } = ctx;
  const publicIndexHtmlPath = path.join(cwd, 'public', 'index.html');
  assert(
    !fs.existsSync(publicIndexHtmlPath),
    `public/index.html is not allowed, please use src/index.html instead`,
  );
  const htmlPath = path.join(cwd, 'src', 'index.html');
  let html = fs.existsSync(htmlPath)
    ? fs.readFileSync(htmlPath, 'utf-8')
    : DEFAULT_HTML;
  html = await ejs.render(html, {
    config: ctx.config,
  });
  assert(html.includes('</head>'), 'html must contain </head>');
  assert(html.includes('</body>'), 'html must contain </body>');
  html = html.replace('</head>', `${css}</head>`);
  html = html.replace('</body>', `${js}</body>`);
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

function buildAsset(
  name: string,
  type: 'js' | 'css',
  ctx: Context,
  stat: Record<string, any>,
) {
  const publicPath = ctx.config.publicPath || '/';
  const asset = Object.keys(stat).find(
    (key) => key.startsWith(`${name}.`) && key.endsWith(`.${type}`),
  );
  if (!asset) return '';
  return type === 'css'
    ? `<link rel="stylesheet" href="${publicPath}${asset}" />`
    : `<script src="${publicPath}${asset}"></script>`;
}
