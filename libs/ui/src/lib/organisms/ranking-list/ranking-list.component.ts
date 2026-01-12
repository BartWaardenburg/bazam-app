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
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 256 256"><path d="M238.46,73.08,208,128,174.63,54.62a8,8,0,0,0-13.48-1.86L128,96,94.85,52.76a8,8,0,0,0-13.48,1.86L48,128,17.54,73.08A8,8,0,0,0,4.81,80.65l32,136A8,8,0,0,0,44.6,224H211.4a8,8,0,0,0,7.79-7.35l32-136A8,8,0,0,0,238.46,73.08Z" opacity="0.2" fill="currentColor"/><path d="M248,80a28,28,0,1,0-51.12,15.77l-26.79,33L146,73.4a28,28,0,1,0-36.06,0L85.91,128.74l-26.79-33a28,28,0,1,0-26,13.58l18.28,67.71A16,16,0,0,0,66.88,192h122.24a16,16,0,0,0,15.45-15l18.28-67.71A28,28,0,0,0,248,80ZM128,40a12,12,0,1,1-12,12A12,12,0,0,1,128,40ZM24,80A12,12,0,1,1,36,92,12,12,0,0,1,24,80Zm196,12A12,12,0,1,1,232,80,12,12,0,0,1,220,92ZM189.12,176H66.88l-15.2-56.3a28.43,28.43,0,0,0,7.57-.82l33.55,41.38a8,8,0,0,0,12.47-.38l26.33-37.59,21.39,36.67a8,8,0,0,0,12.34,1.79l33.55-41.38a28.43,28.43,0,0,0,7.57.82Z" fill="currentColor"/></svg>
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
