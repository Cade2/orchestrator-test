export interface FrontendEnv {
  apiBaseUrl: string;
}

function readRequiredString(value: string | undefined, key: string): string {
  const normalized = value?.trim();

  if (!normalized) {
    throw new Error(`Missing required frontend environment variable: ${key}`);
  }

  return normalized;
}

function parseApiBaseUrl(rawBaseUrl: string): string {
  let parsedUrl: URL;

  try {
    parsedUrl = new URL(rawBaseUrl);
  } catch {
    throw new Error('VITE_API_BASE_URL must be a valid absolute URL, for example http://localhost:4000');
  }

  return parsedUrl.toString().replace(/\/$/, '');
}

export const env: FrontendEnv = {
  apiBaseUrl: parseApiBaseUrl(readRequiredString(import.meta.env.VITE_API_BASE_URL, 'VITE_API_BASE_URL')),
};
