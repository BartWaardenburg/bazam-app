import { pgTable, uuid, text, timestamp, jsonb, integer, index, uniqueIndex } from 'drizzle-orm/pg-core';
import type { QuestionInput } from '@bazam/shared-types';

/** Stored quiz templates with their questions. */
export const quizzes = pgTable('quizzes', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: text('title').notNull(),
  questions: jsonb('questions').notNull().$type<QuestionInput[]>(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

/** Records of played game sessions linked to a quiz. */
export const gameSessions = pgTable('game_sessions', {
  id: uuid('id').primaryKey().defaultRandom(),
  quizId: uuid('quiz_id').references(() => quizzes.id, { onDelete: 'set null' }),
  roomCode: text('room_code').notNull(),
  playerCount: integer('player_count').notNull().default(0),
  startedAt: timestamp('started_at').defaultNow().notNull(),
  endedAt: timestamp('ended_at'),
}, (t) => ({
  quizIdIdx: index('session_quiz_id_idx').on(t.quizId),
  roomCodeIdx: uniqueIndex('session_room_code_idx').on(t.roomCode),
}));

/** Individual player results within a game session. */
export const gameResults = pgTable('game_results', {
  id: uuid('id').primaryKey().defaultRandom(),
  sessionId: uuid('session_id').references(() => gameSessions.id, { onDelete: 'cascade' }).notNull(),
  nickname: text('nickname').notNull(),
  score: integer('score').notNull().default(0),
  rank: integer('rank').notNull(),
  correctAnswers: integer('correct_answers').notNull().default(0),
  totalAnswers: integer('total_answers').notNull().default(0),
}, (t) => ({
  sessionIdIdx: index('result_session_id_idx').on(t.sessionId),
}));
