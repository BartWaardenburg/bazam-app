import type { AnswerIndex, GamePhase, LeaderboardEntry, PlayerInfo, QuestionInput, ReconnectState } from '@bazam/shared-types';
import type { ConnectionRegistry } from './connection-registry';
import { generateRoomCode } from '../utils/room-code';
import { calculateScore } from './scoring';
import { isValidAnswerIndex, validateQuestions, MAX_NICKNAME_LENGTH } from './validation';
import { db } from '../db/client';
import { quizzes, gameSessions, gameResults } from '../db/schema';
import { logger } from '../utils/logger';

/** Sentinel value for a disconnected player's connection ID. */
const DISCONNECTED = '';

/** How long before a stale room is auto-cleaned (2 hours). */
const STALE_ROOM_TTL_MS = 2 * 60 * 60 * 1000;

/** Interval for stale room cleanup checks (5 minutes). */
const CLEANUP_INTERVAL_MS = 5 * 60 * 1000;

/** Countdown duration before the first question (ms). */
const COUNTDOWN_MS = 3000;

/** Grace delay after all players answer before closing the question (ms). */
const ALL_ANSWERED_DELAY_MS = 500;

/**
 * Internal player state tracked by the server.
 * Each player belongs to exactly one {@link Room} and is identified by a unique ID.
 */
interface Player {
  /** Unique identifier for this player, generated on join. */
  id: string;
  /** Display name chosen by the player (trimmed, unique within the room). */
  nickname: string;
  /** Cumulative score across all answered questions. */
  score: number;
  /** Current consecutive correct-answer streak, used for bonus scoring. */
  streak: number;
  /** Total number of questions answered correctly. */
  correctAnswers: number;
  /** Total number of questions the player has submitted an answer for. */
  totalAnswers: number;
  /** Whether the player has submitted an answer for the current question. */
  hasAnswered: boolean;
  /** Active connection ID, or {@link DISCONNECTED} if the player lost connection mid-game. */
  connectionId: string;
}

/**
 * Internal room state containing game progress and all participants.
 * A room is created by a host and progresses through phases: lobby, countdown, question, leaderboard, finished.
 */
interface Room {
  /** Unique numeric room code used by players to join (e.g., "482910"). */
  code: string;
  /** Connection ID of the host who created and controls this room. */
  hostConnectionId: string;
  /** Display name of the host. */
  hostName: string;
  /** Map of player ID to {@link Player} state for all participants. */
  players: Map<string, Player>;
  /** Validated list of quiz questions for this game session. */
  questions: QuestionInput[];
  /** Zero-based index of the current question, or -1 before the first question. */
  currentQuestionIndex: number;
  /** Current lifecycle phase of the game. */
  phase: GamePhase;
  /** Timestamp (ms since epoch) when the current question was sent, used for score calculation. */
  questionStartTime: number | null;
  /** Active timeout handle for the current question's time limit, or null if no timer is running. */
  timer: ReturnType<typeof setTimeout> | null;
  /** Snapshot of player ranks from the previous question, used to show rank changes on the leaderboard. */
  previousRanks: Map<string, number>;
  /** Timestamp (ms since epoch) when the room was created, used for stale-room cleanup. */
  createdAt: number;
}

/**
 * Discriminated result type for operations that can fail.
 * Success carries the typed data payload; failure carries a human-readable error message.
 *
 * @typeParam T - The data type returned on success.
 */
type Result<T> = { ok: true; data: T } | { ok: false; error: string };

/**
 * Builds a ranked leaderboard from the current room state.
 * Players are sorted by score in descending order, with ranks assigned sequentially.
 *
 * @param room - The room to build the leaderboard for.
 * @returns Sorted array of leaderboard entries with rank and streak information.
 */
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

/**
 * Builds a public player list from the current room state.
 * Exposes only the fields safe for broadcast to all participants.
 *
 * @param room - The room to extract player info from.
 * @returns Array of public player information objects.
 */
const buildPlayerList = (room: Room): PlayerInfo[] =>
  [...room.players.values()].map((p) => ({
    id: p.id,
    nickname: p.nickname,
    score: p.score,
    hasAnswered: p.hasAnswered,
  }));

/**
 * Manages all active game rooms, player connections, and the quiz game lifecycle.
 * Uses connection IDs (strings) instead of WebSocket objects to stay transport-agnostic.
 * Persists game data to the database on game completion (fire-and-forget).
 */
