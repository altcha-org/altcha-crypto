import { assert } from 'https://deno.land/std@0.213.0/assert/mod.ts';
import { decrypt, encrypt } from '../lib/cipher.ts';
import { generateKeyPair } from '../lib/rsa.ts';

Deno.test('cipher', async (t) => {
  const message = 'Hello World';
  const data = new TextEncoder().encode(message);

  await t.step('should encrypt data', async () => {
    const keyPair = await generateKeyPair();
    const result = await encrypt(keyPair.publicKey, data);
    assert(result instanceof Uint8Array);
    assert(new TextDecoder().decode(result) !== message);
  });

  await t.step('should decrypt data', async () => {
    const keyPair = await generateKeyPair();
    const encrypted = await encrypt(keyPair.publicKey, data);
    const result = await decrypt(keyPair.privateKey, encrypted);
    assert(result instanceof Uint8Array);
    assert(new TextDecoder().decode(result) === message);
  });
});
