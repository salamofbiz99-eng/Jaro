import { getMediaBucket } from "@/lib/media-storage";

export async function GET(_request: Request, context: { params: Promise<{ key: string[] }> }) {
  const { key: keyParts } = await context.params;
  const key = keyParts.join("/");
  if (!key.startsWith("service-photos/") || key.includes("..")) return new Response("Not found", { status: 404 });

  const object = await getMediaBucket().get(key);
  if (!object) return new Response("Not found", { status: 404 });

  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set("etag", object.httpEtag);
  headers.set("cache-control", "public, max-age=31536000, immutable");
  headers.set("x-content-type-options", "nosniff");
  return new Response(object.body, { headers });
}
