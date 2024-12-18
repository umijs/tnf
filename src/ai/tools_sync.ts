import { execSync } from 'child_process';
import { z } from 'zod';

export const sync = {
  description: 'Sync the project to the temporary directory',
  parameters: z.object({
    mode: z.enum(['dev', 'build']),
  }),
  execute: async ({ mode }: { mode: 'dev' | 'build' }) => {
    try {
      execSync(`npx tnf sync --mode=${mode}`, {
        cwd: process.cwd(),
      });
      return {
        success: true,
      };
    } catch (e) {
      return {
        error: e instanceof Error ? e.message : 'Sync failed',
      };
    }
  },
};
