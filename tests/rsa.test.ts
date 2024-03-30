import { describe, it, expect, beforeEach } from 'vitest';
import { decrypt, encrypt } from '../lib/cipher.js';
import {
  exportPrivateKey,
  exportPrivateKeyPem,
  exportPublicKey,
  exportPublicKeyPem,
  generateKeyPair,
} from '../lib/rsa.js';

describe('RSA', () => {
  describe('generateKeyPair()', () => {
    it('should generate a new key-pair', async () => {
      const result = await generateKeyPair();
      expect(result.privateKey).toBeInstanceOf(CryptoKey);
      expect(result.publicKey).toBeInstanceOf(CryptoKey);
    });
  });

  describe('with key pair', () => {
    let keyPair: CryptoKeyPair;

    beforeEach(async () => {
      keyPair = await generateKeyPair();
    });

    describe('exportPrivateKey()', () => {
      it('should export private key', async () => {
        const result = await exportPrivateKey(keyPair.privateKey);
        expect(result).toBeInstanceOf(Uint8Array);
      });
    });

    describe('exportPrivateKeyPem()', () => {
      it('should export private key in PEM format', async () => {
        const result = await exportPrivateKeyPem(keyPair.privateKey);
        expect(typeof result).toEqual('string');
        expect(result.startsWith('-----BEGIN PRIVATE KEY-----')).toBeTruthy();
        expect(result.endsWith('-----END PRIVATE KEY-----')).toBeTruthy();
      });
    });

    describe('exportPublicKey()', () => {
      it('should export public key', async () => {
        const result = await exportPublicKey(keyPair.publicKey);
        expect(result).toBeInstanceOf(Uint8Array);
      });
    });

    describe('exportPublicKeyPem()', () => {
      it('should export public key in PEM format', async () => {
        const result = await exportPublicKeyPem(keyPair.publicKey);
        expect(typeof result).toEqual('string');
        expect(result.startsWith('-----BEGIN PUBLIC KEY-----')).toBeTruthy();
        expect(result.endsWith('-----END PUBLIC KEY-----')).toBeTruthy();
      });
    });

    describe('encrypt()', () => {
      it('should encrypt data', async () => {
        const data = new TextEncoder().encode('Hello World');
        const encrypted = await encrypt(keyPair.publicKey, data);
        expect(encrypted).toBeInstanceOf(Uint8Array);
      });
    });

    describe('decrypt()', () => {
      it('should decrypt data', async () => {
        const data = new TextEncoder().encode('Hello World');
        const encrypted = await encrypt(keyPair.publicKey, data);
        const decrypted = await decrypt(keyPair.privateKey, encrypted);
        expect(decrypted).toBeInstanceOf(Uint8Array);
        expect(new TextDecoder().decode(decrypted)).toEqual('Hello World');
      });
    });
  });
});
