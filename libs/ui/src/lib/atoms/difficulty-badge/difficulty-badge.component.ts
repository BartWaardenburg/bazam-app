import { Component, ChangeDetectionStrategy, input, computed } from '@angular/core';

/** Difficulty tier determining badge color and label. */
export type DifficultyTier = 'bronze' | 'silver' | 'gold';

/** Size variant for the difficulty badge. */
export type DifficultyBadgeSize = 'sm' | 'md';

@Component({
  selector: 'bzm-difficulty-badge',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span
      [class]="badgeClasses()"
      role="img"
      [attr.aria-label]="ariaLabel()"
    >
      <i class="ph-duotone ph-shield-star badge-icon"></i>
      <span class="badge-label">{{ tierLabel() }}</span>
    </span>
  `,
  styles: `
    :host {
      display: inline-block;
      font-family: var(--bzm-font-family);
    }

    .difficulty-badge {
      display: inline-flex;
      align-items: center;
      gap: var(--bzm-space-1);
      border: 3px solid var(--bzm-black);
      border-width: 2px 3px 4px 2px;
      border-radius: var(--bzm-radius-md);
      font-family: var(--bzm-font-heading);
      text-transform: uppercase;
      letter-spacing: 0.04em;
      line-height: 1;
      white-space: nowrap;
    }

    /* ─── Size: sm ─── */
    .difficulty-badge--sm {
      padding: 2px var(--bzm-space-2);
      border-width: 2px 2px 3px 2px;
    }

    .difficulty-badge--sm .badge-icon {
      font-size: 14px;
    }

    .difficulty-badge--sm .badge-label {
      font-size: var(--bzm-font-size-xs);
    }

    /* ─── Size: md ─── */
    .difficulty-badge--md {
      padding: var(--bzm-space-1) var(--bzm-space-3);
    }

    .difficulty-badge--md .badge-icon {
      font-size: 18px;
    }

    .difficulty-badge--md .badge-label {
      font-size: var(--bzm-font-size-sm);
    }

    .badge-label {
      font-weight: var(--bzm-font-weight-extrabold);
    }

    /* ─── Tier: bronze ─── */
    .difficulty-badge--bronze {
      background: linear-gradient(135deg, #CD7F32 0%, #A0622B 100%);
      color: #fff;
      box-shadow: 3px 3px 0 rgba(0, 0, 0, 0.3);
    }

    .difficulty-badge--bronze .badge-icon {
      color: #FFDBB5;
    }

    /* ─── Tier: silver ─── */
    .difficulty-badge--silver {
      background: linear-gradient(135deg, #D4D4D4 0%, #A8A8A8 100%);
      color: var(--bzm-gray-900);
      box-shadow: 3px 3px 0 rgba(0, 0, 0, 0.25);
    }

    .difficulty-badge--silver .badge-icon {
      color: #fff;
    }

    /* ─── Tier: gold ─── */
    .difficulty-badge--gold {
      background: linear-gradient(135deg, #FFD700 0%, #E6B800 100%);
      color: var(--bzm-gray-900);
      box-shadow: 3px 3px 0 rgba(0, 0, 0, 0.25);
    }

    .difficulty-badge--gold .badge-icon {
      color: #FFF8DC;
    }
  `,
})
/**
 * Displays a difficulty tier badge (Bronze, Silver, or Gold) with a shield icon and comic-style border.
 *
 * Each tier has a distinct gradient background and color scheme. Used on quiz category cards
 * in the singleplayer roguelike mode to indicate difficulty progression.
 *
 * @selector bzm-difficulty-badge
 *
 * @example
 * ```html
 * <bzm-difficulty-badge tier="bronze" />
 * <bzm-difficulty-badge tier="gold" size="sm" />
 * ```
 */
export class BzmDifficultyBadgeComponent {
  /** The difficulty tier, controlling color and label text. */
  readonly tier = input.required<DifficultyTier>();

  /**
   * Controls padding and font size of the badge.
   * @default 'md'
   */
  readonly size = input<DifficultyBadgeSize>('md');

  protected readonly tierLabel = computed(() => {
    const labels: Record<DifficultyTier, string> = {
      bronze: 'Bronze',
      silver: 'Silver',
      gold: 'Gold',
    };
    return labels[this.tier()];
  });

  protected readonly ariaLabel = computed(
    () => `Moeilijkheid: ${this.tierLabel()}`
  );

  protected readonly badgeClasses = computed(
    () => `difficulty-badge difficulty-badge--${this.size()} difficulty-badge--${this.tier()}`
  );
}
