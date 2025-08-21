// Node.js entry point for Vercel deployments
import { serve } from "@hono/node-server";
import app from "./index";

const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

// For local development with Node.js
if (process.env.NODE_ENV !== "production") {
  console.log(`Server is running on port ${port}`);
  serve({
    fetch: app.fetch,
    port,
  });
}

// Export for Vercel
export default app;
-