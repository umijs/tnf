import type yargsParser from 'yargs-parser';
import type { Config } from '../config/types';
import type { PluginManager } from '../plugin/plugin_manager';
import type { Plugin } from '../plugin/types';

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
}
