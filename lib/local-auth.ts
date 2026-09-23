import { cookies } from "next/headers";

const COOKIE_NAME = "jaro_admin_session";
const SESSION_SECONDS = 12 * 60 * 60;

type LocalAuthRuntime = {
  ADMIN_USERNAME?: string;
  ADMIN_PASSWORD_SHA256?: string;
  ADMIN_SESSION_SECRET?: string;
};

function runtime(): LocalAuthRuntime {
  return (globalThis as unknown as { __JARO_ENV__?: LocalAuthRuntime }).__JARO_ENV__ ?? {};
}

function bytes(value: string) {
  return new TextEncoder().encode(value);
}

function base64UrlEncode(value: Uint8Array) {
  let binary = "";
  for (const byte of value) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function base64UrlDecode(value: string) {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(value.length / 4) * 4, "=");
  const binary = atob(padded);
  return Uint8Array.from(binary, (character) => character.charCodeAt(0));
}

function constantTimeEqual(left: string, right: string) {
  if (left.length !== right.length) return false;
  let difference = 0;
  for (let index = 0; index < left.length; index += 1) {
    difference |= left.charCodeAt(index) ^ right.charCodeAt(index);
  }
  return difference === 0;
}

async function sha256(value: string) {
  const digest = await crypto.subtle.digest("SHA-256", bytes(value));
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

async function signature(payload: string, secret: string) {
  const key = await crypto.subtle.importKey("raw", bytes(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const digest = await crypto.subtle.sign("HMAC", key, bytes(payload));
  return base64UrlEncode(new Uint8Array(digest));
}

export function isLocalAdminConfigured() {
  const config = runtime();
  return Boolean(config.ADMIN_USERNAME && config.ADMIN_PASSWORD_SHA256 && config.ADMIN_SESSION_SECRET);
}

export async function verifyLocalCredentials(username: string, password: string) {
  const config = runtime();
  if (!isLocalAdminConfigured()) return false;
  if (!constantTimeEqual(username.trim(), config.ADMIN_USERNAME!)) return false;
  return constantTimeEqual(await sha256(password), config.ADMIN_PASSWORD_SHA256!.toLowerCase());
}

export async function createLocalSession(username: string) {
  const expiresAt = Math.floor(Date.now() / 1000) + SESSION_SECONDS;
  const payload = base64UrlEncode(bytes(JSON.stringify({ username, expiresAt })));
  return `${payload}.${await signature(payload, runtime().ADMIN_SESSION_SECRET!)}`;
}

async function verifyLocalSession(token: string | undefined) {
  if (!token || !isLocalAdminConfigured()) return null;
  const [payload, suppliedSignature] = token.split(".");
  if (!payload || !suppliedSignature) return null;
  const expectedSignature = await signature(payload, runtime().ADMIN_SESSION_SECRET!);
  if (!constantTimeEqual(suppliedSignature, expectedSignature)) return null;

  try {
    const value = JSON.parse(new TextDecoder().decode(base64UrlDecode(payload))) as { username?: string; expiresAt?: number };
    if (value.username !== runtime().ADMIN_USERNAME) return null;
    if (!value.expiresAt || value.expiresAt < Math.floor(Date.now() / 1000)) return null;
    return value.username;
  } catch {
    return null;
  }
}

export async function getLocalAdminFromCookies() {
  const cookieStore = await cookies();
  return verifyLocalSession(cookieStore.get(COOKIE_NAME)?.value);
}

export async function getLocalAdminFromRequest(request: Request) {
  const cookieHeader = request.headers.get("cookie") ?? "";
  const token = cookieHeader
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${COOKIE_NAME}=`))
    ?.slice(COOKIE_NAME.length + 1);
  return verifyLocalSession(token);
}

export function localSessionCookie(token: string) {
  return `${COOKIE_NAME}=${token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${SESSION_SECONDS}`;
}

export function clearLocalSessionCookie() {
  return `${COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0`;
}
