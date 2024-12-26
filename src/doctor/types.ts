import type { buildSrc } from './build_src.js';

export type AppData = Awaited<ReturnType<typeof buildSrc>>;
