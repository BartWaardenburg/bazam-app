import { Component, ChangeDetectionStrategy, input, computed } from '@angular/core';
import { BzmAvatarComponent } from '../../atoms/avatar/avatar.component';
import { BzmLeaderboardItemComponent } from '../../molecules/leaderboard-item/leaderboard-item.component';

/** Presentation-layer subset of `LeaderboardEntry` from `@bazam/shared-types`. */
export interface LeaderboardPlayer {
  readonly id: string;
  readonly nickname: string;
  readonly score: number;
  readonly rank: number;
  readonly streak?: number;
}

const MEDAL_LABELS = ['1ST', '2ND', '3RD'] as const;

@Component({
  selector: 'bzm-leaderboard',
  standalone: true,
  imports: [BzmAvatarComponent, BzmLeaderboardItemComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="bzm-leaderboard" aria-label="Ranglijst">
      @if (showPodium() && topThree().length > 0) {
        <div class="bzm-leaderboard__podium">
          @for (entry of topThree(); track entry.id; let i = $index) {
            <div
              class="bzm-leaderboard__podium-spot"
              [class]="'place-' + (i + 1)"
              [style.animation-delay]="(i * 0.2) + 's'"
            >
              <div class="bzm-leaderboard__medal">{{ medalLabel(i) }}</div>
              <bzm-avatar [nickname]="entry.nickname" size="xl" [rankBadge]="i + 1" />
              <span class="bzm-leaderboard__name">{{ entry.nickname }}</span>
              <span class="bzm-leaderboard__score">{{ entry.score }} pts</span>
            </div>
          }
        </div>
      }

      <div class="bzm-leaderboard__list" role="list" aria-label="Volledige ranglijst">
        @for (entry of remainingEntries(); track entry.id; let i = $index) {
          <bzm-leaderboard-item
            role="listitem"
            [style.animation-delay]="(i * 0.06) + 's'"
            [rank]="entry.rank"
            [nickname]="entry.nickname"
            [streak]="entry.streak ?? 0"
            [points]="entry.score"
            [isCurrentUser]="entry.nickname === highlightNickname()"
          />
        }
      </div>
    </div>
  `,
  styles: `
    :host {
      display: block;
      font-family: var(--bzm-font-family);
    }

    .bzm-leaderboard {
      width: 100%;
      max-width: 500px;
    }

    .bzm-leaderboard__podium {
      display: flex;
      justify-content: center;
      align-items: flex-end;
      gap: var(--bzm-space-3);
      margin-bottom: var(--bzm-space-8);
      min-height: 200px;
    }

    .bzm-leaderboard__podium-spot {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--bzm-space-1);
      background: var(--bzm-color-surface);
      padding: var(--bzm-space-5) var(--bzm-space-4);
      border-radius: var(--bzm-radius-md);
      border: 4px solid var(--bzm-color-border);
      border-width: var(--bzm-border-width-comic);
      box-shadow: var(--bzm-shadow-card);
      animation: bzm-podium-pop 0.5s var(--bzm-transition-playful) backwards;
    }

    .place-1 {
      order: 2;
      transform: scale(1.1);
      border-color: var(--bzm-color-accent);
      animation-name: bzm-podium-pop-first;
    }

    .place-2 { order: 1; }
    .place-3 { order: 3; }

    .bzm-leaderboard__medal {
      font-family: var(--bzm-font-heading);
      font-size: var(--bzm-font-size-4xl);
      filter: drop-shadow(2px 2px 0 var(--bzm-black));
    }

    .place-1 .bzm-leaderboard__medal { color: var(--bzm-color-gold); }
    .place-2 .bzm-leaderboard__medal { color: var(--bzm-color-silver); }
    .place-3 .bzm-leaderboard__medal { color: var(--bzm-color-bronze); }

    .bzm-leaderboard__name {
      font-weight: var(--bzm-font-weight-bold);
      font-size: var(--bzm-font-size-sm);
      color: var(--bzm-color-text);
    }

    .bzm-leaderboard__score {
      font-family: var(--bzm-font-family);
      font-size: var(--bzm-font-size-lg);
      font-weight: var(--bzm-font-weight-extrabold);
      color: var(--bzm-color-accent-dark);
      text-shadow: 1px 1px 0 var(--bzm-black);
      letter-spacing: 0.04em;
    }

    .bzm-leaderboard__list {
      display: flex;
      flex-direction: column;
      gap: var(--bzm-space-2);
    }

    @keyframes bzm-podium-pop {
      from {
        transform: scale(0) translateY(20px);
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }

    @keyframes bzm-podium-pop-first {
      from {
        transform: scale(0) translateY(20px);
        opacity: 0;
      }
      to {
        transform: scale(1.1);
        opacity: 1;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .bzm-leaderboard__podium-spot {
        animation: none;
      }
    }
  `,
})
/**
 * Displays a full leaderboard with an optional animated podium for the top 3
 * players and a scrollable ranked list for the remaining entries.
 *
 * When `showPodium` is enabled, the first three entries are rendered as podium
 * spots with medal labels (1ST, 2ND, 3RD) and pop-in animations. The rest
 * appear as `BzmLeaderboardItem` rows. A player can be visually highlighted
 * by matching their nickname via `highlightNickname`.
 *
 * @selector bzm-leaderboard
 *
 * @example
 * ```html
 * <bzm-leaderboard
 *   [entries]="players"
 *   [showPodium]="true"
 *   [highlightNickname]="currentPlayer"
 * />
 * ```
 */
export class BzmLeaderboardComponent {
  /** Sorted array of player entries to display in the leaderboard. */
  readonly entries = input.required<LeaderboardPlayer[]>();

  /**
   * Whether to render the top 3 players in an animated podium layout.
   * @default false
   */
  readonly showPodium = input<boolean>(false);

  /**
   * Nickname of the player to visually highlight in the list.
   * @default undefined
   */
  readonly highlightNickname = input<string | undefined>(undefined);

  protected readonly topThree = computed(() => this.entries().slice(0, 3));
  protected readonly remainingEntries = computed(() =>
    this.showPodium() ? this.entries().slice(3) : this.entries()
  );

  /** Returns the medal position label (1ST, 2ND, 3RD) for a given podium index. */
  protected medalLabel(index: number): string {
    return MEDAL_LABELS[index] ?? '';
  }
}
