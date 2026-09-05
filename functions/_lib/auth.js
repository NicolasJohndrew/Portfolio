const encoder = new TextEncoder();
const decoder = new TextDecoder();

function toBase64Url(bytes) {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function fromBase64Url(value) {
  const base64 = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
  const binary = atob(padded);
  return Uint8Array.from(binary, (char) => char.charCodeAt(0));
}

async function signingKey(secret) {
  return crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

async function sign(value, secret) {
  const key = await signingKey(secret);
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(value));
  return toBase64Url(new Uint8Array(signature));
}

export async function createSession(secret) {
  const payload = {
    role: "admin",
    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7,
    nonce: crypto.randomUUID(),
  };

  const encoded = toBase64Url(encoder.encode(JSON.stringify(payload)));
  const signature = await sign(encoded, secret);
  return `${encoded}.${signature}`;
}

export async function verifySession(token, secret) {
  if (!token || !secret) return null;

  const [encoded, signature] = token.split(".");
  if (!encoded || !signature) return null;

  try {
    const key = await signingKey(secret);
    const valid = await crypto.subtle.verify(
      "HMAC",
      key,
      fromBase64Url(signature),
      encoder.encode(encoded)
    );

    if (!valid) return null;

    const payload = JSON.parse(decoder.decode(fromBase64Url(encoded)));

    if (payload.role !== "admin") return null;
    if (!payload.exp || payload.exp < Math.floor(Date.now() / 1000)) return null;

    return payload;
  } catch {
    return null;
  }
}

export function getCookie(request, name) {
  const cookieHeader = request.headers.get("cookie") || "";
  const cookies = cookieHeader.split(";");

  for (const cookie of cookies) {
    const [rawName, ...rawValue] = cookie.trim().split("=");
    if (rawName === name) return decodeURIComponent(rawValue.join("="));
  }

  return null;
}

export function sessionCookie(token) {
  return [
    `game_admin=${encodeURIComponent(token)}`,
    "Path=/",
    "HttpOnly",
    "Secure",
    "SameSite=Strict",
    `Max-Age=${60 * 60 * 24 * 7}`,
  ].join("; ");
}

export function clearSessionCookie() {
  return "game_admin=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0";
}

export async function requireAdmin(context) {
  const secret = context.env.AUTH_SECRET;
  if (!secret) return null;

  const token = getCookie(context.request, "game_admin");
  return verifySession(token, secret);
}

export function safeSecretEquals(left, right) {
  if (typeof left !== "string" || typeof right !== "string") return false;

  const a = encoder.encode(left);
  const b = encoder.encode(right);

  let difference = a.length ^ b.length;
  const length = Math.max(a.length, b.length);

  for (let i = 0; i < length; i++) {
    difference |= (a[i % Math.max(a.length, 1)] ?? 0) ^ (b[i % Math.max(b.length, 1)] ?? 0);
  }

  return difference === 0;
}
