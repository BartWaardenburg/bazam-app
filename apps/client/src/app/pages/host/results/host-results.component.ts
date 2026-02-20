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
export class HostResultsComponent {
  readonly gameState = inject(GameStateService);
  private readonly wsService = inject(WebSocketService);
  private readonly router = inject(Router);

  playAgain(): void {
    this.wsService.disconnect();
    this.gameState.reset();
    void this.router.navigate(['/host/create']);
  }

  goHome(): void {
    this.wsService.disconnect();
    this.gameState.reset();
    void this.router.navigate(['/']);
  }
}
