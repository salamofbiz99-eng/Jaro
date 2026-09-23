function configuredAdminEmails() {
  const globalObj = globalThis as unknown as { __JANOR_ENV__?: Record<string, unknown>; __JARO_ENV__?: Record<string, unknown> };
  const runtime = globalObj.__JANOR_ENV__ ?? globalObj.__JARO_ENV__;
  const value = runtime?.ADMIN_EMAILS ?? (typeof process !== "undefined" ? process.env?.ADMIN_EMAILS : undefined);
  if (typeof value !== "string") return [];
  return value
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

export function isAdminEmail(email: string) {
  return configuredAdminEmails().includes(email.trim().toLowerCase());
}

export function isAdminConfigured() {
  return configuredAdminEmails().length > 0;
}
