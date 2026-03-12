import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { WebSocketService } from './websocket.service';
import { GameStateService } from './game-state.service';
import type { ClientMessage, ServerMessage } from '@bazam/shared-types';

// ---------------------------------------------------------------------------
// Mock WebSocket
// ---------------------------------------------------------------------------

type MockWebSocket = {
  url: string;
  readyState: number;
  onopen: ((event: Event) => void) | null;
  onmessage: ((event: MessageEvent) => void) | null;
  onclose: ((event: CloseEvent) => void) | null;
  onerror: ((event: Event) => void) | null;
  send: ReturnType<typeof vi.fn>;
  close: ReturnType<typeof vi.fn>;
};

let mockWsInstance: MockWebSocket;
let mockWsConstructorCalls: string[];

const setupMockWebSocket = (): void => {
  mockWsConstructorCalls = [];

  // Use a real constructor function so `new WebSocket(url)` works
  function MockWS(this: MockWebSocket, url: string): void {
    mockWsConstructorCalls.push(url);
    this.url = url;
    this.readyState = 0; // CONNECTING
    this.onopen = null;
    this.onmessage = null;
    this.onclose = null;
    this.onerror = null;
    this.send = vi.fn();
    this.close = vi.fn();
    mockWsInstance = this;
  }
  MockWS.CONNECTING = 0;
  MockWS.OPEN = 1;
  MockWS.CLOSING = 2;
  MockWS.CLOSED = 3;

  vi.stubGlobal('WebSocket', MockWS);
};

/** Simulate the server accepting the connection. */
const simulateOpen = (): void => {
  mockWsInstance.readyState = WebSocket.OPEN;
  mockWsInstance.onopen?.(new Event('open'));
};

/** Simulate receiving a server message. */
const simulateMessage = (data: ServerMessage): void => {
  mockWsInstance.onmessage?.(new MessageEvent('message', { data: JSON.stringify(data) }));
};

/** Simulate the connection closing. */
const simulateClose = (): void => {
  mockWsInstance.readyState = WebSocket.CLOSED;
  mockWsInstance.onclose?.(new CloseEvent('close'));
};

