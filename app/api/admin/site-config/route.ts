import { saveSiteConfig } from "@/db/site-config";
import { isAdminEmail } from "@/lib/admin-auth";
import { getLocalAdminFromRequest } from "@/lib/local-auth";
import { sanitizeSiteConfig } from "@/lib/site-config";

async function authenticateAdmin(request: Request): Promise<string | null> {
  const localAdmin = await getLocalAdminFromRequest(request);
  if (localAdmin) return localAdmin;

  const email = request.headers.get("oai-authenticated-user-email");
  if (email && isAdminEmail(email)) return email;

  return null;
}

export async function PUT(request: Request) {
  const adminIdentifier = await authenticateAdmin(request);
  if (!adminIdentifier) {
    return Response.json({ ok: false, error: "Administrator authorization required." }, { status: 401 });
  }

  try {
    const config = sanitizeSiteConfig(await request.json());
    const updatedAt = await saveSiteConfig(config, adminIdentifier);
    return Response.json({ ok: true, updatedAt });
  } catch {
    return Response.json({ ok: false, error: "The settings could not be saved. Please try again." }, { status: 500 });
  }
}
