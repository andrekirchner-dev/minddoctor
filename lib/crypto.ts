const APP_SALT = "minddoctor-casos-v1";

const _keyCache = new Map<string, CryptoKey>();

export async function deriveKey(userId: string): Promise<CryptoKey> {
  const cached = _keyCache.get(userId);
  if (cached) return cached;
  const raw = new TextEncoder().encode(userId + APP_SALT);
  const keyMaterial = await crypto.subtle.importKey("raw", raw, "PBKDF2", false, ["deriveKey"]);
  const key = await crypto.subtle.deriveKey(
    { name: "PBKDF2", salt: new TextEncoder().encode(APP_SALT), iterations: 100_000, hash: "SHA-256" },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
  _keyCache.set(userId, key);
  return key;
}

export async function encryptField(text: string, key: CryptoKey): Promise<string> {
  if (!text.trim()) return "";
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const cipher = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    new TextEncoder().encode(text)
  );
  const buf = new Uint8Array(12 + cipher.byteLength);
  buf.set(iv);
  buf.set(new Uint8Array(cipher), 12);
  return btoa(String.fromCharCode(...buf));
}

export async function decryptField(enc: string, key: CryptoKey): Promise<string> {
  if (!enc) return "";
  try {
    const buf = Uint8Array.from(atob(enc), (c) => c.charCodeAt(0));
    const plain = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv: buf.slice(0, 12) },
      key,
      buf.slice(12)
    );
    return new TextDecoder().decode(plain);
  } catch {
    return "";
  }
}
