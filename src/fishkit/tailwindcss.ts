import assert from 'assert';
import { type ChildProcess, spawn } from 'child_process';
import fs from 'fs-extra';
import module from 'module';
import path from 'pathe';
import type { Config } from '../config';

// 常量配置
const CONSTANTS = {
  CHECK_INTERVAL_MS: 300,
  CHECK_TIMEOUT_SECONDS: 5,
  TAILWIND_VERSION: '3',
} as const;

// Tailwind 配置类型
interface TailwindConfig {
  content: string[];
  [key: string]: unknown;
}

// 生成 Tailwindcss 的选项接口
interface GenerateTailwindcssOpts {
  cwd: string;
  tmpPath: string;
  mode: 'development' | 'production';
}

// 生成文件的选项接口
interface GenerateFileOpts {
  binPath: string;
  inputPath: string;
  outputPath: string;
  configPath: string;
  mode: 'development' | 'production';
}

let tailwindProcess: ChildProcess;

/**
 * 获取 Tailwind CLI 的二进制文件路径
 */
function getTailwindBinPath(opts: { cwd: string }): string {
  const require = module.createRequire(process.cwd());
  let pkgPath: string;

  try {
    pkgPath = require.resolve('tailwindcss/package.json', {
      paths: [opts.cwd],
    });
  } catch (error) {
    throw new Error('tailwindcss not found, please install it first');
  }

  const pkg = require(pkgPath);
  const version = pkg.version;

  assert(
    version.startsWith(CONSTANTS.TAILWIND_VERSION),
    `tailwindcss version must be ${CONSTANTS.TAILWIND_VERSION}.x`,
  );

  return path.join(path.dirname(pkgPath), pkg.bin.tailwind);
}

/**
 * 生成 Tailwind CSS 文件
 */
export async function generateTailwindcss(
  opts: GenerateTailwindcssOpts,
): Promise<string> {
  const { cwd, tmpPath, mode } = opts;
  const rootPath = path.join(tmpPath, 'tailwindcss');

  // 设置文件路径
  const paths = {
    input: path.join(cwd, 'src/tailwind.css'),
    output: path.join(rootPath, 'tailwind.css'),
    config: path.join(cwd, 'tailwind.config.js'),
  };

  if (!fs.existsSync(paths.input)) {
    console.log(
      'Enabling feature tailwindcss requires input file src/tailwind.css',
    );
    return '';
  }

  if (!fs.existsSync(paths.config)) {
    console.log(
      'Enabling feature tailwindcss requires config file tailwind.config.js',
    );
    return '';
  }

  // 生成 CSS 文件
  await generateFile({
    binPath: getTailwindBinPath({ cwd }),
    inputPath: paths.input,
    outputPath: paths.output,
    configPath: paths.config,
    mode,
  });

  return paths.output;
}

/**
 * 生成 Tailwind CSS 文件并监听变化
 */
async function generateFile(opts: GenerateFileOpts): Promise<void> {
  const { binPath, inputPath, outputPath, configPath, mode } = opts;
  const isProduction = mode === 'production';

  return new Promise((resolve, reject) => {
    tailwindProcess = spawn(
      binPath,
      [
        '-i',
        inputPath,
        '-o',
        outputPath,
        '-c',
        configPath,
        ...(isProduction ? [] : ['--watch']),
      ],
      { stdio: 'inherit' },
    );

    tailwindProcess.on('error', (error) => {
      console.error('Tailwind CSS service encountered an error:', error);
      reject(error);
    });

    console.log('Tailwind CSS service started');

    tailwindProcess.on('close', () => {
      console.log('Tailwind CSS service closed');
      resolve();
    });

    if (!isProduction) {
      watchOutputFile(outputPath, resolve);
    }
  });
}

/**
 * 监听输出文件的生成
 */
function watchOutputFile(outputPath: string, resolve: () => void): void {
  const interval = setInterval(() => {
    if (fs.existsSync(outputPath)) {
      clearInterval(interval);
      resolve();
    }
  }, CONSTANTS.CHECK_INTERVAL_MS);

  // 设置超时检查
  setTimeout(() => {
    if (!fs.existsSync(outputPath)) {
      clearInterval(interval);
      throw new Error(
        `Tailwind CSS generation failed after ${CONSTANTS.CHECK_TIMEOUT_SECONDS} seconds. ` +
          'Please check your tailwind.css and tailwind.config.js',
      );
    }
  }, CONSTANTS.CHECK_TIMEOUT_SECONDS * 1000);
}
