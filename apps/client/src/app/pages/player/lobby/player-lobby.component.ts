import { Component, inject } from '@angular/core';
import { GameStateService } from '../../../services/game-state.service';
import { PlayerListComponent } from '../../../components/player-list/player-list.component';

@Component({
  selector: 'app-player-lobby',
  imports: [PlayerListComponent],
  template: `
    <div class="player-lobby">
      <div class="waiting animate-scale">
        <h2>Hey {{ gameState.playerNickname() }}!</h2>
        <p>Wachten tot de host start...</p>
        <div class="spinner"></div>
      </div>

      <div class="card animate-in" style="animation-delay: 0.1s">
        <h3>Spelers ({{ gameState.players().length }})</h3>
        <app-player-list [players]="gameState.players()" />
      </div>
    </div>
  `,
  styles: `
    .player-lobby {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 2rem;
      padding: 2rem;
      width: 100%;
      max-width: 500px;
    }

    .waiting {
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.75rem;

      & h2 {
        color: var(--color-primary);
        text-shadow: 2px 2px 0 #000;
      }

      & p {
        color: var(--color-text-muted);
        font-weight: 600;
      }
    }

    .waiting-icon {
      font-size: 3.5rem;
      filter: drop-shadow(2px 2px 0 #000);
    }

    .spinner {
      width: 40px;
      height: 40px;
      border: 4px solid var(--color-border);
      border-top-color: var(--color-primary);
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
      margin-top: 0.5rem;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .card {
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
export class PlayerLobbyComponent {
  readonly gameState = inject(GameStateService);
}
