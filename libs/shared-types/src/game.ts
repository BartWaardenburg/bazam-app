export type GamePhase = 'idle' | 'lobby' | 'countdown' | 'question' | 'leaderboard' | 'finished';

/** Index into a four-option answer array. */
export type AnswerIndex = 0 | 1 | 2 | 3;

export interface QuestionInput {
  text: string;
  answers: [string, string, string, string];
  correctIndex: AnswerIndex;
  timeLimitSeconds: number;
}

export interface QuestionPublic {
  text: string;
  answers: [string, string, string, string];
  timeLimitSeconds: number;
}

export interface PlayerInfo {
  id: string;
  nickname: string;
  score: number;
  hasAnswered: boolean;
}

export interface LeaderboardEntry {
  id: string;
  nickname: string;
  score: number;
  rank: number;
  previousRank: number | null;
  streak: number;
}

export interface AnswerResult {
  correct: boolean;
  score: number;
  totalScore: number;
  correctIndex: AnswerIndex;
}
