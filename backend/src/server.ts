import { createServer } from 'node:http';

import { createApp } from './app';
import { env } from './config/env';
import { connectDatabase, disconnectDatabase } from './db/prisma';

const app = createApp();
const server = createServer(app);
let shuttingDown = false;

async function startServer(): Promise<void> {
  try {
    await connectDatabase();
    server.listen(env.port, () => {
      process.stdout.write(`Backend listening on port ${env.port}\n`);
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    process.stderr.write(`Failed to start backend: ${message}\n`);
    await disconnectDatabase().catch(() => undefined);
    process.exit(1);
  }
}

async function shutdown(signal: NodeJS.Signals): Promise<void> {
  if (shuttingDown) {
    return;
  }

  shuttingDown = true;
  process.stdout.write(`Received ${signal}, shutting down gracefully...\n`);
  let shutdownError = false;

  await new Promise<void>((resolve) => {
    server.close((error) => {
      if (error) {
        process.stderr.write(`Failed to close server cleanly: ${error.message}\n`);
        shutdownError = true;
      }

      resolve();
    });
  });

  await disconnectDatabase().catch((error: unknown) => {
    const message = error instanceof Error ? error.message : String(error);
    process.stderr.write(`Failed to disconnect database cleanly: ${message}\n`);
    shutdownError = true;
  });

  process.exit(shutdownError ? 1 : 0);
}

void startServer();

process.on('SIGINT', () => {
  void shutdown('SIGINT');
});
process.on('SIGTERM', () => {
  void shutdown('SIGTERM');
});
