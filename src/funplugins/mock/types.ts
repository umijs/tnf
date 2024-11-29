import type { Config } from '../../config/types';

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
  config?: Config;
}

export interface MockData {
  mocks: Record<string, Mock>;
  config?: Config;
}
