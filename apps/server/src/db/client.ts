import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

const connectionString = process.env['DATABASE_URL'] ?? 'postgresql://bazam:bazam@localhost:5432/bazam';

const client = postgres(connectionString);

/** Drizzle ORM database instance with the Bazam schema. */
export const db = drizzle(client, { schema });
