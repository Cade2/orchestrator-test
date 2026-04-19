import { config } from 'dotenv';

config();

const REQUIRED_KEYS = ['DATABASE_URL', 'SESSION_SECRET', 'PORT', 'CORS_ORIGIN'] as const;

type RequiredEnvKey = (typeof REQUIRED_KEYS)[number];

interface AppEnv {
  databaseUrl: string;
  sessionSecret: string;
  port: number;
  corsOrigins: string[];
}

function readRequiredString(key: RequiredEnvKey): string {
  const value = process.env[key]?.trim();

  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }

  return value;
}

function parsePort(rawPort: string): number {
  const parsed = Number(rawPort);

  if (!Number.isInteger(parsed) || parsed < 1 || parsed > 65535) {
    throw new Error('PORT must be an integer between 1 and 65535');
  }

  return parsed;
}

function parseCorsOrigins(rawOrigins: string): string[] {
  const origins = rawOrigins
    .split(',')
    .map((origin) => origin.trim())
    .filter((origin) => origin.length > 0);

  if (origins.length === 0) {
    throw new Error('CORS_ORIGIN must include at least one valid origin');
  }

  return origins;
}

export const env: AppEnv = {
  databaseUrl: readRequiredString('DATABASE_URL'),
  sessionSecret: readRequiredString('SESSION_SECRET'),
  port: parsePort(readRequiredString('PORT')),
  corsOrigins: parseCorsOrigins(readRequiredString('CORS_ORIGIN')),
};
