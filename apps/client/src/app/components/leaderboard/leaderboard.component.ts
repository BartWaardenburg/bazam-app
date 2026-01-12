import { Component, computed, input } from '@angular/core';
import { BzmAvatarComponent, BzmLeaderboardItemComponent } from '@bazam/ui';
import type { LeaderboardEntry } from '@bazam/shared-types';

const MEDAL_LABELS = ['1ST', '2ND', '3RD'] as const;

@Component({
  selector: 'app-leaderboard',
  imports: [BzmAvatarComponent, BzmLeaderboardItemComponent],
  template: `
    <div class="leaderboard">
      @if (showPodium()) {
        <div class="podium">
          @for (entry of topThree(); track entry.id; let i = $index) {
            <div class="podium-spot" [class]="'place-' + (i + 1)" [style.animation-delay]="(i * 0.2) + 's'">
              <div class="podium-medal">{{ medalLabel(i) }}</div>
              <bzm-avatar [nickname]="entry.nickname" size="xl" [rankBadge]="i + 1" />
              <span class="podium-name">{{ entry.nickname }}</span>
              <span class="podium-score">{{ entry.score }} pts</span>
            </div>
          }
        </div>
      }

      <div class="ranking-list" role="list" aria-label="Ranglijst">
        @for (entry of entries(); track entry.id; let i = $index) {
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
    </div>
  `,
  styles: `
    .leaderboard {
      width: 100%;
      max-width: 500px;
    }

    .podium {
      display: flex;
      justify-content: center;
      align-items: flex-end;
      gap: 0.75rem;
      margin-bottom: 2rem;
      min-height: 200px;
    }

    .podium-spot {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.4rem;
      animation: fadeInUp 0.5s var(--timing-bounce) both;
      background: var(--color-surface);
      padding: 1.25rem 1rem;
      border-radius: 2px;
      border: 4px solid var(--color-border);
      border-width: 3px 4px 5px 3px;
      box-shadow: var(--shadow-hard-lg);
      filter: url(#sketchy);
    }

    .place-1 {
      order: 2;
      transform: scale(1.1);
      border-color: var(--color-accent);
      box-shadow: var(--shadow-hard-lg);
    }
    .place-2 { order: 1; }
    .place-3 { order: 3; }

    .podium-medal {
      font-size: 2.2rem;
      filter: drop-shadow(2px 2px 0 #000);
    }

    .podium-name {
      font-weight: 700;
      font-size: 0.95rem;
    }

    .podium-score {
      font-family: var(--font-heading);
      font-size: 1.2rem;
      color: var(--color-accent);
      text-shadow: 1px 1px 0 #000;
      letter-spacing: 0.04em;
    }

    .ranking-list {
      display: flex;
      flex-direction: column;
      gap: 0.6rem;
    }
  `,
})
export class LeaderboardComponent {
  readonly entries = input.required<LeaderboardEntry[]>();
  readonly showPodium = input<boolean>(false);
  readonly topThree = computed(() => this.entries().slice(0, 3));

  medalLabel(index: number): string {
    return MEDAL_LABELS[index] ?? '';
  }
}
