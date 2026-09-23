import { clearLocalSessionCookie } from "@/lib/local-auth";

export async function GET(request: Request) {
  const homeUrl = new URL("/", request.url).toString();

  // For HTTP Basic Auth: returning 401 makes the browser forget saved credentials
  // We also clear the local session cookie if present
  return new Response(
    `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Signing out…</title>
    <meta http-equiv="refresh" content="1;url=${homeUrl}">
    <style>body{font-family:sans-serif;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;background:#0a0a0a;color:#fff}
    p{opacity:.6;font-size:14px}</style></head>
    <body><p>Signing out… you will be redirected shortly.</p></body></html>`,
    {
      status: 401,
      headers: {
        "content-type": "text/html; charset=utf-8",
        "www-authenticate": 'Basic realm="JARO Admin", charset="UTF-8"',
        "cache-control": "no-store",
        "set-cookie": clearLocalSessionCookie(),
      },
    }
  );
}
