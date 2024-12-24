import type { buildSrc } from './build_src';

export type AppData = Awaited<ReturnType<typeof buildSrc>>;
