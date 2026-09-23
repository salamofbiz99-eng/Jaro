import { createLocalSession, isLocalAdminConfigured, localSessionCookie, verifyLocalCredentials } from "@/lib/local-auth";

export async function POST(request: Request) {
  if (!isLocalAdminConfigured()) {
    return Response.redirect(new URL("/admin?error=unconfigured", request.url), 303);
  }
  const form = await request.formData();
  const username = String(form.get("username") ?? "");
  const password = String(form.get("password") ?? "");

  const adminEmail = await verifyLocalCredentials(username, password);
  if (!adminEmail) {
    return Response.redirect(new URL("/admin?error=1", request.url), 303);
  }

  const token = await createLocalSession(adminEmail);
  return new Response(null, {
    status: 303,
    headers: {
      location: "/admin",
      "set-cookie": localSessionCookie(token),
    },
  });
}
