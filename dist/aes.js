export default {
    deriveWrappingKey,
    generateKey,
    exportKey,
    importKey,
    decrypt,
    encrypt,
    wrapKey,
    unwrapKey,
};
export async function generateKey(length = 256) {
    return crypto.subtle.generateKey({
        name: 'AES-GCM',
        length,
    }, true, ['encrypt', 'decrypt']);
}
export async function exportKey(key) {
    return new Uint8Array(await crypto.subtle.exportKey('raw', key));
}
export async function importKey(key) {
    return crypto.subtle.importKey('raw', key, {
        name: 'AES-GCM',
    }, true, ['encrypt', 'decrypt']);
}
export async function deriveWrappingKey(keyPair, pubKey, curve = 'P-256') {
    const jwk = await crypto.subtle.exportKey('jwk', keyPair.privateKey);
    const ecdhPrivateKey = await crypto.subtle.importKey('jwk', {
        ...jwk,
        key_ops: ['deriveKey', 'deriveBits'],
    }, {
        name: 'ECDH',
        namedCurve: curve,
    }, true, ['deriveKey', 'deriveBits']);
    const ecdhPublicKey = await crypto.subtle.importKey('raw', pubKey, {
        name: 'ECDH',
        namedCurve: curve,
    }, true, []);
    return crypto.subtle.deriveKey({
        name: 'ECDH',
        public: ecdhPublicKey,
    }, ecdhPrivateKey, {
        name: 'AES-KW',
        length: 256,
    }, false, ['wrapKey', 'unwrapKey']);
}
export async function wrapKey(keyToWrap, senderKeyPair, recipientPubKey) {
    const wrapKey = await deriveWrappingKey(senderKeyPair, recipientPubKey);
    return new Uint8Array(await crypto.subtle.wrapKey('raw', keyToWrap, wrapKey, {
        name: 'AES-KW',
    }));
}
export async function unwrapKey(wrappedKey, recipientKeyPair, senderPubKey) {
    const unwrapKey = await deriveWrappingKey(recipientKeyPair, senderPubKey);
    return crypto.subtle.unwrapKey('raw', wrappedKey, unwrapKey, {
        name: 'AES-KW',
    }, 'AES-GCM', true, ['decrypt', 'encrypt']);
}
export async function encrypt(key, data, ivLen = 16) {
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
export async function decrypt(key, data, iv) {
    return new Uint8Array(await crypto.subtle.decrypt({
        name: 'AES-GCM',
        iv,
    }, key, data));
}
