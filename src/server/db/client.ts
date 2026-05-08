import { drizzle, type DrizzleD1Database } from "drizzle-orm/d1";
import * as schema from "./schema";

export type AppDatabase = DrizzleD1Database<typeof schema>;

export function createDatabase(db: D1Database): AppDatabase {
  return drizzle(db, { schema });
}
