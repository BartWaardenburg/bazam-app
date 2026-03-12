import { Elysia } from 'elysia';
import { cors } from '@elysiajs/cors';
import type { ErrorCode } from '@bazam/shared-types';
import { ConnectionRegistry } from './game/connection-registry';
import { RoomManager } from './game/room-manager';
import { isValidAnswerIndex } from './game/validation';
import { quizRoutes } from './routes/quiz';
import { sessionRoutes } from './routes/sessions';
import { logger } from './utils/logger';

const rawPort = Number(process.env['PORT'] ?? 3001);
const PORT = Number.isInteger(rawPort) && rawPort > 0 ? rawPort : 3001;

const CLIENT_ORIGIN = process.env['CLIENT_ORIGIN'] ?? 'http://localhost:4200';

const connections = new ConnectionRegistry();
const roomManager = new RoomManager(connections);

/**
 * Sends a JSON error message to a single connection via the {@link ConnectionRegistry}.
 *
 * @param connectionId - The target connection's identifier.
 * @param message - Human-readable error description.
 * @param code - Machine-readable error code for client-side handling.
 */
const sendError = (connectionId: string, message: string, code: ErrorCode = 'INVALID_MESSAGE'): void => {
  connections.send(connectionId, { type: 'ERROR', payload: { message, code } });
};

/**
 * Validates the structural shape of a parsed message payload.
 * Returns an error string if the payload is invalid for the given type, or null if valid.
 */
const validatePayload = (parsed: Record<string, unknown>): string | null => {
  const type = parsed.type as string;

  if (type === 'CREATE_ROOM' || type === 'JOIN_ROOM' || type === 'SUBMIT_ANSWER' || type === 'RECONNECT') {
    if (!parsed.payload || typeof parsed.payload !== 'object') {
      return 'Missing payload';
    }
    const payload = parsed.payload as Record<string, unknown>;

    switch (type) {
      case 'CREATE_ROOM':
        if (typeof payload.hostName !== 'string' && payload.hostName !== undefined) return 'Invalid hostName';
        if (!Array.isArray(payload.questions)) return 'Invalid questions';
        if (payload.quizId !== undefined && typeof payload.quizId !== 'string') return 'Invalid quizId';
        break;
      case 'JOIN_ROOM':
        if (typeof payload.roomCode !== 'string') return 'Invalid roomCode';
        if (typeof payload.nickname !== 'string') return 'Invalid nickname';
        break;
      case 'SUBMIT_ANSWER':
        if (!Number.isInteger(payload.questionIndex)) return 'Invalid questionIndex';
        if (!Number.isInteger(payload.answerIndex) || !isValidAnswerIndex(payload.answerIndex as number)) return 'Invalid answerIndex';
        break;
      case 'RECONNECT':
        if (typeof payload.roomCode !== 'string') return 'Invalid roomCode';
        if (typeof payload.playerId !== 'string') return 'Invalid playerId';
        break;
    }
  }

  return null;
};

/**
 * Attempts to parse a raw WebSocket payload into a validated message object.
 * Accepts both string and pre-parsed object payloads.
 *
 * @param raw - The raw WebSocket message data (string or object).
 * @returns A Result containing the parsed message on success, or an error string on failure.
 */
const parseMessage = (raw: unknown): { ok: true; data: Record<string, unknown> } | { ok: false; error: string } => {
  try {
    const str = typeof raw === 'string' ? raw : JSON.stringify(raw);
    const parsed = JSON.parse(str) as Record<string, unknown>;
    if (typeof parsed.type !== 'string') return { ok: false, error: 'Missing message type' };

    const payloadError = validatePayload(parsed);
    if (payloadError) return { ok: false, error: payloadError };

    return { ok: true, data: parsed };
  } catch {
    return { ok: false, error: 'Invalid JSON' };
  }
};

/**
 * Parses and routes an incoming WebSocket message to the appropriate game action.
 * Delegates to the {@link RoomManager} based on the message type, and sends error
 * responses back to the client when an operation fails.
 *
 * @param connectionId - The sender's connection ID.
 * @param raw - The raw WebSocket message data to parse and route.
 */
