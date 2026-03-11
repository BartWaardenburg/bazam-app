import { Component, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import {
  BzmButtonComponent,
  BzmCardComponent,
  BzmScoreDisplayComponent,
  BzmLeaderboardComponent,
  BzmPageTitleComponent,
} from '@bazam/ui';
import { GameStateService } from '../../../services/game-state.service';
import { WebSocketService } from '../../../services/websocket.service';

@Component({
  selector: 'app-player-results',
  imports: [
    BzmButtonComponent,
    BzmCardComponent,
    BzmScoreDisplayComponent,
    BzmLeaderboardComponent,
    BzmPageTitleComponent,
  ],
  template: `
    <div class="player-results">
      <bzm-card>
        <div class="result-header">
          <bzm-page-title size="lg" color="var(--bzm-color-primary)">Einde!</bzm-page-title>
          <bzm-score-display
            [value]="'#' + playerRank()"
            label="Jouw plek"
            size="lg"
          />
          <p class="score-summary">{{ gameState.playerScore() }} punten</p>
        </div>
      </bzm-card>

      <bzm-leaderboard
        [entries]="gameState.sortedLeaderboard()"
        [highlightNickname]="gameState.playerNickname()"
      />

      <bzm-button variant="secondary" size="lg" (click)="goHome()">
        Terug naar home
      </bzm-button>
    </div>
  `,
  styles: `
    .player-results {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 2rem;
      padding: 2rem 1rem;
      width: 100%;
      max-width: 500px;
    }

    .result-header {
      text-align: center;
    }

    .score-summary {
      margin: 0;
      font-family: var(--bzm-font-family);
      font-size: var(--bzm-font-size-base);
      font-weight: var(--bzm-font-weight-bold);
      color: var(--bzm-color-text-muted);
    }
  `,
})
/**
 * Player results screen displayed after the quiz has ended.
 *
 * Shows the player's final rank and score in a highlight card, the
 * complete leaderboard with the player's row visually highlighted,
 * and a button to return to the home page.
 */
export class PlayerResultsComponent {
  /** Injected game state for reading scores, nicknames, and leaderboard data. */
  readonly gameState = inject(GameStateService);

  private readonly wsService = inject(WebSocketService);
  private readonly router = inject(Router);

  /**
   * Computed rank of the current player within the final leaderboard.
   * Looks up the player by nickname and returns their rank, or `'-'`
   * if the player is not found in the leaderboard entries.
   */
  readonly playerRank = computed(() => {
    const nickname = this.gameState.playerNickname();
    const entry = this.gameState.sortedLeaderboard().find((e) => e.nickname === nickname);
    return entry?.rank ?? '-';
  });

  /**
   * Tears down the current session and navigates back to the landing page.
   * Disconnects the WebSocket and resets all game state signals.
   */
  goHome(): void {
    this.wsService.disconnect();
    this.gameState.reset();
    void this.router.navigate(['/']);
  }
}
