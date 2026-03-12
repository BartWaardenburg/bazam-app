import { Component, ChangeDetectionStrategy, input, computed } from '@angular/core';
import { type Rarity } from '../rarity-badge/rarity-badge.component';

/** Visual category of a power-up: offensive (chaos) or defensive (boost). */
export type PowerUpType = 'chaos' | 'boost';

/** @deprecated Use `Rarity` from rarity-badge instead. */
export type PowerUpRarity = Rarity;

@Component({
  selector: 'bzm-power-up-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      [class]="cardClasses()"
      [attr.aria-label]="ariaLabel()"
    >
      <div class="bzm-power-up-card__icon-wrap">
        <i [class]="iconClass()"></i>
      </div>
      @if (!compact()) {
        <span class="bzm-power-up-card__name">{{ name() }}</span>
        @if (description()) {
          <span class="bzm-power-up-card__desc">{{ description() }}</span>
        }
        <span class="bzm-power-up-card__rarity" [attr.aria-label]="'Zeldzaamheid: ' + rarity()">
          @for (dot of rarityDots(); track $index) {
            <span
              class="bzm-power-up-card__dot"
              [class.bzm-power-up-card__dot--filled]="dot"
            ></span>
          }
        </span>
      }
      @if (compact()) {
        <span class="bzm-power-up-card__name">{{ name() }}</span>
      }
    </div>
  `,
  styles: `
    :host {
      display: block;
      font-family: var(--bzm-font-family);
    }

    .bzm-power-up-card {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--bzm-space-2);
      padding: var(--bzm-space-5) var(--bzm-space-4);
      border: 4px solid var(--bzm-color-border);
      border-width: 3px 4px 5px 3px;
      border-radius: var(--bzm-radius-md);
      box-shadow: var(--bzm-shadow-card);
      text-align: center;
      transition:
        transform var(--bzm-transition-playful),
        box-shadow var(--bzm-transition-base),
        border-color var(--bzm-transition-base);
      cursor: default;
      position: relative;
      overflow: hidden;
    }

    /* ─── Type backgrounds ─── */
    .bzm-power-up-card--chaos {
      background: linear-gradient(135deg, var(--bzm-red-50) 0%, var(--bzm-red-100) 100%);
      border-color: var(--bzm-red-500);
    }

    .bzm-power-up-card--boost {
      background: linear-gradient(135deg, var(--bzm-green-50) 0%, var(--bzm-green-100) 100%);
      border-color: var(--bzm-green-500);
    }

    /* ─── Rarity glow (Fortnite colors) ─── */
    .bzm-power-up-card--uncommon {
      box-shadow:
        0 0 10px 2px rgba(49, 146, 54, 0.4),
        var(--bzm-shadow-card);
    }

    .bzm-power-up-card--rare {
      box-shadow:
        0 0 12px 2px rgba(76, 139, 255, 0.5),
        var(--bzm-shadow-card);
    }

    .bzm-power-up-card--epic {
      box-shadow:
        0 0 18px 4px rgba(185, 60, 246, 0.5),
        var(--bzm-shadow-card);
    }

    .bzm-power-up-card--legendary {
      box-shadow:
        0 0 22px 6px rgba(255, 140, 35, 0.5),
        var(--bzm-shadow-card);
    }

    /* ─── Selected pulsing border ─── */
    .bzm-power-up-card--selected {
      animation: bzm-pulse-border 1.2s ease-in-out infinite;
    }

    @keyframes bzm-pulse-border {
      0%, 100% { border-color: var(--bzm-color-accent); box-shadow: 0 0 8px 2px var(--bzm-color-accent-light), var(--bzm-shadow-card); }
      50% { border-color: var(--bzm-color-accent-dark); box-shadow: 0 0 16px 4px var(--bzm-color-accent), var(--bzm-shadow-lg); }
    }

    /* ─── Disabled ─── */
    .bzm-power-up-card--disabled {
      filter: grayscale(0.8);
      opacity: 0.5;
      pointer-events: none;
    }

    /* ─── Compact pill ─── */
    .bzm-power-up-card--compact {
      flex-direction: row;
      gap: var(--bzm-space-2);
      padding: var(--bzm-space-2) var(--bzm-space-3);
      border-radius: var(--bzm-radius-full);
      border-width: 2px 3px 3px 2px;
      box-shadow: var(--bzm-shadow-sm);
    }

    .bzm-power-up-card--compact .bzm-power-up-card__icon-wrap {
      width: 28px;
      height: 28px;
    }

    .bzm-power-up-card--compact .bzm-power-up-card__icon-wrap i {
      font-size: 18px;
    }

    .bzm-power-up-card--compact .bzm-power-up-card__name {
      font-size: var(--bzm-font-size-sm);
    }

    /* ─── Icon ─── */
    .bzm-power-up-card__icon-wrap {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 56px;
      height: 56px;
    }

    .bzm-power-up-card__icon-wrap i {
      font-size: 36px;
      color: var(--bzm-color-text);
    }

    .bzm-power-up-card--chaos .bzm-power-up-card__icon-wrap i {
      color: var(--bzm-red-600);
    }

    .bzm-power-up-card--boost .bzm-power-up-card__icon-wrap i {
      color: var(--bzm-green-600);
    }

    /* ─── Name ─── */
    .bzm-power-up-card__name {
      font-weight: var(--bzm-font-weight-extrabold);
      font-size: var(--bzm-font-size-base);
      color: var(--bzm-color-text);
      line-height: var(--bzm-line-height-snug);
    }

    /* ─── Description ─── */
    .bzm-power-up-card__desc {
      font-weight: var(--bzm-font-weight-medium);
      font-size: var(--bzm-font-size-xs);
      color: var(--bzm-color-text-secondary);
      line-height: var(--bzm-line-height-normal);
    }

    /* ─── Rarity dots ─── */
    .bzm-power-up-card__rarity {
      display: flex;
      gap: 4px;
      margin-top: var(--bzm-space-1);
    }

    .bzm-power-up-card__dot {
      width: 8px;
      height: 8px;
      border-radius: var(--bzm-radius-full);
      border: 2px solid var(--bzm-color-border);
      background: transparent;
    }

    .bzm-power-up-card__dot--filled {
      background: var(--bzm-color-accent);
    }

    @media (prefers-reduced-motion: reduce) {
      .bzm-power-up-card {
        transition: none;
      }

      .bzm-power-up-card--selected {
        animation: none;
        border-color: var(--bzm-color-accent);
        box-shadow: 0 0 8px 2px var(--bzm-color-accent-light), var(--bzm-shadow-card);
      }
    }
  `,
})
/**
 * Displays a single power-up as a comic-styled card with icon, name, rarity dots, and type-based theming.
 *
 * Chaos power-ups render with red-tinted backgrounds and boost power-ups with green.
 * Rarity is visualized as filled dots (common=1, rare=2, epic=3) and glow intensity.
 * Supports compact pill mode for inventory bars and selected/disabled states.
 * Respects `prefers-reduced-motion`.
 *
 * @selector bzm-power-up-card
 *
 * @example
 * ```html
 * <bzm-power-up-card name="Shield" icon="shield" type="boost" rarity="rare" />
 * <bzm-power-up-card name="Scramble" icon="shuffle" type="chaos" [compact]="true" />
 * ```
 */
export class BzmPowerUpCardComponent {
  /** Display name of the power-up. */
  readonly name = input.required<string>();

  /** Phosphor icon name (without `ph-duotone ph-` prefix). */
  readonly icon = input.required<string>();

  /** Category determining background color and accent. @default 'boost' */
  readonly type = input<PowerUpType>('boost');

  /** Rarity tier determining glow intensity and filled dots. @default 'common' */
  readonly rarity = input<Rarity>('common');

  /** Optional description text shown below the name. @default '' */
  readonly description = input<string>('');

  /** Greyed out when the power-up is not usable. @default false */
  readonly disabled = input<boolean>(false);

  /** Smaller pill-shaped variant for use in inventory bars. @default false */
  readonly compact = input<boolean>(false);

  /** Highlighted with pulsing border when selected for use. @default false */
  readonly selected = input<boolean>(false);

  protected readonly iconClass = computed(
    () => `ph-duotone ph-${this.icon()}`
  );

  protected readonly ariaLabel = computed(
    () => `${this.name()} — ${this.type()} power-up, ${this.rarity()}`
  );

  protected readonly rarityDots = computed((): boolean[] => {
    const tierMap: Record<Rarity, number> = {
      common: 1,
      uncommon: 2,
      rare: 3,
      epic: 4,
      legendary: 5,
    };
    const filled = tierMap[this.rarity()];
    return Array.from({ length: 5 }, (_, i) => i < filled);
  });

  protected readonly cardClasses = computed(() => {
    const classes = ['bzm-power-up-card', `bzm-power-up-card--${this.type()}`];
    const r = this.rarity();
    if (r !== 'common') {
      classes.push(`bzm-power-up-card--${r}`);
    }
    if (this.compact()) {
      classes.push('bzm-power-up-card--compact');
    }
    if (this.selected()) {
      classes.push('bzm-power-up-card--selected');
    }
    if (this.disabled()) {
      classes.push('bzm-power-up-card--disabled');
    }
    return classes.join(' ');
  });
}
