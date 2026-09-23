import { saveSiteConfig } from "@/db/site-config";
import { isAdminEmail } from "@/lib/admin-auth";
import { sanitizeSiteConfig } from "@/lib/site-config";

export async function PUT(request: Request) {
  const email = request.headers.get("oai-authenticated-user-email");
  if (!email) return Response.json({ ok: false, error: "Please sign in again." }, { status: 401 });
  if (!isAdminEmail(email)) return Response.json({ ok: false, error: "This account is not allowed to edit JARO Cleaning." }, { status: 403 });

  try {
    const config = sanitizeSiteConfig(await request.json());
    const updatedAt = await saveSiteConfig(config, email);
    return Response.json({ ok: true, updatedAt });
  } catch {
    return Response.json({ ok: false, error: "The settings could not be saved. Please try again." }, { status: 500 });
  }
}
