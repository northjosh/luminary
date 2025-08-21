import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import { getEnv } from "@/lib/auth";
import { env } from "cloudflare:workers";

// const env = await getEnv()

const client = createClient({
	url: env.DATABASE_URL || "",
	authToken: env.DATABASE_TOKEN || ""
});

export const db = drizzle({ client });
