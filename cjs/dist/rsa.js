"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.importPrivateKeyPem = exports.importPrivateKey = exports.importPublicKeyPem = exports.importPublicKey = exports.exportPrivateKeyPem = exports.exportPublicKeyPem = exports.exportPrivateKey = exports.exportPublicKey = exports.decrypt = exports.encrypt = exports.generateKeyPair = void 0;
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
exports.generateKeyPair = generateKeyPair;
async function encrypt(publicKey, data) {
    return new Uint8Array(await crypto.subtle.encrypt({
        name: ALG,
    }, publicKey, data));
}
exports.encrypt = encrypt;
async function decrypt(privateKey, data) {
    return new Uint8Array(await crypto.subtle.decrypt({
        name: ALG,
    }, privateKey, data));
}
exports.decrypt = decrypt;
async function exportPublicKey(key) {
    return new Uint8Array(await crypto.subtle.exportKey('spki', key));
}
exports.exportPublicKey = exportPublicKey;
async function exportPrivateKey(key) {
    return new Uint8Array(await crypto.subtle.exportKey('pkcs8', key));
}
exports.exportPrivateKey = exportPrivateKey;
async function exportPublicKeyPem(key) {
    return ('-----BEGIN PUBLIC KEY-----\n' +
        (0, helpers_js_1.wrapLines)((0, encoding_js_1.base64Encode)(await exportPublicKey(key)), 64) +
        '-----END PUBLIC KEY-----');
}
exports.exportPublicKeyPem = exportPublicKeyPem;
async function exportPrivateKeyPem(key) {
    return ('-----BEGIN PRIVATE KEY-----\n' +
        (0, helpers_js_1.wrapLines)((0, encoding_js_1.base64Encode)(await exportPrivateKey(key)), 64) +
        '-----END PRIVATE KEY-----');
}
exports.exportPrivateKeyPem = exportPrivateKeyPem;
async function importPublicKey(key) {
    return crypto.subtle.importKey('spki', key, {
        name: ALG,
        hash: HASH,
    }, true, ['encrypt']);
}
exports.importPublicKey = importPublicKey;
async function importPublicKeyPem(pem) {
    return importPublicKey((0, helpers_js_1.convertPemToUint8Array)(pem));
}
exports.importPublicKeyPem = importPublicKeyPem;
async function importPrivateKey(key) {
    return crypto.subtle.importKey('pkcs8', key, {
        name: ALG,
        hash: HASH,
    }, true, ['decrypt']);
}
exports.importPrivateKey = importPrivateKey;
async function importPrivateKeyPem(pem) {
    return importPrivateKey((0, helpers_js_1.convertPemToUint8Array)(pem));
}
exports.importPrivateKeyPem = importPrivateKeyPem;
