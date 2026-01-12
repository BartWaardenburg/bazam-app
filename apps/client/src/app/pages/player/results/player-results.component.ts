import { Component, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { BzmButtonComponent, BzmLeaderboardItemComponent } from '@bazam/ui';
import { GameStateService } from '../../../services/game-state.service';
import { WebSocketService } from '../../../services/websocket.service';

@Component({
  selector: 'app-player-results',
  imports: [BzmLeaderboardItemComponent, BzmButtonComponent],
  template: `
    <div class="player-results">
      <header class="header animate-scale">
        <h2>Einde!</h2>
        <p class="rank-label">Jouw plek</p>
        <p class="rank">#{{ playerRank() }}</p>
        <p class="score">{{ gameState.playerScore() }} punten</p>
      </header>

      <section class="leaderboard animate-in" style="animation-delay: 0.15s" aria-label="Ranglijst">
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
              [isCurrentUser]="entry.nickname === gameState.playerNickname()"
            />
          }
        </div>
      </section>

      <div class="animate-in" style="animation-delay: 0.3s">
        <bzm-button variant="secondary" size="lg" (click)="goHome()">
          Terug naar home
        </bzm-button>
      </div>
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

    .header {
      text-align: center;
      width: 100%;
      padding: 2rem;
      background: var(--color-surface);
      border: 4px solid var(--color-border);
      border-width: 3px 4px 5px 3px;
      border-radius: 2px;
      box-shadow: var(--shadow-hard-lg);

      & h2 {
        color: var(--color-primary);
        text-shadow: 3px 3px 0 #000;
      }
    }

    .rank-label {
      font-size: 0.85rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: var(--color-text-muted);
      margin-top: 0.5rem;
    }

    .rank {
      font-family: var(--font-heading);
      font-size: clamp(4rem, 15vw, 6rem);
      color: var(--color-accent);
      line-height: 1;
      text-shadow: 4px 4px 0 #000;
      letter-spacing: 0.05em;
    }

    .score {
      font-size: 1.1rem;
      font-weight: 700;
      color: var(--color-text-muted);
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
  `,
})
export class PlayerResultsComponent {
  readonly gameState = inject(GameStateService);
  private readonly wsService = inject(WebSocketService);
  private readonly router = inject(Router);

  readonly playerRank = computed(() => {
    const nickname = this.gameState.playerNickname();
    const entry = this.gameState.sortedLeaderboard().find((e) => e.nickname === nickname);
    return entry?.rank ?? '-';
  });

  goHome(): void {
    this.wsService.disconnect();
    this.gameState.reset();
    void this.router.navigate(['/']);
  }
}
