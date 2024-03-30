import { describe, test, expect, beforeAll } from 'vitest';
import { decrypt, encrypt } from '../lib/cipher.js';
import { generateKeyPair } from '../lib/rsa.js';

describe('Cipher', () => {
  const message = 'Hello World';
  const data = new TextEncoder().encode(message);

  let keyPair: CryptoKeyPair;

  beforeAll(async () => {
    keyPair = await generateKeyPair();
  });

  test('should encrypt data', async () => {
    const result = await encrypt(keyPair.publicKey, data);
    expect(result).toBeInstanceOf(Uint8Array);
    expect(new TextDecoder().decode(result)).not.toEqual(message);
  });

  test('should decrypt data', async () => {
    const encrypted = await encrypt(keyPair.publicKey, data);
    const result = await decrypt(keyPair.privateKey, encrypted);
    expect(result).toBeInstanceOf(Uint8Array);
    expect(new TextDecoder().decode(result)).toEqual(message);
  });
});
