import type { AnswerIndex, AnswerResult, GamePhase, LeaderboardEntry, PlayerInfo, QuestionInput, QuestionPublic, ReconnectState } from './game';

/** Discriminated union of all messages sent from the client to the server via WebSocket. */
export type ClientMessage =
  | { type: 'CREATE_ROOM'; payload: { hostName: string; questions: QuestionInput[] } }
  | { type: 'JOIN_ROOM'; payload: { roomCode: string; nickname: string } }
  | { type: 'START_GAME' }
  | { type: 'NEXT_QUESTION' }
  | { type: 'SUBMIT_ANSWER'; payload: { questionIndex: number; answerIndex: AnswerIndex; timestamp: number } }
  | { type: 'END_GAME' }
  | { type: 'RECONNECT'; payload: { roomCode: string; playerId: string } };

/** Discriminated union of all messages sent from the server to the client via WebSocket. */
export type ServerMessage =
  | { type: 'ROOM_CREATED'; payload: { roomCode: string } }
  | { type: 'PLAYER_JOINED'; payload: { players: PlayerInfo[] } }
  | { type: 'PLAYER_LEFT'; payload: { players: PlayerInfo[] } }
  | { type: 'PLAYERS_UPDATED'; payload: { players: PlayerInfo[] } }
  | { type: 'GAME_STARTING'; payload: { totalQuestions: number } }
  | { type: 'QUESTION'; payload: { question: QuestionPublic; index: number; total: number; timeLimit: number } }
  | { type: 'ANSWER_RESULT'; payload: AnswerResult }
  | { type: 'QUESTION_CLOSED'; payload: { correctIndex: AnswerIndex; leaderboard: LeaderboardEntry[] } }
  | { type: 'GAME_OVER'; payload: { leaderboard: LeaderboardEntry[] } }
  | { type: 'PHASE_CHANGE'; payload: { phase: GamePhase } }
  | { type: 'RECONNECTED'; payload: ReconnectState }
  | { type: 'ERROR'; payload: { message: string; code: string } };
