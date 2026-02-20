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
        <div class="player-section" aria-live="polite">
          <bzm-page-title size="md" color="var(--bzm-color-answer-a)">Spelers ({{ gameState.players().length }})</bzm-page-title>
          <bzm-player-list [players]="gameState.players()" />
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
export class HostLobbyComponent {
  readonly gameState = inject(GameStateService);
  private readonly wsService = inject(WebSocketService);

  startGame(): void {
    this.wsService.send({ type: 'START_GAME' });
  }
}
