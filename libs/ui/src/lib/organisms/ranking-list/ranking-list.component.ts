import { Component, ChangeDetectionStrategy, input, computed, signal } from '@angular/core';
import { BzmTabBarComponent } from '../tab-bar/tab-bar.component';
import { BzmLeaderboardItemComponent } from '../../molecules/leaderboard-item/leaderboard-item.component';
import { BzmAvatarComponent } from '../../atoms/avatar/avatar.component';

export interface RankingEntry {
  readonly rank: number;
  readonly nickname: string;
  readonly avatarUrl?: string;
  readonly streak: number;
  readonly points: number;
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
        (tabChange)="activeTab.set($event)"
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
      animation: float 2s ease-in-out infinite;
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

    @keyframes float {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-4px); }
    }
  `,
})
export class BzmRankingListComponent {
  readonly entries = input.required<RankingEntry[]>();
  readonly currentUserNickname = input<string | undefined>(undefined);

  readonly activeTab = signal(0);

  protected readonly topPlayer = computed(() => {
    const list = this.entries();
    return list.length > 0 ? list[0] : undefined;
  });
}
