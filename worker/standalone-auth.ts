type AuthEnv = { ADMIN_EMAILS?: string; ADMIN_PASSWORD?: string };
const protectedPath = (path: string) => path === "/admin" || path.startsWith("/admin/") || path === "/api/admin" || path.startsWith("/api/admin/");
const deny = () => new Response("Administrator sign-in required.", { status: 401, headers: { "WWW-Authenticate": 'Basic realm="JARO Admin", charset="UTF-8"', "Cache-Control": "no-store" } });
async function equal(a: string, b: string) {
  const digest = async (s: string) => new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s)));
  const [x,y] = await Promise.all([digest(a),digest(b)]);
  let diff = 0;
  for (let i=0;i<x.length;i++) diff |= x[i] ^ y[i];
  return diff === 0;
}
export async function authenticate(request: Request, env: AuthEnv): Promise<Request | Response> {
  const adminEmails = env.ADMIN_EMAILS ?? (typeof process !== "undefined" ? process.env?.ADMIN_EMAILS : undefined);
  const adminPassword = env.ADMIN_PASSWORD ?? (typeof process !== "undefined" ? process.env?.ADMIN_PASSWORD : undefined);
  const url = new URL(request.url);
  const headers = new Headers(request.headers);
  for (const key of [...headers.keys()]) if (key.startsWith("oai-")) headers.delete(key);
  if (url.pathname === "/signin-with-chatgpt") return Response.redirect(new URL("/admin",url).href,302);
  if (url.pathname === "/signout-with-chatgpt") return new Response("Close the private browser window to clear the saved administrator login.", { headers: { "Cache-Control":"no-store" } });
  if (protectedPath(url.pathname)) {
    const email = adminEmails?.split(",")[0]?.trim().toLowerCase();
    if (!email || !adminPassword || adminPassword.length < 20) return new Response("Administrator access is not configured.", {status:503});
    if (url.protocol !== "https:" && !["localhost","127.0.0.1"].includes(url.hostname)) return new Response("HTTPS required.",{status:403});
    if (!["GET","HEAD","OPTIONS"].includes(request.method) && request.headers.get("origin") !== url.origin) return new Response("Invalid request origin.",{status:403});
    let decoded = "";
    try { const auth = request.headers.get("authorization") || ""; if (auth.startsWith("Basic ")) decoded = new TextDecoder().decode(Uint8Array.from(atob(auth.slice(6)), c=>c.charCodeAt(0))); } catch { return deny(); }
    const colon = decoded.indexOf(":");
    if (colon < 0 || decoded.slice(0,colon).toLowerCase() !== email || !await equal(decoded.slice(colon+1),adminPassword)) return deny();
    headers.set("oai-authenticated-user-email",email);
  }
  headers.delete("authorization");
  return new Request(request,{headers});
}
