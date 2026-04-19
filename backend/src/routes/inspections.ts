import { Router } from 'express';

import { InspectionService } from '../modules/inspections/service';

export const inspectionsRouter = Router();

const inspectionService = new InspectionService();

inspectionsRouter.get('/schema', (_req, res) => {
  try {
    const schema = inspectionService.getSchema();
    res.status(200).json(schema);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown inspection schema error';
    res.status(500).json({
      error: 'Failed to load inspection schema',
      message,
    });
  }
});

