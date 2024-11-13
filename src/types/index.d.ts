import type { Config } from '../config';

interface Paths {
  tmpPath: string;
}

export interface Context {
  argv: yargsParser.Arguments;
  config: Config;
  cwd: string;
  mode: 'development' | 'production';
  paths: Paths;
}
