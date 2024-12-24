import { execSync } from 'child_process';
import { z } from 'zod';

export const generateRoute = {
  description: 'Generate a page or route',
  parameters: z.object({
    pageName: z.string(),
  }),
  execute: async ({ pageName }: { pageName: string }) => {
    try {
      execSync(`npx tnf generate page ${pageName}`, {
        cwd: process.cwd(),
      });
      return {
        success: true,
      };
    } catch (e) {
      return {
        error:
          e instanceof Error
            ? e.message
            : `Route ${pageName} generation failed`,
      };
    }
  },
};

export const generateTailwindcss = {
  description: 'Setup tailwindcss',
  parameters: z.object({}),
  execute: async () => {
    try {
      execSync(`npx tnf generate tailwindcss`, {
        cwd: process.cwd(),
      });
      return {
        success: true,
      };
    } catch (e) {
      return {
        error: e instanceof Error ? e.message : `Tailwindcss setup failed`,
      };
    }
  },
};