export class RoomManager {
  private readonly rooms = new Map<string, Room>();
  private readonly connectionToRoom = new Map<string, { roomCode: string; playerId: string | null }>();
  private readonly cleanupTimer: ReturnType<typeof setInterval>;

  constructor(private readonly connections: ConnectionRegistry) {
    this.cleanupTimer = setInterval(() => this.cleanupStaleRooms(), CLEANUP_INTERVAL_MS);
  }

  /** Stops the periodic cleanup timer (for graceful shutdown). */
  dispose(): void {
    clearInterval(this.cleanupTimer);
  }

  /**
   * Generates a unique player ID using a UUID v4.
   *
   * @returns A player ID string in the format "player_{uuid}".
   */
  private nextPlayerId(): string {
    return `player_${crypto.randomUUID()}`;
  }

  /**
   * Sends a message to a single connection by ID.
   *
   * @param connectionId - The target connection's identifier.
   * @param message - The message object to serialize and send.
   */
  private sendTo(connectionId: string, message: unknown): void {
    this.connections.send(connectionId, message);
  }

  /**
   * Broadcasts a message to all connected participants in a room, optionally excluding one.
   * Includes the host and all players whose connection is not marked as {@link DISCONNECTED}.
   *
   * @param room - The room whose participants should receive the message.
   * @param message - The message object to serialize and broadcast.
   * @param excludeId - Optional connection ID to skip (e.g., the sender).
   */
  private broadcast(room: Room, message: unknown, excludeId?: string): void {
    const ids = [
      room.hostConnectionId,
      ...[...room.players.values()]
        .filter((p) => p.connectionId !== DISCONNECTED)
        .map((p) => p.connectionId),
    ];
    this.connections.broadcast(ids, message, excludeId);
  }

  /**
   * Clears any active question timer for the given room.
   * Safe to call even when no timer is active.
   *
   * @param room - The room whose timer should be cleared.
   */
  private clearTimer(room: Room): void {
    if (room.timer) {
      clearTimeout(room.timer);
      room.timer = null;
    }
  }

  /**
   * Removes a room and all associated connection-to-room mappings.
   * Should be called after the room is finished or when the host disconnects.
   *
   * @param roomCode - The code of the room to remove.
   */
  private cleanupRoom(roomCode: string): void {
    this.rooms.delete(roomCode);
    for (const [connId, mapping] of this.connectionToRoom) {
      if (mapping.roomCode === roomCode) {
        this.connectionToRoom.delete(connId);
      }
    }
  }

  /** Removes rooms that have been alive longer than the TTL. */
  private cleanupStaleRooms(): void {
    const now = Date.now();
    for (const [code, room] of this.rooms) {
      if (now - room.createdAt > STALE_ROOM_TTL_MS) {
        logger.info('Cleaning up stale room', { roomCode: code, ageMinutes: Math.round((now - room.createdAt) / 60_000) });
        this.clearTimer(room);
        this.broadcast(room, { type: 'ERROR', payload: { message: 'Room timed out', code: 'ROOM_TIMEOUT' } });
        this.cleanupRoom(code);
      }
    }
  }

  /**
   * Returns only the players with an active connection (excludes disconnected players).
   * Used for all-answered checks to avoid waiting on players who left mid-game.
   *
   * @param room - The room to filter players from.
   * @returns Array of players whose connection ID is not {@link DISCONNECTED}.
   */
  private connectedPlayers(room: Room): Player[] {
    return [...room.players.values()].filter((p) => p.connectionId !== DISCONNECTED);
  }

  /**
   * Creates a new game room with the given questions.
   *
   * @param connectionId - The host's connection ID.
   * @param hostName - Display name for the host.
   * @param questions - Raw question data to validate and store.
   * @returns The generated room code on success.
   */
  createRoom(connectionId: string, hostName: string, questions: unknown): Result<string> {
    if (!validateQuestions(questions)) {
      return { ok: false, error: 'Invalid questions: each must have text, 4 answers, a valid correctIndex (0-3), and timeLimitSeconds > 0' };
    }

    const existingCodes = new Set(this.rooms.keys());
    const code = generateRoomCode(existingCodes);

    const room: Room = {
      code,
      hostConnectionId: connectionId,
      hostName: typeof hostName === 'string' ? hostName.trim() || 'Host' : 'Host',
      players: new Map(),
      questions,
      currentQuestionIndex: -1,
      phase: 'lobby',
      questionStartTime: null,
      timer: null,
      previousRanks: new Map(),
      createdAt: Date.now(),
    };

    this.rooms.set(code, room);
    this.connectionToRoom.set(connectionId, { roomCode: code, playerId: null });

    logger.info('Room created', { roomCode: code, hostName: room.hostName });
    return { ok: true, data: code };
  }

