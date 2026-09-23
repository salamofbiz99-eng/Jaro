import { createLocalSession, isLocalAdminConfigured, localSessionCookie, verifyLocalCredentials } from "@/lib/local-auth";

export async function POST(request: Request) {
  if (!isLocalAdminConfigured()) return Response.redirect(new URL("/admin", request.url), 303);
  const form = await request.formData();
  const username = String(form.get("username") ?? "");
  const password = String(form.get("password") ?? "");
  if (!(await verifyLocalCredentials(username, password))) {
    return Response.redirect(new URL("/admin/login?error=1", request.url), 303);
  }
  const token = await createLocalSession(username.trim());
  return new Response(null, {
    status: 303,
    headers: { location: "/admin", "set-cookie": localSessionCookie(token) },
  });
}
