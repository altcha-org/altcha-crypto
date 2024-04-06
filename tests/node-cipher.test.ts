import { describe, test, expect, beforeAll } from 'vitest';
import { PassThrough, Readable } from 'node:stream';
import { decryptStream, encryptStream } from '../lib/node-cipher.js';
import { encrypt, decrypt } from '../lib/cipher.js';
import { generateKeyPair } from '../lib/rsa.js';

async function streamToBuffer(stream: Readable) {
  let buf = Buffer.from('');
  for await (const chunk of stream) {
    buf = Buffer.concat([buf, chunk]);
  }
  return buf;
}

describe('Node stream cipher', () => {
  const message = 'Hello World';
  const data = new TextEncoder().encode(message);

  let keyPair: CryptoKeyPair;

  beforeAll(async () => {
    keyPair = await generateKeyPair();
  });

  test('should encrypt stream', async () => {
    const input = Readable.from(Buffer.from(message));
    const output = new PassThrough();
    encryptStream(keyPair.publicKey, input, output);
    const result = await streamToBuffer(output);
    expect(result.toString()).not.toEqual(message);
  });

  test('should decrypt stream', async () => {
    const encrypted = await encrypt(keyPair.publicKey, data);
    const input = Readable.from(Buffer.from(encrypted));
    const output = new PassThrough();
    decryptStream(keyPair.privateKey, input, output);
    const result = await streamToBuffer(output);
    expect(result.toString()).toEqual(message);
  });

  test('should be able to decrypt using sync api', async () => {
    const input = Readable.from(Buffer.from(message));
    const output = new PassThrough();
    encryptStream(keyPair.publicKey, input, output);
    const buf = await streamToBuffer(output);
    const ua = new Uint8Array(
      buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength)
    );
    const result = await decrypt(keyPair.privateKey, ua);
    expect(result).toBeInstanceOf(Uint8Array);
    expect(new TextDecoder().decode(result)).toEqual(message);
  });
});
