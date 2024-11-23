import { promises as fsp } from 'fs';
import * as path from 'path';
import { join } from 'pathe';

let rootRoute: RouteInfo | null = null;

// 不需要生成path的route
const NOT_NEED_PATH = Symbol('NOT_NEED_PATH');

interface BaseRouteInfo {
  filePath: string;
  importPath: string;
  routeName: string;
  isRoot: boolean;
  isIndex: boolean;
  isLayout: boolean;
  isLayoutIndependent: boolean;
  isSplat: boolean;
  routeSegments: string[];
}

interface RouteInfo extends BaseRouteInfo {
  routePath: string | null;
  // 为了方便生成createRoute
  parentRoute: RouteInfo | null;
}

interface RouteInfoTree extends RouteInfo {
  childrenRoute: RouteInfoTree[];
}

interface GeneratorOptions {
  baseDir: string;
  srcDir?: string;
}

const removeExt = (path: string) => {
  return path.replace(/\.[^/.]+$/, '');
};

const convertPathToName = (pathArray: string[]) => {
  return pathArray.map((part: string) => {
    // 检查是否为文件名（包含扩展名）
    let str = part;
    if (part.includes('.tsx') || part.includes('.jsx')) {
      const parts = part.split('.');
      parts.pop();
      str = parts.join('');
    }
    return (
      str
        // 处理 _前缀
        .replace(/^_(.)/g, (_, c) => c.toUpperCase())
        // // 处理 _后缀
        // .replace(/_$/g, '')
        // 处理中间的_
        .replace(/(_)(.)/g, (_, __, c) => c.toUpperCase())
        // // 处理 $前缀
        // .replace(/^\$(.)/g, (_, c) => c.toUpperCase())
        // 处理连字符
        .replace(/-(.)/g, (_, c) => c.toUpperCase())
        // 处理括号
        .replace(/[()]/g, '')
        // 确保首字母大写
        .replace(/^(.)/, (c) => c.toUpperCase())
    );
  });
};

const getImportPath = (
  filePath: string,
  baseDir: string,
  srcDir: string,
): string => {
  return path
    .join(srcDir, path.relative(baseDir, filePath))
    .replace(/\\/g, '/');
};

const generateRouteName = (segments: string[]): string => {
  const base = convertPathToName(segments).join('');
  return `${base}Import`;
};

const processRootRoute = (
  filePath: string,
  baseDir: string,
  srcDir: string,
): RouteInfo => ({
  filePath,
  importPath: getImportPath(filePath, baseDir, srcDir),
  routeName: 'rootRouteImport',
  routePath: '/',
  parentRoute: null,
  isRoot: true,
  isIndex: false,
  isLayout: false,
  isLayoutIndependent: false,
  isSplat: false,
  routeSegments: ['__root.tsx'],
});

const getRouteType = (
  filePath?: string,
): {
  isIndex: boolean;
  isSplat: boolean;
  isLayoutIndependent: boolean;
  isLayout: boolean;
  isGroup: boolean;
  isRoot: boolean;
} => {
  const isIndex = filePath === 'index';
  const isSplat = filePath === '$';
  const isLayoutIndependent = filePath?.endsWith('_') || false;
  const isLayout = filePath?.startsWith('_') || false;
  const isGroup =
    (filePath?.startsWith('(') && filePath?.endsWith(')')) || false;
  const isRoot = filePath === '__root';

  return {
    isIndex,
    isSplat,
    isLayoutIndependent,
    isLayout,
    isGroup,
    isRoot,
  };
};

const parseRouteInfo = (
  segments: string[],
  filePath: string,
  baseDir: string,
  srcDir: string,
): BaseRouteInfo => {
  const routeName = generateRouteName(segments);
  const { isIndex, isSplat, isLayoutIndependent, isLayout } = getRouteType(
    segments[segments.length - 1],
  );

  return {
    filePath,
    importPath: getImportPath(filePath, baseDir, srcDir),
    routeName,
    isRoot: false,
    isIndex,
    isLayout,
    isLayoutIndependent,
    isSplat,
    routeSegments: segments,
  };
};

const fileNameToSegments = (filename: string): string[] | null => {
  // 忽略以 . 或 - 开头的文件
  if (filename.startsWith('.') || filename.startsWith('-')) {
    return null;
  }

  // 获取文件扩展名
  const ext = /\.(tsx|jsx)$/.exec(filename)?.[0];
  if (!ext) {
    return null;
  }

  // 首先处理连续的点号
  let processedName = filename.replace(/\.{2,}/g, '.');

  // 然后移除扩展名
  let name = processedName.slice(0, -ext.length);

  // 如果没有点号，说明是普通文件名
  if (!name.includes('.')) {
    return [processedName];
  }

  // 将点号分割 把扩展名加回去
  const segments = name.split('.');
  segments[segments.length - 1] = segments[segments.length - 1] + ext;
  return segments;
};

