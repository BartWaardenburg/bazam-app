import type { GamePhase, LeaderboardEntry, PlayerInfo, QuestionInput } from '@bazam/shared-types';
import type { ConnectionRegistry } from './connection-registry';
import { generateRoomCode } from '../utils/room-code';
import { calculateScore } from './scoring';
import { logger } from '../utils/logger';

interface Player {
  id: string;
  nickname: string;
  score: number;
  streak: number;
  hasAnswered: boolean;
  connectionId: string;
}

interface Room {
  code: string;
  hostConnectionId: string;
  players: Map<string, Player>;
  questions: QuestionInput[];
  currentQuestionIndex: number;
  phase: GamePhase;
  questionStartTime: number | null;
  timer: ReturnType<typeof setTimeout> | null;
  previousRanks: Map<string, number>;
}

type Result<T> = { ok: true; data: T } | { ok: false; error: string };

const buildLeaderboard = (room: Room): LeaderboardEntry[] =>
  [...room.players.values()]
    .sort((a, b) => b.score - a.score)
    .map((p, i) => ({
      id: p.id,
      nickname: p.nickname,
      score: p.score,
      rank: i + 1,
      previousRank: room.previousRanks.get(p.id) ?? null,
      streak: p.streak,
    }));

const buildPlayerList = (room: Room): PlayerInfo[] =>
  [...room.players.values()].map((p) => ({
    id: p.id,
    nickname: p.nickname,
    score: p.score,
    hasAnswered: p.hasAnswered,
  }));

let playerIdCounter = 0;
const nextPlayerId = (): string => `player_${++playerIdCounter}`;

export class RoomManager {
  private readonly rooms = new Map<string, Room>();
  private readonly connectionToRoom = new Map<string, { roomCode: string; playerId: string | null }>();

  constructor(private readonly connections: ConnectionRegistry) {}

  private sendTo(connectionId: string, message: unknown): void {
    this.connections.send(connectionId, message);
  }

  private broadcast(room: Room, message: unknown, excludeId?: string): void {
    const ids = [room.hostConnectionId, ...[...room.players.values()].map((p) => p.connectionId)];
    this.connections.broadcast(ids, message, excludeId);
  }

  createRoom(connectionId: string, questions: QuestionInput[]): Result<string> {
    const existingCodes = new Set(this.rooms.keys());
    const code = generateRoomCode(existingCodes);

    const room: Room = {
      code,
      hostConnectionId: connectionId,
      players: new Map(),
      questions,
      currentQuestionIndex: -1,
      phase: 'lobby',
      questionStartTime: null,
      timer: null,
      previousRanks: new Map(),
    };

    this.rooms.set(code, room);
    this.connectionToRoom.set(connectionId, { roomCode: code, playerId: null });

    logger.info('Room created', { roomCode: code });
    return { ok: true, data: code };
  }

  joinRoom(connectionId: string, roomCode: string, nickname: string): Result<PlayerInfo[]> {
    const room = this.rooms.get(roomCode);
    if (!room) return { ok: false, error: 'Room not found' };
    if (room.phase !== 'lobby') return { ok: false, error: 'Game already in progress' };

    const existingNicknames = [...room.players.values()].map((p) => p.nickname.toLowerCase());
    if (existingNicknames.includes(nickname.toLowerCase())) {
      return { ok: false, error: 'Nickname already taken' };
    }

    const id = nextPlayerId();
    const player: Player = { id, nickname, score: 0, streak: 0, hasAnswered: false, connectionId };
    room.players.set(id, player);
    this.connectionToRoom.set(connectionId, { roomCode, playerId: id });

    logger.info('Player joined', { roomCode, nickname, playerId: id });

    const players = buildPlayerList(room);
    this.broadcast(room, { type: 'PLAYER_JOINED', payload: { players } });
    return { ok: true, data: players };
  }

  startGame(connectionId: string): Result<void> {
    const mapping = this.connectionToRoom.get(connectionId);
    if (!mapping) return { ok: false, error: 'Not in a room' };

    const room = this.rooms.get(mapping.roomCode);
    if (!room) return { ok: false, error: 'Room not found' };
    if (room.hostConnectionId !== connectionId) return { ok: false, error: 'Only the host can start the game' };
    if (room.players.size === 0) return { ok: false, error: 'No players in the room' };

    room.phase = 'countdown';
    this.broadcast(room, {
      type: 'GAME_STARTING',
      payload: { totalQuestions: room.questions.length },
    });

    setTimeout(() => this.sendNextQuestion(room), 3000);
    return { ok: true, data: undefined };
  }

