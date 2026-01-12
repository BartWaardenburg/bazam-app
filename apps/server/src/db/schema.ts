import { pgTable, uuid, text, timestamp, jsonb, integer } from 'drizzle-orm/pg-core';
import type { QuestionInput } from '@bazam/shared-types';

export const quizzes = pgTable('quizzes', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: text('title').notNull(),
  questions: jsonb('questions').notNull().$type<QuestionInput[]>(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const gameSessions = pgTable('game_sessions', {
  id: uuid('id').primaryKey().defaultRandom(),
  quizId: uuid('quiz_id').references(() => quizzes.id),
  roomCode: text('room_code').notNull(),
  playerCount: integer('player_count').notNull().default(0),
  startedAt: timestamp('started_at').defaultNow().notNull(),
  endedAt: timestamp('ended_at'),
});

export const gameResults = pgTable('game_results', {
  id: uuid('id').primaryKey().defaultRandom(),
  sessionId: uuid('session_id').references(() => gameSessions.id).notNull(),
  nickname: text('nickname').notNull(),
  score: integer('score').notNull().default(0),
  rank: integer('rank').notNull(),
  correctAnswers: integer('correct_answers').notNull().default(0),
  totalAnswers: integer('total_answers').notNull().default(0),
});
