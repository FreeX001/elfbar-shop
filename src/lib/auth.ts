// Uses Web Crypto (available in both Node 18+ and Edge runtime) so it can run
// inside middleware (edge) and API routes (node) with identical logic.

const COOKIE_NAME = "elfbar_admin_session";
const MAX_AGE_MS = 1000 * 60 * 60 * 24 * 14; // 14 days

function getSecret(): string {
  return process.env.ADMIN_SESSION_SECRET || "elfbar-default-secret-please-override";
}

async function hmac(data: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(getSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(data));
  return Buffer.from(sig).toString("hex");
}

export async function createSessionToken(): Promise<string> {
  const expires = Date.now() + MAX_AGE_MS;
  const payload = `admin.${expires}`;
  const sig = await hmac(payload);
  return `${payload}.${sig}`;
}

export async function isValidSessionToken(token: string | undefined | null): Promise<boolean> {
  if (!token) return false;
  const parts = token.split(".");
  if (parts.length !== 3) return false;
  const [role, expiresStr, sig] = parts;
  if (role !== "admin") return false;
  const expires = Number(expiresStr);
  if (!expires || Date.now() > expires) return false;
  const expected = await hmac(`${role}.${expiresStr}`);
  return expected === sig;
}

export { COOKIE_NAME, MAX_AGE_MS };
