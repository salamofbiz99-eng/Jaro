import { clearLocalSessionCookie } from "@/lib/local-auth";

export async function GET(request: Request) {
  return new Response(null, {
    status: 303,
    headers: { location: new URL("/", request.url).toString(), "set-cookie": clearLocalSessionCookie() },
  });
}
