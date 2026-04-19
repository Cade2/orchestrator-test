import { Router } from 'express';

const serviceStartedAt = Date.now();

export const healthRouter = Router();

healthRouter.get('/', (_req, res) => {
  res.status(200).json({
    ok: true,
    service: 'workshop-inspect-backend',
    uptimeSeconds: Math.floor((Date.now() - serviceStartedAt) / 1000),
    timestamp: new Date().toISOString(),
  });
});
