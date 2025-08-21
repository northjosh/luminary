import { trpcServer } from "@hono/trpc-server";
import { createContext } from "./lib/context";
import { appRouter } from "./routers/index";
import { auth } from "./lib/auth";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";

const app = new Hono();

app.use(logger());

// Environment-aware CORS configuration
const getCorsOrigin = () => {
  // Cloudflare Workers environment
  if (typeof globalThis !== "undefined" && "env" in globalThis) {
    // biome-ignore lint/suspicious/noExplicitAny: cf API requires any type
    const cfEnv = (globalThis as any).env;
    return cfEnv?.CORS_ORIGIN || "*";
  }
  // Node.js environment
  return process.env.CORS_ORIGIN || "*";
};

app.use(
  "/*",
  cors({
    origin: getCorsOrigin(),
    allowMethods: ["GET", "POST", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.on(["POST", "GET"], "/api/auth/**", (c) => auth.handler(c.req.raw));

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
