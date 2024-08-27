import { createHash } from 'node:crypto';
import type { BinaryLike, BinaryToTextEncoding } from 'node:crypto';

export function md5(data: BinaryLike, encoding: BinaryToTextEncoding = 'hex') {
  const hash = createHash('md5');
  hash.update(data);
  return hash.digest(encoding);
}
