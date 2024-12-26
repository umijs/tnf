import type yargsParser from 'yargs-parser';
import type { Config } from '../config/types.js';
import type { PluginManager } from '../plugin/plugin_manager.js';
import type { Plugin } from '../plugin/types.js';

export interface Pkg {
  name?: string;
  version?: string;
  scripts?: Record<string, string>;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  [key: string]: any;
}

interface ContextPaths {
  tmpPath: string;
  outputPath: string;
}

interface PluginContext {
  command: string | undefined;
  config: Config;
  cwd: string;
  userConfig: Config;
}

export enum Mode {
  Development = 'development',
  Production = 'production',
}

export interface Context {
  argv: yargsParser.Arguments;
  config: Config;
  pluginManager: PluginManager<Plugin>;
  pluginContext: PluginContext;
  cwd: string;
  mode: Mode;
  paths: ContextPaths;
  pkg: Pkg;
}
