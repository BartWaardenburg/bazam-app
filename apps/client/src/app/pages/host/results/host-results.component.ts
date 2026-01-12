import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { BzmButtonComponent, BzmLeaderboardItemComponent } from '@bazam/ui';
import { GameStateService } from '../../../services/game-state.service';
import { WebSocketService } from '../../../services/websocket.service';

@Component({
  selector: 'app-host-results',
  imports: [BzmLeaderboardItemComponent, BzmButtonComponent],
  template: `
    <div class="results">
      <header class="header animate-scale">
        <h2>Eindstand!</h2>
      </header>

      @if (gameState.sortedLeaderboard().length > 0) {
        <section class="winner-card card animate-in" style="animation-delay: 0.1s">
          <p class="winner-label">Winnaar</p>
          <p class="winner-name">{{ gameState.sortedLeaderboard()[0].nickname }}</p>
          <p class="winner-score">{{ gameState.sortedLeaderboard()[0].score }} punten</p>
        </section>
      }

      <section class="leaderboard animate-in" style="animation-delay: 0.2s" aria-label="Ranglijst">
        <h3>Ranglijst</h3>
        <div class="ranking-list" role="list">
          @for (entry of gameState.sortedLeaderboard(); track entry.id; let i = $index) {
            <bzm-leaderboard-item
              role="listitem"
              style="animation: slideInLeft 0.4s var(--timing-playful) both"
              [style.animation-delay]="(i * 0.06) + 's'"
              [rank]="entry.rank"
              [nickname]="entry.nickname"
              [streak]="entry.streak"
              [points]="entry.score"
            />
          }
        </div>
      </section>

      <nav class="actions animate-in" style="animation-delay: 0.3s">
        <bzm-button variant="accent" size="lg" (click)="playAgain()">Opnieuw spelen</bzm-button>
        <bzm-button variant="secondary" size="lg" (click)="goHome()">Home</bzm-button>
      </nav>
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

    .header {
      text-align: center;

      & h2 {
        color: var(--color-accent);
        text-shadow: 3px 3px 0 #000;
      }
    }

    .winner-card {
      text-align: center;
      width: 100%;
      border-color: var(--color-accent);
    }

    .winner-label {
      font-size: 0.85rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: var(--color-text-muted);
    }

    .winner-name {
      font-family: var(--font-heading);
      font-size: clamp(2.5rem, 10vw, 4rem);
      color: var(--color-primary);
      text-shadow: 3px 3px 0 #000;
      line-height: 1.1;
      letter-spacing: 0.04em;
    }

    .winner-score {
      font-size: 1.1rem;
      font-weight: 700;
      color: var(--color-accent);
      margin-top: 0.25rem;
    }

    .leaderboard {
      width: 100%;

      & h3 {
        text-align: center;
        color: var(--color-cyan);
        text-shadow: 2px 2px 0 #000;
        margin-bottom: 1rem;
      }
    }

    .ranking-list {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .actions {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
      justify-content: center;
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
