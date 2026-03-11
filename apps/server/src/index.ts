import { Elysia } from 'elysia';
import { cors } from '@elysiajs/cors';
import type { ClientMessage } from '@bazam/shared-types';
import { ConnectionRegistry } from './game/connection-registry';
import { RoomManager } from './game/room-manager';
import { quizRoutes } from './routes/quiz';
import { sessionRoutes } from './routes/sessions';
import { logger } from './utils/logger';

const PORT = Number(process.env['PORT'] ?? 3001);

const connections = new ConnectionRegistry();
const roomManager = new RoomManager(connections);

/**
 * Sends a JSON error message to a single client connection.
 * Silently swallows send failures (e.g., if the connection is already closed).
 *
 * @param sendFn - The raw send function bound to the target WebSocket.
 * @param message - Human-readable error description.
 * @param code - Machine-readable error code for client-side handling.
 */
const sendError = (sendFn: (data: string) => void, message: string, code = 'INVALID_MESSAGE'): void => {
  try {
    sendFn(JSON.stringify({ type: 'ERROR', payload: { message, code } }));
  } catch { /* connection closed */ }
};

/**
 * Attempts to parse a raw WebSocket payload into a typed {@link ClientMessage}.
 * Accepts both string and pre-parsed object payloads.
 *
 * @param raw - The raw WebSocket message data (string or object).
 * @returns A Result containing the parsed ClientMessage on success, or an error string on failure.
 */
const parseMessage = (raw: unknown): { ok: true; data: ClientMessage } | { ok: false; error: string } => {
  try {
    const str = typeof raw === 'string' ? raw : JSON.stringify(raw);
    const parsed = JSON.parse(str) as ClientMessage;
    if (!parsed.type) return { ok: false, error: 'Missing message type' };
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
 * @param sendFn - The raw send function bound to the sender's WebSocket.
 * @param raw - The raw WebSocket message data to parse and route.
 */
const routeMessage = (connectionId: string, sendFn: (data: string) => void, raw: unknown): void => {
  const result = parseMessage(raw);
  if (!result.ok) {
    sendError(sendFn, result.error);
    return;
  }

  const message = result.data;
  logger.debug('Message received', { type: message.type, connectionId });

  switch (message.type) {
    case 'CREATE_ROOM': {
      const createResult = roomManager.createRoom(connectionId, message.payload.hostName, message.payload.questions);
      if (createResult.ok) {
        sendFn(JSON.stringify({ type: 'ROOM_CREATED', payload: { roomCode: createResult.data } }));
      } else {
        sendError(sendFn, createResult.error, 'CREATE_ROOM_FAILED');
      }
      break;
    }

    case 'JOIN_ROOM': {
      const joinResult = roomManager.joinRoom(connectionId, message.payload.roomCode, message.payload.nickname);
      if (!joinResult.ok) {
        sendError(sendFn, joinResult.error, 'JOIN_ROOM_FAILED');
      }
      break;
    }

    case 'START_GAME': {
      const startResult = roomManager.startGame(connectionId);
      if (!startResult.ok) {
        sendError(sendFn, startResult.error, 'START_GAME_FAILED');
      }
      break;
    }

    case 'NEXT_QUESTION': {
      const nextResult = roomManager.nextQuestion(connectionId);
      if (!nextResult.ok) {
        sendError(sendFn, nextResult.error, 'NEXT_QUESTION_FAILED');
      }
      break;
    }

    case 'SUBMIT_ANSWER': {
      const answerResult = roomManager.submitAnswer(
        connectionId,
        message.payload.questionIndex,
        message.payload.answerIndex,
      );
      if (!answerResult.ok) {
        sendError(sendFn, answerResult.error, 'SUBMIT_ANSWER_FAILED');
      }
      break;
    }

    case 'END_GAME': {
      const endResult = roomManager.forceEndGame(connectionId);
      if (!endResult.ok) {
        sendError(sendFn, endResult.error, 'END_GAME_FAILED');
      }
      break;
    }

    case 'RECONNECT': {
      const reconnectResult = roomManager.reconnect(
        connectionId,
        message.payload.roomCode,
        message.payload.playerId,
      );
      if (reconnectResult.ok) {
        sendFn(JSON.stringify({ type: 'RECONNECTED', payload: reconnectResult.data }));
      } else {
        sendError(sendFn, reconnectResult.error, 'RECONNECT_FAILED');
      }
      break;
    }

    default: {
      sendError(sendFn, 'Unknown message type', 'UNKNOWN_TYPE');
    }
  }
};

const app = new Elysia()
  .use(cors())
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
      const sendFn = (data: string): void => { ws.send(data); };
      connections.register(ws.id, sendFn);
      logger.info('Client connected', { id: ws.id });
    },
    /** Parses and routes incoming messages to the appropriate game action via {@link routeMessage}. */
    message(ws, raw) {
      const sendFn = (data: string): void => { ws.send(data); };
      routeMessage(ws.id, sendFn, raw);
    },
    /** Handles client disconnection by notifying the room and cleaning up the connection. */
    close(ws) {
      roomManager.handleDisconnect(ws.id);
      connections.unregister(ws.id);
      logger.info('Client disconnected', { id: ws.id });
    },
  })
  .listen(PORT);

logger.info(`Server running on port ${app.server?.port}`);
