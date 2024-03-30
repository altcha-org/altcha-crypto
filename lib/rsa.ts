import { base64Encode } from './encoding.js';
import { convertPemToUint8Array, wrapLines } from './helpers.js';

const ALG = 'RSA-OAEP';

const HASH = 'SHA-256';

const MOD_LEN = 2048;

const PUB_EXP = new Uint8Array([1, 0, 1]);

export default {
  generateKeyPair,
  encrypt,
  decrypt,
  exportPrivateKey,
  exportPrivateKeyPem,
  exportPublicKey,
  exportPublicKeyPem,
  importPrivateKey,
  importPrivateKeyPem,
  importPublicKey,
  importPublicKeyPem,
};

export async function generateKeyPair() {
  return crypto.subtle.generateKey(
    {
      name: ALG,
      modulusLength: MOD_LEN,
      publicExponent: PUB_EXP,
      hash: HASH,
    },
    true,
    ['encrypt', 'decrypt']
  );
}

export async function encrypt(publicKey: CryptoKey, data: Uint8Array) {
  return new Uint8Array(
    await crypto.subtle.encrypt(
      {
        name: ALG,
      },
      publicKey,
      data
    )
  );
}

export async function decrypt(privateKey: CryptoKey, data: Uint8Array) {
  return new Uint8Array(
    await crypto.subtle.decrypt(
      {
        name: ALG,
      },
      privateKey,
      data
    )
  );
}

export async function exportPublicKey(key: CryptoKey) {
  return new Uint8Array(await crypto.subtle.exportKey('spki', key));
}

export async function exportPrivateKey(key: CryptoKey) {
  return new Uint8Array(await crypto.subtle.exportKey('pkcs8', key));
}

export async function exportPublicKeyPem(key: CryptoKey) {
  return (
    '-----BEGIN PUBLIC KEY-----\n' +
    wrapLines(base64Encode(await exportPublicKey(key)), 64) +
    '-----END PUBLIC KEY-----'
  );
}

export async function exportPrivateKeyPem(key: CryptoKey) {
  return (
    '-----BEGIN PRIVATE KEY-----\n' +
    wrapLines(base64Encode(await exportPrivateKey(key)), 64) +
    '-----END PRIVATE KEY-----'
  );
}

export async function importPublicKey(key: Uint8Array) {
  return crypto.subtle.importKey(
    'spki',
    key,
    {
      name: ALG,
      hash: HASH,
    },
    true,
    ['encrypt']
  );
}

export async function importPublicKeyPem(pem: string) {
  return importPublicKey(convertPemToUint8Array(pem));
}

export async function importPrivateKey(key: Uint8Array) {
  return crypto.subtle.importKey(
    'pkcs8',
    key,
    {
      name: ALG,
      hash: HASH,
    },
    true,
    ['decrypt']
  );
}

export async function importPrivateKeyPem(pem: string) {
  return importPrivateKey(convertPemToUint8Array(pem));
}
