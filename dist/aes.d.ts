import type { TCurveName } from './types.js';
declare const _default: {
    deriveWrappingKey: typeof deriveWrappingKey;
    generateKey: typeof generateKey;
    exportKey: typeof exportKey;
    importKey: typeof importKey;
    decrypt: typeof decrypt;
    encrypt: typeof encrypt;
    wrapKey: typeof wrapKey;
    unwrapKey: typeof unwrapKey;
};
export default _default;
export declare function generateKey(length?: number): Promise<CryptoKey>;
export declare function exportKey(key: CryptoKey): Promise<Uint8Array>;
export declare function importKey(key: Uint8Array): Promise<CryptoKey>;
export declare function deriveWrappingKey(keyPair: CryptoKeyPair, pubKey: Uint8Array, curve?: TCurveName): Promise<CryptoKey>;
export declare function wrapKey(keyToWrap: CryptoKey, senderKeyPair: CryptoKeyPair, recipientPubKey: Uint8Array): Promise<Uint8Array>;
export declare function unwrapKey(wrappedKey: Uint8Array, recipientKeyPair: CryptoKeyPair, senderPubKey: Uint8Array): Promise<CryptoKey>;
export declare function encrypt(key: CryptoKey, data: Uint8Array, ivLen?: number): Promise<{
    encrypted: Uint8Array;
    iv: Uint8Array;
}>;
export declare function decrypt(key: CryptoKey, data: Uint8Array, iv: Uint8Array): Promise<Uint8Array>;
