import { cookies } from "next/headers";

const COOKIE_NAME = "jaro_admin_session";
const SESSION_SECONDS = 7 * 24 * 60 * 60; // 7 days

type LocalAuthRuntime = {
  ADMIN_USERNAME?: string;
  ADMIN_PASSWORD_SHA256?: string;
  ADMIN_SESSION_SECRET?: string;
  ADMIN_EMAILS?: string;
  ADMIN_PASSWORD?: string;
};

function runtime(): LocalAuthRuntime {
  const env = (globalThis as unknown as { __JARO_ENV__?: LocalAuthRuntime }).__JARO_ENV__ ?? {};
  return {
    ADMIN_USERNAME: env.ADMIN_USERNAME ?? (typeof process !== "undefined" ? process.env?.ADMIN_USERNAME : undefined),
    ADMIN_PASSWORD_SHA256: env.ADMIN_PASSWORD_SHA256 ?? (typeof process !== "undefined" ? process.env?.ADMIN_PASSWORD_SHA256 : undefined),
    ADMIN_SESSION_SECRET: env.ADMIN_SESSION_SECRET ?? (typeof process !== "undefined" ? process.env?.ADMIN_SESSION_SECRET : undefined),
    ADMIN_EMAILS: env.ADMIN_EMAILS ?? (typeof process !== "undefined" ? process.env?.ADMIN_EMAILS : undefined),
    ADMIN_PASSWORD: env.ADMIN_PASSWORD ?? (typeof process !== "undefined" ? process.env?.ADMIN_PASSWORD : undefined),
  };
}

function getSessionSecret(): string {
  const config = runtime();
  return (
    config.ADMIN_SESSION_SECRET ||
    config.ADMIN_PASSWORD ||
    config.ADMIN_PASSWORD_SHA256 ||
    "jaro-admin-secure-fallback-salt-2026"
  );
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
  const hasBasic = Boolean(config.ADMIN_EMAILS && config.ADMIN_PASSWORD);
  const hasSha = Boolean(config.ADMIN_USERNAME && config.ADMIN_PASSWORD_SHA256);
  return hasBasic || hasSha;
}

export async function verifyLocalCredentials(username: string, password: string): Promise<string | null> {
  const config = runtime();
  const cleanUser = username.trim().toLowerCase();
  const cleanPass = password;
  if (!cleanUser || !cleanPass) return null;

  // 1. Check against ADMIN_EMAILS & ADMIN_PASSWORD
  if (config.ADMIN_EMAILS && config.ADMIN_PASSWORD) {
    const allowedEmails = config.ADMIN_EMAILS
      .split(",")
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean);

    const emailMatches =
      allowedEmails.includes(cleanUser) ||
      (cleanUser === "admin" && allowedEmails.length > 0);

    if (emailMatches && constantTimeEqual(cleanPass, config.ADMIN_PASSWORD)) {
      return allowedEmails[0] || cleanUser;
    }
  }

  // 2. Check against ADMIN_USERNAME & ADMIN_PASSWORD_SHA256
  if (config.ADMIN_USERNAME && config.ADMIN_PASSWORD_SHA256) {
    if (constantTimeEqual(cleanUser, config.ADMIN_USERNAME.toLowerCase())) {
      const passHash = await sha256(cleanPass);
      if (constantTimeEqual(passHash, config.ADMIN_PASSWORD_SHA256.toLowerCase())) {
        return config.ADMIN_USERNAME;
      }
    }
  }

  return null;
}

export async function createLocalSession(username: string) {
  const expiresAt = Math.floor(Date.now() / 1000) + SESSION_SECONDS;
  const payload = base64UrlEncode(bytes(JSON.stringify({ username, expiresAt })));
  return `${payload}.${await signature(payload, getSessionSecret())}`;
}

async function verifyLocalSession(token: string | undefined): Promise<string | null> {
  if (!token || !isLocalAdminConfigured()) return null;
  const [payload, suppliedSignature] = token.split(".");
  if (!payload || !suppliedSignature) return null;
  const expectedSignature = await signature(payload, getSessionSecret());
  if (!constantTimeEqual(suppliedSignature, expectedSignature)) return null;

  try {
    const value = JSON.parse(new TextDecoder().decode(base64UrlDecode(payload))) as { username?: string; expiresAt?: number };
    if (!value.username) return null;
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
  // 1. Session cookie
  const cookieHeader = request.headers.get("cookie") ?? "";
  const token = cookieHeader
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${COOKIE_NAME}=`))
    ?.slice(COOKIE_NAME.length + 1);
  const fromCookie = await verifyLocalSession(token);
  if (fromCookie) return fromCookie;

  // 2. HTTP Basic Auth header if present
  const authHeader = request.headers.get("authorization") ?? "";
  if (authHeader.startsWith("Basic ")) {
    try {
      const decoded = atob(authHeader.slice(6));
      const colon = decoded.indexOf(":");
      if (colon > 0) {
        const u = decoded.slice(0, colon);
        const p = decoded.slice(colon + 1);
        const verified = await verifyLocalCredentials(u, p);
        if (verified) return verified;
      }
    } catch {
      // ignore decoding error
    }
  }

  return null;
}

export function localSessionCookie(token: string) {
  return `${COOKIE_NAME}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${SESSION_SECONDS}`;
}

export function clearLocalSessionCookie() {
  return `${COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`;
}
