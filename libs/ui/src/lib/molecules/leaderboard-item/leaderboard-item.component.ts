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
export class BzmLeaderboardItemComponent {
  readonly rank = input.required<number>();
  readonly nickname = input.required<string>();
  readonly avatarUrl = input<string | undefined>(undefined);
  readonly streak = input<number>(0);
  readonly points = input.required<number>();
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
