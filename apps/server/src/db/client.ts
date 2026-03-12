import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';
import { logger } from '../utils/logger';

const connectionString = process.env['DATABASE_URL'] ?? 'postgresql://bazam:bazam@localhost:5432/bazam';

if (!process.env['DATABASE_URL']) {
  logger.warn('DATABASE_URL not set — using local dev fallback');
}

const client = postgres(connectionString, {
  max: 10,
  idle_timeout: 30,
  connect_timeout: 10,
});

/** Drizzle ORM database instance with the Bazam schema. */
export const db = drizzle(client, { schema });
