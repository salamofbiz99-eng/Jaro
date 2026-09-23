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

const serverHandler = {
  async fetch(request: Request, env?: ServerEnv, ctx?: ExecutionContext): Promise<Response> {
    const runtimeEnv = env || {};
    (globalThis as unknown as { __JARO_ENV__?: ServerEnv }).__JARO_ENV__ = runtimeEnv;
    const authenticated = await authenticate(request, runtimeEnv);
    if (authenticated instanceof Response) return authenticated;
    request = authenticated;
    const url = new URL(request.url);

    if (url.pathname === "/_vinext/image") {
      const allowedWidths = [...DEFAULT_DEVICE_SIZES, ...DEFAULT_IMAGE_SIZES];
      return handleImageOptimization(request, {
        fetchAsset: (path) => fetch(new URL(path, request.url).href),
        transformImage: async (body) => {
          return new Response(body);
        },
      }, allowedWidths);
    }

    const response = await handler.fetch(request, runtimeEnv, ctx);
    if (url.pathname.startsWith("/admin") || url.pathname.startsWith("/api/admin")) {
      const protectedResponse = new Response(response.body, response);
      protectedResponse.headers.set("Cache-Control", "no-store");
      return protectedResponse;
    }
    return response;
  },
};

export default serverHandler;
