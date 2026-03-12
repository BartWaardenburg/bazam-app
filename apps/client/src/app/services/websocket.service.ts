import { computed, inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import type { ClientMessage, GamePhase, ServerMessage } from '@bazam/shared-types';
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

  /** Derived signal: `true` while the WebSocket handshake is in progress. */
  readonly isConnecting = computed(() => this.connectionStatus() === 'connecting');

  /**
   * Opens a WebSocket connection to the game server.
   *
   * Resolves immediately if a connection is already open.
   * Cancels any in-flight connection attempt before starting a new one.
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

    if (this.ws?.readyState === WebSocket.CONNECTING) {
      this.disconnect();
    }

    this.connectionStatus.set('connecting');
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = window.location.hostname;
    const portPart = window.location.port === '4200'
      ? ':3001'
      : window.location.port
        ? `:${window.location.port}`
        : '';
    const ws = new WebSocket(`${protocol}//${host}${portPart}/ws`);
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
        if (this.ws === ws) {
          this.ws = null;
        }
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
   * Returns `false` if the connection is not open (message was not sent).
   *
   * @param message - The client message to serialize and send.
   * @returns `true` if the message was sent, `false` otherwise.
   */
  send(message: ClientMessage): boolean {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
      return true;
    }
    this.gameState.errorMessage.set('Geen verbinding met de server.');
    return false;
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
   * Tears down the current session: disconnects the WebSocket,
   * resets all game state, and navigates to the given route.
   *
   * @param redirectTo - The route path to navigate to after cleanup.
   */
  endSession(redirectTo: string): void {
    this.disconnect();
    this.gameState.reset();
    void this.router.navigate([redirectTo]);
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
          const nickname = this.gameState.playerNickname();
          const player = message.payload.players.find((p) => p.nickname === nickname);
          if (player) {
            this.gameState.playerId.set(player.id);
          }
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
        this.gameState.totalQuestions.set(message.payload.total);
        this.gameState.timeLimit.set(message.payload.timeLimit);
        this.gameState.lastAnswerResult.set(null);
        this.gameState.correctAnswerIndex.set(null);
        this.gameState.gamePhase.set('question');
        break;

      case 'ANSWER_RESULT':
        this.gameState.lastAnswerResult.set(message.payload);
        this.gameState.playerScore.set(message.payload.totalScore);
        break;

      case 'QUESTION_CLOSED':
        this.gameState.correctAnswerIndex.set(message.payload.correctIndex);
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

      case 'RECONNECTED': {
        const s = message.payload;
        this.gameState.roomCode.set(s.roomCode);
        this.gameState.gamePhase.set(s.phase);
        this.gameState.players.set(s.players);
        this.gameState.currentQuestion.set(s.question);
        this.gameState.questionIndex.set(s.questionIndex);
        this.gameState.totalQuestions.set(s.totalQuestions);
        this.gameState.timeLimit.set(s.timeLimit);
        this.gameState.elapsedMs.set(s.elapsedMs);
        this.gameState.playerScore.set(s.score);
        this.gameState.leaderboard.set(s.leaderboard);
        // TODO: extend ReconnectState to include the actual AnswerResult from the server.
        // This fabricated result prevents the answer grid from reappearing on reconnect,
        // but correctIndex/correct/score values are placeholders (server doesn't send them yet).
        if (s.hasAnswered && !this.gameState.lastAnswerResult()) {
          this.gameState.lastAnswerResult.set({ correct: false, score: 0, totalScore: s.score, correctIndex: 0 });
        }
        this.navigateToPhase(s.phase);
        break;
      }

      case 'ERROR':
        this.gameState.errorMessage.set(message.payload.message);
        break;

      default: {
        const _exhaustive: never = message;
        void _exhaustive;
        break;
      }
    }
  }

  /**
   * Navigates to the correct route based on the current game phase and role.
   */
  private navigateToPhase(phase: GamePhase): void {
    const isHost = this.gameState.role() === 'host';
    const prefix = isHost ? '/host' : '/play';

    switch (phase) {
      case 'lobby':
        void this.router.navigate([`${prefix}/lobby`]);
        break;
      case 'countdown':
      case 'question':
      case 'leaderboard':
        void this.router.navigate([`${prefix}/game`]);
        break;
      case 'finished':
        void this.router.navigate([`${prefix}/results`]);
        break;
      case 'idle':
        // No active session — nothing to navigate to
        break;
    }
  }
}
