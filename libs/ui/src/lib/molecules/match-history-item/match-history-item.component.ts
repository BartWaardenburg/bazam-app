import { Component, ChangeDetectionStrategy, input, computed } from '@angular/core';

@Component({
  selector: 'bzm-match-history-item',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="bzm-match-history-item"
      [class.bzm-match-history-item--win]="isWin()"
      role="listitem"
      [attr.aria-label]="ariaDescription()"
    >
      <div class="bzm-match-history-item__mode">
        <i [class]="modeIconClass()" class="bzm-match-history-item__mode-icon"></i>
        <span class="bzm-match-history-item__mode-name">{{ mode() }}</span>
      </div>
      <div class="bzm-match-history-item__center">
        <span class="bzm-match-history-item__date">{{ date() }}</span>
        <span class="bzm-match-history-item__score">{{ score() }} punten</span>
      </div>
      <div class="bzm-match-history-item__rank">
        @if (isWin()) {
          <i class="ph-duotone ph-trophy bzm-match-history-item__trophy"></i>
        }
        <span class="bzm-match-history-item__rank-text" [class.bzm-match-history-item__rank-text--win]="isWin()">
          #{{ rank() }} / {{ totalPlayers() }}
        </span>
      </div>
    </div>
  `,
  styles: `
    :host {
      display: block;
      font-family: var(--bzm-font-family);
    }

    .bzm-match-history-item {
      display: flex;
      align-items: center;
      gap: var(--bzm-space-3);
      padding: var(--bzm-space-3) var(--bzm-space-4);
      background: var(--bzm-color-surface);
      border: 4px solid var(--bzm-color-border);
      border-width: var(--bzm-border-width-comic);
      border-radius: var(--bzm-radius-md);
      box-shadow: var(--bzm-shadow-sm);
      transition:
        transform var(--bzm-transition-playful),
        box-shadow var(--bzm-transition-base);
    }

    .bzm-match-history-item:hover {
      transform: translateY(-2px);
      box-shadow: var(--bzm-shadow-md);
    }

    .bzm-match-history-item--win {
      border-left: 6px solid var(--bzm-color-gold);
    }

    .bzm-match-history-item__mode {
      display: flex;
      align-items: center;
      gap: var(--bzm-space-2);
      min-width: 0;
      flex-shrink: 0;
    }

    .bzm-match-history-item__mode-icon {
      font-size: var(--bzm-font-size-xl);
      color: var(--bzm-color-primary);
      flex-shrink: 0;
    }

    .bzm-match-history-item__mode-name {
      font-size: var(--bzm-font-size-sm);
      font-weight: var(--bzm-font-weight-bold);
      color: var(--bzm-color-text);
      white-space: nowrap;
    }

    .bzm-match-history-item__center {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      min-width: 0;
    }

    .bzm-match-history-item__date {
      font-size: var(--bzm-font-size-sm);
      color: var(--bzm-color-text-muted);
    }

    .bzm-match-history-item__score {
      font-size: var(--bzm-font-size-base);
      font-weight: var(--bzm-font-weight-extrabold);
      color: var(--bzm-color-text);
    }

    .bzm-match-history-item__rank {
      display: flex;
      align-items: center;
      gap: var(--bzm-space-1);
      flex-shrink: 0;
    }

    .bzm-match-history-item__trophy {
      font-size: var(--bzm-font-size-lg);
      color: var(--bzm-color-gold);
    }

    .bzm-match-history-item__rank-text {
      font-size: var(--bzm-font-size-sm);
      font-weight: var(--bzm-font-weight-extrabold);
      color: var(--bzm-color-text-secondary);
      white-space: nowrap;
    }

    .bzm-match-history-item__rank-text--win {
      color: var(--bzm-color-gold);
    }

    @media (prefers-reduced-motion: reduce) {
      .bzm-match-history-item {
        transition: none;
      }

      .bzm-match-history-item:hover {
        transform: none;
      }
    }
  `,
})
/**
 * Displays a single match history row with game mode, date, score, and rank.
 * Wins are highlighted with a gold left accent border and trophy icon.
 *
 * @selector bzm-match-history-item
 *
 * @example
 * ```html
 * <bzm-match-history-item
 *   mode="Klassiek"
 *   modeIcon="game-controller"
 *   date="10 mrt 2026"
 *   [score]="2400"
 *   [rank]="1"
 *   [totalPlayers]="8"
 *   [isWin]="true"
 * />
 * ```
 */
export class BzmMatchHistoryItemComponent {
  /** Game mode name (e.g., "Klassiek", "Team Battle"). */
  readonly mode = input.required<string>();

  /** Phosphor icon name (without `ph-duotone` prefix) for the game mode. */
  readonly modeIcon = input.required<string>();

  /** Formatted date string for when the match was played. */
  readonly date = input.required<string>();

  /** Final score earned in the match. */
  readonly score = input.required<number>();

  /** Player's final rank position in the match. */
  readonly rank = input.required<number>();

  /** Total number of players in the match. */
  readonly totalPlayers = input.required<number>();

  /**
   * Whether this match was a win.
   * @default false
   */
  readonly isWin = input<boolean>(false);

  protected readonly modeIconClass = computed(() => `ph-duotone ph-${this.modeIcon()}`);

  protected readonly ariaDescription = computed(() =>
    `${this.mode()} - ${this.date()} - ${this.score()} punten - Rang ${this.rank()} van ${this.totalPlayers()}${this.isWin() ? ' - Gewonnen' : ''}`
  );
}
