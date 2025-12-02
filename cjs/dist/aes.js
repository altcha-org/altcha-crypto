"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateKey = generateKey;
exports.exportKey = exportKey;
exports.importKey = importKey;
exports.encrypt = encrypt;
exports.decrypt = decrypt;
exports.default = {
    generateKey,
    exportKey,
    importKey,
    decrypt,
    encrypt,
};
async function generateKey(length = 256) {
    return crypto.subtle.generateKey({
        name: 'AES-GCM',
        length,
    }, true, ['encrypt', 'decrypt']);
}
async function exportKey(key) {
    return new Uint8Array(await crypto.subtle.exportKey('raw', key));
}
async function importKey(key) {
    return crypto.subtle.importKey('raw', key, {
        name: 'AES-GCM',
    }, true, ['encrypt', 'decrypt']);
}
async function encrypt(key, data, ivLen = 16) {
    const iv = crypto.getRandomValues(new Uint8Array(ivLen));
    const encrypted = new Uint8Array(await crypto.subtle.encrypt({
        name: 'AES-GCM',
        iv,
    }, key, data));
    return {
        encrypted,
        iv,
    };
}
async function decrypt(key, data, iv) {
    return new Uint8Array(await crypto.subtle.decrypt({
        name: 'AES-GCM',
        iv: iv,
    }, key, data));
}
