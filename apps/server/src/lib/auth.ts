import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "../db";
import * as schema from "../db/schema/auth";
// import { env } from "cloudflare:workers";

export const getEnv = async () => {
	if (process.env.BUILD_TARGET === 'cloudflare') {
	  // This gets compiled only for Cloudflare
	  const { env } = await import('cloudflare:workers');
	  return env;
	} else {
	  return process.env;
	}
  };

const env = await getEnv()

console.log(env)


export const auth = betterAuth({
	database: drizzleAdapter(db, {
		provider: "sqlite",

		schema: schema,
	}),
	trustedOrigins: [env.CORS_ORIGIN],
	emailAndPassword: {
		enabled: true,
	},
	secret: env.BETTER_AUTH_SECRET,
	baseURL: env.BETTER_AUTH_URL,
	advanced: {
		defaultCookieAttributes: {
			sameSite: "none",
			secure: true,
			httpOnly: true,
		},
	},
});
