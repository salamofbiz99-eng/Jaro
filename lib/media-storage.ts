type MediaRuntime = { BUCKET?: R2Bucket };

export function getMediaBucket() {
  const bucket = (globalThis as unknown as { __JARO_ENV__?: MediaRuntime }).__JARO_ENV__?.BUCKET;
  if (!bucket) throw new Error("The media bucket is not available.");
  return bucket;
}
