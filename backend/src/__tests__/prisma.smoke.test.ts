import { afterAll, describe, expect, it } from 'vitest';

import { prisma } from '../db/prisma';

describe('prisma smoke test', () => {
  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('connects and executes a simple query', async () => {
    await prisma.$connect();

    const rows = await prisma.$queryRaw<Array<{ result: number }>>`SELECT 1::int AS result`;

    expect(rows).toHaveLength(1);
    expect(rows[0]?.result).toBe(1);
  });
});