const processFile = async (
  filePath: string,
  baseDir: string,
  srcDir: string,
): Promise<BaseRouteInfo | null> => {
  const relativePath = path.relative(baseDir, filePath);
  const parsedPath = path.parse(relativePath);

  // 不允许文件作为路由组
  if (getRouteType(parsedPath.name).isGroup) {
    throw new Error(`this file ${parsedPath.name} is not supported`);
  }

  const baseSegments = fileNameToSegments(parsedPath.base);
  if (!baseSegments) return null;
  const routeSegments = parsedPath.dir.split(path.sep).concat(baseSegments);

  // 如果第一个元素为空，代表路径为 baseDir/xxx.tsx
  if (routeSegments[0] === '') {
    routeSegments.shift();
  }

  if (parsedPath.name === '__root') {
    rootRoute = processRootRoute(filePath, baseDir, srcDir);
    return rootRoute;
  }

  return parseRouteInfo(routeSegments, filePath, baseDir, srcDir);
};

const scanDirectory = async (
  dir: string,
  baseDir: string,
  srcDir: string,
): Promise<BaseRouteInfo[]> => {
  const entries = await fsp.readdir(dir, { withFileTypes: true });
  const routesPromises = entries.map(async (entry) => {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      return await scanDirectory(fullPath, baseDir, srcDir);
    }

    if (entry.isFile() && entry.name.endsWith('.tsx')) {
      const baseRoute = await processFile(fullPath, baseDir, srcDir);
      return baseRoute ? [baseRoute] : [];
    }

    return [];
  });

  const routeArrays = (await Promise.all(routesPromises)).flat();
  return routeArrays;
};

type BaseRouteInfoWithParent = BaseRouteInfo & {
  parentRoute: BaseRouteInfo | null;
};

const determineParentRoute = (
  baseRoutes: BaseRouteInfo[],
  route: BaseRouteInfo,
): BaseRouteInfoWithParent => {
  if (route.routeSegments.length === 1) {
    if (route.isRoot) {
      return {
        ...route,
        parentRoute: null,
      };
    }
    return {
      ...route,
      parentRoute: rootRoute,
    };
  }

  // 倒序遍历routeSegments
  for (let i = route.routeSegments.length - 1; i >= 0; i--) {
    const currentSegments = route.routeSegments.slice(0, i);
    const lastSegment = currentSegments[currentSegments.length - 1];

    //  Non-Nested Routes 不能作为父路由 直接跳过
    const { isLayoutIndependent } = getRouteType(lastSegment);
    if (isLayoutIndependent) {
      continue;
    }

    const parentRoute = baseRoutes.find(
      (r) =>
        r.routeSegments.join('/') === currentSegments.join('/') + '.tsx' ||
        r.routeSegments.join('/') === currentSegments.join('/') + '.jsx',
    );
    if (parentRoute) {
      return {
        ...route,
        parentRoute,
      };
    }
  }

  // 没有任何匹配的情况
  return {
    ...route,
    parentRoute: rootRoute,
  };
};

// 获取两个路由的差异segment
const getSegmentsDiff = (
  routeSegments: string[],
  parentRouteSegments: string[],
): string[] => {
  const diffSegments: string[] = [];
  // 需要注意的是，父路由的最后一个segment是文件，会多一个文件后缀
  for (let i = 0; i < routeSegments.length; i++) {
    const currentSegment = routeSegments[i];
    // ts 这里会报错 因为routeSegments[i] 可能为空
    if (!currentSegment) continue;
    if (currentSegment !== removeExt(parentRouteSegments[i] || '')) {
      diffSegments.push(removeExt(currentSegment));
    }
  }
  return diffSegments;
};

const normalizeSegment = (segment: string) => {
  // 将后缀_去掉
  return segment.replace(/_$/, '');
};

const generateRoutePath = (
  baseRoutes: BaseRouteInfoWithParent[],
): RouteInfo[] => {
  const existRoute: string[] = [];

  // 在生成path时，要注意有一些特殊的路由要特别注意
  // 1. layoutIndependent_ 它不会作为父路由，但是在path中又需要包含这个父路由的path
  // 2. _layout 无路由路由，要生成path时，需要跳过它
  // 3. (group) 路由组，在生成path时需要去掉路由组，不作为path
  // 4. index 在生成path时，直接做为 /

  return baseRoutes.map((route) => {
    const { parentRoute, routeSegments, routeName } = route;

    const { isLayout, isRoot } = getRouteType(
      routeSegments[routeSegments.length - 1],
    );
    if (isLayout || isRoot) {
      return {
        ...route,
        routePath: null,
      } as RouteInfo;
    }

    if (existRoute.includes(routeName)) {
      throw new Error(`routeName ${routeName} is duplicated`);
    }

    existRoute.push(routeName);

    const diffSegments = getSegmentsDiff(
      routeSegments,
      parentRoute!.routeSegments,
    );

    let routePathSegments: string[] = [];

    // 不能直接拿最后一个segment来决定路由 因为可能存在layoutIndependent_.tsx这种文件
    for (const [index, segment] of diffSegments.entries()) {
      const { isGroup, isRoot, isIndex, isLayout } = getRouteType(segment);
      if (isGroup || isLayout || isRoot) continue;
      // 特别注意 index ，因为index作为文件的时候 作为/
      // 但是如果index作为文件夹，就要直接视为 /index/
      if (isIndex) {
        if (index === diffSegments.length - 1) {
          if (routePathSegments.length === 0) {
            routePathSegments.push('/');
          }
        } else {
          routePathSegments.push('index');
        }
        continue;
      }
      routePathSegments.push(normalizeSegment(segment));
    }

    return {
      ...route,
      routePath: routePathSegments.join('/'),
    } as RouteInfo;
  });
};

