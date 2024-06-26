import { arrayBufferToHex, base64Encode } from './encoding.ts';
import { convertPemToUint8Array, wrapLines } from './helpers.ts';

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
  exportPublicKeyFromPrivateKey,
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

export async function exportPublicKeyFromPrivateKey(privateKey: CryptoKey) {
  const jwk = await crypto.subtle.exportKey('jwk', privateKey);
  delete jwk.d;
  delete jwk.dp;
  delete jwk.dq;
  delete jwk.q;
  delete jwk.qi;
  jwk.key_ops = ['encrypt'];
  const pubKey = await crypto.subtle.importKey(
    'jwk',
    jwk,
    {
      name: ALG,
      hash: HASH,
    },
    true,
    ['encrypt']
  );
  return exportPublicKey(pubKey);
}

export async function getPublicKeyId(pubKeyBytes: Uint8Array) {
  const hash = arrayBufferToHex(
    await crypto.subtle.digest('SHA-256', pubKeyBytes)
  );
  return hash.slice(0, 8).match(/.{2}/g)!.join(':').toUpperCase();
}