  /**
   * Adds a player to an existing room.
   *
   * @param connectionId - The joining player's connection ID.
   * @param roomCode - The room to join.
   * @param nickname - Desired display name (trimmed, must be unique in the room).
   * @returns The updated player list on success.
   */
  joinRoom(connectionId: string, roomCode: string, nickname: string): Result<PlayerInfo[]> {
    const trimmed = nickname.trim();
    if (trimmed.length === 0 || trimmed.length > MAX_NICKNAME_LENGTH) {
      return { ok: false, error: `Nickname must be between 1 and ${MAX_NICKNAME_LENGTH} characters` };
    }

    const room = this.rooms.get(roomCode);
    if (!room) return { ok: false, error: 'Room not found' };
    if (room.phase !== 'lobby') return { ok: false, error: 'Game already in progress' };
    if (connectionId === room.hostConnectionId) return { ok: false, error: 'Host cannot join as player' };

    const existingNicknames = [...room.players.values()].map((p) => p.nickname.toLowerCase());
    if (existingNicknames.includes(trimmed.toLowerCase())) {
      return { ok: false, error: 'Nickname already taken' };
    }

    const id = this.nextPlayerId();
    const player: Player = {
      id,
      nickname: trimmed,
      score: 0,
      streak: 0,
      correctAnswers: 0,
      totalAnswers: 0,
      hasAnswered: false,
      connectionId,
    };
    room.players.set(id, player);
    this.connectionToRoom.set(connectionId, { roomCode, playerId: id });

    logger.info('Player joined', { roomCode, nickname: trimmed, playerId: id });

    const players = buildPlayerList(room);
    this.broadcast(room, { type: 'PLAYER_JOINED', payload: { players } });
    return { ok: true, data: players };
  }

  /**
   * Starts the game in the given room (host only).
   * Transitions from lobby → countdown → first question.
   *
   * @param connectionId - Must be the host's connection ID.
   */
  startGame(connectionId: string): Result<void> {
    const mapping = this.connectionToRoom.get(connectionId);
    if (!mapping) return { ok: false, error: 'Not in a room' };

    const room = this.rooms.get(mapping.roomCode);
    if (!room) return { ok: false, error: 'Room not found' };
    if (room.hostConnectionId !== connectionId) return { ok: false, error: 'Only the host can start the game' };
    if (room.phase !== 'lobby') return { ok: false, error: 'Game already started' };
    if (room.players.size === 0) return { ok: false, error: 'No players in the room' };

    room.phase = 'countdown';
    this.broadcast(room, {
      type: 'GAME_STARTING',
      payload: { totalQuestions: room.questions.length },
    });

    setTimeout(() => this.sendNextQuestion(room), COUNTDOWN_MS);
    return { ok: true, data: undefined };
  }

