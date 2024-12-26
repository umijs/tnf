import assert from 'assert';
import enhancedResolve from 'enhanced-resolve';
import { init, parse } from 'es-module-lexer';
import esbuild from 'esbuild';
import fs from 'fs';
import path from 'pathe';
import * as logger from '../fishkit/logger.js';

interface BuildSrcOptions {
  entry: string;
  alias: [string, string][];
}

export async function buildSrc(opts: BuildSrcOptions) {
  const { entry, alias } = opts;
  const aliasMap = alias.reduce<Record<string, string>>((acc, [key, value]) => {
    acc[key] = value;
    return acc;
  }, {});
  const aliasKeys = Object.keys(aliasMap);
  const queue = [];
  queue.push(entry);
  await init;
  const { CachedInputFileSystem, ResolverFactory } = enhancedResolve;
  const resolver = ResolverFactory.createResolver({
    fileSystem: new CachedInputFileSystem(fs, 4000),
    extensions: ['.tsx', '.ts', '.jsx', '.js', '.json'],
    alias: aliasMap,
  });
  const modules: Record<
    string,
    { imports: any; exports: any; content: string; pkgs: string[] }
  > = {};
  const pkgs = new Set<string>();
  while (queue.length) {
    const file = queue.shift()!;
    logger.debug('file', file);
    const content = fs.readFileSync(file, 'utf-8');
    const loader = file.endsWith('.tsx') ? 'tsx' : 'ts';
    const { imports, exports } = parseFile(content, loader);
    const data = {
      imports,
      exports,
      content,
      pkgs: [],
    };
    modules[file] = data;
    for (const imp of imports) {
      if (imp.n) {
        const n = imp.n;
        logger.debug(
          '  > n',
          n,
          n.includes('node_modules'),
          isStartWithNpmPackage(n),
          !isJsOrTs(n),
        );
        // TODO:  aliased path should be resolved with enhanced-resolve
        // if (!isAliased(n, aliasKeys)) {
        if (n.includes('node_modules')) {
          continue;
        }
        if (isStartWithNpmPackage(n)) {
          const pkgName = n.startsWith('@')
            ? n.split('/').slice(0, 2).join('/')
            : n.split('/')[0];
          assert(pkgName, `pkgName parse failed from ${n}`);
          pkgs.add(pkgName);
          continue;
        }
        if (!isJsOrTs(n)) {
          continue;
        }
        // }
        const resolved = await (() => {
          return new Promise<string | null>((resolve, reject) => {
            resolver.resolve(
              {},
              path.dirname(file),
              imp.n!,
              {},
              (err, filePath) => {
                if (err) {
                  reject(err);
                } else {
                  resolve(filePath || null);
                }
              },
            );
          });
        })();
        if (resolved && !resolved.includes('node_modules')) {
          queue.push(resolved);
        }
      }
    }
  }
  return { modules, pkgs: Array.from(pkgs) };
}

function parseFile(content: string, loader: 'tsx' | 'ts') {
  // const stripped = amaro.transformSync(content);
  const stripped = esbuild.transformSync(content, {
    loader,
  }).code;
  const [imports, exports] = parse(stripped);
  return {
    imports,
    exports,
  };
}

function isAbsolute(n: string) {
  const isWin = process.platform === 'win32';
  return n.charAt(0) === '/' || (isWin && /^[a-zA-Z]:/.test(n));
}

function isAliased(n: string, aliasKeys: string[]) {
  return aliasKeys.some((key) => n.startsWith(key));
}

function isStartWithNpmPackage(n: string) {
  return /^@[a-zA-Z]/.test(n) || /^[a-zA-Z]/.test(n);
}

function isJsOrTs(n: string) {
  const extname = path.extname(n);
  if (extname === '') {
    return true;
  }
  if (
    [
      '.css',
      '.less',
      '.sass',
      '.scss',
      '.styl',
      '.stylus',
      '.json',
      '.html',
      '.htm',
      '.xml',
      '.svg',
      '.png',
      '.jpg',
      '.jpeg',
      '.gif',
      '.ico',
      '.webp',
      '.bmp',
      '.tiff',
    ].includes(extname)
  ) {
    return false;
  }
  return true;
}
