import type { Config } from '../../config/types.js';

export interface Mock {
  method: string;
  path: string;
  handler: Function;
  file?: string;
}

export interface MockOptions {
  paths: string[];
  cwd: string;
  ignore?: string[];
}

export interface MockData {
  mocks: Record<string, Mock>;
  config?: Config;
}
