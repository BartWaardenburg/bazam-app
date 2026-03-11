import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import type { ClientMessage, ServerMessage } from '@bazam/shared-types';
import { GameStateService } from './game-state.service';

/** Maximum time in milliseconds to wait for a WebSocket connection before rejecting. */
const MAX_CONNECTION_TIMEOUT_MS = 5000;

/**
 * Manages the WebSocket connection to the Bazam game server.
 *
 * Responsibilities:
 * - Establishes and tears down the WebSocket connection.
 * - Sends typed {@link ClientMessage} payloads to the server.
 * - Deserializes incoming {@link ServerMessage} payloads and routes them
 *   to the appropriate {@link GameStateService} signal updates and
 *   Angular Router navigations.
 *
 * The service exposes a reactive {@link connectionStatus} signal so that
 * UI components can reflect connection state (e.g. disabling buttons
 * while connecting).
 *
 * @example
 * ```ts
 * const ws = inject(WebSocketService);
 * await ws.connect();
 * ws.send({ type: 'CREATE_ROOM', payload: { hostName: 'Host', questions } });
 * ```
 */
@Injectable({ providedIn: 'root' })
export class WebSocketService {
  /** Active WebSocket instance, or `null` when disconnected. */
  private ws: WebSocket | null = null;
  private readonly gameState = inject(GameStateService);
  private readonly router = inject(Router);

  /**
   * Reactive connection status exposed for UI binding.
   *
   * - `'disconnected'` -- no active connection.
   * - `'connecting'` -- handshake in progress.
   * - `'connected'` -- ready to send and receive messages.
   */
  readonly connectionStatus = signal<'disconnected' | 'connecting' | 'connected'>('disconnected');

  /**
   * Opens a WebSocket connection to the game server.
   *
   * Resolves immediately if a connection is already open.
   * Automatically determines the correct protocol (`ws:` / `wss:`) and port
   * based on the current page location. Rejects with an error if the
   * connection cannot be established within {@link MAX_CONNECTION_TIMEOUT_MS}.
   *
   * @returns A promise that resolves when the connection is open.
   * @throws {Error} If the connection times out, fails, or is closed before opening.
   */
  connect(): Promise<void> {
    if (this.ws?.readyState === WebSocket.OPEN) {
      return Promise.resolve();
    }

    this.connectionStatus.set('connecting');
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = window.location.hostname;
    const port = window.location.port === '4200' ? '3001' : window.location.port;
    const ws = new WebSocket(`${protocol}//${host}:${port}/ws`);
    this.ws = ws;

    return new Promise<void>((resolve, reject) => {
      let settled = false;

      const timeout = setTimeout(() => {
        if (settled) return;
        settled = true;
        this.disconnect();
        reject(new Error('WebSocket connection timed out'));
      }, MAX_CONNECTION_TIMEOUT_MS);

      ws.onopen = () => {
        if (settled) return;
        settled = true;
        clearTimeout(timeout);
        this.connectionStatus.set('connected');
        resolve();
      };

      ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data as string) as ServerMessage;
          this.handleMessage(message);
        } catch {
          this.gameState.errorMessage.set('Ongeldig bericht ontvangen van de server');
        }
      };

      ws.onclose = () => {
        clearTimeout(timeout);
        if (this.ws === ws) {
          this.ws = null;
          this.connectionStatus.set('disconnected');
        }
        if (!settled) {
          settled = true;
          reject(new Error('WebSocket connection closed'));
        }
      };

      ws.onerror = () => {
        clearTimeout(timeout);
        if (!settled) {
          settled = true;
          this.connectionStatus.set('disconnected');
          reject(new Error('WebSocket connection failed'));
        }
      };
    });
  }

  /**
   * Sends a typed client message to the server as JSON.
   * Silently no-ops if the connection is not open.
   *
   * @param message - The client message to serialize and send.
   */
  send(message: ClientMessage): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    }
  }

  /**
   * Closes the WebSocket connection and removes all event handlers.
   * Safe to call multiple times -- subsequent calls are no-ops.
   * Sets {@link connectionStatus} to `'disconnected'`.
   */
  disconnect(): void {
    const ws = this.ws;
    if (ws) {
      ws.onopen = null;
      ws.onmessage = null;
      ws.onclose = null;
      ws.onerror = null;
      ws.close();
    }
    this.ws = null;
    this.connectionStatus.set('disconnected');
  }

  /**
   * Routes an incoming server message to the appropriate game state updates
   * and Angular Router navigations.
   *
   * Each message type maps to one or more {@link GameStateService} signal
   * writes and, where applicable, a route change to transition the UI
   * between game phases.
   *
   * @param message - The deserialized server message to handle.
   */
  private handleMessage(message: ServerMessage): void {
    switch (message.type) {
      case 'ROOM_CREATED':
        this.gameState.roomCode.set(message.payload.roomCode);
        this.gameState.gamePhase.set('lobby');
        void this.router.navigate(['/host/lobby']);
        break;

      case 'PLAYER_JOINED':
        this.gameState.players.set(message.payload.players);
        if (this.gameState.role() === 'player' && this.gameState.gamePhase() === 'idle') {
          this.gameState.gamePhase.set('lobby');
          void this.router.navigate(['/play/lobby']);
        }
        break;

      case 'PLAYERS_UPDATED':
        this.gameState.players.set(message.payload.players);
        break;

      case 'PLAYER_LEFT':
        this.gameState.players.set(message.payload.players);
        break;

      case 'GAME_STARTING':
        this.gameState.totalQuestions.set(message.payload.totalQuestions);
        this.gameState.gamePhase.set('countdown');
        if (this.gameState.role() === 'host') {
          void this.router.navigate(['/host/game']);
        } else {
          void this.router.navigate(['/play/game']);
        }
        break;

      case 'QUESTION':
        this.gameState.currentQuestion.set(message.payload.question);
        this.gameState.questionIndex.set(message.payload.index);
        this.gameState.timeLimit.set(message.payload.timeLimit);
        this.gameState.lastAnswerResult.set(null);
        this.gameState.gamePhase.set('question');
        break;

      case 'ANSWER_RESULT':
        this.gameState.lastAnswerResult.set(message.payload);
        this.gameState.playerScore.set(message.payload.totalScore);
        break;

      case 'QUESTION_CLOSED':
        this.gameState.leaderboard.set(message.payload.leaderboard);
        this.gameState.gamePhase.set('leaderboard');
        break;

      case 'GAME_OVER':
        this.gameState.leaderboard.set(message.payload.leaderboard);
        this.gameState.gamePhase.set('finished');
        if (this.gameState.role() === 'host') {
          void this.router.navigate(['/host/results']);
        } else {
          void this.router.navigate(['/play/results']);
        }
        break;

      case 'PHASE_CHANGE':
        this.gameState.gamePhase.set(message.payload.phase);
        break;

      case 'ERROR':
        this.gameState.errorMessage.set(message.payload.message);
        break;
    }
  }
}
