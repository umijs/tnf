import { setupWorker } from 'msw/browser';
import app from './app';
import { handlers } from './handlers';

export const worker = setupWorker(...handlers, ...app);
