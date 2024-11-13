import { generatePage } from './generate_page';

export interface GenerateOptions {
  cwd: string;
  type: string;
  name: string;
}

export async function generate(opts: GenerateOptions) {
  if (opts.type === 'page') {
    return await generatePage(opts);
  }
}
