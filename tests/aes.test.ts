import { describe, test, expect } from 'vitest';
import { decrypt, encrypt, generateKey } from '../lib/aes.js';

describe('AES', () => {
  test('should encrypt data', async () => {
    const text = 'Hello World';
    const key = await generateKey();
    const data = new TextEncoder().encode(text);
    const { encrypted, iv } = await encrypt(key, data);
    expect(iv.length).toBeGreaterThanOrEqual(16);
    expect(encrypted).toBeDefined();
    expect(iv).toBeDefined();
    expect(encrypted).not.toEqual(data);
  });

  test('should decrypt data', async () => {
    const key = await generateKey();
    const data = new TextEncoder().encode('Hello World');
    const { encrypted, iv } = await encrypt(key, data);
    expect(encrypted).toBeDefined();
    expect(iv).toBeDefined();
    expect(encrypted).not.toEqual(data);
    const result = await decrypt(key, encrypted, iv);
    expect(result).toEqual(data);
  });
});
