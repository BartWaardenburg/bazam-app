/** Default time limit for a question in seconds. */
export const DEFAULT_TIME_LIMIT_SECONDS = 20;

/** Maximum allowed length for a player nickname. */
export const MAX_NICKNAME_LENGTH = 32;

/** Current phase of the game lifecycle. */
export type GamePhase = 'idle' | 'lobby' | 'countdown' | 'question' | 'leaderboard' | 'finished';

/** Machine-readable error codes sent in ERROR messages. */
export type ErrorCode =
  | 'INVALID_MESSAGE'
  | 'CREATE_ROOM_FAILED'
  | 'JOIN_ROOM_FAILED'
  | 'START_GAME_FAILED'
  | 'NEXT_QUESTION_FAILED'
  | 'SUBMIT_ANSWER_FAILED'
  | 'END_GAME_FAILED'
  | 'RECONNECT_FAILED'
  | 'HOST_DISCONNECTED'
  | 'ROOM_TIMEOUT'
  | 'INTERNAL_ERROR'
  | 'UNKNOWN_TYPE';

/** Index into a four-option answer array. */
export type AnswerIndex = 0 | 1 | 2 | 3;

/** A quiz question as authored by the host, including the correct answer. */
export interface QuestionInput {
  /** The question text displayed to players. */
  text: string;
  /** Exactly four answer options. */
  answers: [string, string, string, string];
  /** Index of the correct answer in the answers tuple. */
  correctIndex: AnswerIndex;
  /** Time limit for answering in seconds. */
  timeLimitSeconds: number;
}

/** A question as seen by players — omits the correct answer. */
export interface QuestionPublic {
  /** The question text displayed to players. */
  text: string;
  /** Exactly four answer options. */
  answers: [string, string, string, string];
  /** Time limit for answering in seconds. */
  timeLimitSeconds: number;
}

/** Public player information visible to all participants. */
export interface PlayerInfo {
  /** Unique player identifier. */
  id: string;
  /** Display name chosen by the player. */
  nickname: string;
  /** Cumulative score. */
  score: number;
  /** Whether the player has submitted an answer for the current question. */
  hasAnswered: boolean;
}

/** A single entry in the post-question or final leaderboard. */
export interface LeaderboardEntry {
  /** Unique player identifier. */
  id: string;
  /** Display name chosen by the player. */
  nickname: string;
  /** Cumulative score. */
  score: number;
  /** Current rank (1-based). */
  rank: number;
  /** Rank from the previous round, or `null` for the first round. */
  previousRank: number | null;
  /** Number of consecutive correct answers. */
  streak: number;
}

/** Result sent to a player after submitting an answer. */
export interface AnswerResult {
  /** Whether the submitted answer was correct. */
  correct: boolean;
  /** Points earned for this question. */
  score: number;
  /** Cumulative score after this question. */
  totalScore: number;
  /** Index of the correct answer. */
  correctIndex: AnswerIndex;
}

/** A saved quiz with metadata. */
export interface Quiz {
  /** Unique quiz identifier. */
  id: string;
  /** Display title for the quiz. */
  title: string;
  /** The quiz questions. */
  questions: QuestionInput[];
  /** ISO 8601 creation timestamp. */
  createdAt: string;
}

/** Summary of a completed game session. */
export interface GameSession {
  /** Unique session identifier. */
  id: string;
  /** Associated quiz ID, if persisted. */
  quizId: string | null;
  /** Room code used for this session. */
  roomCode: string;
  /** Number of players who participated. */
  playerCount: number;
  /** ISO 8601 start timestamp. */
  startedAt: string;
  /** ISO 8601 end timestamp, or null if still in progress. */
  endedAt: string | null;
}

/** Individual player result from a completed game. */
export interface GameResultEntry {
  /** Unique result identifier. */
  id: string;
  /** Player display name. */
  nickname: string;
  /** Final score. */
  score: number;
  /** Final rank (1-based). */
  rank: number;
  /** Number of correctly answered questions. */
  correctAnswers: number;
  /** Total number of questions answered. */
  totalAnswers: number;
}

/** Full game session with player results. */
export interface GameSessionDetail extends GameSession {
  /** Player results for this session. */
  results: GameResultEntry[];
}

/** State snapshot sent to a reconnecting player. */
export interface ReconnectState {
  /** The room code. */
  roomCode: string;
  /** Current game phase. */
  phase: GamePhase;
  /** All players in the room. */
  players: PlayerInfo[];
  /** Current question, or null if not in question phase. */
  question: QuestionPublic | null;
  /** Zero-based index of the current question. */
  questionIndex: number;
  /** Total number of questions. */
  totalQuestions: number;
  /** Time limit for the current question in seconds. */
  timeLimit: number;
  /** Milliseconds elapsed since the current question was sent (for accurate countdown on reconnect). */
  elapsedMs: number;
  /** The reconnecting player's cumulative score. */
  score: number;
  /** Current leaderboard. */
  leaderboard: LeaderboardEntry[];
  /** Whether the reconnecting player has answered the current question. */
  hasAnswered: boolean;
}
