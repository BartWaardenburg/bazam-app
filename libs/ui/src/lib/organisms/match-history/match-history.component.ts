import { Component, ChangeDetectionStrategy, input, computed, signal } from '@angular/core';
import { BzmMatchHistoryItemComponent } from '../../molecules/match-history-item/match-history-item.component';

/** A single match history entry with all display data. */
export interface MatchHistoryEntry {
  readonly id: string;
  readonly mode: string;
  readonly modeIcon: string;
  readonly date: string;
  readonly score: number;
  readonly rank: number;
  readonly totalPlayers: number;
  readonly isWin: boolean;
}

@Component({
  selector: 'bzm-match-history',
  standalone: true,
  imports: [BzmMatchHistoryItemComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="history" role="list" aria-label="Wedstrijdgeschiedenis">
      @if (matches().length === 0) {
        <div class="history__empty">
          <i class="ph-duotone ph-game-controller history__empty-icon"></i>
          <p class="history__empty-text">{{ emptyText() }}</p>
        </div>
      } @else {
        @for (match of visibleMatches(); track match.id; let i = $index) {
          <div class="history__item" [style.animation-delay]="i * 60 + 'ms'">
            <bzm-match-history-item
              [mode]="match.mode"
              [modeIcon]="match.modeIcon"
              [date]="match.date"
              [score]="match.score"
              [rank]="match.rank"
              [totalPlayers]="match.totalPlayers"
              [isWin]="match.isWin"
            />
          </div>
        }
        @if (hasMore()) {
          <button class="history__more-btn" (click)="showMore()">
            <i class="ph-duotone ph-caret-down history__more-icon"></i>
            Bekijk meer
          </button>
        }
      }
    </div>
  `,
  styles: `
    :host {
      display: block;
      font-family: var(--bzm-font-family);
    }

    .history {
      display: flex;
      flex-direction: column;
      gap: var(--bzm-space-2);
    }

    .history__item {
      animation: slide-in 0.3s ease-out both;
    }

    @keyframes slide-in {
      from {
        opacity: 0;
        transform: translateX(-12px);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }

    .history__empty {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: var(--bzm-space-12) var(--bzm-space-4);
      text-align: center;
    }

    .history__empty-icon {
      font-size: 48px;
      color: var(--bzm-color-text-muted);
      margin-bottom: var(--bzm-space-4);
    }

    .history__empty-text {
      margin: 0;
      font-size: var(--bzm-font-size-base);
      font-weight: var(--bzm-font-weight-bold);
      color: var(--bzm-color-text-muted);
    }

    .history__more-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: var(--bzm-space-2);
      padding: var(--bzm-space-3) var(--bzm-space-4);
      border: 3px solid var(--bzm-color-border);
      border-width: var(--bzm-border-width-comic-sm);
      border-radius: var(--bzm-radius-md);
      background: var(--bzm-color-surface);
      font-family: var(--bzm-font-family);
      font-size: var(--bzm-font-size-sm);
      font-weight: var(--bzm-font-weight-extrabold);
      color: var(--bzm-color-text-secondary);
      cursor: pointer;
      transition:
        transform var(--bzm-transition-playful),
        box-shadow var(--bzm-transition-base);
    }

    .history__more-btn:hover {
      transform: translateY(-2px);
      box-shadow: var(--bzm-shadow-sm);
      color: var(--bzm-color-text);
    }

    .history__more-icon {
      font-size: var(--bzm-font-size-lg);
    }

    @media (prefers-reduced-motion: reduce) {
      .history__item {
        animation: none;
      }

      .history__more-btn {
        transition: none;
      }

      .history__more-btn:hover {
        transform: none;
      }
    }
  `,
})
/**
 * Displays a vertical list of match history items with staggered entrance animation.
 * Shows an encouraging empty state when no matches exist and a "Bekijk meer" button
 * when the list exceeds the maximum visible count.
 *
 * @selector bzm-match-history
 *
 * @example
 * ```html
 * <bzm-match-history
 *   [matches]="playerMatches"
 *   [maxVisible]="5"
 *   emptyText="Nog geen wedstrijden gespeeld"
 * />
 * ```
 */
export class BzmMatchHistoryComponent {
  /** Array of match history entries to display. */
  readonly matches = input.required<MatchHistoryEntry[]>();

  /**
   * Maximum number of matches to show before the "Bekijk meer" button.
   * @default 10
   */
  readonly maxVisible = input<number>(10);

  /**
   * Text shown in the empty state when no matches exist.
   * @default 'Nog geen wedstrijden gespeeld'
   */
  readonly emptyText = input<string>('Nog geen wedstrijden gespeeld');

  private readonly expanded = signal(false);

  protected readonly visibleMatches = computed(() => {
    const all = this.matches();
    if (this.expanded()) return all;
    return all.slice(0, this.maxVisible());
  });

  protected readonly hasMore = computed(() =>
    !this.expanded() && this.matches().length > this.maxVisible()
  );

  protected showMore(): void {
    this.expanded.set(true);
  }
}
