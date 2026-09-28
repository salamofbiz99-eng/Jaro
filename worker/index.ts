import { authenticate } from "./standalone-auth";
import { handleImageOptimization, DEFAULT_DEVICE_SIZES, DEFAULT_IMAGE_SIZES } from "vinext/server/image-optimization";
import handler from "vinext/server/app-router-entry";

interface ServerEnv {
  ADMIN_EMAILS?: string;
  ADMIN_PASSWORD?: string;
  RESEND_API_KEY?: string;
  RESEND_FROM_EMAIL?: string;
}

interface ExecutionContext {
  waitUntil?(promise: Promise<unknown>): void;
  passThroughOnException?(): void;
}

// Static asset extensions that should be cached long-term
const STATIC_EXTENSIONS = /\.(js|css|woff2?|ttf|otf|ico|png|jpg|jpeg|webp|avif|gif|svg)$/i;

const serverHandler = {
  async fetch(request: Request, env?: ServerEnv, ctx?: ExecutionContext): Promise<Response> {
    const runtimeEnv = env || {};
    (globalThis as unknown as { __JANOR_ENV__?: ServerEnv; __JARO_ENV__?: ServerEnv }).__JANOR_ENV__ = runtimeEnv;
    (globalThis as unknown as { __JANOR_ENV__?: ServerEnv; __JARO_ENV__?: ServerEnv }).__JARO_ENV__ = runtimeEnv;
    const authenticated = await authenticate(request, runtimeEnv);
    if (authenticated instanceof Response) return authenticated;
    request = authenticated;
    const url = new URL(request.url);

    if (url.pathname === "/_vinext/image") {
      const allowedWidths = [...DEFAULT_DEVICE_SIZES, ...DEFAULT_IMAGE_SIZES];
      const imgResponse = await handleImageOptimization(request, {
        fetchAsset: (path) => fetch(new URL(path, request.url).href),
        transformImage: async (body) => new Response(body),
      }, allowedWidths);
      // Cache optimized images for 1 week
      const cachedImg = new Response(imgResponse.body, imgResponse);
      cachedImg.headers.set("Cache-Control", "public, max-age=604800, stale-while-revalidate=86400");
      return cachedImg;
    }

    const response = await handler.fetch(request, runtimeEnv as any, ctx as any);

    // Admin paths: never cache
    if (url.pathname.startsWith("/admin") || url.pathname.startsWith("/api/admin")) {
      const protectedResponse = new Response(response.body, response);
      protectedResponse.headers.set("Cache-Control", "no-store");
      return protectedResponse;
    }

    // Static assets (_next/static): cache 1 year immutable
    if (url.pathname.startsWith("/_next/static/") || STATIC_EXTENSIONS.test(url.pathname)) {
      const staticResponse = new Response(response.body, response);
      staticResponse.headers.set("Cache-Control", "public, max-age=31536000, immutable");
      return staticResponse;
    }

    // SEO / discovery files: cache 1 day
    if (
      url.pathname === "/sitemap.xml" ||
      url.pathname === "/robots.txt" ||
      url.pathname === "/site.webmanifest"
    ) {
      const seoResponse = new Response(response.body, response);
      seoResponse.headers.set("Cache-Control", "public, max-age=86400");
      return seoResponse;
    }

    // HTML pages: no-store so admin changes appear immediately
    const dynamicResponse = new Response(response.body, response);
    dynamicResponse.headers.set("Cache-Control", "no-store, no-cache, must-revalidate");
    // Security headers (positive signal for Google ranking)
    dynamicResponse.headers.set("X-Content-Type-Options", "nosniff");
    dynamicResponse.headers.set("X-Frame-Options", "SAMEORIGIN");
    dynamicResponse.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
    return dynamicResponse;
  },
};

export default serverHandler;
