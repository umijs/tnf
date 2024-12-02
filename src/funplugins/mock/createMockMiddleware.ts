import bodyParser from 'body-parser';
import type { RequestHandler } from 'express';
// @ts-ignore
import multer from 'multer';
import pathToRegexp from 'path-to-regexp';
import type { MockData } from './types';

export function createMockMiddleware(context: MockData): RequestHandler {
  return async (req, res, next) => {
    const method = req.method.toUpperCase();
    for (const key of Object.keys(context.mocks)) {
      const mock = context.mocks[key]!;
      if (mock.method !== method) continue;
      const { keys, re } = getPathReAndKeys(mock.path);
      const m = re.exec(req.path);
      if (m) {
        if (typeof mock.handler === 'function') {
          // add params
          const params: Record<string, any> = {};
          for (let i = 1; i < m.length; i += 1) {
            const key = keys[i - 1];
            const prop = key.name;
            const val = decodeParam(m[i]);
            if (val !== undefined) {
              params[prop] = val;
            }
          }
          req.params = params;

          // parse delay from path, like /api/users?delay=3000
          // delay in params url is greater than that configuration mock.delay
          let delay = Number(req.query?.delay) || 0;
          if (delay === 0) {
            const delayValue = context.config?.mock?.delay;
            if (typeof delayValue === 'string' && delayValue.includes('-')) {
              const [min, max] = delayValue
                .split('-')
                .map(Number)
                .filter((n) => !isNaN(n));
              if (min !== undefined && max !== undefined) {
                delay = Math.floor(Math.random() * (max - min + 1)) + min;
              }
            } else {
              delay = Number(delayValue ?? 0);
            }
          }
          if (delay > 0) {
            await new Promise((resolve) => setTimeout(resolve, delay));
          }

          // handler
          if (method === 'GET') {
            mock.handler(req, res, next);
          } else {
            const jsonOpts = { limit: '5mb', strict: false };
            const urlEncodedOpts = { limit: '5mb', extended: true };
            // body parser + multer
            bodyParser.json(jsonOpts)(req, res, () => {
              bodyParser.urlencoded(urlEncodedOpts)(req, res, () => {
                // @ts-ignore
                multer().any()(req, res, () => {
                  mock.handler(req, res, next);
                });
              });
            });
          }
        } else {
          res.status(200).json(mock.handler);
        }
        return;
      }
    }
    next();
  };
}

function getPathReAndKeys(path: string) {
  const keys: any[] = [];
  const re = pathToRegexp(path, keys);
  return { re, keys };
}

function decodeParam(val: any) {
  if (typeof val !== 'string' || val.length === 0) {
    return val;
  }
  try {
    return decodeURIComponent(val);
  } catch (err) {
    if (err instanceof URIError) {
      err.message = `Failed to decode param ' ${val} '`;
      // @ts-ignore
      err.status = 400;
      // @ts-ignore
      err.statusCode = 400;
    }
    throw err;
  }
}
