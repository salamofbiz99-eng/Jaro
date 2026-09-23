import { getSiteConfig } from "@/db/site-config";
import { saveQuoteRequest, updateQuoteEmailStatus, type QuoteRequestInput } from "@/db/quote-requests";

type MailRuntime = {
  RESEND_API_KEY?: string;
  RESEND_FROM_EMAIL?: string;
};

function text(value: unknown, maxLength: number) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

function requestInput(value: unknown): QuoteRequestInput & { website: string } {
  const body = value && typeof value === "object" ? value as Record<string, unknown> : {};
  return {
    service: text(body.service, 100),
    propertyType: text(body.propertyType, 80),
    postcode: text(body.postcode, 20),
    approximateSize: text(body.approximateSize, 20),
    preferredDate: text(body.preferredDate, 30) || "Flexible",
    name: text(body.name, 100),
    contact: text(body.contact, 160),
    details: text(body.details, 1200) || "No extra details",
    website: text(body.website, 200),
  };
}

function message(input: QuoteRequestInput, id: number) {
  return [
    `New JARO Cleaning request #${id}`,
    "",
    `Service: ${input.service}`,
    `Property: ${input.propertyType}`,
    `Postcode: ${input.postcode}`,
    `Approx. size: ${input.approximateSize} m²`,
    `Preferred date: ${input.preferredDate}`,
    `Name: ${input.name}`,
    `Contact: ${input.contact}`,
    `Details: ${input.details}`,
  ].join("\n");
}

async function emailRequest(input: QuoteRequestInput, id: number, destination: string) {
  const runtime = (globalThis as unknown as { __JARO_ENV__?: MailRuntime }).__JARO_ENV__;
  const apiKey = runtime?.RESEND_API_KEY;
  const from = runtime?.RESEND_FROM_EMAIL;
  if (!apiKey || !from || !destination) return false;

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      authorization: `Bearer ${apiKey}`,
      "content-type": "application/json",
      "idempotency-key": `jaro-quote-${id}`,
      "user-agent": "jaro-cleaning-site/1.0",
    },
    body: JSON.stringify({
      from,
      to: [destination],
      subject: `New cleaning request #${id} — ${input.service}`,
      text: message(input, id),
      ...(input.contact.includes("@") ? { reply_to: input.contact } : {}),
    }),
  });
  return response.ok;
}

export async function POST(request: Request) {
  try {
    const input = requestInput(await request.json());
    if (input.website) return Response.json({ ok: true, emailed: true });
    if (!input.service || !input.propertyType || !input.postcode || !input.approximateSize || !input.name || !input.contact) {
      return Response.json({ ok: false, error: "Complete all required fields." }, { status: 400 });
    }

    const quote: QuoteRequestInput = {
      service: input.service,
      propertyType: input.propertyType,
      postcode: input.postcode,
      approximateSize: input.approximateSize,
      preferredDate: input.preferredDate,
      name: input.name,
      contact: input.contact,
      details: input.details,
    };
    const saved = await saveQuoteRequest(quote);
    const config = await getSiteConfig();
    const emailed = await emailRequest(quote, saved.id, config.business.email);
    await updateQuoteEmailStatus(saved.id, emailed ? "sent" : config.business.email ? "failed" : "not-configured");

    return Response.json({ ok: true, emailed, requestId: saved.id });
  } catch {
    return Response.json({ ok: false, error: "Your request could not be sent. Please try WhatsApp or call JARO." }, { status: 500 });
  }
}
