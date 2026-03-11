import { Component, inject } from '@angular/core';
import {
  BzmPageTitleComponent,
  BzmWaitingStateComponent,
  BzmCardComponent,
  BzmPlayerListComponent,
} from '@bazam/ui';
import { GameStateService } from '../../../services/game-state.service';

@Component({
  selector: 'app-player-lobby',
  imports: [BzmPageTitleComponent, BzmWaitingStateComponent, BzmCardComponent, BzmPlayerListComponent],
  template: `
    <div class="player-lobby">
      <bzm-page-title size="lg">Hey {{ gameState.playerNickname() }}!</bzm-page-title>
      <bzm-waiting-state message="Wachten tot de host start..." />

      <bzm-card>
        <div class="player-section">
          <bzm-page-title size="md" color="var(--bzm-color-answer-a)">Spelers ({{ gameState.players().length }})</bzm-page-title>
          <bzm-player-list [players]="gameState.players()" />
        </div>
      </bzm-card>
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

    .player-section {
      text-align: center;
    }
  `,
})
/**
 * Player lobby (waiting room) displayed after successfully joining a game.
 *
 * Greets the player by nickname, shows a waiting indicator until the host
 * starts the quiz, and displays a live list of all connected players.
 * This is a read-only view -- the player cannot trigger any actions here.
 */
export class PlayerLobbyComponent {
  /** Injected game state for reading the player nickname and connected players. */
  readonly gameState = inject(GameStateService);
}
