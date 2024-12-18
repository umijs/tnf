import { execSync } from 'child_process';
import { z } from 'zod';

export const doctor = {
  description: 'Run doctor command to check the project for potential issues',
  parameters: z.object({}),
  execute: async () => {
    try {
      execSync(`npx tnf doctor`, {
        cwd: process.cwd(),
      });
      return {
        success: true,
      };
    } catch (e) {
      return {
        error: e instanceof Error ? e.message : 'Doctor check failed',
      };
    }
  },
};
