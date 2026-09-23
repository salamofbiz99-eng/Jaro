import { DatabaseSync } from "node:sqlite";
import fs from "node:fs";
import path from "node:path";

let localAdapterInstance: any = null;

export function getLocalSqliteAdapter() {
  if (localAdapterInstance) return localAdapterInstance;

  const dbPath = process.env.DATABASE_PATH || "./data/jaro.db";
  fs.mkdirSync(path.dirname(dbPath), { recursive: true });
  const sqlite = new DatabaseSync(dbPath);

  localAdapterInstance = {
    prepare(sql: string) {
      const createBound = (args: any[]) => ({
        async run() {
          const stmt = sqlite.prepare(sql);
          const info = stmt.run(...args);
          return { meta: { last_row_id: Number(info.lastInsertRowid) } };
        },
        async first<T = Record<string, unknown>>(): Promise<T | null> {
          const stmt = sqlite.prepare(sql);
          const row = stmt.get(...args) as T | undefined;
          return row ?? null;
        },
        async all<T = Record<string, unknown>>(): Promise<{ results: T[] }> {
          const stmt = sqlite.prepare(sql);
          const results = stmt.all(...args) as T[];
          return { results };
        }
      });

      return {
        bind(...args: any[]) {
          return createBound(args);
        },
        async run() {
          return createBound([]).run();
        },
        async first<T = Record<string, unknown>>() {
          return createBound([]).first<T>();
        },
        async all<T = Record<string, unknown>>() {
          return createBound([]).all<T>();
        }
      };
    }
  };

  return localAdapterInstance;
}
