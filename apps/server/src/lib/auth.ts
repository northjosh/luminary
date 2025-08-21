import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "../db";
import * as schema from "../db/schema/auth";
import { getEnvVar } from "./env";

/**
 * Create auth instance with environment context
 * This works for both Cloudflare Workers and Node.js runtimes
 */
export function createAuth(context?: { env?: any }) {
  return betterAuth({
    database: drizzleAdapter(db, {
      provider: "sqlite",
      schema: schema,
    }),
    trustedOrigins: [getEnvVar("CORS_ORIGIN", context, "*")],
    emailAndPassword: {
      enabled: true,
    },
    secret: getEnvVar("BETTER_AUTH_SECRET", context),
    baseURL: getEnvVar("BETTER_AUTH_URL", context),
    advanced: {
      defaultCookieAttributes: {
        sameSite: "none",
        secure: true,
        httpOnly: true,
      },
    },
  });
}

// Default auth instance for Node.js environments
export const auth = createAuth();
