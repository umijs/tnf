export type ChangeEvent = 'create' | 'update' | 'delete';

export type ChokidarOptions = {
  ignored?: string | RegExp | Array<string | RegExp>;
  persistent?: boolean;
  ignoreInitial?: boolean;
  followSymlinks?: boolean;
  cwd?: string;
  disableGlobbing?: boolean;
  usePolling?: boolean;
  interval?: number;
  binaryInterval?: number;
  alwaysStat?: boolean;
  depth?: number;
  awaitWriteFinish?:
    | boolean
    | { stabilityThreshold?: number; pollInterval?: number };
};

export type WatchEvent =
  | { code: 'START' }
  | { code: 'CHANGE'; id: string; event: ChangeEvent }
  | { code: 'ERROR'; error: Error }
  | { code: 'END' };

export type EventListener<T, K extends keyof T> = T[K] extends (
  ...args: any[]
) => any
  ? (...args: Parameters<T[K]>) => void | Promise<void>
  : never;
