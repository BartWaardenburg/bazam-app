import type { AnswerResult, GamePhase, LeaderboardEntry, PlayerInfo, QuestionInput, QuestionPublic } from './game';

/** Client → Server messages */
export type ClientMessage =
  | { type: 'CREATE_ROOM'; payload: { hostName: string; questions: QuestionInput[] } }
  | { type: 'JOIN_ROOM'; payload: { roomCode: string; nickname: string } }
  | { type: 'START_GAME' }
  | { type: 'NEXT_QUESTION' }
  | { type: 'SUBMIT_ANSWER'; payload: { questionIndex: number; answerIndex: number; timestamp: number } }
  | { type: 'END_GAME' };

/** Server → Client messages */
export type ServerMessage =
  | { type: 'ROOM_CREATED'; payload: { roomCode: string } }
  | { type: 'PLAYER_JOINED'; payload: { players: PlayerInfo[] } }
  | { type: 'PLAYER_LEFT'; payload: { players: PlayerInfo[] } }
  | { type: 'GAME_STARTING'; payload: { totalQuestions: number } }
  | { type: 'QUESTION'; payload: { question: QuestionPublic; index: number; total: number; timeLimit: number } }
  | { type: 'ANSWER_RESULT'; payload: AnswerResult }
  | { type: 'QUESTION_CLOSED'; payload: { correctIndex: number; leaderboard: LeaderboardEntry[] } }
  | { type: 'GAME_OVER'; payload: { leaderboard: LeaderboardEntry[] } }
  | { type: 'PHASE_CHANGE'; payload: { phase: GamePhase } }
  | { type: 'ERROR'; payload: { message: string; code: string } };
