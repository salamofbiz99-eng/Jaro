import { DEFAULT_SITE_CONFIG, sanitizeSiteConfig, type SiteConfig } from "@/lib/site-config";

type JaroRuntime = { DB?: D1Database };

const CREATE_SITE_SETTINGS = `
  CREATE TABLE IF NOT EXISTS site_settings (
    id INTEGER PRIMARY KEY,
    content_json TEXT NOT NULL,
    updated_by TEXT NOT NULL,
    updated_at TEXT NOT NULL
  )
`;

async function database() {
  const db = (globalThis as unknown as { __JARO_ENV__?: JaroRuntime }).__JARO_ENV__?.DB;
  if (!db) throw new Error("The site database is not available.");
  await db.prepare(CREATE_SITE_SETTINGS).run();
  return db;
}

export async function getSiteConfig(): Promise<SiteConfig> {
  const db = await database();
  const row = await db
    .prepare("SELECT content_json FROM site_settings WHERE id = ?")
    .bind(1)
    .first<{ content_json: string }>();

  if (!row) return DEFAULT_SITE_CONFIG;

  try {
    return sanitizeSiteConfig(JSON.parse(row.content_json));
  } catch {
    return DEFAULT_SITE_CONFIG;
  }
}

export async function saveSiteConfig(config: SiteConfig, updatedBy: string) {
  const db = await database();
  const now = new Date().toISOString();
  await db
    .prepare(`
      INSERT INTO site_settings (id, content_json, updated_by, updated_at)
      VALUES (?, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET
        content_json = excluded.content_json,
        updated_by = excluded.updated_by,
        updated_at = excluded.updated_at
    `)
    .bind(1, JSON.stringify(config), updatedBy, now)
    .run();
  return now;
}
