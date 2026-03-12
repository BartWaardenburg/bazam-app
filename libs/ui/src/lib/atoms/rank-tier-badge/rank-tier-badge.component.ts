import { Component, ChangeDetectionStrategy, input, computed } from '@angular/core';

/** Rank tier representing a player's competitive level. */
export type RankTier = 'bronze' | 'silver' | 'gold' | 'diamond' | 'champion';

/** Size preset for the rank tier badge. */
export type RankTierBadgeSize = 'sm' | 'md' | 'lg';

const TIER_COLORS: Record<RankTier, { gradient: string; border: string }> = {
  bronze: {
    gradient: 'linear-gradient(135deg, #CD7F32 0%, #A0622D 40%, #E8A860 60%, #CD7F32 100%)',
    border: '#8B5A2B',
  },
  silver: {
    gradient: 'linear-gradient(135deg, #C0C0C0 0%, #A8A8A8 40%, #E8E8E8 60%, #C0C0C0 100%)',
    border: '#808080',
  },
  gold: {
    gradient: 'linear-gradient(135deg, #FFD700 0%, #DAA520 40%, #FFF8A0 60%, #FFD700 100%)',
    border: '#B8860B',
  },
  diamond: {
    gradient: 'linear-gradient(135deg, #B9F2FF 0%, #87CEEB 25%, #E0F7FF 50%, #A8E6F0 75%, #B9F2FF 100%)',
    border: '#5BB5CF',
  },
  champion: {
    gradient: 'linear-gradient(135deg, #9B59B6 0%, #8E44AD 30%, #F1C40F 50%, #9B59B6 70%, #8E44AD 100%)',
    border: '#6C3483',
  },
};

const TIER_LABELS: Record<RankTier, string> = {
  bronze: 'Brons',
  silver: 'Zilver',
  gold: 'Goud',
  diamond: 'Diamant',
  champion: 'Kampioen',
};

const SIZE_MAP: Record<RankTierBadgeSize, { badge: number; icon: number; font: string }> = {
  sm: { badge: 36, icon: 16, font: 'var(--bzm-font-size-sm)' },
  md: { badge: 52, icon: 22, font: 'var(--bzm-font-size-sm)' },
  lg: { badge: 72, icon: 30, font: 'var(--bzm-font-size-base)' },
};

@Component({
  selector: 'bzm-rank-tier-badge',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="badge-container"
      [class.badge--animate]="animate()"
      [attr.aria-label]="'Rang: ' + tierLabel()"
      role="img"
    >
      <div
        class="badge-shield"
        [style.width.px]="sizeConfig().badge"
        [style.height.px]="sizeConfig().badge"
        [style.background]="tierColors().gradient"
        [style.border-color]="tierColors().border"
      >
        @if (tier() === 'champion') {
          <i
            class="ph-duotone ph-crown badge-crown"
            [style.font-size.px]="sizeConfig().icon * 0.7"
          ></i>
        }
        <i
          class="ph-duotone ph-shield-star badge-icon"
          [style.font-size.px]="sizeConfig().icon"
        ></i>
      </div>
      @if (showLabel()) {
        <span
          class="badge-label"
          [style.font-size]="sizeConfig().font"
        >{{ tierLabel() }}</span>
      }
      @if (animate()) {
        <div class="badge-shine"></div>
      }
    </div>
  `,
  styles: `
    :host {
      display: inline-flex;
      font-family: var(--bzm-font-family);
    }

    .badge-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--bzm-space-1);
      position: relative;
      overflow: hidden;
    }

    .badge-shield {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      border: 4px solid;
      border-width: var(--bzm-border-width-comic);
      border-radius: var(--bzm-radius-md);
      box-shadow: var(--bzm-shadow-card);
      color: var(--bzm-white);
      text-shadow: 1px 1px 0 rgba(0, 0, 0, 0.3);
    }

    .badge-crown {
      position: absolute;
      top: -2px;
      color: #FFD700;
      filter: drop-shadow(1px 1px 0 rgba(0, 0, 0, 0.3));
    }

    .badge-icon {
      filter: drop-shadow(1px 1px 0 rgba(0, 0, 0, 0.2));
    }

    .badge-label {
      font-weight: var(--bzm-font-weight-extrabold);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--bzm-color-text);
      font-variant: small-caps;
    }

    .badge-shine {
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(
        90deg,
        transparent 0%,
        rgba(255, 255, 255, 0.4) 50%,
        transparent 100%
      );
      pointer-events: none;
    }

    .badge--animate .badge-shine {
      animation: bzm-shine 2s ease-in-out infinite;
    }

    @keyframes bzm-shine {
      0% { left: -100%; }
      50% { left: 100%; }
      100% { left: 100%; }
    }

    @media (prefers-reduced-motion: reduce) {
      .badge--animate .badge-shine {
        animation: none;
      }
    }
  `,
})
/**
 * Displays a shield-shaped rank tier badge with tier-specific gradient colors,
 * optional label, and metallic shine animation. Supports bronze through champion tiers.
 *
 * @selector bzm-rank-tier-badge
 *
 * @example
 * ```html
 * <bzm-rank-tier-badge tier="gold" size="lg" [animate]="true" />
 * <bzm-rank-tier-badge tier="diamond" [showLabel]="false" />
 * ```
 */
export class BzmRankTierBadgeComponent {
  /** The player's rank tier determining badge color and icon. */
  readonly tier = input.required<RankTier>();

  /**
   * Controls the dimensions of the badge.
   * @default 'md'
   */
  readonly size = input<RankTierBadgeSize>('md');

  /**
   * Whether to show the tier name text below the badge.
   * @default true
   */
  readonly showLabel = input<boolean>(true);

  /**
   * Whether to play a metallic shine sweep animation across the badge.
   * @default false
   */
  readonly animate = input<boolean>(false);

  protected readonly tierColors = computed(() => TIER_COLORS[this.tier()]);
  protected readonly tierLabel = computed(() => TIER_LABELS[this.tier()]);
  protected readonly sizeConfig = computed(() => SIZE_MAP[this.size()]);
}
