export default {
  base64Decode,
  base64Encode,
}

export function base64Decode(b64: string, urlSafe: boolean = false) {
  if (urlSafe) {
    b64 =
      b64.replace(/_/g, '/').replace(/-/g, '+') +
      '='.repeat(3 - ((3 + b64.length) % 4));
  }
  return Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
}

export function base64Encode(ua: Uint8Array, urlSafe: boolean = false) {
  const b64 = btoa(String.fromCharCode(...ua));
  if (urlSafe) {
    return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }
  return b64;
}
