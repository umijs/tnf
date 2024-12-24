import { generator } from '@tanstack/router-generator';
import fsp from 'fs/promises';
import { existsSync } from 'node:fs';
import {
  dirname,
  extname,
  isAbsolute,
  join,
  normalize,
  relative,
  resolve,
} from 'node:path';
import { FRAMEWORK_NAME } from '../../constants';
import type { Plugin } from '../../plugin/types';
import { getConfig } from './config';
import type { Config } from './config';

let lock = false;
const checkLock = () => lock;
const setLock = (bool: boolean) => {
  lock = bool;
};

export const routerGenerator = (options: Partial<Config> = {}): Plugin => {
  let ROOT: string = process.cwd();
  let userConfig = options as Config;
  const tmpPath = join(ROOT, `.${FRAMEWORK_NAME}`);
  let routesDirectory: string = '';

  const getRoutesDirectoryPath = () => {
    return isAbsolute(routesDirectory)
      ? routesDirectory
      : join(ROOT, routesDirectory);
  };

  const isRouteFile = (filename: string): boolean => {
    const ext = extname(filename).toLowerCase();
    return ext === '.tsx' || ext === '.jsx';
  };

  const shouldIgnoreFile = (filePath: string) => {
    if (!userConfig.routeFileIgnorePattern) {
      return false;
    }
    const pattern = new RegExp(userConfig.routeFileIgnorePattern);
    return pattern.test(filePath);
  };

  const generateImportPath = (tmpPagePath: string, srcPagePath: string) => {
    const tmpPageDir = dirname(tmpPagePath);
    const importPath = relative(tmpPageDir, srcPagePath);
    const importPathWithoutExt = importPath.replace(/\.(tsx|jsx)$/, '');
    return importPathWithoutExt.startsWith('.')
      ? importPathWithoutExt
      : `./${importPathWithoutExt}`;
  };

  const middlePageFilesGenerator = async (
    dirPath: string,
    pagesRootPath: string,
  ) => {
    const files = await fsp.readdir(dirPath, { withFileTypes: true });

    for (const file of files) {
      if (shouldIgnoreFile(file.name)) {
        continue;
      }

      const currentPath = join(dirPath, file.name);

      if (file.isDirectory()) {
        const relativePath = relative(pagesRootPath, currentPath);
        const targetDir = join(tmpPath, 'pages', relativePath);
        await fsp.mkdir(targetDir, { recursive: true });
        await middlePageFilesGenerator(join(dirPath, file.name), pagesRootPath);
      } else if (file.isFile() && isRouteFile(file.name)) {
        const relativePath = relative(pagesRootPath, currentPath);
        const targetPath = join(tmpPath, 'pages', relativePath);
        await fsp.mkdir(dirname(targetPath), { recursive: true });
        if (!existsSync(targetPath)) {
          await fsp.writeFile(targetPath, '', 'utf-8');
        }
      }
    }
  };

  function transformRouteFile(importPath: string, content: string) {
    const isRootFile = content.includes('createRootRoute');

    // 1. 替换 import 声明
    content = content.replace(/@tanstack\/react-router/g, '@umijs/tnf/router');

    // 2. 添加新的 import 语句
    const importStatement = `import ImportComponent from '${importPath}'`;
    if (!content.includes(importStatement)) {
      content = `${importStatement}\n${content}`;
    }

    // 3. 替换 component: RouteComponent 为 component: ImportComponent
    content = content.replace(
      /component:\s*RouteComponent/g,
      'component: ImportComponent',
    );

    if (isRootFile) {
      content = content.replace(
        /component:\s*RootComponent/g,
        'component: ImportComponent',
      );
    }

    // 4. 移除 RouteComponent 函数定义
    content = content.replace(
      /\s*function\s+RouteComponent\s*\(\)\s*{[\s\S]*?}\s*/g,
      '',
    );

    if (isRootFile) {
      content = content.replace(
        /\s*function\s+RootComponent\s*\(\)\s*{[\s\S]*?}\s*/g,
        '',
      );
    }

    return content;
  }

  const getRelativePagePath = (currentPath: string, tmpPath: string) => {
    return relative(join(tmpPath, 'pages'), currentPath);
  };

  const processRouteFile = async (
    currentPath: string,
    tmpPath: string,
    routesDirectory: string,
  ) => {
    try {
      const relPath = getRelativePagePath(currentPath, tmpPath);
      const importPath = generateImportPath(
        currentPath,
        join(routesDirectory, relPath),
      );

      const content = await fsp.readFile(currentPath, 'utf-8');
      const transformedContent = transformRouteFile(importPath, content);
      await fsp.writeFile(currentPath, transformedContent, 'utf-8');
    } catch (error) {
      console.error(`Failed to process route file: ${currentPath}`, error);
    }
  };

  const modifyMiddlePageFiles = async (
    dirPath: string,
    pagesRootPath: string,
  ) => {
    const files = await fsp.readdir(dirPath, { withFileTypes: true });

    await Promise.all(
      files
        .map(async (file) => {
          const currentPath = join(dirPath, file.name);

          if (file.isDirectory()) {
            return modifyMiddlePageFiles(
              join(dirPath, file.name),
              pagesRootPath,
            );
          }

          if (file.isFile() && isRouteFile(file.name)) {
            return processRouteFile(currentPath, tmpPath, routesDirectory);
          }
        })
        .filter(Boolean),
    );
  };

  const generate = async () => {
    if (checkLock()) {
      return;
    }

    setLock(true);

    // 在tmpPath下生成pages目录 复制pages结构 但是不生成文件内容
    // 因为如果要生成文件内容 必须要生成符合tanstack/react-router的规范的文件内容
    // 因此 不需要生成文件内容 只需要新建文件 tanstack 会自动生成规范的文件内容
    // 最后再修改文件内容 生成最终的中间文件
    try {
      const pagesPath = userConfig.routesDirectory;
      await middlePageFilesGenerator(pagesPath, pagesPath);
      // 临时修改 routesDirectory ，让 tanstack 生成路由文件
      const middlePagesPath = join(tmpPath, 'pages');
      userConfig.routesDirectory = middlePagesPath;
      await generator(userConfig);
      await modifyMiddlePageFiles(middlePagesPath, pagesPath);
      // 还原 routesDirectory
      userConfig.routesDirectory = routesDirectory;
    } catch (err) {
      console.error('router-generator error', err);
    } finally {
      setLock(false);
    }
  };

  const handleFile = async (
    file: string,
    event: 'create' | 'update' | 'delete',
  ) => {
    const filePath = isAbsolute(file) ? normalize(file) : join(ROOT, file);

    // TODO: 这里需要处理配置文件的更新 因为tnf的特性，部分配置不能由用户直接更改
    // if (filePath === join(ROOT, CONFIG_FILE_NAME)) {
    //   userConfig = getConfig(options, ROOT)
    //   return
    // }

    if (
      event === 'update' &&
      filePath === resolve(userConfig.generatedRouteTree)
    ) {
      // skip generating routes if the generated route tree is updated
      return;
    }

    const routesDirectoryPath = getRoutesDirectoryPath();
    if (filePath.startsWith(routesDirectoryPath)) {
      await generate();
    }
  };

  const run: (cb: () => Promise<void> | void) => Promise<void> = async (cb) => {
    if (userConfig.enableRouteGeneration ?? true) {
      await cb();
    }
  };

  return {
    name: 'router-generator-plugin',
    async watchChange(id, { event }) {
      console.log('watchChange', id, event);
      await run(async () => {
        await handleFile(id, event);
      });
    },
    async configResolved() {
      const config: Partial<Config> = {
        routeFileIgnorePrefix: '-',
        routesDirectory: join(ROOT, 'src/pages'),
        generatedRouteTree: join(tmpPath, 'routeTree.gen.ts'),
        quoteStyle: 'single',
        semicolons: false,
        disableTypes: false,
        addExtensions: false,
        disableLogging: false,
        disableManifestGeneration: false,
        apiBase: '/api',
        routeTreeFileHeader: [
          '/* prettier-ignore-start */',
          '/* eslint-disable */',
          '// @ts-nocheck',
          '// noinspection JSUnusedGlobalSymbols',
        ],
        routeTreeFileFooter: ['/* prettier-ignore-end */'],
        indexToken: 'index',
        routeToken: 'route',
        autoCodeSplitting: true,
        ...options,
      };
      userConfig = getConfig(config, ROOT);
      routesDirectory = userConfig.routesDirectory;
      await run(generate);
    },
  };
};
