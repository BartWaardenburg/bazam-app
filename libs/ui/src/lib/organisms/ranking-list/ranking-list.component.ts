import { Component, ChangeDetectionStrategy, input, computed, signal, output } from '@angular/core';
import { BzmTabBarComponent } from '../tab-bar/tab-bar.component';
import { BzmLeaderboardItemComponent } from '../../molecules/leaderboard-item/leaderboard-item.component';
import { BzmAvatarComponent } from '../../atoms/avatar/avatar.component';

/** A single entry in the ranking list. */
export interface RankingEntry {
  /** Position in the ranking (1-based). */
  readonly rank: number;
  /** Player display name. */
  readonly nickname: string;
  /** Optional avatar image URL. */
  readonly avatarUrl?: string;
  /** Current streak count. */
  readonly streak: number;
  /** Total accumulated points. */
  readonly points: number;
  /** Whether this entry belongs to the current user. */
  readonly isCurrentUser?: boolean;
}

@Component({
  selector: 'bzm-ranking-list',
  standalone: true,
  imports: [BzmTabBarComponent, BzmLeaderboardItemComponent, BzmAvatarComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="ranking-list">
      <bzm-tab-bar
        [tabs]="['World', 'Weekly', 'Friends']"
        [activeIndex]="activeTab()"
        (tabChange)="onTabChange($event)"
      />

      @if (topPlayer(); as top) {
        <div class="top-player">
          <div class="top-player-crown" aria-hidden="true">
<i class="ph-duotone ph-crown" style="font-size: 32px;"></i>
          </div>
          <bzm-avatar
            [imageUrl]="top.avatarUrl"
            [nickname]="top.nickname"
            size="xl"
          />
          <span class="top-player-name">{{ top.nickname }}</span>
          <span class="top-player-points">{{ top.points }} pts</span>
        </div>
      }

      <div class="list-container" role="list" aria-label="Rankings">
        @for (entry of entries(); track entry.rank) {
          <bzm-leaderboard-item
            [rank]="entry.rank"
            [nickname]="entry.nickname"
            [avatarUrl]="entry.avatarUrl"
            [streak]="entry.streak"
            [points]="entry.points"
            [isCurrentUser]="entry.isCurrentUser ?? entry.nickname === currentUserNickname()"
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

    .ranking-list {
      display: flex;
      flex-direction: column;
      gap: var(--bzm-space-5);
    }

    .top-player {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--bzm-space-2);
      padding: var(--bzm-space-4) var(--bzm-space-4) var(--bzm-space-6);
    }

    .top-player-crown {
      color: var(--bzm-color-accent);
      line-height: 1;
      display: flex;
      justify-content: center;
      animation: bzm-float 2s ease-in-out infinite;
    }

    .top-player-name {
      font-size: var(--bzm-font-size-lg);
      font-weight: var(--bzm-font-weight-extrabold);
      color: var(--bzm-color-text);
    }

    .top-player-points {
      font-size: var(--bzm-font-size-sm);
      font-weight: var(--bzm-font-weight-bold);
      color: var(--bzm-color-primary);
    }

    .list-container {
      display: flex;
      flex-direction: column;
      gap: var(--bzm-space-2);
      max-height: 400px;
      overflow-y: auto;
      scrollbar-width: thin;
      scrollbar-color: var(--bzm-color-border) transparent;
    }

    .list-container::-webkit-scrollbar {
      width: 4px;
    }

    .list-container::-webkit-scrollbar-track {
      background: transparent;
    }

    .list-container::-webkit-scrollbar-thumb {
      background-color: var(--bzm-color-border);
      border-radius: var(--bzm-radius-full);
    }

    @keyframes bzm-float {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-4px); }
    }
  `,
})
/**
 * Displays a tabbed ranking list with a featured top player spotlight and a
 * scrollable list of leaderboard entries.
 *
 * Includes a built-in tab bar with "World", "Weekly", and "Friends" tabs.
 * The top-ranked player is displayed prominently with a crown icon and
 * enlarged avatar. The current user's entry is visually highlighted.
 *
 * @selector bzm-ranking-list
 *
 * @example
 * ```html
 * <bzm-ranking-list
 *   [entries]="rankings"
 *   [currentUserNickname]="'bartw'"
 * />
 * ```
 */
export class BzmRankingListComponent {
  /** Sorted array of ranking entries to display in the list. */
  readonly entries = input.required<RankingEntry[]>();

  /**
   * Nickname of the current user, used to highlight their row in the list.
   * @default undefined
   */
  readonly currentUserNickname = input<string | undefined>(undefined);

  /** Index of the currently active tab (World=0, Weekly=1, Friends=2). */
  readonly activeTab = signal(0);

  /** Emits the new tab index when a tab is selected. */
  readonly tabChanged = output<number>();

  protected onTabChange(index: number): void {
    this.activeTab.set(index);
    this.tabChanged.emit(index);
  }

  protected readonly topPlayer = computed(() => {
    const list = this.entries();
    return list.length > 0 ? list[0] : undefined;
  });
}