  private sendNextQuestion(room: Room): void {
    room.currentQuestionIndex++;
    if (room.currentQuestionIndex >= room.questions.length) {
      this.endGame(room);
      return;
    }

    const q = room.questions[room.currentQuestionIndex];
    room.phase = 'question';
    room.questionStartTime = Date.now();

    for (const player of room.players.values()) {
      player.hasAnswered = false;
    }

    this.broadcast(room, { type: 'PHASE_CHANGE', payload: { phase: 'question' } });
    this.broadcast(room, {
      type: 'QUESTION',
      payload: {
        question: { text: q.text, answers: q.answers, timeLimitSeconds: q.timeLimitSeconds },
        index: room.currentQuestionIndex,
        total: room.questions.length,
        timeLimit: q.timeLimitSeconds,
      },
    });

    room.timer = setTimeout(() => {
      this.closeQuestion(room);
    }, q.timeLimitSeconds * 1000);
  }

  submitAnswer(connectionId: string, questionIndex: number, answerIndex: number): Result<void> {
    const mapping = this.connectionToRoom.get(connectionId);
    if (!mapping?.playerId) return { ok: false, error: 'Not a player' };

    const room = this.rooms.get(mapping.roomCode);
    if (!room) return { ok: false, error: 'Room not found' };
    if (room.phase !== 'question') return { ok: false, error: 'No active question' };
    if (questionIndex !== room.currentQuestionIndex) return { ok: false, error: 'Wrong question' };

    const player = room.players.get(mapping.playerId);
    if (!player) return { ok: false, error: 'Player not found' };
    if (player.hasAnswered) return { ok: false, error: 'Already answered' };

    const q = room.questions[room.currentQuestionIndex];
    const isCorrect = answerIndex === q.correctIndex;
    const responseTimeMs = Date.now() - (room.questionStartTime ?? Date.now());
    const score = calculateScore(isCorrect, responseTimeMs, q.timeLimitSeconds * 1000);

    player.hasAnswered = true;
    player.score += score;
    player.streak = isCorrect ? player.streak + 1 : 0;

    this.sendTo(connectionId, {
      type: 'ANSWER_RESULT',
      payload: { correct: isCorrect, score, totalScore: player.score, correctIndex: q.correctIndex },
    });

    this.sendTo(room.hostConnectionId, {
      type: 'PLAYER_JOINED',
      payload: { players: buildPlayerList(room) },
    });

    const allAnswered = [...room.players.values()].every((p) => p.hasAnswered);
    if (allAnswered) {
      if (room.timer) clearTimeout(room.timer);
      setTimeout(() => this.closeQuestion(room), 500);
    }

    return { ok: true, data: undefined };
  }

  private closeQuestion(room: Room): void {
    room.phase = 'leaderboard';
    const q = room.questions[room.currentQuestionIndex];
    const leaderboard = buildLeaderboard(room);

    this.broadcast(room, {
      type: 'QUESTION_CLOSED',
      payload: { correctIndex: q.correctIndex, leaderboard },
    });

    room.previousRanks.clear();
    for (const entry of leaderboard) {
      room.previousRanks.set(entry.id, entry.rank);
    }
  }

  nextQuestion(connectionId: string): Result<void> {
    const mapping = this.connectionToRoom.get(connectionId);
    if (!mapping) return { ok: false, error: 'Not in a room' };

    const room = this.rooms.get(mapping.roomCode);
    if (!room) return { ok: false, error: 'Room not found' };
    if (room.hostConnectionId !== connectionId) return { ok: false, error: 'Only the host can advance' };

    this.sendNextQuestion(room);
    return { ok: true, data: undefined };
  }

  private endGame(room: Room): void {
    room.phase = 'finished';
    const leaderboard = buildLeaderboard(room);
    this.broadcast(room, { type: 'GAME_OVER', payload: { leaderboard } });
    logger.info('Game ended', { roomCode: room.code });
  }

  handleDisconnect(connectionId: string): void {
    const mapping = this.connectionToRoom.get(connectionId);
    if (!mapping) return;

    const room = this.rooms.get(mapping.roomCode);
    if (!room) {
      this.connectionToRoom.delete(connectionId);
      return;
    }

    if (room.hostConnectionId === connectionId) {
      if (room.timer) clearTimeout(room.timer);
      this.broadcast(room, { type: 'ERROR', payload: { message: 'Host disconnected', code: 'HOST_DISCONNECTED' } });
      this.rooms.delete(mapping.roomCode);
      logger.info('Room closed (host disconnected)', { roomCode: mapping.roomCode });
    } else if (mapping.playerId) {
      room.players.delete(mapping.playerId);
      const players = buildPlayerList(room);
      this.broadcast(room, { type: 'PLAYER_LEFT', payload: { players } });
      logger.info('Player left', { roomCode: mapping.roomCode, playerId: mapping.playerId });
    }

    this.connectionToRoom.delete(connectionId);
  }

  forceEndGame(connectionId: string): Result<void> {
    const mapping = this.connectionToRoom.get(connectionId);
    if (!mapping) return { ok: false, error: 'Not in a room' };

    const room = this.rooms.get(mapping.roomCode);
    if (!room) return { ok: false, error: 'Room not found' };
    if (room.hostConnectionId !== connectionId) return { ok: false, error: 'Only the host can end the game' };

    if (room.timer) clearTimeout(room.timer);
    this.endGame(room);
    return { ok: true, data: undefined };
  }
}
