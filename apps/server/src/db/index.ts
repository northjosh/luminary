import { drizzle } from "drizzle-orm/libsql";
import { env } from "cloudflare:workers";
import { createClient } from "@libsql/client";

const client = createClient({
	url: env.DATABASE_URL || "",
});

export const db = drizzle({ client });
