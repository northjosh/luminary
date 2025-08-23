import { neon, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { drizzle as pdrizzle } from 'drizzle-orm/postgres-js';
import ws from 'ws';

neonConfig.webSocketConstructor = ws;

// To work in edge environments (Cloudflare Workers, Vercel Edge, etc.), enable querying over fetch
// neonConfig.poolQueryViaFetch = true

const createDb = () => {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error('DATABASE_URL is required');
  }

  if (databaseUrl.includes('neon.tech')) {
    const sql = neon(databaseUrl);
    return drizzle(sql);
  }
  return pdrizzle(databaseUrl);
};

export const db = createDb();
