import { customAlphabet } from 'nanoid';

const alphabet = 'abcdefghijklmnopqrstuvwxyz0123456789';
const nanoid = customAlphabet(alphabet, 15);

/**
 * Generates a unique identifier with an optional prefix. Use custom alphabet
 * without special chars for less chaotic, copy-able URLs Will not collide for a
 * long time: https://zelark.github.io/nano-id-cc/
 */
export const nid = () => {
  return nanoid();
};