  /**
   * Advances the room to the next question, or ends the game if all questions are exhausted.
   * Resets per-question player state, broadcasts the new question to all participants,
   * and starts the question timer.
   *
   * @param room - The room to advance.
   */
  private sendNextQuestion(room: Room): void {
    this.clearTimer(room);

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

  /**
   * Records a player's answer for the current question.
   * Calculates score based on correctness, response time, and streak.
   * Auto-closes the question when all connected players have answered.
   *
   * @param connectionId - The answering player's connection ID.
   * @param questionIndex - Must match the current question index.
   * @param answerIndex - The selected answer (0–3).
   */
  submitAnswer(connectionId: string, questionIndex: number, answerIndex: number): Result<void> {
    if (!Number.isInteger(answerIndex) || !isValidAnswerIndex(answerIndex)) {
      return { ok: false, error: 'Invalid answer index' };
    }
    if (!Number.isInteger(questionIndex) || questionIndex < 0) {
      return { ok: false, error: 'Invalid question index' };
    }

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
    const score = calculateScore(isCorrect, responseTimeMs, q.timeLimitSeconds * 1000, player.streak);

    player.hasAnswered = true;
    player.score += score;
    player.totalAnswers++;
    if (isCorrect) {
      player.correctAnswers++;
      player.streak++;
    } else {
      player.streak = 0;
    }

    this.sendTo(connectionId, {
      type: 'ANSWER_RESULT',
      payload: { correct: isCorrect, score, totalScore: player.score, correctIndex: q.correctIndex },
    });

    this.sendTo(room.hostConnectionId, {
      type: 'PLAYERS_UPDATED',
      payload: { players: buildPlayerList(room) },
    });

    const active = this.connectedPlayers(room);
    const allAnswered = active.length > 0 && active.every((p) => p.hasAnswered);
    if (allAnswered) {
      this.clearTimer(room);
      setTimeout(() => this.closeQuestion(room), ALL_ANSWERED_DELAY_MS);
    }

    return { ok: true, data: undefined };
  }

  /**
   * Closes the current question, transitions to the leaderboard phase, and broadcasts results.
   * Calculates the ranked leaderboard and stores a snapshot of player ranks for the next round.
   * No-ops if the room is not in the 'question' phase (guards against duplicate timer fires).
   *
   * @param room - The room whose current question should be closed.
   */
  private closeQuestion(room: Room): void {
    if (room.phase !== 'question') return;

    room.phase = 'leaderboard';
    this.clearTimer(room);

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

  /**
   * Advances to the next question (host only).
   * Only valid when the current phase is 'leaderboard'.
   *
   * @param connectionId - Must be the host's connection ID.
   */
  nextQuestion(connectionId: string): Result<void> {
    const mapping = this.connectionToRoom.get(connectionId);
    if (!mapping) return { ok: false, error: 'Not in a room' };

    const room = this.rooms.get(mapping.roomCode);
    if (!room) return { ok: false, error: 'Room not found' };
    if (room.hostConnectionId !== connectionId) return { ok: false, error: 'Only the host can advance' };
    if (room.phase !== 'leaderboard') return { ok: false, error: 'Cannot advance from current phase' };

    this.sendNextQuestion(room);
    return { ok: true, data: undefined };
  }

  /**
   * Ends the game by transitioning to the 'finished' phase, broadcasting the final leaderboard,
   * persisting game data to the database (fire-and-forget), and cleaning up all room state.
   *
   * @param room - The room to finalize and tear down.
   */
  private endGame(room: Room): void {
    this.clearTimer(room);
    room.phase = 'finished';
    const leaderboard = buildLeaderboard(room);
    this.broadcast(room, { type: 'GAME_OVER', payload: { leaderboard } });
    logger.info('Game ended', { roomCode: room.code, playerCount: room.players.size });

    void this.persistGameData(room, leaderboard);
    this.cleanupRoom(room.code);
  }

  /**
   * Persists quiz, session, and player results to the database.
   * Fire-and-forget — failures are logged but never block the game.
   */
  private async persistGameData(room: Room, leaderboard: LeaderboardEntry[]): Promise<void> {
    try {
      const [quiz] = await db
        .insert(quizzes)
        .values({ title: `Quiz ${room.code}`, questions: room.questions })
        .returning({ id: quizzes.id });

      const [session] = await db
        .insert(gameSessions)
        .values({
          quizId: quiz.id,
          roomCode: room.code,
          playerCount: room.players.size,
          endedAt: new Date(),
        })
        .returning({ id: gameSessions.id });

      const allPlayers = [...room.players.values()];
      if (allPlayers.length > 0) {
        await db.insert(gameResults).values(
          allPlayers.map((p) => ({
            sessionId: session.id,
            nickname: p.nickname,
            score: p.score,
            rank: leaderboard.find((e) => e.id === p.id)?.rank ?? allPlayers.length,
            correctAnswers: p.correctAnswers,
            totalAnswers: p.totalAnswers,
          })),
        );
      }

      logger.info('Game data persisted', { sessionId: session.id, roomCode: room.code });
    } catch (error) {
      logger.warn('Failed to persist game data', { error: String(error), roomCode: room.code });
    }
  }

  /**
   * Handles a connection disconnect.
   * - Host disconnect: closes the entire room.
   * - Player disconnect during lobby: removes the player.
   * - Player disconnect during game: marks as disconnected (preserves score for reconnection).
   *
   * @param connectionId - The disconnected client's connection ID.
   */
  handleDisconnect(connectionId: string): void {
    const mapping = this.connectionToRoom.get(connectionId);
    if (!mapping) return;

    const room = this.rooms.get(mapping.roomCode);
    if (!room) {
      this.connectionToRoom.delete(connectionId);
      return;
    }

    if (room.hostConnectionId === connectionId) {
      this.clearTimer(room);
      this.broadcast(room, { type: 'ERROR', payload: { message: 'Host disconnected', code: 'HOST_DISCONNECTED' } });
      this.cleanupRoom(mapping.roomCode);
      logger.info('Room closed (host disconnected)', { roomCode: mapping.roomCode });
      return;
    }

    if (!mapping.playerId) return;

    const player = room.players.get(mapping.playerId);
    if (!player) {
      this.connectionToRoom.delete(connectionId);
      return;
    }

    if (room.phase === 'lobby') {
      // During lobby, remove the player entirely
      room.players.delete(mapping.playerId);
      this.connectionToRoom.delete(connectionId);
      const players = buildPlayerList(room);
      this.broadcast(room, { type: 'PLAYER_LEFT', payload: { players } });
      logger.info('Player left (lobby)', { roomCode: mapping.roomCode, playerId: mapping.playerId });
    } else {
      // During game, mark as disconnected but keep their data for reconnection
      player.connectionId = DISCONNECTED;
      this.connectionToRoom.delete(connectionId);

      const players = buildPlayerList(room);
      this.broadcast(room, { type: 'PLAYER_LEFT', payload: { players } });
      logger.info('Player disconnected (mid-game)', { roomCode: mapping.roomCode, playerId: mapping.playerId });

      // If in question phase and they haven't answered, check if all remaining players have answered
      if (room.phase === 'question') {
        const active = this.connectedPlayers(room);
        if (active.length > 0 && active.every((p) => p.hasAnswered)) {
          this.clearTimer(room);
          setTimeout(() => this.closeQuestion(room), ALL_ANSWERED_DELAY_MS);
        }
      }
    }
  }

  /**
   * Reconnects a previously disconnected player to their game.
   * Sends them a full state snapshot so the client can restore the UI.
   *
   * @param connectionId - The new connection ID.
   * @param roomCode - The room to rejoin.
   * @param playerId - The player's original ID.
   */
  reconnect(connectionId: string, roomCode: string, playerId: string): Result<ReconnectState> {
    const room = this.rooms.get(roomCode);
    if (!room) return { ok: false, error: 'Room not found' };

    const player = room.players.get(playerId);
    if (!player) return { ok: false, error: 'Player not found in this room' };
    if (player.connectionId !== DISCONNECTED) return { ok: false, error: 'Player is already connected' };

    // Restore the player's connection
    player.connectionId = connectionId;
    this.connectionToRoom.set(connectionId, { roomCode, playerId });

    logger.info('Player reconnected', { roomCode, playerId, nickname: player.nickname });

    // Notify others
    const players = buildPlayerList(room);
    this.broadcast(room, { type: 'PLAYER_JOINED', payload: { players } }, connectionId);

    // Build state snapshot for the reconnecting player
    const currentQ = room.currentQuestionIndex >= 0 ? room.questions[room.currentQuestionIndex] : null;
    const question = currentQ
      ? { text: currentQ.text, answers: currentQ.answers, timeLimitSeconds: currentQ.timeLimitSeconds }
      : null;

    return {
      ok: true,
      data: {
        roomCode: room.code,
        phase: room.phase,
        players,
        question,
        questionIndex: room.currentQuestionIndex,
        totalQuestions: room.questions.length,
        timeLimit: currentQ?.timeLimitSeconds ?? 0,
        score: player.score,
        leaderboard: buildLeaderboard(room),
        hasAnswered: player.hasAnswered,
      },
    };
  }

  /**
   * Forcefully ends the game (host only).
   * Can be called from any phase to immediately finish and clean up.
   *
   * @param connectionId - Must be the host's connection ID.
   */
  forceEndGame(connectionId: string): Result<void> {
    const mapping = this.connectionToRoom.get(connectionId);
    if (!mapping) return { ok: false, error: 'Not in a room' };

    const room = this.rooms.get(mapping.roomCode);
    if (!room) return { ok: false, error: 'Room not found' };
    if (room.hostConnectionId !== connectionId) return { ok: false, error: 'Only the host can end the game' };

    this.clearTimer(room);
    this.endGame(room);
    return { ok: true, data: undefined };
  }
}
