import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import type { ClientMessage, ServerMessage } from '@bazam/shared-types';
import { GameStateService } from './game-state.service';

const MAX_CONNECTION_TIMEOUT_MS = 5000;

@Injectable({ providedIn: 'root' })
export class WebSocketService {
  private ws: WebSocket | null = null;
  private readonly gameState = inject(GameStateService);
  private readonly router = inject(Router);

  readonly connectionStatus = signal<'disconnected' | 'connecting' | 'connected'>('disconnected');

  /**
   * Opens a WebSocket connection and resolves when connected.
   * Rejects after timeout if the connection cannot be established.
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

  send(message: ClientMessage): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    }
  }

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
