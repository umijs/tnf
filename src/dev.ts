import { build } from './build';

export interface IDevOpts {
  cwd: string;
}

export async function dev(opts: IDevOpts) {
  await build({
    ...opts,
    watch: true,
  });
}