// 将baseRoute转换为Route 主要是要确定parentRoute和path
const baseRoutesToRoutes = (baseRoutes: BaseRouteInfo[]): RouteInfo[] => {
  const BaseRoutesWithParent = baseRoutes.map((route) =>
    determineParentRoute(baseRoutes, route),
  );
  const routes = generateRoutePath(BaseRoutesWithParent);
  return routes;
};

const generateImports = (routes: RouteInfo[]): string[] => {
  return [
    "import { createRootRoute, createRoute } from '@tanstack/react-router'",
    '',
    ...routes.map(
      (route) => `import ${route.routeName} from '${route.importPath}'`,
    ),
  ];
};

const generateRouteDefinitions = (routes: RouteInfo[]): string[] => {
  const getComponentName = (route: RouteInfo): string =>
    route.routeName.replace(/Import$/, 'Component');

  return routes.map((route) => {
    if (route.isRoot) {
      return [
        `const ${getComponentName(route)} = createRootRoute({`,
        `  component: ${route.routeName}`,
        `})`,
      ].join('\n');
    }

    const definition = [
      `const ${getComponentName(route)} = createRoute({`,
      `  getParentRoute: () => ${getComponentName(route.parentRoute!)},`,
      `  component: ${route.routeName},`,
    ];

    if (!route.isLayout) {
      definition.push(`  path: '${route.routePath}',`);
    } else {
      definition.push(`  id: '${route.routePath}',`);
    }

    definition.push('})');

    return definition.join('\n');
  });
};

const generateRouteTree = (routes: RouteInfo[]): RouteInfoTree => {
  // rootRoute 已经在前面判断了 没有会直接抛出异常
  const rootRoute = routes.find((r) => r.isRoot)!;

  // 构造哈希图 方便快速查找
  const hashMap: Record<string, RouteInfoTree> = {};
  routes.forEach((route) => {
    hashMap[route.routeName] = {
      ...route,
      childrenRoute: [],
    };
  });

  routes.forEach((route) => {
    if (route.isRoot) return;
    const parentRoute = hashMap[route.parentRoute!.routeName]!;
    parentRoute.childrenRoute.push(hashMap[route.routeName]!);
  });

  return hashMap[rootRoute.routeName]!;
};

function generateRouteTreeCode(routeInfo: RouteInfoTree): string {
  const getComponentName = (route: RouteInfo): string =>
    route.routeName.replace(/Import$/, 'Component');

  function processRouteTree(route: RouteInfoTree): string {
    // 获取路由变量名
    const routeVarName = getComponentName(route);

    // 如果有子路由，生成带 addChildren 的代码
    if (route.childrenRoute && route.childrenRoute.length > 0) {
      const childrenCode = route.childrenRoute
        .map((child) => processRouteTree(child))
        .filter(Boolean) // 过滤掉空值
        .join(',\n  ');

      return `${routeVarName}.addChildren([\n  ${childrenCode}\n])`;
    }

    // 没有子路由，直接返回路由变量名
    return routeVarName;
  }

  // 生成最终的路由树代码
  return `export const routeTree = ${processRouteTree(routeInfo)}`;
}

const generateRouterCode = (routes: RouteInfo[]): string => {
  const imports = generateImports(routes);
  const routeDefinitions = generateRouteDefinitions(routes);
  const routeTree = generateRouteTree(routes);
  const routeTreeCode = generateRouteTreeCode(routeTree);
  return [
    imports.join('\n'),
    '',
    routeDefinitions.join('\n\n'),
    '',
    routeTreeCode,
  ].join('\n');
};

export const generateTanStackRouter = async ({
  baseDir,
  srcDir = './../src/pages',
}: GeneratorOptions): Promise<string> => {
  try {
    const baseRoutesArray = await scanDirectory(baseDir, baseDir, srcDir);
    if (!rootRoute) throw new Error('rootRoute not found');
    const routes = baseRoutesToRoutes(baseRoutesArray);
    return generateRouterCode(routes);
  } catch (error) {
    console.error('Error generating router code:', error);
    throw error;
  }
};

export const generateRoute = async ({
  generatedRouteTree,
  routeTreeFileHeader,
}: {
  generatedRouteTree: string;
  routeTreeFileHeader: string[];
}) => {
  try {
    const routerCode = await generateTanStackRouter({
      baseDir: 'src/pages',
    });
    await fsp.writeFile(
      generatedRouteTree,
      [...routeTreeFileHeader, routerCode].join('\n'),
    );
    console.log('Router code generated successfully!');
  } catch (error) {
    console.error('Failed to generate router code:', error);
  }
};
