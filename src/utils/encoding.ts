function encodeString(str: string): string {
  const buffer = Buffer.from(str);
  return buffer.toString('base64');
}

function decodeString(b64: string): string {
  const buffer = Buffer.from(b64, 'base64');
  return buffer.toString();
}

export { encodeString, decodeString };
