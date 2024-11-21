import { promises as fsp } from 'fs';
import * as path from 'path';
import { join } from 'pathe';

interface RouteInfo {
  filePath: string;
  importPath: string;
  routeName: string;
  routePath: string;
  parentRoute: string | null;
  isRoot: boolean;
  isIndex: boolean;
  isLayout: boolean;
  isLayoutIndependent: boolean;
  isSplat: boolean;
  params: string[];
}

interface GeneratorOptions {
  baseDir: string;
  srcDir?: string;
}

const getImportPath = (filePath: string, baseDir: string, srcDir: string): string => {
  return path.join(srcDir, path.relative(baseDir, filePath))
    .replace(/\\/g, '/');
};

const generateRouteName = (segments: string[]): string => {
  const base = segments
    .map((str) => {
      const ret = str
        // 1. 先处理参数标记
        .replace(/^\$/, '')
        // 2. 然后处理连字符
        .replace(/-([a-z])/g, (_, letter) => letter.toUpperCase())
        // 3. 先处理_.的情况，去掉_
        .replace(/_\./g, '.')
        // 4. 然后处理.后面的字符转大写
        .replace(/\.(\w)/g, (_, letter) => letter.toUpperCase())
        // 5. 去掉 group router，将()及其中的内容去掉
        .replace(/\(\w+\)/g, '')
      return ret
    })
    .join('');
  return `${base}Route`;
};

const generateRoutePath = (segments: string[]): string => {
  return segments
    .filter(s => !s.startsWith('_') && !s.startsWith('('))
    .map(s => {
      if (s === 'index') return '/';
      if (s.startsWith('$')) return s;
      return s.replace(/\./g, '/');
    })
    .join('/');
};

const determineParentRoute = (segments: string[], isLayoutIndependent: boolean): string | null => {
  if (isLayoutIndependent) return 'rootRoute';
  if (segments.length <= 1) return 'rootRoute';

  const parentSegments = segments.slice(0, -1);
  return generateRouteName(parentSegments);
};

const processRootRoute = (filePath: string, baseDir: string, srcDir: string): RouteInfo => ({
  filePath,
  importPath: getImportPath(filePath, baseDir, srcDir),
  routeName: 'rootRoute',
  routePath: '/',
  parentRoute: null,
  isRoot: true,
  isIndex: false,
  isLayout: false,
  isLayoutIndependent: false,
  isSplat: false,
  params: []
});

const parseRouteInfo = (segments: string[], filePath: string, baseDir: string, srcDir: string): RouteInfo => {
  const routeName = generateRouteName(segments);
  const routePath = generateRoutePath(segments);
  const isLayout = segments.some(s => s.startsWith('_'));
  const isLayoutIndependent = segments?.[segments.length - 1]?.endsWith('_') || false;
  const isIndex = segments[segments.length - 1] === 'index';
  const isSplat = segments[segments.length - 1] === '$';
  const params = segments.filter(s => s.startsWith('$')).map(s => s.slice(1));

  console.log({
    filePath,
    importPath: getImportPath(filePath, baseDir, srcDir),
    routeName,
    routePath,
    parentRoute: determineParentRoute(segments, isLayoutIndependent),
    isRoot: false,
    isIndex,
    isLayout,
    isLayoutIndependent,
    isSplat,
    params
  })

  return {
    filePath,
    importPath: getImportPath(filePath, baseDir, srcDir),
    routeName,
    routePath,
    parentRoute: determineParentRoute(segments, isLayoutIndependent),
    isRoot: false,
    isIndex,
    isLayout,
    isLayoutIndependent,
    isSplat,
    params
  };
};

const processFile = async (filePath: string, baseDir: string, srcDir: string): Promise<RouteInfo | null> => {
  const relativePath = path.relative(baseDir, filePath);
  const parsedPath = path.parse(relativePath);
  const routeSegments = parsedPath.dir.split(path.sep).concat(parsedPath.name);

  if (parsedPath.name === '__root') {
    return processRootRoute(filePath, baseDir, srcDir);
  }

  return parseRouteInfo(routeSegments, filePath, baseDir, srcDir);
};

const scanDirectory = async (dir: string, baseDir: string, srcDir: string): Promise<RouteInfo[]> => {
  const entries = await fsp.readdir(dir, { withFileTypes: true });
  const routePromises = entries.map(async entry => {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      return scanDirectory(fullPath, baseDir, srcDir);
    }

    if (entry.isFile() && entry.name.endsWith('.tsx')) {
      const route = await processFile(fullPath, baseDir, srcDir);
      return route ? [route] : [];
    }

    return [];
  });

  const routeArrays = await Promise.all(routePromises);
  return routeArrays.flat();
};

const generateImports = (routes: RouteInfo[]): string[] => {
  const getComponentName = (route: RouteInfo): string =>
    route.routeName.replace(/Route$/, 'Component');

  return [
    "import { createRootRoute, createRoute } from '@tanstack/react-router'",
    '',
    ...routes.map(route =>
      `import ${getComponentName(route)} from '${route.importPath}'`
    )
  ];
};

const generateRouteDefinitions = (routes: RouteInfo[]): string[] => {
  const getComponentName = (route: RouteInfo): string =>
    route.routeName.replace(/Route$/, 'Component');

  return routes.map(route => {
    if (route.isRoot) {
      return [
        `const ${route.routeName} = createRootRoute({`,
        `  component: ${getComponentName(route)}`,
        `})`
      ].join('\n');
    }

    const definition = [
      `const ${route.routeName} = createRoute({`,
      `  getParentRoute: () => ${route.parentRoute},`,
      `  path: '${route.routePath}',`,
      `  component: ${getComponentName(route)}`
    ];

    if (route.isSplat) {
      definition.push(`  validateSearch: (search: Record<string, unknown>) => ({`,
        `    _splat: search._splat as string`,
        `  })`);
    }

    definition.push(`})`);
    return definition.join('\n');
  });
};

const generateRouteTree = (routes: RouteInfo[]): string => {
  const rootRoute = routes.find(r => r.isRoot);
  if (!rootRoute) return '';

  const childRoutes = routes
    .filter(r => r.parentRoute === 'rootRoute' && !r.isRoot)
    .map(r => r.routeName);

  return [
    'export const routeTree = rootRoute.addChildren([',
    `  ${childRoutes.join(',\n  ')}`,
    '])'
  ].join('\n');
};

const generateRouterCode = (routes: RouteInfo[]): string => {
  const imports = generateImports(routes);
  const routeDefinitions = generateRouteDefinitions(routes);
  const routeTree = generateRouteTree(routes);

  return [
    imports.join('\n'),
    '',
    routeDefinitions.join('\n\n'),
    '',
    routeTree
  ].join('\n');
};

export const generateTanStackRouter = async ({ baseDir, srcDir = './../src/pages' }: GeneratorOptions): Promise<string> => {
  try {
    const routes = await scanDirectory(baseDir, baseDir, srcDir);
    return generateRouterCode(routes);
  } catch (error) {
    console.error('Error generating router code:', error);
    throw error;
  }
};

export const generateRouter = async (tmpPath: string) => {
  try {
    const routerCode = await generateTanStackRouter({
      baseDir: 'src/pages'
    });
    await fsp.writeFile(join(tmpPath, 'routes.tsx'), routerCode);
    console.log('Router code generated successfully!');
  } catch (error) {
    console.error('Failed to generate router code:', error);
  }
};
