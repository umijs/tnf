import { execSync } from 'child_process';
import { z } from 'zod';

export const listConfig = {
  description: 'List all config',
  parameters: z.object({}),
  execute: async () => {
    try {
      execSync(`npx tnf config list`, {
        cwd: process.cwd(),
      });
      return {
        success: true,
      };
    } catch (e) {
      return {
        error: e instanceof Error ? e.message : 'Config list failed',
      };
    }
  },
};

export const removeConfig = {
  description: 'Remove a config',
  parameters: z.object({
    name: z.string(),
  }),
  execute: async ({ name }: { name: string }) => {
    try {
      execSync(`npx tnf config remove ${name}`, {
        cwd: process.cwd(),
      });
      return {
        success: true,
      };
    } catch (e) {
      return {
        error: e instanceof Error ? e.message : `Config ${name} remove failed`,
      };
    }
  },
};

export const getConfig = {
  description: 'Get a config',
  parameters: z.object({
    name: z.string(),
  }),
  execute: async ({ name }: { name: string }) => {
    try {
      execSync(`npx tnf config get ${name}`, {
        cwd: process.cwd(),
      });
      return {
        success: true,
      };
    } catch (e) {
      return {
        error: e instanceof Error ? e.message : `Config ${name} get failed`,
      };
    }
  },
};

// TODO: setConfig
