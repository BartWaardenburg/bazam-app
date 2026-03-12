import { Elysia } from 'elysia';
import { eq, desc } from 'drizzle-orm';
import type { Quiz, QuestionInput } from '@bazam/shared-types';
import { db } from '../db/client';
import { quizzes } from '../db/schema';
import { validateQuestions, validateTitle, INVALID_QUESTIONS_MESSAGE } from '../game/validation';
import { logger } from '../utils/logger';

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** Default page size for quiz listing. */
const DEFAULT_LIMIT = 50;

/** Maps a Drizzle quiz row to the public API shape. */
const mapQuiz = (q: typeof quizzes.$inferSelect): Quiz => ({
  id: q.id,
  title: q.title,
  questions: q.questions,
  createdAt: q.createdAt.toISOString(),
});

/**
 * REST endpoints for quiz CRUD operations.
 * All routes are prefixed with `/api/quizzes` and interact with the quizzes table via Drizzle ORM.
 */
export const quizRoutes = new Elysia({ prefix: '/api/quizzes' })
  /**
   * GET /api/quizzes
   * Lists quizzes ordered by creation date (newest first) with pagination.
   *
   * @returns Array of quiz objects with id, title, questions, and createdAt.
   */
  .get('/', async ({ query, set }) => {
    try {
      const limit = Math.min(Math.max(Number(query['limit']) || DEFAULT_LIMIT, 1), 100);
      const offset = Math.max(Number(query['offset']) || 0, 0);
      const rows = await db.select().from(quizzes).orderBy(desc(quizzes.createdAt)).limit(limit).offset(offset);
      return rows.map(mapQuiz);
    } catch (error) {
      logger.error('Failed to list quizzes', { error: String(error) });
      set.status = 500;
      return { error: 'Database error' };
    }
  })
  /**
   * GET /api/quizzes/:id
   * Retrieves a single quiz by its UUID.
   *
   * @returns The quiz object, or a 404 error if not found.
   */
  .get('/:id', async ({ params, set }) => {
    if (!UUID_RE.test(params.id)) {
      set.status = 400;
      return { error: 'Invalid ID format' };
    }
    try {
      const rows = await db.select().from(quizzes).where(eq(quizzes.id, params.id));
      if (rows.length === 0) {
        set.status = 404;
        return { error: 'Quiz not found' };
      }
      return mapQuiz(rows[0]);
    } catch (error) {
      logger.error('Failed to get quiz', { error: String(error) });
      set.status = 500;
      return { error: 'Database error' };
    }
  })
  /**
   * POST /api/quizzes
   * Creates a new quiz with a validated title and question set.
   * The request body must contain a `title` (string) and `questions` (QuestionInput[]).
   *
   * @returns The created quiz object, or a 400 error if validation fails.
   */
  .post('/', async ({ body, set }) => {
    const { title, questions } = body as { title: unknown; questions: unknown };

    if (!validateTitle(title)) {
      set.status = 400;
      return { error: 'Title must be between 1 and 200 characters' };
    }
    if (!validateQuestions(questions)) {
      set.status = 400;
      return { error: INVALID_QUESTIONS_MESSAGE };
    }

    try {
      const [quiz] = await db
        .insert(quizzes)
        .values({ title: (title as string).trim(), questions })
        .returning();
      return mapQuiz(quiz);
    } catch (error) {
      logger.error('Failed to create quiz', { error: String(error) });
      set.status = 500;
      return { error: 'Database error' };
    }
  })
  /**
   * PUT /api/quizzes/:id
   * Updates an existing quiz's title and/or questions.
   * At least one field must be provided. Each provided field is validated independently.
   *
   * @returns The updated quiz object, or a 404 error if the quiz does not exist.
   */
  .put('/:id', async ({ params, body, set }) => {
    if (!UUID_RE.test(params.id)) {
      set.status = 400;
      return { error: 'Invalid ID format' };
    }

    const { title, questions } = body as { title?: unknown; questions?: unknown };
    const updates: Partial<typeof quizzes.$inferInsert> = {};

    if (title !== undefined) {
      if (!validateTitle(title)) {
        set.status = 400;
        return { error: 'Title must be between 1 and 200 characters' };
      }
      updates.title = (title as string).trim();
    }
    if (questions !== undefined) {
      if (!validateQuestions(questions)) {
        set.status = 400;
        return { error: INVALID_QUESTIONS_MESSAGE };
      }
      updates.questions = questions as QuestionInput[];
    }

    if (Object.keys(updates).length === 0) {
      set.status = 400;
      return { error: 'No fields to update' };
    }

    try {
      const rows = await db
        .update(quizzes)
        .set(updates)
        .where(eq(quizzes.id, params.id))
        .returning();
      if (rows.length === 0) {
        set.status = 404;
        return { error: 'Quiz not found' };
      }
      return mapQuiz(rows[0]);
    } catch (error) {
      logger.error('Failed to update quiz', { error: String(error) });
      set.status = 500;
      return { error: 'Database error' };
    }
  })
  /**
   * DELETE /api/quizzes/:id
   * Deletes a quiz by its UUID.
   *
   * @returns `{ ok: true }` on success, or a 404 error if the quiz does not exist.
   */
  .delete('/:id', async ({ params, set }) => {
    if (!UUID_RE.test(params.id)) {
      set.status = 400;
      return { error: 'Invalid ID format' };
    }
    try {
      const rows = await db
        .delete(quizzes)
        .where(eq(quizzes.id, params.id))
        .returning({ id: quizzes.id });
      if (rows.length === 0) {
        set.status = 404;
        return { error: 'Quiz not found' };
      }
      return { ok: true };
    } catch (error) {
      logger.error('Failed to delete quiz', { error: String(error) });
      set.status = 500;
      return { error: 'Database error' };
    }
  });
