import type { buildSrc } from './buildSrc';

export type AppData = Awaited<ReturnType<typeof buildSrc>>;
