import { createServer } from 'node:http';

import { createApp } from './app';
import { env } from './config/env';

const app = createApp();
const server = createServer(app);

server.listen(env.port, () => {
  process.stdout.write(`Backend listening on port ${env.port}\n`);
});

function shutdown(signal: NodeJS.Signals) {
  process.stdout.write(`Received ${signal}, shutting down gracefully...\n`);
  server.close((error) => {
    if (error) {
      process.stderr.write(`Failed to close server cleanly: ${error.message}\n`);
      process.exit(1);
    }

    process.exit(0);
  });
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
