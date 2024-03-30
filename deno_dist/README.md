# ALTCHA JS Crypto Library

A small library simplifying asymetric data encryption using Web Crypto. Based on hybrid approach with RSA keys and AES encryption.

## Features

- Easy-to-use hybrid encryption using RSA + AES
- Supports all modern browsers with Web Crypto
- Supports node.js streams, making it suitable for encrypting large files

## Compatibility

- Node.js 20+
- Bun 1+
- Deno 1+
- Modern browsers

## Usage

```ts
import { cipher, rsa } from 'altcha-crypto';

const keyPair = await rsa.generateKeyPair();

const encrypted = await cipher.encrypt(keyPair.publicKey, new TextEncoder().encode('Hello World'));

const decrypted = await cipher.decrypt(keyPair.privateKey, encrypted);
```

Node.js streams:

```ts
import { createReadStream, createWriteStream } from 'node:fs';
import { nodeCipher, rsa } from 'altcha-crypto';

const keyPair = await rsa.generateKeyPair();

await nodeCipher.encryptStream(keyPair.publicKey, createReadStream('./input.txt'), createWriteStream('./output.txt.enc'));
```

## API

TODO

## License

MIT