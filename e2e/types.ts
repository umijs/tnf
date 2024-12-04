import { Page } from '@playwright/test';

export type E2EContext = {
  page: Page;
  content: string;
};
