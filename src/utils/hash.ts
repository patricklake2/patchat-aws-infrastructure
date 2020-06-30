import * as crypto from 'crypto';

export function createHash(input): string {
  return crypto.createHash('sha1').update(input).digest('base64');
}