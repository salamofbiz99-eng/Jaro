function configuredAdminEmails() {
  const runtime = (globalThis as unknown as { __JARO_ENV__?: Record<string, unknown> }).__JARO_ENV__;
  const value = runtime?.ADMIN_EMAILS;
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
