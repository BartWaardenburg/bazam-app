import { Elysia } from 'elysia';
import { eq, desc } from 'drizzle-orm';
import { db } from '../db/client';
import { gameSessions, gameResults } from '../db/schema';
import { logger } from '../utils/logger';

/**
 * REST endpoints for viewing game session history.
 * All routes are prefixed with `/api/sessions` and provide read-only access
 * to completed game sessions and their player results.
 */
export const sessionRoutes = new Elysia({ prefix: '/api/sessions' })
  /**
   * GET /api/sessions
   * Lists the most recent 100 game sessions ordered by start date (newest first).
   *
   * @returns Array of session summary objects with id, quizId, roomCode, playerCount, and timestamps.
   */
  .get('/', async ({ set }) => {
    try {
      const rows = await db
        .select()
        .from(gameSessions)
        .orderBy(desc(gameSessions.startedAt))
        .limit(100);
      return rows.map((s) => ({
        id: s.id,
        quizId: s.quizId,
        roomCode: s.roomCode,
        playerCount: s.playerCount,
        startedAt: s.startedAt.toISOString(),
        endedAt: s.endedAt?.toISOString() ?? null,
      }));
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
        id: s.id,
        quizId: s.quizId,
        roomCode: s.roomCode,
        playerCount: s.playerCount,
        startedAt: s.startedAt.toISOString(),
        endedAt: s.endedAt?.toISOString() ?? null,
        results: results.map((r) => ({
          id: r.id,
          nickname: r.nickname,
          score: r.score,
          rank: r.rank,
          correctAnswers: r.correctAnswers,
          totalAnswers: r.totalAnswers,
        })),
      };
    } catch (error) {
      logger.error('Failed to get session', { error: String(error) });
      set.status = 500;
      return { error: 'Database error' };
    }
  });
