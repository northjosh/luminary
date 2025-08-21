// Environment abstraction layer for dual runtime support
type EnvironmentVariables = {
  CORS_ORIGIN?: string;
  BETTER_AUTH_SECRET?: string;
  BETTER_AUTH_URL?: string;
  DATABASE_URL?: string;
  DATABASE_TOKEN?: string;
  NODE_ENV?: string;
};

/**
 * Get environment variables in a runtime-agnostic way
 * Works with both Cloudflare Workers and Node.js/Vercel
 */
export function getEnv(context?: { env?: any }): EnvironmentVariables {
  // Cloudflare Workers environment (passed through context)
  if (context?.env) {
    return context.env;
  }

  // Node.js environment (process.env)
  return process.env as EnvironmentVariables;
}

/**
 * Type-safe environment variable getter with fallbacks
 */
export function getEnvVar(
  key: keyof EnvironmentVariables,
  context?: { env?: any },
  fallback?: string
): string {
  const env = getEnv(context);
  return env[key] || fallback || "";
}
