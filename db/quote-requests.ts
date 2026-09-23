type QuoteRuntime = { DB?: D1Database };

export type QuoteRequestInput = {
  service: string;
  propertyType: string;
  postcode: string;
  approximateSize: string;
  preferredDate: string;
  name: string;
  contact: string;
  details: string;
};

const CREATE_QUOTE_REQUESTS = `
  CREATE TABLE IF NOT EXISTS quote_requests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    service TEXT NOT NULL,
    property_type TEXT NOT NULL,
    postcode TEXT NOT NULL,
    approximate_size TEXT NOT NULL,
    preferred_date TEXT NOT NULL,
    name TEXT NOT NULL,
    contact TEXT NOT NULL,
    details TEXT NOT NULL,
    email_status TEXT NOT NULL,
    created_at TEXT NOT NULL
  )
`;

function database() {
  const db = (globalThis as unknown as { __JARO_ENV__?: QuoteRuntime }).__JARO_ENV__?.DB;
  if (!db) throw new Error("The site database is not available.");
  return db;
}

export async function saveQuoteRequest(input: QuoteRequestInput) {
  const db = database();
  await db.prepare(CREATE_QUOTE_REQUESTS).run();
  const createdAt = new Date().toISOString();
  const result = await db.prepare(`
    INSERT INTO quote_requests (
      service, property_type, postcode, approximate_size, preferred_date,
      name, contact, details, email_status, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).bind(
    input.service,
    input.propertyType,
    input.postcode,
    input.approximateSize,
    input.preferredDate,
    input.name,
    input.contact,
    input.details,
    "pending",
    createdAt,
  ).run();
  return { id: Number(result.meta.last_row_id), createdAt };
}

export async function updateQuoteEmailStatus(id: number, status: "sent" | "failed" | "not-configured") {
  const db = database();
  await db.prepare("UPDATE quote_requests SET email_status = ? WHERE id = ?").bind(status, id).run();
}
