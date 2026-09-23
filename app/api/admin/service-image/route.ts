import { isAdminEmail } from "@/lib/admin-auth";
import { DEFAULT_SITE_CONFIG } from "@/lib/site-config";
import { getMediaBucket } from "@/lib/media-storage";

const MAX_IMAGE_SIZE = 8 * 1024 * 1024;
const extensions: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

export async function POST(request: Request) {
  const email = request.headers.get("oai-authenticated-user-email");
  if (!email) return Response.json({ ok: false, error: "Please sign in again." }, { status: 401 });
  if (!isAdminEmail(email)) return Response.json({ ok: false, error: "This account is not allowed to edit JARO Cleaning." }, { status: 403 });

  try {
    const form = await request.formData();
    const image = form.get("image");
    const serviceNumber = String(form.get("serviceNumber") || "").trim();
    if (!(image instanceof File)) return Response.json({ ok: false, error: "Choose a photo first." }, { status: 400 });
    if (!DEFAULT_SITE_CONFIG.services.some((service) => service.number === serviceNumber)) {
      return Response.json({ ok: false, error: "Unknown service." }, { status: 400 });
    }
    const extension = extensions[image.type];
    if (!extension) return Response.json({ ok: false, error: "Use a JPG, PNG or WebP photo." }, { status: 415 });
    if (image.size < 1 || image.size > MAX_IMAGE_SIZE) {
      return Response.json({ ok: false, error: "The photo must be smaller than 8 MB." }, { status: 413 });
    }

    const key = `service-photos/${serviceNumber}/${crypto.randomUUID()}.${extension}`;
    await getMediaBucket().put(key, await image.arrayBuffer(), {
      httpMetadata: { contentType: image.type, cacheControl: "public, max-age=31536000, immutable" },
      customMetadata: { uploadedBy: email, serviceNumber },
    });

    return Response.json({ ok: true, url: `/api/media/${key}` });
  } catch {
    return Response.json({ ok: false, error: "The photo could not be uploaded. Please try again." }, { status: 500 });
  }
}
