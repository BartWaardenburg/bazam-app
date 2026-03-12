import { Component, ChangeDetectionStrategy, input, computed } from '@angular/core';

/** Fortnite-style rarity tiers used across all collectibles and power-ups. */
export type Rarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';

/** @deprecated Use `Rarity` instead. */
export type BrainRarity = Rarity;

@Component({
  selector: 'bzm-rarity-badge',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span
      [class]="badgeClasses()"
      role="img"
      [attr.aria-label]="ariaLabel()"
    >
      <i [class]="iconClasses()"></i>
      <span class="rarity-label">{{ rarityLabel() }}</span>
    </span>
  `,
  styles: `
    :host {
      display: inline-block;
      font-family: var(--bzm-font-family);
    }

    .rarity-badge {
      display: inline-flex;
      align-items: center;
      gap: var(--bzm-space-1);
      padding: var(--bzm-space-1) var(--bzm-space-3);
      border: 3px solid var(--bzm-black);
      border-width: 2px 3px 4px 2px;
      border-radius: var(--bzm-radius-md);
      font-family: var(--bzm-font-heading);
      text-transform: uppercase;
      letter-spacing: 0.04em;
      line-height: 1;
      white-space: nowrap;
    }

    .rarity-badge i {
      font-size: 16px;
    }

    .rarity-label {
      font-weight: var(--bzm-font-weight-extrabold);
      font-size: var(--bzm-font-size-sm);
    }

    /* ─── Common (Gray) ─── */
    .rarity-badge--common {
      background: var(--bzm-gray-100);
      color: var(--bzm-gray-700);
      box-shadow: 3px 3px 0 rgba(0, 0, 0, 0.2);
    }

    .rarity-badge--common i {
      color: var(--bzm-gray-500);
    }

    /* ─── Uncommon (Green) ─── */
    .rarity-badge--uncommon {
      background: linear-gradient(135deg, #7FE07F 0%, #319236 100%);
      color: #fff;
      box-shadow: 3px 3px 0 rgba(0, 0, 0, 0.3);
    }

    .rarity-badge--uncommon i {
      color: #d4ffd4;
    }

    /* ─── Rare (Blue) ─── */
    .rarity-badge--rare {
      background: linear-gradient(135deg, #7EB2FF 0%, #4C8BFF 100%);
      color: #fff;
      box-shadow: 3px 3px 0 rgba(0, 0, 0, 0.3);
    }

    .rarity-badge--rare i {
      color: #d0e2ff;
    }

    /* ─── Epic (Purple) ─── */
    .rarity-badge--epic {
      background: linear-gradient(135deg, #D89EFF 0%, #B93CF6 100%);
      color: #fff;
      box-shadow: 3px 3px 0 rgba(0, 0, 0, 0.3);
    }

    .rarity-badge--epic i {
      color: #f0d6ff;
    }

    /* ─── Legendary (Orange) ─── */
    .rarity-badge--legendary {
      background: linear-gradient(135deg, #FFB366 0%, #FF8C23 100%);
      color: #fff;
      box-shadow: 3px 3px 0 rgba(0, 0, 0, 0.3);
    }

    .rarity-badge--legendary i {
      color: #ffe0be;
    }
  `,
})
/**
 * Displays a rarity indicator with a comic-style border, icon, and tier label.
 *
 * Uses Fortnite-style rarity tiers: Common (gray), Uncommon (green), Rare (blue),
 * Epic (purple), and Legendary (orange). Used on brain cards, power-up cards,
 * shop items, and boss rewards.
 *
 * @selector bzm-rarity-badge
 *
 * @example
 * ```html
 * <bzm-rarity-badge rarity="common" />
 * <bzm-rarity-badge rarity="rare" />
 * <bzm-rarity-badge rarity="legendary" />
 * ```
 */
export class BzmRarityBadgeComponent {
  /** The rarity tier to display. */
  readonly rarity = input.required<Rarity>();

  protected readonly rarityLabel = computed(() => {
    const labels: Record<Rarity, string> = {
      common: 'Gewoon',
      uncommon: 'Ongewoon',
      rare: 'Zeldzaam',
      epic: 'Episch',
      legendary: 'Legendarisch',
    };
    return labels[this.rarity()];
  });

  protected readonly ariaLabel = computed(
    () => `Zeldzaamheid: ${this.rarityLabel()}`
  );

  protected readonly iconClasses = computed(() => {
    const icons: Record<Rarity, string> = {
      common: 'ph-duotone ph-cube',
      uncommon: 'ph-duotone ph-arrow-up',
      rare: 'ph-duotone ph-diamond',
      epic: 'ph-duotone ph-lightning',
      legendary: 'ph-duotone ph-crown',
    };
    return `${icons[this.rarity()]} badge-icon`;
  });

  protected readonly badgeClasses = computed(
    () => `rarity-badge rarity-badge--${this.rarity()}`
  );
}
