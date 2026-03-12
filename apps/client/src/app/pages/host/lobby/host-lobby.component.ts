import { Component, inject } from '@angular/core';
import {
  BzmButtonComponent,
  BzmPageTitleComponent,
  BzmCardComponent,
  BzmRoomCodeComponent,
  BzmPlayerListComponent,
} from '@bazam/ui';
import { GameStateService } from '../../../services/game-state.service';
import { WebSocketService } from '../../../services/websocket.service';

@Component({
  selector: 'app-host-lobby',
  imports: [BzmButtonComponent, BzmPageTitleComponent, BzmCardComponent, BzmRoomCodeComponent, BzmPlayerListComponent],
  template: `
    <div class="lobby">
      <bzm-page-title size="lg">Wachtkamer</bzm-page-title>

      <bzm-card borderColor="var(--bzm-color-primary)">
        <p class="share-text">Deel deze code met je spelers:</p>
        <bzm-room-code [code]="gameState.roomCode() ?? '----'" />
      </bzm-card>

      <bzm-card>
        <div class="player-section">
          <bzm-page-title size="md" color="var(--bzm-color-answer-a)">Spelers ({{ gameState.players().length }})</bzm-page-title>
          <div aria-live="polite">
            <bzm-player-list [players]="gameState.players()" />
          </div>
        </div>
      </bzm-card>

      <bzm-button
        variant="primary"
        size="lg"
        [disabled]="gameState.players().length === 0"
        (click)="startGame()"
      >
        Start Quiz!
      </bzm-button>
    </div>
  `,
  styles: `
    .lobby {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 2rem;
      padding: 2rem;
      width: 100%;
      max-width: 600px;
    }

    .share-text {
      font-family: var(--bzm-font-family);
      font-weight: 600;
      color: var(--bzm-color-text-muted);
      margin: 0 0 1rem;
      text-align: center;
    }

    .player-section {
      text-align: center;
    }
  `,
})
/**
 * Host lobby (waiting room) displayed after a room has been created.
 *
 * Shows the shareable room code that players can use to join, a live
 * player list that updates as players connect, and a "Start Quiz" button
 * that is enabled once at least one player has joined.
 */
export class HostLobbyComponent {
  /** Injected game state for reading the room code and connected players. */
  readonly gameState = inject(GameStateService);

  private readonly wsService = inject(WebSocketService);

  /**
   * Sends a `START_GAME` message to the server, transitioning all
   * connected clients from the lobby into the countdown phase.
   */
  readonly startGame = (): void => {
    this.wsService.send({ type: 'START_GAME' });
  };
}
