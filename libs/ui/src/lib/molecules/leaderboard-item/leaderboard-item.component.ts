import { Component, ChangeDetectionStrategy, computed, input } from '@angular/core';

@Component({
  selector: 'bzm-leaderboard-item',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div [class]="containerClass()">
      <span class="bzm-leaderboard-item__rank" [style]="rankStyle()">
        {{ rank() }}
      </span>
      <div class="bzm-leaderboard-item__avatar">
        @if (avatarUrl()) {
          <img [src]="avatarUrl()" [alt]="nickname()" class="bzm-leaderboard-item__avatar-img" />
        } @else {
          <div class="bzm-leaderboard-item__avatar-placeholder">
            {{ nickname().charAt(0).toUpperCase() }}
          </div>
        }
      </div>
      <div class="bzm-leaderboard-item__info">
        <span class="bzm-leaderboard-item__name">{{ nickname() }}</span>
        @if (streak() > 0) {
          <span class="bzm-leaderboard-item__streak">{{ streak() }} Streak</span>
        }
      </div>
      <div class="bzm-leaderboard-item__points" [class.bzm-leaderboard-item__points--current]="isCurrentUser()">
<i class="ph-duotone ph-star bzm-leaderboard-item__star" [style.color]="isCurrentUser() ? 'var(--bzm-color-primary)' : 'var(--bzm-color-accent)'" style="font-size: 16px;"></i>
        <span>{{ points() }}</span>
      </div>
    </div>
  `,
  styles: `
    :host {
      display: block;
      width: 100%;
    }

    .bzm-leaderboard-item {
      display: flex;
      align-items: center;
      gap: var(--bzm-space-3);
      padding: var(--bzm-space-3) var(--bzm-space-4);
      background: var(--bzm-color-surface);
      border: 4px solid var(--bzm-color-border);
      border-width: 3px 4px 4px 3px;
      border-radius: var(--bzm-radius-md);
      box-shadow: var(--bzm-shadow-sm);
      font-family: var(--bzm-font-family);
      transition: background var(--bzm-transition-base);

    }

    .bzm-leaderboard-item--current {
      border-color: var(--bzm-color-primary);
      background: var(--bzm-red-50);
    }

    .bzm-leaderboard-item__rank {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 28px;
      font-size: var(--bzm-font-size-lg);
      font-weight: var(--bzm-font-weight-extrabold);
      flex-shrink: 0;
    }

    .bzm-leaderboard-item__avatar {
      width: 40px;
      height: 40px;
      border-radius: 3px;
      overflow: hidden;
      flex-shrink: 0;
      border: 3px solid var(--bzm-black);
      border-width: 2px 3px 3px 2px;
      box-shadow: var(--bzm-shadow-sm);
    }

    .bzm-leaderboard-item__avatar-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      background-color: var(--bzm-color-surface);
    }

    .bzm-leaderboard-item__avatar-placeholder {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--bzm-red-100);
      color: var(--bzm-red-700);
      font-size: var(--bzm-font-size-base);
      font-weight: var(--bzm-font-weight-extrabold);
    }

    .bzm-leaderboard-item__info {
      flex: 1;
      min-width: 0;
      display: flex;
      flex-direction: column;
    }

    .bzm-leaderboard-item__name {
      font-size: var(--bzm-font-size-base);
      font-weight: var(--bzm-font-weight-bold);
      color: var(--bzm-color-text);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .bzm-leaderboard-item__streak {
      font-size: var(--bzm-font-size-xs);
      font-weight: var(--bzm-font-weight-semibold);
      color: var(--bzm-color-accent-dark);
    }

    .bzm-leaderboard-item__points {
      display: flex;
      align-items: center;
      gap: var(--bzm-space-1);
      font-size: var(--bzm-font-size-base);
      font-weight: var(--bzm-font-weight-extrabold);
      color: var(--bzm-color-text);
      flex-shrink: 0;
    }

    .bzm-leaderboard-item__points--current {
      color: var(--bzm-color-primary);
    }

    .bzm-leaderboard-item__star {
      flex-shrink: 0;
    }
  `,
})
/**
 * Displays a single leaderboard row with rank badge, avatar, nickname, streak indicator, and point total.
 *
 * Renders a compact row suitable for vertical leaderboard lists. Top-3 ranks receive
 * gold/silver/bronze coloring. The current user's row is visually highlighted with
 * a distinct border and background color.
 *
 * @selector bzm-leaderboard-item
 *
 * @example
 * ```html
 * <bzm-leaderboard-item
 *   [rank]="1"
 *   nickname="Speler1"
 *   [points]="2400"
 *   [streak]="3"
 *   [isCurrentUser]="true"
 * />
 * ```
 */
export class BzmLeaderboardItemComponent {
  /** Numeric rank position (1-based). Ranks 1-3 receive gold, silver, and bronze colors. */
  readonly rank = input.required<number>();

  /** Player's display name. The first character is used as an avatar fallback. */
  readonly nickname = input.required<string>();

  /** URL for the player's avatar image. Falls back to a letter placeholder when not provided. @default undefined */
  readonly avatarUrl = input<string | undefined>(undefined);

  /** Current answer streak count. Displayed as "{n} Streak" when greater than zero. @default 0 */
  readonly streak = input<number>(0);

  /** Total points earned by the player. */
  readonly points = input.required<number>();

  /** Whether this row represents the current (local) player. Applies a highlighted visual style. @default false */
  readonly isCurrentUser = input<boolean>(false);

  readonly containerClass = computed(() => {
    const classes = ['bzm-leaderboard-item'];
    if (this.isCurrentUser()) classes.push('bzm-leaderboard-item--current');
    return classes.join(' ');
  });

  readonly rankStyle = computed(() => {
    const r = this.rank();
    if (r === 1) return 'color: #D4A017';
    if (r === 2) return 'color: #A0A0A0';
    if (r === 3) return 'color: #CD7F32';
    return 'color: var(--bzm-color-text-secondary)';
  });
}