const routeMessage = (connectionId: string, raw: unknown): void => {
  const result = parseMessage(raw);
  if (!result.ok) {
    sendError(connectionId, result.error);
    return;
  }

  const message = result.data;
  const type = message.type as string;
  const payload = (message.payload ?? {}) as Record<string, unknown>;
  logger.debug('Message received', { type, connectionId });

  try {
    switch (type) {
      case 'CREATE_ROOM': {
        const createResult = roomManager.createRoom(
          connectionId,
          (payload.hostName as string) ?? '',
          payload.questions,
          payload.quizId as string | undefined,
        );
        if (createResult.ok) {
          connections.send(connectionId, { type: 'ROOM_CREATED', payload: { roomCode: createResult.data } });
        } else {
          sendError(connectionId, createResult.error, 'CREATE_ROOM_FAILED');
        }
        break;
      }

      case 'JOIN_ROOM': {
        const joinResult = roomManager.joinRoom(
          connectionId,
          payload.roomCode as string,
          payload.nickname as string,
        );
        if (!joinResult.ok) {
          sendError(connectionId, joinResult.error, 'JOIN_ROOM_FAILED');
        }
        break;
      }

      case 'START_GAME': {
        const startResult = roomManager.startGame(connectionId);
        if (!startResult.ok) {
          sendError(connectionId, startResult.error, 'START_GAME_FAILED');
        }
        break;
      }

      case 'NEXT_QUESTION': {
        const nextResult = roomManager.nextQuestion(connectionId);
        if (!nextResult.ok) {
          sendError(connectionId, nextResult.error, 'NEXT_QUESTION_FAILED');
        }
        break;
      }

      case 'SUBMIT_ANSWER': {
        const answerResult = roomManager.submitAnswer(
          connectionId,
          payload.questionIndex as number,
          payload.answerIndex as 0 | 1 | 2 | 3,
        );
        if (!answerResult.ok) {
          sendError(connectionId, answerResult.error, 'SUBMIT_ANSWER_FAILED');
        }
        break;
      }

      case 'END_GAME': {
        const endResult = roomManager.forceEndGame(connectionId);
        if (!endResult.ok) {
          sendError(connectionId, endResult.error, 'END_GAME_FAILED');
        }
        break;
      }

      case 'RECONNECT': {
        const reconnectResult = roomManager.reconnect(
          connectionId,
          payload.roomCode as string,
          payload.playerId as string,
        );
        if (reconnectResult.ok) {
          connections.send(connectionId, { type: 'RECONNECTED', payload: reconnectResult.data });
        } else {
          sendError(connectionId, reconnectResult.error, 'RECONNECT_FAILED');
        }
        break;
      }

      default: {
        sendError(connectionId, 'Unknown message type', 'UNKNOWN_TYPE');
      }
    }
  } catch (error) {
    logger.error('Error handling message', { type, connectionId, error: String(error) });
    sendError(connectionId, 'Internal server error', 'INTERNAL_ERROR');
  }
};

const app = new Elysia()
  .use(cors({ origin: CLIENT_ORIGIN }))
  .use(quizRoutes)
  .use(sessionRoutes)
  .get('/health', () => ({ status: 'ok', timestamp: new Date().toISOString() }))
  /**
   * WebSocket endpoint for real-time game communication.
   * All game actions (create room, join, answer, etc.) flow through this single connection.
   */
  .ws('/ws', {
    /** Registers a new client connection in the {@link ConnectionRegistry}. */
    open(ws) {
      connections.register(ws.id, (data: string): void => { ws.send(data); });
      logger.info('Client connected', { id: ws.id });
    },
    /** Parses and routes incoming messages to the appropriate game action via {@link routeMessage}. */
    message(ws, raw) {
      routeMessage(ws.id, raw);
    },
    /** Handles client disconnection by notifying the room and cleaning up the connection. */
    close(ws) {
      roomManager.handleDisconnect(ws.id);
      connections.unregister(ws.id);
      logger.info('Client disconnected', { id: ws.id });
    },
  })
  .listen(PORT);

/** Graceful shutdown — clean up timers and active rooms. */
const shutdown = (): void => {
  logger.info('Shutting down...');
  roomManager.dispose();
  app.stop();
  process.exit(0);
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

logger.info(`Server running on port ${app.server?.port}`);
