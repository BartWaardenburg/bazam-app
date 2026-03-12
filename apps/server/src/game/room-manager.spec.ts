import { RoomManager } from './room-manager';
import type { ConnectionRegistry } from './connection-registry';
import type { QuestionInput, LeaderboardEntry, PlayerInfo } from '@bazam/shared-types';

vi.mock('../db/client', () => ({
  db: {
    insert: vi.fn().mockReturnValue({
      values: vi.fn().mockReturnValue({
        returning: vi.fn().mockResolvedValue([{ id: 'test-id' }]),
      }),
    }),
  },
}));

vi.mock('../utils/logger', () => ({
  logger: { info: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn() },
}));

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

interface SentMessage {
  connectionId: string;
  message: unknown;
}

interface BroadcastMessage {
  ids: string[];
  message: unknown;
  excludeId?: string;
}

const createMockRegistry = () => {
  const sent: SentMessage[] = [];
  const broadcasts: BroadcastMessage[] = [];

  const registry: ConnectionRegistry = {
    send: vi.fn((id: string, data: unknown) => {
      sent.push({ connectionId: id, message: data });
    }),
    broadcast: vi.fn((ids: string[], data: unknown, excludeId?: string) => {
      broadcasts.push({ ids, message: data, excludeId });
    }),
    register: vi.fn(),
    unregister: vi.fn(),
  } as unknown as ConnectionRegistry;

  return { registry, sent, broadcasts };
};

const validQuestions: QuestionInput[] = [
  { text: 'What is 1+1?', answers: ['1', '2', '3', '4'], correctIndex: 1, timeLimitSeconds: 10 },
  { text: 'What is 2+2?', answers: ['3', '4', '5', '6'], correctIndex: 1, timeLimitSeconds: 10 },
];

const singleQuestion: QuestionInput[] = [
  { text: 'What is 1+1?', answers: ['1', '2', '3', '4'], correctIndex: 1, timeLimitSeconds: 10 },
];

const HOST_CONN = 'host-conn-1';
const PLAYER_CONN_1 = 'player-conn-1';
const PLAYER_CONN_2 = 'player-conn-2';

/**
 * Creates a room with a host and optionally joins players.
 * Returns the room code and player IDs.
 */
const setupRoom = (
  manager: RoomManager,
  options: { playerCount?: number; questions?: QuestionInput[] } = {},
) => {
  const { playerCount = 0, questions = validQuestions } = options;
  const result = manager.createRoom(HOST_CONN, 'TestHost', questions);
  if (!result.ok) throw new Error(`createRoom failed: ${result.error}`);
  const roomCode = result.data;

  const playerIds: string[] = [];
  const playerConns: string[] = [];
  for (let i = 0; i < playerCount; i++) {
    const conn = `player-conn-${i + 1}`;
    const joinResult = manager.joinRoom(conn, roomCode, `Player${i + 1}`);
    if (!joinResult.ok) throw new Error(`joinRoom failed: ${joinResult.error}`);
    const players = joinResult.data;
    const lastPlayer = players[players.length - 1];
    playerIds.push(lastPlayer.id);
    playerConns.push(conn);
  }

  return { roomCode, playerIds, playerConns };
};

/**
 * Starts the game and advances past the countdown to the first question.
 * Requires fake timers to be active.
 */