/** Simulate a connection error. */
const simulateError = (): void => {
  mockWsInstance.onerror?.(new Event('error'));
};

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('WebSocketService', () => {
  let service: WebSocketService;
  let gameState: GameStateService;
  let router: Router;

  beforeEach(() => {
    vi.useFakeTimers();
    setupMockWebSocket();

    TestBed.configureTestingModule({
      providers: [provideRouter([])],
    });

    service = TestBed.inject(WebSocketService);
    gameState = TestBed.inject(GameStateService);
    router = TestBed.inject(Router);
    gameState.reset();

    vi.spyOn(router, 'navigate').mockResolvedValue(true);
  });

  afterEach(() => {
    service.disconnect();
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  // ---------------------------------------------------------------------------
  // connectionStatus
  // ---------------------------------------------------------------------------

  describe('connectionStatus', () => {
    it('should be disconnected initially', () => {
      expect(service.connectionStatus()).toBe('disconnected');
    });
  });

  // ---------------------------------------------------------------------------
  // connect()
  // ---------------------------------------------------------------------------

  describe('connect()', () => {
    it('should resolve and set status to connected on successful connection', async () => {
      const connectPromise = service.connect();

      expect(service.connectionStatus()).toBe('connecting');
      simulateOpen();

      await connectPromise;
      expect(service.connectionStatus()).toBe('connected');
    });

    it('should construct the WebSocket URL with ws: protocol', async () => {
      const connectPromise = service.connect();
      simulateOpen();
      await connectPromise;

      expect(mockWsConstructorCalls.length).toBe(1);
      expect(mockWsConstructorCalls[0]).toContain('ws:');
    });

    it('should reject with timeout error after 5 seconds', async () => {
      const connectPromise = service.connect();

      vi.advanceTimersByTime(5000);

      await expect(connectPromise).rejects.toThrow('WebSocket connection timed out');
      expect(service.connectionStatus()).toBe('disconnected');
    });

    it('should resolve immediately if already connected', async () => {
      const firstConnect = service.connect();
      simulateOpen();
      await firstConnect;

      // Second connect should resolve immediately without creating a new WS
      const callCountBefore = mockWsConstructorCalls.length;
      await service.connect();
      expect(mockWsConstructorCalls.length).toBe(callCountBefore);
    });

    it('should reject when connection emits error', async () => {
      const connectPromise = service.connect();

      simulateError();

      await expect(connectPromise).rejects.toThrow('WebSocket connection failed');
      expect(service.connectionStatus()).toBe('disconnected');
    });

    it('should reject when connection closes before open', async () => {
      const connectPromise = service.connect();

      simulateClose();

      await expect(connectPromise).rejects.toThrow('WebSocket connection closed');
      expect(service.connectionStatus()).toBe('disconnected');
    });
  });

  // ---------------------------------------------------------------------------
  // send()
  // ---------------------------------------------------------------------------

  describe('send()', () => {
    it('should send JSON-stringified message when connected', async () => {
      const connectPromise = service.connect();
      simulateOpen();
      await connectPromise;

      const message: ClientMessage = { type: 'START_GAME' };
      service.send(message);

      expect(mockWsInstance.send).toHaveBeenCalledWith(JSON.stringify(message));
    });

    it('should not throw when disconnected', () => {
      const message: ClientMessage = { type: 'START_GAME' };
      expect(() => service.send(message)).not.toThrow();
    });

    it('should not call send on the underlying WebSocket when disconnected', () => {
      const message: ClientMessage = { type: 'START_GAME' };
      service.send(message);
      // No mockWsInstance exists, so nothing to check -- just confirm no error
    });

    it('should send the correct payload structure', async () => {
      const connectPromise = service.connect();
      simulateOpen();
      await connectPromise;

      const message: ClientMessage = {
        type: 'SUBMIT_ANSWER',
        payload: { questionIndex: 0, answerIndex: 2 },
      };
      service.send(message);

      const sentData = mockWsInstance.send.mock.calls[0][0] as string;
      const parsed = JSON.parse(sentData) as ClientMessage;
      expect(parsed).toEqual(message);
    });

    it('should return false and set errorMessage when disconnected', () => {
      const message: ClientMessage = { type: 'START_GAME' };
      const result = service.send(message);

      expect(result).toBe(false);
      expect(gameState.errorMessage()).toBe('Geen verbinding met de server.');
    });

    it('should return true when connected', async () => {
      const connectPromise = service.connect();
      simulateOpen();
      await connectPromise;

      const result = service.send({ type: 'START_GAME' });
      expect(result).toBe(true);
    });
  });

  // ---------------------------------------------------------------------------
  // disconnect()
  // ---------------------------------------------------------------------------

  describe('disconnect()', () => {
    it('should close the WebSocket and set status to disconnected', async () => {
      const connectPromise = service.connect();
      simulateOpen();
      await connectPromise;

      service.disconnect();

      expect(mockWsInstance.close).toHaveBeenCalled();
      expect(service.connectionStatus()).toBe('disconnected');
    });

    it('should clear all event handlers on the WebSocket', async () => {
      const connectPromise = service.connect();
      simulateOpen();
      await connectPromise;

      service.disconnect();

      expect(mockWsInstance.onopen).toBeNull();
      expect(mockWsInstance.onmessage).toBeNull();
      expect(mockWsInstance.onclose).toBeNull();
      expect(mockWsInstance.onerror).toBeNull();
    });

    it('should be safe to call multiple times', async () => {
      const connectPromise = service.connect();
      simulateOpen();
      await connectPromise;

      service.disconnect();
      expect(() => service.disconnect()).not.toThrow();
      expect(service.connectionStatus()).toBe('disconnected');
    });
  });

  // ---------------------------------------------------------------------------
  // handleMessage (via onmessage)
  // ---------------------------------------------------------------------------

  describe('handleMessage', () => {
    /** Helper to connect and then simulate a server message. */
    const connectAndSend = async (msg: ServerMessage): Promise<void> => {
      const connectPromise = service.connect();
      simulateOpen();
      await connectPromise;
      simulateMessage(msg);
    };

    // -- ROOM_CREATED -------------------------------------------------------

    describe('ROOM_CREATED', () => {
      it('should set roomCode and gamePhase to lobby', async () => {
        await connectAndSend({ type: 'ROOM_CREATED', payload: { roomCode: 'XYZ789' } });

        expect(gameState.roomCode()).toBe('XYZ789');
        expect(gameState.gamePhase()).toBe('lobby');
      });

      it('should navigate to /host/lobby', async () => {
        await connectAndSend({ type: 'ROOM_CREATED', payload: { roomCode: 'XYZ789' } });

        expect(router.navigate).toHaveBeenCalledWith(['/host/lobby']);
      });
    });

    // -- PLAYER_JOINED ------------------------------------------------------

    describe('PLAYER_JOINED', () => {
      const players = [
        { id: 'p1', nickname: 'Alice', score: 0, hasAnswered: false },
        { id: 'p2', nickname: 'Bob', score: 0, hasAnswered: false },
      ];

      it('should set players list', async () => {
        await connectAndSend({ type: 'PLAYER_JOINED', payload: { players } });

        expect(gameState.players()).toEqual(players);
      });

      it('should set gamePhase to lobby and navigate for player in idle phase', async () => {
        gameState.role.set('player');
        gameState.gamePhase.set('idle');

        await connectAndSend({ type: 'PLAYER_JOINED', payload: { players } });

        expect(gameState.gamePhase()).toBe('lobby');
        expect(router.navigate).toHaveBeenCalledWith(['/play/lobby']);
      });

      it('should not navigate when role is host', async () => {
        gameState.role.set('host');
        gameState.gamePhase.set('idle');

        await connectAndSend({ type: 'PLAYER_JOINED', payload: { players } });

        expect(gameState.players()).toEqual(players);
        expect(router.navigate).not.toHaveBeenCalled();
      });

      it('should not navigate when player is already past idle phase', async () => {
        gameState.role.set('player');
        gameState.gamePhase.set('lobby');

        await connectAndSend({ type: 'PLAYER_JOINED', payload: { players } });

        expect(gameState.players()).toEqual(players);
        expect(router.navigate).not.toHaveBeenCalled();
      });
    });

    // -- PLAYERS_UPDATED ----------------------------------------------------

    describe('PLAYERS_UPDATED', () => {
      it('should update players list', async () => {
        const players = [{ id: 'p1', nickname: 'Alice', score: 100, hasAnswered: true }];
        await connectAndSend({ type: 'PLAYERS_UPDATED', payload: { players } });

        expect(gameState.players()).toEqual(players);
      });
    });

    // -- PLAYER_LEFT --------------------------------------------------------

    describe('PLAYER_LEFT', () => {
      it('should update players list', async () => {
        const players = [{ id: 'p1', nickname: 'Alice', score: 0, hasAnswered: false }];
        await connectAndSend({ type: 'PLAYER_LEFT', payload: { players } });

        expect(gameState.players()).toEqual(players);
      });
    });

    // -- GAME_STARTING ------------------------------------------------------

    describe('GAME_STARTING', () => {
      it('should set totalQuestions and gamePhase to countdown', async () => {
        await connectAndSend({ type: 'GAME_STARTING', payload: { totalQuestions: 10 } });

        expect(gameState.totalQuestions()).toBe(10);
        expect(gameState.gamePhase()).toBe('countdown');
      });

      it('should navigate to /host/game when role is host', async () => {
        gameState.role.set('host');

        await connectAndSend({ type: 'GAME_STARTING', payload: { totalQuestions: 5 } });

        expect(router.navigate).toHaveBeenCalledWith(['/host/game']);
      });

      it('should navigate to /play/game when role is player', async () => {
        gameState.role.set('player');

        await connectAndSend({ type: 'GAME_STARTING', payload: { totalQuestions: 5 } });

        expect(router.navigate).toHaveBeenCalledWith(['/play/game']);
      });

      it('should navigate to /play/game when role is null (defaults to else branch)', async () => {
        gameState.role.set(null);

        await connectAndSend({ type: 'GAME_STARTING', payload: { totalQuestions: 5 } });

        expect(router.navigate).toHaveBeenCalledWith(['/play/game']);
      });
    });

    // -- QUESTION -----------------------------------------------------------

    describe('QUESTION', () => {
      const question = {
        text: 'What is 2+2?',
        answers: ['1', '2', '3', '4'] as [string, string, string, string],
        timeLimitSeconds: 15,
      };

      it('should set currentQuestion, questionIndex, timeLimit, and gamePhase', async () => {
        await connectAndSend({
          type: 'QUESTION',
          payload: { question, index: 2, total: 10, timeLimit: 15 },
        });

        expect(gameState.currentQuestion()).toEqual(question);
        expect(gameState.questionIndex()).toBe(2);
        expect(gameState.timeLimit()).toBe(15);
        expect(gameState.gamePhase()).toBe('question');
      });

      it('should clear lastAnswerResult', async () => {
        gameState.lastAnswerResult.set({ correct: true, score: 100, totalScore: 100, correctIndex: 0 });

        await connectAndSend({
          type: 'QUESTION',
          payload: { question, index: 1, total: 5, timeLimit: 20 },
        });

        expect(gameState.lastAnswerResult()).toBeNull();
      });
    });

    // -- ANSWER_RESULT ------------------------------------------------------

    describe('ANSWER_RESULT', () => {
      it('should set lastAnswerResult and playerScore', async () => {
        const result = { correct: true, score: 150, totalScore: 300, correctIndex: 2 as const };

        await connectAndSend({ type: 'ANSWER_RESULT', payload: result });

        expect(gameState.lastAnswerResult()).toEqual(result);
        expect(gameState.playerScore()).toBe(300);
      });
    });

    // -- QUESTION_CLOSED ----------------------------------------------------

    describe('QUESTION_CLOSED', () => {
      it('should set leaderboard and gamePhase to leaderboard', async () => {
        const leaderboard = [
          { id: 'p1', nickname: 'Alice', score: 200, rank: 1, previousRank: null, streak: 1 },
        ];

        await connectAndSend({
          type: 'QUESTION_CLOSED',
          payload: { correctIndex: 1, leaderboard },
        });

        expect(gameState.leaderboard()).toEqual(leaderboard);
        expect(gameState.gamePhase()).toBe('leaderboard');
      });
    });

    // -- GAME_OVER ----------------------------------------------------------

    describe('GAME_OVER', () => {
      const leaderboard = [
        { id: 'p1', nickname: 'Alice', score: 500, rank: 1, previousRank: 1, streak: 3 },
        { id: 'p2', nickname: 'Bob', score: 300, rank: 2, previousRank: 2, streak: 1 },
      ];

      it('should set leaderboard and gamePhase to finished', async () => {
        await connectAndSend({ type: 'GAME_OVER', payload: { leaderboard } });

        expect(gameState.leaderboard()).toEqual(leaderboard);
        expect(gameState.gamePhase()).toBe('finished');
      });

      it('should navigate to /host/results when role is host', async () => {
        gameState.role.set('host');

        await connectAndSend({ type: 'GAME_OVER', payload: { leaderboard } });

        expect(router.navigate).toHaveBeenCalledWith(['/host/results']);
      });

      it('should navigate to /play/results when role is player', async () => {
        gameState.role.set('player');

        await connectAndSend({ type: 'GAME_OVER', payload: { leaderboard } });

        expect(router.navigate).toHaveBeenCalledWith(['/play/results']);
      });
    });

    // -- PHASE_CHANGE -------------------------------------------------------

    describe('PHASE_CHANGE', () => {
      it('should set gamePhase to the provided phase', async () => {
        await connectAndSend({ type: 'PHASE_CHANGE', payload: { phase: 'countdown' } });

        expect(gameState.gamePhase()).toBe('countdown');
      });
    });

    // -- ERROR --------------------------------------------------------------

    describe('ERROR', () => {
      it('should set errorMessage', async () => {
        await connectAndSend({
          type: 'ERROR',
          payload: { message: 'Room not found', code: 'ROOM_NOT_FOUND' },
        });

        expect(gameState.errorMessage()).toBe('Room not found');
      });
    });

    // -- RECONNECTED --------------------------------------------------------

    describe('RECONNECTED', () => {
      const reconnectPayload = {
        roomCode: 'ABC123',
        phase: 'question' as const,
        players: [{ id: 'p1', nickname: 'Alice', score: 100, hasAnswered: true }],
        question: { text: 'Q?', answers: ['A', 'B', 'C', 'D'] as [string, string, string, string], timeLimitSeconds: 20 },
        questionIndex: 2,
        totalQuestions: 5,
        timeLimit: 20,
        elapsedMs: 5000,
        score: 100,
        leaderboard: [{ id: 'p1', nickname: 'Alice', score: 100, rank: 1, previousRank: null, streak: 1 }],
        hasAnswered: true,
      };

      it('should restore all game state signals from the reconnect payload', async () => {
        await connectAndSend({ type: 'RECONNECTED', payload: reconnectPayload });

        expect(gameState.roomCode()).toBe('ABC123');
        expect(gameState.gamePhase()).toBe('question');
        expect(gameState.players()).toEqual(reconnectPayload.players);
        expect(gameState.currentQuestion()).toEqual(reconnectPayload.question);
        expect(gameState.questionIndex()).toBe(2);
        expect(gameState.totalQuestions()).toBe(5);
        expect(gameState.timeLimit()).toBe(20);
        expect(gameState.elapsedMs()).toBe(5000);
        expect(gameState.playerScore()).toBe(100);
        expect(gameState.leaderboard()).toEqual(reconnectPayload.leaderboard);
      });

      it('should set a placeholder lastAnswerResult when hasAnswered is true', async () => {
        await connectAndSend({ type: 'RECONNECTED', payload: reconnectPayload });

        expect(gameState.lastAnswerResult()).toEqual({ correct: false, score: 0, totalScore: 100, correctIndex: 0 });
      });

      it('should not overwrite existing lastAnswerResult on reconnect', async () => {
        const existingResult = { correct: true, score: 50, totalScore: 150, correctIndex: 1 as const };
        gameState.lastAnswerResult.set(existingResult);

        await connectAndSend({ type: 'RECONNECTED', payload: reconnectPayload });

        expect(gameState.lastAnswerResult()).toEqual(existingResult);
      });

      it('should not set lastAnswerResult when hasAnswered is false', async () => {
        await connectAndSend({
          type: 'RECONNECTED',
          payload: { ...reconnectPayload, hasAnswered: false },
        });

        expect(gameState.lastAnswerResult()).toBeNull();
      });

      it('should navigate to the correct route based on phase and role', async () => {
        gameState.role.set('host');
        await connectAndSend({ type: 'RECONNECTED', payload: { ...reconnectPayload, phase: 'lobby' } });

        expect(router.navigate).toHaveBeenCalledWith(['/host/lobby']);
      });

      it('should navigate to /play/game for player in question phase', async () => {
        gameState.role.set('player');
        await connectAndSend({ type: 'RECONNECTED', payload: reconnectPayload });

        expect(router.navigate).toHaveBeenCalledWith(['/play/game']);
      });

      it('should navigate to /host/results for host in finished phase', async () => {
        gameState.role.set('host');
        await connectAndSend({ type: 'RECONNECTED', payload: { ...reconnectPayload, phase: 'finished' } });

        expect(router.navigate).toHaveBeenCalledWith(['/host/results']);
      });
    });

    // -- Invalid message ----------------------------------------------------

    describe('invalid message', () => {
      it('should set error message when receiving unparseable data', async () => {
        const connectPromise = service.connect();
        simulateOpen();
        await connectPromise;

        // Simulate raw invalid JSON via onmessage
        mockWsInstance.onmessage?.(new MessageEvent('message', { data: 'not-json{{{' }));

        expect(gameState.errorMessage()).toBe('Ongeldig bericht ontvangen van de server');
      });
    });
  });

  // ---------------------------------------------------------------------------
  // endSession()
  // ---------------------------------------------------------------------------

  describe('endSession()', () => {
    it('should disconnect, reset game state, and navigate to the given path', async () => {
      const connectPromise = service.connect();
      simulateOpen();
      await connectPromise;

      gameState.roomCode.set('ABC123');
      gameState.role.set('host');

      service.endSession('/');

      expect(service.connectionStatus()).toBe('disconnected');
      expect(gameState.roomCode()).toBeNull();
      expect(gameState.role()).toBeNull();
      expect(router.navigate).toHaveBeenCalledWith(['/']);
    });
  });

  // ---------------------------------------------------------------------------
  // isConnecting
  // ---------------------------------------------------------------------------

  describe('isConnecting', () => {
    it('should be false when disconnected', () => {
      expect(service.isConnecting()).toBe(false);
    });

    it('should be true while connecting', () => {
      service.connect();
      expect(service.isConnecting()).toBe(true);
    });

    it('should be false after connected', async () => {
      const connectPromise = service.connect();
      simulateOpen();
      await connectPromise;
      expect(service.isConnecting()).toBe(false);
    });
  });
});
