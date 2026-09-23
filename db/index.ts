import { getLocalSqliteAdapter } from "./sqlite-fallback";

export function getDb() {
  return getLocalSqliteAdapter();
}
