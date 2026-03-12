import { Component, ChangeDetectionStrategy, input, computed } from '@angular/core';
import { BzmAvatarComponent } from '../../atoms/avatar/avatar.component';
import { BzmRankTierBadgeComponent, type RankTier } from '../../atoms/rank-tier-badge/rank-tier-badge.component';

/** Aggregate player statistics for profile display. */
export interface PlayerStats {
  readonly totalGames: number;
  readonly wins: number;
  readonly winRate: number;
  readonly avgScore: number;
  readonly bestStreak: number;
  readonly favoriteMode: string;
}

@Component({
  selector: 'bzm-player-profile',
  standalone: true,
  imports: [BzmAvatarComponent, BzmRankTierBadgeComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="profile" role="region" [attr.aria-label]="'Profiel van ' + nickname()">
      <div class="profile__decorations">
        <span class="profile__star profile__star--1">&#9733;</span>
        <span class="profile__star profile__star--2">&#10022;</span>
        <span class="profile__star profile__star--3">&#9733;</span>
      </div>

      <div class="profile__header">
        <bzm-avatar [nickname]="nickname()" size="xl" />
        <div class="profile__identity">
          <h2 class="profile__nickname">{{ nickname() }}</h2>
          <bzm-rank-tier-badge [tier]="tier()" size="sm" />
        </div>
      </div>

      <div class="profile__stats-grid">
        <div class="profile__stat">
          <span class="profile__stat-value">{{ stats().totalGames }}</span>
          <span class="profile__stat-label">Games</span>
        </div>
        <div class="profile__stat">
          <span class="profile__stat-value">{{ stats().wins }}</span>
          <span class="profile__stat-label">Gewonnen</span>
        </div>
        <div class="profile__stat">
          <span class="profile__stat-value">{{ formattedWinRate() }}%</span>
          <span class="profile__stat-label">Winstpercentage</span>
        </div>
        <div class="profile__stat">
          <span class="profile__stat-value">{{ stats().avgScore }}</span>
          <span class="profile__stat-label">Gem. Score</span>
        </div>
        <div class="profile__stat">
          <span class="profile__stat-value">{{ stats().bestStreak }}</span>
          <span class="profile__stat-label">Beste Streak</span>
        </div>
        <div class="profile__stat">
          <span class="profile__stat-value profile__stat-value--text">{{ stats().favoriteMode }}</span>
          <span class="profile__stat-label">Favoriete Modus</span>
        </div>
      </div>

      @if (totalAchievements() > 0) {
        <div class="profile__achievements">
          <div class="profile__achievements-header">
            <i class="ph-duotone ph-trophy profile__achievements-icon"></i>
            <span class="profile__achievements-text">
              {{ achievementCount() }}/{{ totalAchievements() }} prestaties
            </span>
          </div>
          <div class="profile__achievements-track">
            <div
              class="profile__achievements-fill"
              [style.width.%]="achievementPercentage()"
              role="progressbar"
              [attr.aria-valuenow]="achievementCount()"
              [attr.aria-valuemax]="totalAchievements()"
              aria-label="Prestatie voortgang"
            ></div>
          </div>
        </div>
      }

      @if (memberSince()) {
        <div class="profile__footer">
          <i class="ph-duotone ph-calendar profile__footer-icon"></i>
          <span class="profile__footer-text">Lid sinds {{ memberSince() }}</span>
        </div>
      }
    </div>
  `,
  styles: `
    :host {
      display: block;
      font-family: var(--bzm-font-family);
    }

    .profile {
      position: relative;
      background: var(--bzm-color-surface);
      border: 4px solid var(--bzm-color-border);
      border-width: var(--bzm-border-width-comic);
      border-radius: var(--bzm-radius-md);
      box-shadow: var(--bzm-shadow-card);
      padding: var(--bzm-space-8);
      overflow: hidden;
    }

    .profile__decorations {
      position: absolute;
      inset: 0;
      pointer-events: none;
    }

    .profile__star {
      position: absolute;
      color: var(--bzm-color-accent);
      opacity: 0.15;
      font-size: 24px;
    }

    .profile__star--1 { top: 8px; right: 16px; }
    .profile__star--2 { bottom: 40px; left: 12px; font-size: 18px; }
    .profile__star--3 { top: 50%; right: 8px; font-size: 14px; }

    .profile__header {
      display: flex;
      align-items: center;
      gap: var(--bzm-space-4);
      margin-bottom: var(--bzm-space-6);
    }

    .profile__identity {
      display: flex;
      flex-direction: column;
      gap: var(--bzm-space-2);
    }

    .profile__nickname {
      margin: 0;
      font-size: var(--bzm-font-size-2xl);
      font-weight: var(--bzm-font-weight-black);
      color: var(--bzm-color-text);
      line-height: 1.1;
    }

    .profile__stats-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: var(--bzm-space-3);
      margin-bottom: var(--bzm-space-6);
    }

    .profile__stat {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      padding: var(--bzm-space-3) var(--bzm-space-2);
      background: var(--bzm-white);
      border: 2px solid var(--bzm-color-border);
      border-width: var(--bzm-border-width-comic-sm);
      border-radius: var(--bzm-radius-sm);
    }

    .profile__stat-value {
      font-size: var(--bzm-font-size-xl);
      font-weight: var(--bzm-font-weight-black);
      color: var(--bzm-color-primary);
      line-height: 1.2;
    }

    .profile__stat-value--text {
      font-size: var(--bzm-font-size-sm);
    }

    .profile__stat-label {
      font-size: 11px;
      font-weight: var(--bzm-font-weight-bold);
      color: var(--bzm-color-text-muted);
      text-transform: uppercase;
      letter-spacing: 0.03em;
      margin-top: 2px;
    }

    .profile__achievements {
      margin-bottom: var(--bzm-space-4);
    }

    .profile__achievements-header {
      display: flex;
      align-items: center;
      gap: var(--bzm-space-2);
      margin-bottom: var(--bzm-space-2);
    }

    .profile__achievements-icon {
      font-size: var(--bzm-font-size-lg);
      color: var(--bzm-color-accent);
    }

    .profile__achievements-text {
      font-size: var(--bzm-font-size-sm);
      font-weight: var(--bzm-font-weight-extrabold);
      color: var(--bzm-color-text);
    }

    .profile__achievements-track {
      width: 100%;
      height: 12px;
      background: var(--bzm-white);
      border: 2px solid var(--bzm-color-border);
      border-width: var(--bzm-border-width-comic-sm);
      border-radius: 2px;
      overflow: hidden;
    }

    .profile__achievements-fill {
      height: 100%;
      background: var(--bzm-color-accent);
      border-radius: 1px;
      transition: width var(--bzm-transition-base);
    }

    .profile__footer {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: var(--bzm-space-2);
      padding-top: var(--bzm-space-4);
      border-top: 2px dashed var(--bzm-color-border);
    }

    .profile__footer-icon {
      font-size: var(--bzm-font-size-base);
      color: var(--bzm-color-text-muted);
    }

    .profile__footer-text {
      font-size: var(--bzm-font-size-sm);
      color: var(--bzm-color-text-muted);
      font-weight: var(--bzm-font-weight-semibold);
    }

    @media (prefers-reduced-motion: reduce) {
      .profile__achievements-fill {
        transition: none;
      }
    }
  `,
})
/**
 * Displays a comprehensive player profile card with avatar, nickname, rank tier badge,
 * statistics grid, achievement progress bar, and membership date.
 *
 * Uses BzmAvatarComponent for the player avatar and BzmRankTierBadgeComponent for
 * the tier indicator. Stats are displayed in a 2x3 grid with comic-styled boxes.
 *
 * @selector bzm-player-profile
 *
 * @example
 * ```html
 * <bzm-player-profile
 *   nickname="QuizMeester"
 *   [stats]="playerStats"
 *   tier="gold"
 *   [achievementCount]="15"
 *   [totalAchievements]="30"
 *   memberSince="januari 2025"
 * />
 * ```
 */
export class BzmPlayerProfileComponent {
  /** Player's display name. */
  readonly nickname = input.required<string>();

  /** Aggregate player statistics. */
  readonly stats = input.required<PlayerStats>();

  /** Player's current rank tier. */
  readonly tier = input.required<RankTier>();

  /**
   * Number of achievements unlocked.
   * @default 0
   */
  readonly achievementCount = input<number>(0);

  /**
   * Total number of achievements available.
   * @default 0
   */
  readonly totalAchievements = input<number>(0);

  /**
   * Formatted membership date string.
   * @default ''
   */
  readonly memberSince = input<string>('');

  protected readonly formattedWinRate = computed(() =>
    Math.round(this.stats().winRate)
  );

  protected readonly achievementPercentage = computed(() => {
    const total = this.totalAchievements();
    if (total === 0) return 0;
    return Math.min(100, Math.round((this.achievementCount() / total) * 100));
  });
}
