import { randomBytes, scrypt as scryptCallback, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';

const scrypt = promisify(scryptCallback);

const HASH_PREFIX = 'scrypt';
const SALT_BYTES = 16;
const KEY_LENGTH = 64;

export async function hashPassword(password: string): Promise<string> {
  const normalized = password.normalize('NFKC');

  if (normalized.length < 8) {
    throw new Error('Password must be at least 8 characters long');
  }

  const salt = randomBytes(SALT_BYTES);
  const derived = (await scrypt(normalized, salt, KEY_LENGTH)) as Buffer;

  return `${HASH_PREFIX}$${salt.toString('hex')}$${derived.toString('hex')}`;
}

export async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
  const segments = storedHash.split('$');

  if (segments.length !== 3) {
    return false;
  }

  const [prefix, saltHex, hashHex] = segments;

  if (prefix !== HASH_PREFIX || !saltHex || !hashHex) {
    return false;
  }

  const salt = Buffer.from(saltHex, 'hex');
  const hash = Buffer.from(hashHex, 'hex');

  if (salt.length !== SALT_BYTES || hash.length !== KEY_LENGTH) {
    return false;
  }

  const derived = (await scrypt(password.normalize('NFKC'), salt, KEY_LENGTH)) as Buffer;

  return timingSafeEqual(hash, derived);
}
