import { execSync } from 'child_process';
import { z } from 'zod';

export const build = {
  description: 'Build the project',
  parameters: z.object({}),
  execute: async () => {
    try {
      execSync(`npx tnf build`, {
        cwd: process.cwd(),
      });
      return {
        success: true,
      };
    } catch (e) {
      return {
        error: e instanceof Error ? e.message : 'Build failed',
      };
    }
  },
};
