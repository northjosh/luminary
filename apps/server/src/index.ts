import { trpcServer } from "@hono/trpc-server";
import { createContext } from "./lib/context";
import { appRouter } from "./routers/index";
import { createAuth } from "./lib/auth";
import { Hono, type Context, type Next } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";

const app = new Hono();

app.use(logger());

// Environment-aware CORS configuration
const getCorsOrigin = (c: Context): string => {
  // Since Cloudflare Workers  pass env through the fetch/route handler
  // we use this middle ware to use the context passed from Hono's handler to retrieve
  // the env vars, If null we fall back to NodeJS's env for the variables.
  // Nullability may depend on runtime environment or failure to pass env vars.
  return c.env?.CORS_ORIGIN ?? process.env.CORS_ORIGIN ?? "*";
};

const corsMiddleware = (c: Context, next: Next) => {
  const origin = getCorsOrigin(c);
  return cors({
    origin: origin === "*" ? "*" : origin.split(","), // for multiple comma separated origins
    allowMethods: ["GET", "POST", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })(c, next);
};

app.use("/*", corsMiddleware);

app.on(["POST", "GET"], "/api/auth/**", (c) => {
  const auth = createAuth(c);
  return auth.handler(c.req.raw);
});

app.use(
  "/trpc/*",
  trpcServer({
    router: appRouter,
    createContext: (_opts, context) => {
      return createContext({ context });
    },
  })
);

app.get("/", (c) => {
  return c.text("OK");
});

// Default export for both Cloudflare Workers and Vercel
export default app;