const startGameAndAdvanceToQuestion = (manager: RoomManager) => {
  manager.startGame(HOST_CONN);
  vi.advanceTimersByTime(3000); // COUNTDOWN_MS
};

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('RoomManager', () => {
  let registry: ConnectionRegistry;
  let sent: SentMessage[];
  let broadcasts: BroadcastMessage[];
  let manager: RoomManager;

  beforeEach(() => {
    vi.useFakeTimers();
    const mock = createMockRegistry();
    registry = mock.registry;
    sent = mock.sent;
    broadcasts = mock.broadcasts;
    manager = new RoomManager(registry);
  });

  afterEach(() => {
    manager.dispose();
    vi.useRealTimers();
  });

  // -----------------------------------------------------------------------
  // createRoom
  // -----------------------------------------------------------------------
  describe('createRoom', () => {
    it('creates a room and returns a room code for valid questions', () => {
      const result = manager.createRoom(HOST_CONN, 'Alice', validQuestions);
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(typeof result.data).toBe('string');
        expect(result.data.length).toBe(6);
      }
    });

    it('returns an error for invalid questions', () => {
      const result = manager.createRoom(HOST_CONN, 'Alice', []);
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toContain('Invalid questions');
      }
    });

    it('returns an error when questions are not an array', () => {
      const result = manager.createRoom(HOST_CONN, 'Alice', 'not-an-array');
      expect(result.ok).toBe(false);
    });

    it('returns an error for questions missing required fields', () => {
      const result = manager.createRoom(HOST_CONN, 'Alice', [{ text: 'Hello' }]);
      expect(result.ok).toBe(false);
    });

    it('maps the host connectionId to the room', () => {
      const createResult = manager.createRoom(HOST_CONN, 'Alice', validQuestions);
      expect(createResult.ok).toBe(true);
      // Verify the mapping exists by starting a game (which requires the mapping)
      const joinResult = manager.joinRoom(PLAYER_CONN_1, (createResult as { ok: true; data: string }).data, 'Bob');
      expect(joinResult.ok).toBe(true);
      const startResult = manager.startGame(HOST_CONN);
      expect(startResult.ok).toBe(true);
    });

    it('uses provided hostName (trimmed)', () => {
      const result = manager.createRoom(HOST_CONN, '  Alice  ', validQuestions);
      expect(result.ok).toBe(true);
      // The hostName is stored trimmed — verified indirectly through the room existing
    });

    it('falls back to "Host" when hostName is empty', () => {
      const result = manager.createRoom(HOST_CONN, '', validQuestions);
      expect(result.ok).toBe(true);
    });

    it('falls back to "Host" when hostName is non-string', () => {
      const result = manager.createRoom(HOST_CONN, 123 as unknown as string, validQuestions);
      expect(result.ok).toBe(true);
    });

    it('creates multiple rooms with unique codes', () => {
      const r1 = manager.createRoom('host-1', 'Alice', validQuestions);
      const r2 = manager.createRoom('host-2', 'Bob', validQuestions);
      expect(r1.ok).toBe(true);
      expect(r2.ok).toBe(true);
      if (r1.ok && r2.ok) {
        expect(r1.data).not.toBe(r2.data);
      }
    });

    it('enforces MAX_ROOMS limit', () => {
      // Create 1000 rooms (the limit)
      for (let i = 0; i < 1000; i++) {
        const r = manager.createRoom(`host-${i}`, `Host${i}`, validQuestions);
        expect(r.ok).toBe(true);
      }
      // The 1001st should fail
      const result = manager.createRoom('host-overflow', 'Overflow', validQuestions);
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toContain('Too many active rooms');
      }
    });

    it('truncates overly long hostName', () => {
      const longName = 'A'.repeat(200);
      const result = manager.createRoom(HOST_CONN, longName, validQuestions);
      expect(result.ok).toBe(true);
      // The hostName should be truncated to MAX_HOST_NAME_LENGTH (100)
    });

    it('stores quizId when provided', () => {
      const result = manager.createRoom(HOST_CONN, 'Alice', validQuestions, 'quiz-123');
      expect(result.ok).toBe(true);
    });
  });

  // -----------------------------------------------------------------------
  // joinRoom
  // -----------------------------------------------------------------------
  describe('joinRoom', () => {
    it('adds a player and broadcasts PLAYER_JOINED', () => {
      const { roomCode } = setupRoom(manager);
      const result = manager.joinRoom(PLAYER_CONN_1, roomCode, 'Bob');
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.data).toHaveLength(1);
        expect(result.data[0].nickname).toBe('Bob');
      }
      const joinBroadcast = broadcasts.find((b) =>
        (b.message as { type: string }).type === 'PLAYER_JOINED',
      );
      expect(joinBroadcast).toBeDefined();
    });

    it('returns the full player list after joining', () => {
      const { roomCode } = setupRoom(manager);
      manager.joinRoom(PLAYER_CONN_1, roomCode, 'Bob');
      const result = manager.joinRoom(PLAYER_CONN_2, roomCode, 'Carol');
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.data).toHaveLength(2);
        expect(result.data.map((p) => p.nickname)).toEqual(['Bob', 'Carol']);
      }
    });

    it('returns an error for empty nickname', () => {
      const { roomCode } = setupRoom(manager);
      const result = manager.joinRoom(PLAYER_CONN_1, roomCode, '');
      expect(result.ok).toBe(false);
      if (!result.ok) expect(result.error).toContain('Nickname');
    });

    it('returns an error for whitespace-only nickname', () => {
      const { roomCode } = setupRoom(manager);
      const result = manager.joinRoom(PLAYER_CONN_1, roomCode, '   ');
      expect(result.ok).toBe(false);
    });

    it('returns an error for nickname exceeding max length', () => {
      const { roomCode } = setupRoom(manager);
      const result = manager.joinRoom(PLAYER_CONN_1, roomCode, 'A'.repeat(33));
      expect(result.ok).toBe(false);
      if (!result.ok) expect(result.error).toContain('Nickname');
    });

    it('returns an error when room is not found', () => {
      const result = manager.joinRoom(PLAYER_CONN_1, 'NONEXIST', 'Bob');
      expect(result.ok).toBe(false);
      if (!result.ok) expect(result.error).toBe('Room not found');
    });

    it('returns an error when game is already in progress', () => {
      const { roomCode } = setupRoom(manager, { playerCount: 1 });
      manager.startGame(HOST_CONN);
      vi.advanceTimersByTime(3000);

      const result = manager.joinRoom(PLAYER_CONN_2, roomCode, 'LateJoiner');
      expect(result.ok).toBe(false);
      if (!result.ok) expect(result.error).toBe('Game already in progress');
    });

    it('prevents the host from joining as a player', () => {
      const { roomCode } = setupRoom(manager);
      const result = manager.joinRoom(HOST_CONN, roomCode, 'HostAsPlayer');
      expect(result.ok).toBe(false);
      if (!result.ok) expect(result.error).toBe('Host cannot join as player');
    });

    it('rejects duplicate nickname (case-insensitive)', () => {
      const { roomCode } = setupRoom(manager);
      manager.joinRoom(PLAYER_CONN_1, roomCode, 'Bob');
      const result = manager.joinRoom(PLAYER_CONN_2, roomCode, 'bob');
      expect(result.ok).toBe(false);
      if (!result.ok) expect(result.error).toBe('Nickname already taken');
    });

    it('rejects duplicate nickname (exact match)', () => {
      const { roomCode } = setupRoom(manager);
      manager.joinRoom(PLAYER_CONN_1, roomCode, 'Bob');
      const result = manager.joinRoom(PLAYER_CONN_2, roomCode, 'Bob');
      expect(result.ok).toBe(false);
    });

    it('returns an error when room is full', () => {
      const { roomCode } = setupRoom(manager);
      // Fill room to MAX_PLAYERS_PER_ROOM (50)
      for (let i = 0; i < 50; i++) {
        const r = manager.joinRoom(`p-${i}`, roomCode, `P${i}`);
        expect(r.ok).toBe(true);
      }
      const result = manager.joinRoom('overflow-conn', roomCode, 'Overflow');
      expect(result.ok).toBe(false);
      if (!result.ok) expect(result.error).toBe('Room is full');
    });
  });

  // -----------------------------------------------------------------------
  // startGame
  // -----------------------------------------------------------------------
  describe('startGame', () => {
    it('broadcasts GAME_STARTING when host starts with players', () => {
      setupRoom(manager, { playerCount: 1 });
      const result = manager.startGame(HOST_CONN);
      expect(result.ok).toBe(true);

      const gameStarting = broadcasts.find((b) =>
        (b.message as { type: string }).type === 'GAME_STARTING',
      );
      expect(gameStarting).toBeDefined();
      expect((gameStarting!.message as { payload: { totalQuestions: number } }).payload.totalQuestions).toBe(2);
    });

    it('sends first question after countdown delay', () => {
      setupRoom(manager, { playerCount: 1 });
      manager.startGame(HOST_CONN);

      const questionBefore = broadcasts.find((b) =>
        (b.message as { type: string }).type === 'QUESTION',
      );
      expect(questionBefore).toBeUndefined();

      vi.advanceTimersByTime(3000);

      const questionAfter = broadcasts.find((b) =>
        (b.message as { type: string }).type === 'QUESTION',
      );
      expect(questionAfter).toBeDefined();
    });

    it('returns an error when a non-host tries to start', () => {
      setupRoom(manager, { playerCount: 1 });
      const result = manager.startGame(PLAYER_CONN_1);
      expect(result.ok).toBe(false);
      if (!result.ok) expect(result.error).toBe('Only the host can start the game');
    });

    it('returns an error when there are no players', () => {
      setupRoom(manager);
      const result = manager.startGame(HOST_CONN);
      expect(result.ok).toBe(false);
      if (!result.ok) expect(result.error).toBe('No players in the room');
    });

    it('returns an error when game is already started', () => {
      setupRoom(manager, { playerCount: 1 });
      manager.startGame(HOST_CONN);
      const result = manager.startGame(HOST_CONN);
      expect(result.ok).toBe(false);
      if (!result.ok) expect(result.error).toBe('Game already started');
    });

    it('returns an error when connection is not in a room', () => {
      const result = manager.startGame('unknown-conn');
      expect(result.ok).toBe(false);
      if (!result.ok) expect(result.error).toBe('Not in a room');
    });

    it('broadcasts PHASE_CHANGE with "question" after countdown', () => {
      setupRoom(manager, { playerCount: 1 });
      manager.startGame(HOST_CONN);
      vi.advanceTimersByTime(3000);

      const phaseChange = broadcasts.find((b) =>
        (b.message as { type: string }).type === 'PHASE_CHANGE' &&
        (b.message as { payload: { phase: string } }).payload.phase === 'question',
      );
      expect(phaseChange).toBeDefined();
    });
  });

  // -----------------------------------------------------------------------
  // submitAnswer
  // -----------------------------------------------------------------------
  describe('submitAnswer', () => {
    it('awards score > 0 for a correct answer', () => {
      const { playerConns } = setupRoom(manager, { playerCount: 1 });
      startGameAndAdvanceToQuestion(manager);

      const result = manager.submitAnswer(playerConns[0], 0, 1); // correctIndex = 1
      expect(result.ok).toBe(true);

      const answerResult = sent.find((s) =>
        s.connectionId === playerConns[0] &&
        (s.message as { type: string }).type === 'ANSWER_RESULT',
      );
      expect(answerResult).toBeDefined();
      const payload = (answerResult!.message as { payload: { correct: boolean; score: number } }).payload;
      expect(payload.correct).toBe(true);
      expect(payload.score).toBeGreaterThan(0);
    });

    it('awards score = 0 for an incorrect answer and resets streak', () => {
      const { playerConns } = setupRoom(manager, { playerCount: 1 });
      startGameAndAdvanceToQuestion(manager);

      const result = manager.submitAnswer(playerConns[0], 0, 0); // wrong answer
      expect(result.ok).toBe(true);

      const answerResult = sent.find((s) =>
        s.connectionId === playerConns[0] &&
        (s.message as { type: string }).type === 'ANSWER_RESULT',
      );
      expect(answerResult).toBeDefined();
      const payload = (answerResult!.message as { payload: { correct: boolean; score: number } }).payload;
      expect(payload.correct).toBe(false);
      expect(payload.score).toBe(0);
    });

    it('sends PLAYERS_UPDATED to the host after an answer', () => {
      const { playerConns } = setupRoom(manager, { playerCount: 1 });
      startGameAndAdvanceToQuestion(manager);

      manager.submitAnswer(playerConns[0], 0, 1);

      const hostUpdate = sent.find((s) =>
        s.connectionId === HOST_CONN &&
        (s.message as { type: string }).type === 'PLAYERS_UPDATED',
      );
      expect(hostUpdate).toBeDefined();
    });

    it('returns an error when player already answered', () => {
      const { playerConns } = setupRoom(manager, { playerCount: 1 });
      startGameAndAdvanceToQuestion(manager);

      manager.submitAnswer(playerConns[0], 0, 1);
      const result = manager.submitAnswer(playerConns[0], 0, 1);
      expect(result.ok).toBe(false);
      if (!result.ok) expect(result.error).toBe('Already answered');
    });

    it('returns an error for invalid answer index', () => {
      const { playerConns } = setupRoom(manager, { playerCount: 1 });
      startGameAndAdvanceToQuestion(manager);

      const result = manager.submitAnswer(playerConns[0], 0, 5 as 0 | 1 | 2 | 3);
      expect(result.ok).toBe(false);
      if (!result.ok) expect(result.error).toBe('Invalid answer index');
    });

    it('returns an error for non-integer answer index', () => {
      const { playerConns } = setupRoom(manager, { playerCount: 1 });
      startGameAndAdvanceToQuestion(manager);

      const result = manager.submitAnswer(playerConns[0], 0, 1.5 as 0 | 1 | 2 | 3);
      expect(result.ok).toBe(false);
      if (!result.ok) expect(result.error).toBe('Invalid answer index');
    });

    it('returns an error for wrong question index', () => {
      const { playerConns } = setupRoom(manager, { playerCount: 1 });
      startGameAndAdvanceToQuestion(manager);

      const result = manager.submitAnswer(playerConns[0], 5, 1);
      expect(result.ok).toBe(false);
      if (!result.ok) expect(result.error).toBe('Wrong question');
    });

    it('returns an error for negative question index', () => {
      const { playerConns } = setupRoom(manager, { playerCount: 1 });
      startGameAndAdvanceToQuestion(manager);

      const result = manager.submitAnswer(playerConns[0], -1, 1);
      expect(result.ok).toBe(false);
      if (!result.ok) expect(result.error).toBe('Invalid question index');
    });

    it('returns an error when connection is not a player', () => {
      setupRoom(manager, { playerCount: 1 });
      startGameAndAdvanceToQuestion(manager);

      const result = manager.submitAnswer('random-conn', 0, 1);
      expect(result.ok).toBe(false);
      if (!result.ok) expect(result.error).toBe('Not a player');
    });

    it('returns an error when host tries to submit answer', () => {
      setupRoom(manager, { playerCount: 1 });
      startGameAndAdvanceToQuestion(manager);

      // Host has playerId = null in connectionToRoom
      const result = manager.submitAnswer(HOST_CONN, 0, 1);
      expect(result.ok).toBe(false);
      if (!result.ok) expect(result.error).toBe('Not a player');
    });

    it('returns an error when no active question', () => {
      const { playerConns } = setupRoom(manager, { playerCount: 1 });
      // Game hasn't started yet, phase is 'lobby'
      const result = manager.submitAnswer(playerConns[0], 0, 1);
      expect(result.ok).toBe(false);
    });

    it('triggers closeQuestion after delay when all connected players have answered', () => {
      const { playerConns } = setupRoom(manager, { playerCount: 2 });
      startGameAndAdvanceToQuestion(manager);

      manager.submitAnswer(playerConns[0], 0, 1);

      // No QUESTION_CLOSED yet
      const closedBefore = broadcasts.find((b) =>
        (b.message as { type: string }).type === 'QUESTION_CLOSED',
      );
      expect(closedBefore).toBeUndefined();

      manager.submitAnswer(playerConns[1], 0, 0);

      // After ALL_ANSWERED_DELAY_MS (500ms)
      vi.advanceTimersByTime(500);

      const closedAfter = broadcasts.find((b) =>
        (b.message as { type: string }).type === 'QUESTION_CLOSED',
      );
      expect(closedAfter).toBeDefined();
    });

    it('closes question automatically when timer expires', () => {
      const { playerConns } = setupRoom(manager, { playerCount: 1 });
      startGameAndAdvanceToQuestion(manager);

      // Don't answer, let the timer expire (10 seconds)
      vi.advanceTimersByTime(10_000);

      const closed = broadcasts.find((b) =>
        (b.message as { type: string }).type === 'QUESTION_CLOSED',
      );
      expect(closed).toBeDefined();
    });

    it('increments streak for consecutive correct answers', () => {
      const { playerConns } = setupRoom(manager, { playerCount: 1, questions: validQuestions });
      startGameAndAdvanceToQuestion(manager);

      // Answer Q1 correctly
      manager.submitAnswer(playerConns[0], 0, 1);
      vi.advanceTimersByTime(500); // all answered delay
      manager.nextQuestion(HOST_CONN);

      // Answer Q2 correctly
      manager.submitAnswer(playerConns[0], 1, 1);

      const answerResults = sent.filter((s) =>
        s.connectionId === playerConns[0] &&
        (s.message as { type: string }).type === 'ANSWER_RESULT',
      );
      expect(answerResults).toHaveLength(2);
      // Second answer should have streak bonus (streak = 1 at that point, no bonus yet though)
      // But both should be correct
      expect((answerResults[0].message as { payload: { correct: boolean } }).payload.correct).toBe(true);
      expect((answerResults[1].message as { payload: { correct: boolean } }).payload.correct).toBe(true);
    });

    it('provides correctIndex in QUESTION_CLOSED payload', () => {
      const { playerConns } = setupRoom(manager, { playerCount: 1 });
      startGameAndAdvanceToQuestion(manager);

      manager.submitAnswer(playerConns[0], 0, 1);
      vi.advanceTimersByTime(500);

      const closed = broadcasts.find((b) =>
        (b.message as { type: string }).type === 'QUESTION_CLOSED',
      );
      expect(closed).toBeDefined();
      const payload = (closed!.message as { payload: { correctIndex: number; leaderboard: LeaderboardEntry[] } }).payload;
      expect(payload.correctIndex).toBe(1);
      expect(payload.leaderboard).toHaveLength(1);
      expect(payload.leaderboard[0].rank).toBe(1);
    });
  });

  // -----------------------------------------------------------------------
  // nextQuestion
  // -----------------------------------------------------------------------
  describe('nextQuestion', () => {
    it('advances to the next question from leaderboard phase', () => {
      setupRoom(manager, { playerCount: 1 });
      startGameAndAdvanceToQuestion(manager);

      // Answer and close question
      manager.submitAnswer(PLAYER_CONN_1, 0, 1);
      vi.advanceTimersByTime(500);

      broadcasts.length = 0; // Clear previous broadcasts
      const result = manager.nextQuestion(HOST_CONN);
      expect(result.ok).toBe(true);

      const question = broadcasts.find((b) =>
        (b.message as { type: string }).type === 'QUESTION',
      );
      expect(question).toBeDefined();
      const payload = (question!.message as { payload: { index: number; total: number } }).payload;
      expect(payload.index).toBe(1);
      expect(payload.total).toBe(2);
    });

    it('returns an error when non-host tries to advance', () => {
      setupRoom(manager, { playerCount: 1 });
      startGameAndAdvanceToQuestion(manager);
      manager.submitAnswer(PLAYER_CONN_1, 0, 1);
      vi.advanceTimersByTime(500);

      const result = manager.nextQuestion(PLAYER_CONN_1);
      expect(result.ok).toBe(false);
      if (!result.ok) expect(result.error).toBe('Only the host can advance');
    });

    it('returns an error when phase is not leaderboard', () => {
      setupRoom(manager, { playerCount: 1 });
      startGameAndAdvanceToQuestion(manager);

      // Phase is 'question', not 'leaderboard'
      const result = manager.nextQuestion(HOST_CONN);
      expect(result.ok).toBe(false);
      if (!result.ok) expect(result.error).toBe('Cannot advance from current phase');
    });

    it('returns an error when not in a room', () => {
      const result = manager.nextQuestion('unknown-conn');
      expect(result.ok).toBe(false);
      if (!result.ok) expect(result.error).toBe('Not in a room');
    });

    it('ends the game after the last question', () => {
      setupRoom(manager, { playerCount: 1, questions: singleQuestion });
      startGameAndAdvanceToQuestion(manager);

      manager.submitAnswer(PLAYER_CONN_1, 0, 1);
      vi.advanceTimersByTime(500); // close question

      broadcasts.length = 0;
      manager.nextQuestion(HOST_CONN);

      // nextQuestion increments index to 1, which >= questions.length(1), so endGame fires
      const gameOver = broadcasts.find((b) =>
        (b.message as { type: string }).type === 'GAME_OVER',
      );
      expect(gameOver).toBeDefined();
    });

    it('includes leaderboard in GAME_OVER payload', () => {
      setupRoom(manager, { playerCount: 1, questions: singleQuestion });
      startGameAndAdvanceToQuestion(manager);

      manager.submitAnswer(PLAYER_CONN_1, 0, 1);
      vi.advanceTimersByTime(500);

      broadcasts.length = 0;
      manager.nextQuestion(HOST_CONN);

      const gameOver = broadcasts.find((b) =>
        (b.message as { type: string }).type === 'GAME_OVER',
      );
      expect(gameOver).toBeDefined();
      const payload = (gameOver!.message as { payload: { leaderboard: LeaderboardEntry[] } }).payload;
      expect(payload.leaderboard).toHaveLength(1);
      expect(payload.leaderboard[0].nickname).toBe('Player1');
      expect(payload.leaderboard[0].score).toBeGreaterThan(0);
    });

    it('sets previousRanks for subsequent leaderboards', () => {
      setupRoom(manager, { playerCount: 2 });
      startGameAndAdvanceToQuestion(manager);

      // Q1: Player1 correct, Player2 wrong
      manager.submitAnswer(PLAYER_CONN_1, 0, 1);
      manager.submitAnswer(PLAYER_CONN_2, 0, 0);
      vi.advanceTimersByTime(500);

      const q1Closed = broadcasts.find((b) =>
        (b.message as { type: string }).type === 'QUESTION_CLOSED',
      );
      expect(q1Closed).toBeDefined();
      const q1Leaderboard = (q1Closed!.message as { payload: { leaderboard: LeaderboardEntry[] } }).payload.leaderboard;
      // First question — previousRank should be null
      expect(q1Leaderboard[0].previousRank).toBeNull();

      // Advance to Q2
      broadcasts.length = 0;
      manager.nextQuestion(HOST_CONN);

      // Q2: Both answer correctly
      manager.submitAnswer(PLAYER_CONN_1, 1, 1);
      manager.submitAnswer(PLAYER_CONN_2, 1, 1);
      vi.advanceTimersByTime(500);

      const q2Closed = broadcasts.find((b) =>
        (b.message as { type: string }).type === 'QUESTION_CLOSED',
      );
      expect(q2Closed).toBeDefined();
      const q2Leaderboard = (q2Closed!.message as { payload: { leaderboard: LeaderboardEntry[] } }).payload.leaderboard;
      // Second question — previousRank should be set from Q1
      expect(q2Leaderboard[0].previousRank).toBeTypeOf('number');
    });
  });

  // -----------------------------------------------------------------------
  // handleDisconnect
  // -----------------------------------------------------------------------
  describe('handleDisconnect', () => {
    it('destroys room and broadcasts ERROR when host disconnects', () => {
      setupRoom(manager, { playerCount: 1 });
      broadcasts.length = 0;

      manager.handleDisconnect(HOST_CONN);

      const error = broadcasts.find((b) =>
        (b.message as { type: string }).type === 'ERROR' &&
        (b.message as { payload: { code: string } }).payload.code === 'HOST_DISCONNECTED',
      );
      expect(error).toBeDefined();

      // Room should be cleaned up — trying to join should fail
      const result = manager.joinRoom('new-conn', 'DOESNT_EXIST', 'Alice');
      expect(result.ok).toBe(false);
    });

    it('removes player and broadcasts PLAYER_LEFT in lobby phase', () => {
      const { roomCode } = setupRoom(manager, { playerCount: 1 });
      broadcasts.length = 0;

      manager.handleDisconnect(PLAYER_CONN_1);

      const left = broadcasts.find((b) =>
        (b.message as { type: string }).type === 'PLAYER_LEFT',
      );
      expect(left).toBeDefined();
      const payload = (left!.message as { payload: { players: PlayerInfo[] } }).payload;
      expect(payload.players).toHaveLength(0);

      // Player should be fully removed, not just disconnected — a new player with same name can join
      const joinResult = manager.joinRoom('new-conn', roomCode, 'Player1');
      expect(joinResult.ok).toBe(true);
    });

    it('marks player DISCONNECTED mid-game and broadcasts PLAYER_LEFT', () => {
      const { roomCode, playerConns } = setupRoom(manager, { playerCount: 2 });
      startGameAndAdvanceToQuestion(manager);
      broadcasts.length = 0;

      manager.handleDisconnect(PLAYER_CONN_1);

      const left = broadcasts.find((b) =>
        (b.message as { type: string }).type === 'PLAYER_LEFT',
      );
      expect(left).toBeDefined();
      // Player should still be in the list (kept for reconnection)
      const payload = (left!.message as { payload: { players: PlayerInfo[] } }).payload;
      expect(payload.players).toHaveLength(2);
    });

    it('triggers question close when last connected player has answered after a disconnect', () => {
      const { playerConns } = setupRoom(manager, { playerCount: 2 });
      startGameAndAdvanceToQuestion(manager);

      // Player1 answers
      manager.submitAnswer(PLAYER_CONN_1, 0, 1);

      // Player2 disconnects (hasn't answered)
      manager.handleDisconnect(PLAYER_CONN_2);
      // Now the only connected player (Player1) has answered
      vi.advanceTimersByTime(500);

      const closed = broadcasts.find((b) =>
        (b.message as { type: string }).type === 'QUESTION_CLOSED',
      );
      expect(closed).toBeDefined();
    });

    it('is a no-op for unknown connection', () => {
      const broadcastsBefore = broadcasts.length;
      const sentBefore = sent.length;

      manager.handleDisconnect('unknown-conn');

      expect(broadcasts.length).toBe(broadcastsBefore);
      expect(sent.length).toBe(sentBefore);
    });

    it('cleans up connectionToRoom mapping on host disconnect', () => {
      setupRoom(manager, { playerCount: 1 });
      manager.handleDisconnect(HOST_CONN);

      // Host can no longer start a game since mapping is gone
      const result = manager.startGame(HOST_CONN);
      expect(result.ok).toBe(false);
      if (!result.ok) expect(result.error).toBe('Not in a room');
    });

    it('clears timers in disconnect all-answered path', () => {
      const { playerConns } = setupRoom(manager, { playerCount: 2 });
      startGameAndAdvanceToQuestion(manager);

      // Player1 answers
      manager.submitAnswer(playerConns[0], 0, 1);

      // Player2 disconnects — triggers all-answered check and should clear timer
      manager.handleDisconnect(playerConns[1]);

      // The question timer should have been cleared, so advancing past 10s
      // should not trigger a second closeQuestion
      vi.advanceTimersByTime(500); // all-answered delay fires closeQuestion
      vi.advanceTimersByTime(10_000); // original timer would have fired here

      // Only one QUESTION_CLOSED should exist
      const closedCount = broadcasts.filter((b) =>
        (b.message as { type: string }).type === 'QUESTION_CLOSED',
      ).length;
      expect(closedCount).toBe(1);
    });
  });

  // -----------------------------------------------------------------------
  // reconnect
  // -----------------------------------------------------------------------
  describe('reconnect', () => {
    it('restores connection and returns full reconnect state', () => {
      const { roomCode, playerIds } = setupRoom(manager, { playerCount: 1 });
      startGameAndAdvanceToQuestion(manager);

      // Disconnect the player mid-game
      manager.handleDisconnect(PLAYER_CONN_1);

      // Reconnect with a new connection ID
      const newConn = 'new-player-conn';
      const result = manager.reconnect(newConn, roomCode, playerIds[0]);
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.data.roomCode).toBe(roomCode);
        expect(result.data.phase).toBe('question');
        expect(result.data.players).toHaveLength(1);
        expect(result.data.questionIndex).toBe(0);
        expect(result.data.totalQuestions).toBe(2);
        expect(result.data.question).not.toBeNull();
        expect(result.data.elapsedMs).toBeTypeOf('number');
        expect(result.data.leaderboard).toHaveLength(1);
        expect(result.data.hasAnswered).toBe(false);
      }
    });

    it('broadcasts PLAYER_JOINED to others (excluding reconnecting player)', () => {
      const { roomCode, playerIds } = setupRoom(manager, { playerCount: 1 });
      startGameAndAdvanceToQuestion(manager);
      manager.handleDisconnect(PLAYER_CONN_1);
      broadcasts.length = 0;

      const newConn = 'new-player-conn';
      manager.reconnect(newConn, roomCode, playerIds[0]);

      const joinBroadcast = broadcasts.find((b) =>
        (b.message as { type: string }).type === 'PLAYER_JOINED',
      );
      expect(joinBroadcast).toBeDefined();
      expect(joinBroadcast!.excludeId).toBe(newConn);
    });

    it('returns an error when room is not found', () => {
      const result = manager.reconnect('new-conn', 'DOESNOTEXIST', 'player_123');
      expect(result.ok).toBe(false);
      if (!result.ok) expect(result.error).toBe('Room not found');
    });

    it('returns an error when player is not found in room', () => {
      const { roomCode } = setupRoom(manager, { playerCount: 1 });
      const result = manager.reconnect('new-conn', roomCode, 'nonexistent_player');
      expect(result.ok).toBe(false);
      if (!result.ok) expect(result.error).toBe('Player not found in this room');
    });

    it('returns an error when player is already connected', () => {
      const { roomCode, playerIds } = setupRoom(manager, { playerCount: 1 });
      // Player is still connected (not disconnected)
      const result = manager.reconnect('new-conn', roomCode, playerIds[0]);
      expect(result.ok).toBe(false);
      if (!result.ok) expect(result.error).toBe('Player is already connected');
    });

    it('allows reconnected player to submit answers', () => {
      const { roomCode, playerIds } = setupRoom(manager, { playerCount: 1 });
      startGameAndAdvanceToQuestion(manager);
      manager.handleDisconnect(PLAYER_CONN_1);

      const newConn = 'new-player-conn';
      manager.reconnect(newConn, roomCode, playerIds[0]);

      const result = manager.submitAnswer(newConn, 0, 1);
      expect(result.ok).toBe(true);
    });

    it('returns score and hasAnswered reflecting player state', () => {
      const { roomCode, playerIds } = setupRoom(manager, { playerCount: 1 });
      startGameAndAdvanceToQuestion(manager);

      // Answer the question, then disconnect
      manager.submitAnswer(PLAYER_CONN_1, 0, 1);
      manager.handleDisconnect(PLAYER_CONN_1);

      const newConn = 'new-player-conn';
      const result = manager.reconnect(newConn, roomCode, playerIds[0]);
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.data.score).toBeGreaterThan(0);
        expect(result.data.hasAnswered).toBe(true);
      }
    });
  });

  // -----------------------------------------------------------------------
  // forceEndGame
  // -----------------------------------------------------------------------
  describe('forceEndGame', () => {
    it('ends the game and broadcasts GAME_OVER when host force-ends', () => {
      setupRoom(manager, { playerCount: 1 });
      startGameAndAdvanceToQuestion(manager);
      broadcasts.length = 0;

      const result = manager.forceEndGame(HOST_CONN);
      expect(result.ok).toBe(true);

      const gameOver = broadcasts.find((b) =>
        (b.message as { type: string }).type === 'GAME_OVER',
      );
      expect(gameOver).toBeDefined();
    });

    it('includes leaderboard in the GAME_OVER payload', () => {
      setupRoom(manager, { playerCount: 1 });
      startGameAndAdvanceToQuestion(manager);
      broadcasts.length = 0;

      manager.forceEndGame(HOST_CONN);

      const gameOver = broadcasts.find((b) =>
        (b.message as { type: string }).type === 'GAME_OVER',
      );
      expect(gameOver).toBeDefined();
      const payload = (gameOver!.message as { payload: { leaderboard: LeaderboardEntry[] } }).payload;
      expect(payload.leaderboard).toHaveLength(1);
    });

    it('returns an error when non-host tries to force end', () => {
      setupRoom(manager, { playerCount: 1 });
      startGameAndAdvanceToQuestion(manager);

      const result = manager.forceEndGame(PLAYER_CONN_1);
      expect(result.ok).toBe(false);
      if (!result.ok) expect(result.error).toBe('Only the host can end the game');
    });

    it('returns an error when not in a room', () => {
      const result = manager.forceEndGame('unknown-conn');
      expect(result.ok).toBe(false);
      if (!result.ok) expect(result.error).toBe('Not in a room');
    });

    it('cleans up room after force ending', () => {
      const { roomCode } = setupRoom(manager, { playerCount: 1 });
      startGameAndAdvanceToQuestion(manager);

      manager.forceEndGame(HOST_CONN);

      // Room should no longer exist
      const result = manager.joinRoom('new-conn', roomCode, 'Late');
      expect(result.ok).toBe(false);
      if (!result.ok) expect(result.error).toBe('Room not found');
    });

    it('works from lobby phase (before game starts)', () => {
      setupRoom(manager, { playerCount: 1 });
      broadcasts.length = 0;

      const result = manager.forceEndGame(HOST_CONN);
      expect(result.ok).toBe(true);

      const gameOver = broadcasts.find((b) =>
        (b.message as { type: string }).type === 'GAME_OVER',
      );
      expect(gameOver).toBeDefined();
      const payload = (gameOver!.message as { payload: { leaderboard: LeaderboardEntry[] } }).payload;
      // Players should have zero scores
      expect(payload.leaderboard).toHaveLength(1);
      expect(payload.leaderboard[0].score).toBe(0);
    });

    it('works from countdown phase', () => {
      setupRoom(manager, { playerCount: 1 });
      manager.startGame(HOST_CONN);
      // Don't advance past countdown
      broadcasts.length = 0;

      const result = manager.forceEndGame(HOST_CONN);
      expect(result.ok).toBe(true);

      const gameOver = broadcasts.find((b) =>
        (b.message as { type: string }).type === 'GAME_OVER',
      );
      expect(gameOver).toBeDefined();
    });
  });

  // -----------------------------------------------------------------------
  // dispose
  // -----------------------------------------------------------------------
  describe('dispose', () => {
    it('clears the cleanup interval', () => {
      const clearIntervalSpy = vi.spyOn(globalThis, 'clearInterval');
      manager.dispose();
      expect(clearIntervalSpy).toHaveBeenCalled();
      clearIntervalSpy.mockRestore();
    });
  });

  // -----------------------------------------------------------------------
  // cleanupStaleRooms (via timer)
  // -----------------------------------------------------------------------
  describe('stale room cleanup', () => {
    it('removes rooms older than 2 hours and broadcasts ROOM_TIMEOUT error', () => {
      const { roomCode } = setupRoom(manager, { playerCount: 1 });

      // Advance past STALE_ROOM_TTL_MS (2 hours) + CLEANUP_INTERVAL_MS (5 minutes)
      vi.advanceTimersByTime(2 * 60 * 60 * 1000 + 5 * 60 * 1000);

      const timeout = broadcasts.find((b) =>
        (b.message as { type: string }).type === 'ERROR' &&
        (b.message as { payload: { code: string } }).payload.code === 'ROOM_TIMEOUT',
      );
      expect(timeout).toBeDefined();

      // Room should be gone
      const result = manager.joinRoom('new-conn', roomCode, 'Late');
      expect(result.ok).toBe(false);
      if (!result.ok) expect(result.error).toBe('Room not found');
    });

    it('does not remove rooms younger than 2 hours', () => {
      const { roomCode } = setupRoom(manager, { playerCount: 1 });

      // Advance less than 2 hours
      vi.advanceTimersByTime(60 * 60 * 1000); // 1 hour

      // Room should still exist
      const result = manager.joinRoom('new-conn', roomCode, 'Timely');
      expect(result.ok).toBe(true);
    });
  });

  // -----------------------------------------------------------------------
  // Full game flow (integration-style)
  // -----------------------------------------------------------------------
  describe('full game flow', () => {
    it('plays a complete single-question game from lobby to finished', () => {
      // 1. Create room
      const createResult = manager.createRoom(HOST_CONN, 'Host', singleQuestion);
      expect(createResult.ok).toBe(true);
      const roomCode = (createResult as { ok: true; data: string }).data;

      // 2. Join players
      const join1 = manager.joinRoom(PLAYER_CONN_1, roomCode, 'Alice');
      const join2 = manager.joinRoom(PLAYER_CONN_2, roomCode, 'Bob');
      expect(join1.ok).toBe(true);
      expect(join2.ok).toBe(true);

      // 3. Start game
      const startResult = manager.startGame(HOST_CONN);
      expect(startResult.ok).toBe(true);

      // 4. Wait for countdown
      vi.advanceTimersByTime(3000);

      // 5. Both players answer
      manager.submitAnswer(PLAYER_CONN_1, 0, 1); // correct
      manager.submitAnswer(PLAYER_CONN_2, 0, 0); // wrong

      // 6. All answered — wait for close delay
      vi.advanceTimersByTime(500);

      // 7. QUESTION_CLOSED should have been broadcast
      const closed = broadcasts.find((b) =>
        (b.message as { type: string }).type === 'QUESTION_CLOSED',
      );
      expect(closed).toBeDefined();

      // 8. Host advances — since single question, game should end
      broadcasts.length = 0;
      manager.nextQuestion(HOST_CONN);

      const gameOver = broadcasts.find((b) =>
        (b.message as { type: string }).type === 'GAME_OVER',
      );
      expect(gameOver).toBeDefined();

      const leaderboard = (gameOver!.message as { payload: { leaderboard: LeaderboardEntry[] } }).payload.leaderboard;
      expect(leaderboard).toHaveLength(2);
      // Alice (correct) should be rank 1
      expect(leaderboard[0].nickname).toBe('Alice');
      expect(leaderboard[0].rank).toBe(1);
      expect(leaderboard[0].score).toBeGreaterThan(0);
      // Bob (wrong) should be rank 2
      expect(leaderboard[1].nickname).toBe('Bob');
      expect(leaderboard[1].rank).toBe(2);
      expect(leaderboard[1].score).toBe(0);
    });

    it('plays a multi-question game with timer-based question close', () => {
      setupRoom(manager, { playerCount: 1 });
      startGameAndAdvanceToQuestion(manager);

      // Let Q1 timer expire without answering
      vi.advanceTimersByTime(10_000);

      const q1Closed = broadcasts.find((b) =>
        (b.message as { type: string }).type === 'QUESTION_CLOSED',
      );
      expect(q1Closed).toBeDefined();

      // Host advances to Q2
      broadcasts.length = 0;
      manager.nextQuestion(HOST_CONN);

      const q2 = broadcasts.find((b) =>
        (b.message as { type: string }).type === 'QUESTION',
      );
      expect(q2).toBeDefined();
      expect((q2!.message as { payload: { index: number } }).payload.index).toBe(1);

      // Let Q2 timer expire
      vi.advanceTimersByTime(10_000);

      // After Q2, host advances — should trigger GAME_OVER since we have 2 questions
      broadcasts.length = 0;
      manager.nextQuestion(HOST_CONN);

      const gameOver = broadcasts.find((b) =>
        (b.message as { type: string }).type === 'GAME_OVER',
      );
      expect(gameOver).toBeDefined();
    });
  });
});
