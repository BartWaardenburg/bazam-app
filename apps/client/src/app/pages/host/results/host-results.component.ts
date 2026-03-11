import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import {
  BzmButtonComponent,
  BzmPageTitleComponent,
  BzmWinnerCardComponent,
  BzmLeaderboardComponent,
  BzmActionBarComponent,
} from '@bazam/ui';
import { GameStateService } from '../../../services/game-state.service';
import { WebSocketService } from '../../../services/websocket.service';

@Component({
  selector: 'app-host-results',
  imports: [BzmButtonComponent, BzmPageTitleComponent, BzmWinnerCardComponent, BzmLeaderboardComponent, BzmActionBarComponent],
  template: `
    <div class="results">
      <bzm-page-title size="lg" color="var(--bzm-color-accent)">Eindstand!</bzm-page-title>

      @if (gameState.sortedLeaderboard().length > 0) {
        <bzm-winner-card
          [name]="gameState.sortedLeaderboard()[0].nickname"
          [score]="gameState.sortedLeaderboard()[0].score"
        />
      }

      <bzm-leaderboard [entries]="gameState.sortedLeaderboard()" />

      <bzm-action-bar>
        <bzm-button variant="accent" size="lg" (click)="playAgain()">Opnieuw spelen</bzm-button>
        <bzm-button variant="secondary" size="lg" (click)="goHome()">Home</bzm-button>
      </bzm-action-bar>
    </div>
  `,
  styles: `
    .results {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 2rem;
      padding: 2rem 1rem;
      width: 100%;
      max-width: 500px;
    }
  `,
})
/**
 * Host results screen displayed after the final question has been answered.
 *
 * Highlights the winner with a dedicated card, shows the full final
 * leaderboard, and offers two actions:
 * - "Opnieuw spelen" -- resets state and navigates back to quiz creation.
 * - "Home" -- resets state and returns to the landing page.
 */
export class HostResultsComponent {
  /** Injected game state for reading the final leaderboard and standings. */
  readonly gameState = inject(GameStateService);

  private readonly wsService = inject(WebSocketService);
  private readonly router = inject(Router);

  /**
   * Tears down the current session and navigates to the quiz creation page
   * so the host can immediately start a new game.
   */
  playAgain(): void {
    this.wsService.disconnect();
    this.gameState.reset();
    void this.router.navigate(['/host/create']);
  }

  /**
   * Tears down the current session and navigates back to the landing page.
   */
  goHome(): void {
    this.wsService.disconnect();
    this.gameState.reset();
    void this.router.navigate(['/']);
  }
}
