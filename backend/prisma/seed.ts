import { PrismaClient } from '@prisma/client';

import { hashPassword } from '../src/security/password';

const prisma = new PrismaClient();

async function seed(): Promise<void> {
  const employeeEmail = 'employee@workshop.local';
  const employeeName = 'Workshop Employee';
  const initialPassword = 'ChangeMeNow!123';

  const passwordHash = await hashPassword(initialPassword);

  await prisma.user.upsert({
    where: { email: employeeEmail },
    update: {
      name: employeeName,
      passwordHash,
    },
    create: {
      email: employeeEmail,
      name: employeeName,
      passwordHash,
    },
  });

  process.stdout.write(`Seeded workshop employee user: ${employeeEmail}\n`);
}

seed()
  .catch((error: unknown) => {
    const message = error instanceof Error ? error.message : String(error);
    process.stderr.write(`Seeding failed: ${message}\n`);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
