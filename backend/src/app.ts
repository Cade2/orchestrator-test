import cors, { CorsOptions } from 'cors';
import express, { Request, Response } from 'express';

import { env } from './config/env';
import { healthRouter } from './routes/health';
import { inspectionsRouter } from './routes/inspections';

const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    if (!origin || env.corsOrigins.includes(origin)) {
      callback(null, true);
      return;
    }

    callback(new Error('CORS policy does not allow this origin'));
  },
  credentials: true,
};

export function createApp() {
  const app = express();

  app.disable('x-powered-by');
  app.use(cors(corsOptions));
  app.use(express.json({ limit: '1mb' }));

  app.get('/', (_req: Request, res: Response) => {
    res.status(200).json({
      name: 'Workshop Inspect Lite API',
      status: 'running',
    });
  });

  app.use('/health', healthRouter);
  app.use('/api/inspections', inspectionsRouter);

  app.use((_req, res) => {
    res.status(404).json({
      error: 'Not found',
    });
  });

  return app;
}
