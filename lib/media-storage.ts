import fs from "node:fs";
import path from "node:path";

function getLocalDiskBucket() {
  const uploadsDir = process.env.UPLOADS_DIR || "./data/uploads";
  return {
    async put(key: string, data: ArrayBuffer | Uint8Array, options?: { httpMetadata?: { contentType?: string } }) {
      const filePath = path.join(uploadsDir, key);
      await fs.promises.mkdir(path.dirname(filePath), { recursive: true });
      await fs.promises.writeFile(filePath, Buffer.from(data as any));
      const metaPath = `${filePath}.meta.json`;
      if (options?.httpMetadata) {
        await fs.promises.writeFile(metaPath, JSON.stringify(options.httpMetadata));
      }
    },
    async get(key: string) {
      const filePath = path.join(uploadsDir, key);
      try {
        const fileData = await fs.promises.readFile(filePath);
        const metaPath = `${filePath}.meta.json`;
        let contentType = "application/octet-stream";
        if (fs.existsSync(metaPath)) {
          try {
            const meta = JSON.parse(await fs.promises.readFile(metaPath, "utf-8"));
            contentType = meta.contentType || contentType;
          } catch {}
        }
        return {
          body: fileData,
          httpEtag: `"${fileData.length}-${fs.statSync(filePath).mtimeMs}"`,
          writeHttpMetadata(headers: Headers) {
            headers.set("content-type", contentType);
          },
        };
      } catch {
        return null;
      }
    },
  };
}

export function getMediaBucket() {
  return getLocalDiskBucket();
}
