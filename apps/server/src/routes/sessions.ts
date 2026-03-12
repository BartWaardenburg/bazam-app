import { Elysia } from 'elysia';
import { eq, desc } from 'drizzle-orm';
import type { GameSession, GameResultEntry } from '@bazam/shared-types';
import { db } from '../db/client';
import { gameSessions, gameResults } from '../db/schema';
import { logger } from '../utils/logger';

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** Maps a Drizzle session row to the public API shape. */
const mapSession = (s: typeof gameSessions.$inferSelect): GameSession => ({
  id: s.id,
  quizId: s.quizId,
  roomCode: s.roomCode,
  playerCount: s.playerCount,
  startedAt: s.startedAt.toISOString(),
  endedAt: s.endedAt?.toISOString() ?? null,
});

/** Maps a Drizzle result row to the public API shape. */
const mapResult = (r: typeof gameResults.$inferSelect): GameResultEntry => ({
  id: r.id,
  nickname: r.nickname,
  score: r.score,
  rank: r.rank,
  correctAnswers: r.correctAnswers,
  totalAnswers: r.totalAnswers,
});

/**
 * REST endpoints for viewing game session history.
 * All routes are prefixed with `/api/sessions` and provide read-only access
 * to completed game sessions and their player results.
 */
export const sessionRoutes = new Elysia({ prefix: '/api/sessions' })
  /**
   * GET /api/sessions
   * Lists the most recent game sessions ordered by start date (newest first) with pagination.
   *
   * @returns Array of session summary objects with id, quizId, roomCode, playerCount, and timestamps.
   */
  .get('/', async ({ query, set }) => {
    try {
      const limit = Math.min(Math.max(Number(query['limit']) || 100, 1), 100);
      const offset = Math.max(Number(query['offset']) || 0, 0);
      const rows = await db
        .select()
        .from(gameSessions)
        .orderBy(desc(gameSessions.startedAt))
        .limit(limit)
        .offset(offset);
      return rows.map(mapSession);
    } catch (error) {
      logger.error('Failed to list sessions', { error: String(error) });
      set.status = 500;
      return { error: 'Database error' };
    }
  })
  /**
   * GET /api/sessions/:id
   * Retrieves a single game session by its UUID, including the full player results
   * sorted by rank (ascending).
   *
   * @returns The session object with nested results array, or a 404 error if not found.
   */
  .get('/:id', async ({ params, set }) => {
    if (!UUID_RE.test(params.id)) {
      set.status = 400;
      return { error: 'Invalid ID format' };
    }
    try {
      const sessions = await db
        .select()
        .from(gameSessions)
        .where(eq(gameSessions.id, params.id));
      if (sessions.length === 0) {
        set.status = 404;
        return { error: 'Session not found' };
      }
      const s = sessions[0];
      const results = await db
        .select()
        .from(gameResults)
        .where(eq(gameResults.sessionId, s.id))
        .orderBy(gameResults.rank);
      return {
        ...mapSession(s),
        results: results.map(mapResult),
      };
    } catch (error) {
      logger.error('Failed to get session', { error: String(error) });
      set.status = 500;
      return { error: 'Database error' };
    }
  });
