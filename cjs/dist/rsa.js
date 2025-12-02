"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateKeyPair = generateKeyPair;
exports.encrypt = encrypt;
exports.decrypt = decrypt;
exports.exportPublicKey = exportPublicKey;
exports.exportPrivateKey = exportPrivateKey;
exports.exportPublicKeyPem = exportPublicKeyPem;
exports.exportPrivateKeyPem = exportPrivateKeyPem;
exports.importPublicKey = importPublicKey;
exports.importPublicKeyPem = importPublicKeyPem;
exports.importPrivateKey = importPrivateKey;
exports.importPrivateKeyPem = importPrivateKeyPem;
exports.exportPublicKeyFromPrivateKey = exportPublicKeyFromPrivateKey;
exports.getPublicKeyId = getPublicKeyId;
const encoding_js_1 = require("./encoding.js");
const helpers_js_1 = require("./helpers.js");
const ALG = 'RSA-OAEP';
const HASH = 'SHA-256';
const MOD_LEN = 2048;
const PUB_EXP = new Uint8Array([1, 0, 1]);
exports.default = {
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
async function generateKeyPair() {
    return crypto.subtle.generateKey({
        name: ALG,
        modulusLength: MOD_LEN,
        publicExponent: PUB_EXP,
        hash: HASH,
    }, true, ['encrypt', 'decrypt']);
}
async function encrypt(publicKey, data) {
    return new Uint8Array(await crypto.subtle.encrypt({
        name: ALG,
    }, publicKey, data));
}
async function decrypt(privateKey, data) {
    return new Uint8Array(await crypto.subtle.decrypt({
        name: ALG,
    }, privateKey, data));
}
async function exportPublicKey(key) {
    return new Uint8Array(await crypto.subtle.exportKey('spki', key));
}
async function exportPrivateKey(key) {
    return new Uint8Array(await crypto.subtle.exportKey('pkcs8', key));
}
async function exportPublicKeyPem(key) {
    return ('-----BEGIN PUBLIC KEY-----\n' +
        (0, helpers_js_1.wrapLines)((0, encoding_js_1.base64Encode)(await exportPublicKey(key)), 64) +
        '-----END PUBLIC KEY-----');
}
async function exportPrivateKeyPem(key) {
    return ('-----BEGIN PRIVATE KEY-----\n' +
        (0, helpers_js_1.wrapLines)((0, encoding_js_1.base64Encode)(await exportPrivateKey(key)), 64) +
        '-----END PRIVATE KEY-----');
}
async function importPublicKey(key) {
    return crypto.subtle.importKey('spki', key, {
        name: ALG,
        hash: HASH,
    }, true, ['encrypt']);
}
async function importPublicKeyPem(pem) {
    return importPublicKey((0, helpers_js_1.convertPemToUint8Array)(pem));
}
async function importPrivateKey(key) {
    return crypto.subtle.importKey('pkcs8', key, {
        name: ALG,
        hash: HASH,
    }, true, ['decrypt']);
}
async function importPrivateKeyPem(pem) {
    return importPrivateKey((0, helpers_js_1.convertPemToUint8Array)(pem));
}
async function exportPublicKeyFromPrivateKey(privateKey) {
    const jwk = await crypto.subtle.exportKey('jwk', privateKey);
    delete jwk.d;
    delete jwk.dp;
    delete jwk.dq;
    delete jwk.q;
    delete jwk.qi;
    jwk.key_ops = ['encrypt'];
    const pubKey = await crypto.subtle.importKey('jwk', jwk, {
        name: ALG,
        hash: HASH,
    }, true, ['encrypt']);
    return exportPublicKey(pubKey);
}
async function getPublicKeyId(pubKeyBytes) {
    const hash = (0, encoding_js_1.arrayBufferToHex)(await crypto.subtle.digest('SHA-256', pubKeyBytes));
    return hash.slice(0, 8).match(/.{2}/g).join(':').toUpperCase();
}
