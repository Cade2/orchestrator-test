import request from 'supertest';
import { describe, expect, it } from 'vitest';

import { createApp } from '../app';

describe('health-check route', () => {
  it('returns backend health metadata', async () => {
    const app = createApp();

    const response = await request(app).get('/health').expect(200);

    expect(response.type).toMatch(/application\/json/);
    expect(response.body).toMatchObject({
      ok: true,
      service: 'workshop-inspect-backend',
    });
    expect(typeof response.body.uptimeSeconds).toBe('number');
    expect(response.body.uptimeSeconds).toBeGreaterThanOrEqual(0);
    expect(typeof response.body.timestamp).toBe('string');
    expect(Number.isNaN(Date.parse(response.body.timestamp))).toBe(false);
  });
});
