import { Component, inject } from '@angular/core';
import { BzmButtonComponent } from '@bazam/ui';
import { GameStateService } from '../../../services/game-state.service';
import { WebSocketService } from '../../../services/websocket.service';
import { RoomCodeComponent } from '../../../components/room-code/room-code.component';
import { PlayerListComponent } from '../../../components/player-list/player-list.component';

@Component({
  selector: 'app-host-lobby',
  imports: [RoomCodeComponent, PlayerListComponent, BzmButtonComponent],
  template: `
    <div class="lobby">
      <h2 class="animate-in">Wachtkamer</h2>

      <div class="code-section card animate-in" style="animation-delay: 0.05s">
        <p class="share-text">Deel deze code met je spelers:</p>
        <app-room-code [code]="gameState.roomCode() ?? '----'" />
      </div>

      <div class="player-section card animate-in" style="animation-delay: 0.1s" aria-live="polite">
        <h3>Spelers ({{ gameState.players().length }})</h3>
        <app-player-list [players]="gameState.players()" />
      </div>

      <div class="animate-in" style="animation-delay: 0.15s">
        <bzm-button
          variant="primary"
          size="lg"
          [disabled]="gameState.players().length === 0"
          (click)="startGame()"
        >
          Start Quiz!
        </bzm-button>
      </div>
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

      & h2 {
        color: var(--color-primary);
        text-shadow: 2px 2px 0 #000;
      }
    }

    .code-section {
      width: 100%;
      text-align: center;
      border-color: var(--color-primary);
      background: var(--color-surface);
    }

    .share-text {
      font-weight: 600;
      color: var(--color-text-muted);
      margin-bottom: 1rem;
    }

    .player-section {
      width: 100%;
      text-align: center;

      & h3 {
        margin-bottom: 1rem;
        color: var(--color-cyan);
        text-shadow: 2px 2px 0 #000;
      }
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
