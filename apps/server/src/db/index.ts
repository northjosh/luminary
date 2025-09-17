import { neon, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { drizzle as pdrizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import ws from 'ws';
import * as authSchema from './schema/auth';
import * as gallerySchema from './schema/gallery';

neonConfig.webSocketConstructor = ws;

// To work in edge environments (Cloudflare Workers, Vercel Edge, etc.), enable querying over fetch
// neonConfig.poolQueryViaFetch = true

const schema = { ...authSchema, ...gallerySchema };

const createDb = () => {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error('DATABASE_URL is required');
  }

  if (databaseUrl.includes('neon.tech')) {
    // Create and reuse Neon client instance
    const client = neon(databaseUrl);
    return drizzle(client, { schema });
  }
  
  // Create and reuse postgres client instance
  const client = postgres(databaseUrl, {max: 1, prepare: false});
  return pdrizzle(client, { schema });
};

export const db = createDb();
