import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import { getEnvVar } from "@/lib/env";
/**
 * Create database connection with environment context
 * This works for both Cloudflare Workers and Node.js runtimes
 */
export function createDatabase(context?: { env?: any }) {
  const client = createClient({
    url: getEnvVar("DATABASE_URL", context, ""),
    authToken: getEnvVar("DATABASE_TOKEN", context, ""),
  });

  return {
    db: drizzle({ client }),
    client,
  };
}

// Default database instance for Node.js environments
const { db, client } = createDatabase();

export { db };
export { client };
