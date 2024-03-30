import cipher from '../lib/cipher.js';
import rsa from '../lib/rsa.js';
import encoding from '../lib/encoding.js';

// Generate keys the client, share the public key with the server, keep the private key secret
const keyPair = await rsa.generateKeyPair();
const privateKeyPem = await rsa.exportPrivateKeyPem(keyPair.privateKey);
const publicKeyPem = await rsa.exportPublicKeyPem(keyPair.publicKey);

// Data to encrypt
const data = new TextEncoder().encode('Hello World');

// Import the PEM-formatted public key and encrypt data on the server
const importedPublicKey = await rsa.importPublicKeyPem(publicKeyPem);
const encryptedData = await cipher.encrypt(importedPublicKey, data);

// Import the PEM-formatted private key on the client and decrypt
const importedPrivateKey = await rsa.importPrivateKeyPem(privateKeyPem);
const decryptedData = await cipher.decrypt(importedPrivateKey, encryptedData);

console.log('Public key (PEM):');
console.log(publicKeyPem);
console.log();
console.log('Private key (PEM):');
console.log(privateKeyPem);
console.log();
console.log('Encrypted (base64):');
console.log(encoding.base64Encode(encryptedData));
console.log();
console.log('Decrypted:');
console.log(new TextDecoder().decode(decryptedData));