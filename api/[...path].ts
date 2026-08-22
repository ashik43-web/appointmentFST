import type { RequestHandler } from 'express';
import { createApp } from '../server.js';

let appPromise: ReturnType<typeof createApp> | undefined;

const handler: RequestHandler = async (req, res, next) => {
  try {
    appPromise ??= createApp();
    const app = await appPromise;
    app(req, res, next);
  } catch (error) {
    next(error);
  }
};

export default handler;