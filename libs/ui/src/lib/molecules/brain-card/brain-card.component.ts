import { Component, ChangeDetectionStrategy, computed, input, output } from '@angular/core';
import { BzmRarityBadgeComponent, type Rarity } from '../../atoms/rarity-badge/rarity-badge.component';

@Component({
  selector: 'bzm-brain-card',
  standalone: true,
  imports: [BzmRarityBadgeComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      type="button"
      [class]="cardClasses()"
      [disabled]="!interactive()"
      [attr.aria-label]="ariaLabel()"
      (click)="handleClick()"
    >
      <div class="bzm-brain-card__icon">
        <i [class]="'ph-duotone ph-' + icon()" style="font-size: 36px;"></i>
      </div>

      <h4 class="bzm-brain-card__name">{{ name() }}</h4>

      <bzm-rarity-badge [rarity]="rarity()" />

      <p class="bzm-brain-card__description">{{ description() }}</p>

      @if (price() !== undefined) {
        <div class="bzm-brain-card__price" [attr.aria-label]="'Prijs: ' + price() + ' Sparks'">
          <i class="ph-duotone ph-lightning" style="font-size: 14px; color: #FDCB6E;"></i>
          <span>{{ price() }}</span>
        </div>
      }

      @if (equipped()) {
        <div class="bzm-brain-card__equipped-badge" aria-label="Uitgerust">
          <i class="ph-duotone ph-check" style="font-size: 12px;"></i>
          Uitgerust
        </div>
      }
    </button>
  `,
  styles: `
    :host {
      display: block;
      font-family: var(--bzm-font-family);
    }

    .bzm-brain-card {
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--bzm-space-2);
      width: 140px;
      padding: var(--bzm-space-4) var(--bzm-space-3) var(--bzm-space-3);
      background: var(--bzm-color-surface);
      border: 4px solid var(--bzm-color-border);
      border-width: var(--bzm-border-width-comic);
      border-radius: var(--bzm-radius-md);
      box-shadow: 4px 4px 0 var(--bzm-black);
      cursor: pointer;
      transition: transform var(--bzm-transition-playful),
                  box-shadow var(--bzm-transition-base),
                  border-color var(--bzm-transition-base);
      text-align: center;
      overflow: hidden;
      outline: none;
      font-family: inherit;
    }

    .bzm-brain-card:hover:not(:disabled) {
      transform: translateY(-3px) rotate(1.5deg);
      box-shadow: 5px 6px 0 var(--bzm-black);
    }

    .bzm-brain-card:focus-visible {
      box-shadow: 0 0 0 3px var(--bzm-color-focus);
    }

    .bzm-brain-card--equipped {
      border-color: #A29BFE;
      box-shadow: 4px 4px 0 var(--bzm-black),
                  0 0 12px rgba(162, 155, 254, 0.4);
    }

    .bzm-brain-card--equipped:hover:not(:disabled) {
      box-shadow: 5px 6px 0 var(--bzm-black),
                  0 0 16px rgba(162, 155, 254, 0.5);
    }

    .bzm-brain-card--non-interactive {
      cursor: default;
    }

    .bzm-brain-card--non-interactive:hover {
      transform: none;
      box-shadow: 4px 4px 0 var(--bzm-black);
    }

    .bzm-brain-card__icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 56px;
      height: 56px;
      background: var(--bzm-gray-100);
      border-radius: var(--bzm-radius-md);
      color: var(--bzm-color-text);
    }

    .bzm-brain-card__name {
      font-family: var(--bzm-font-heading);
      font-size: var(--bzm-font-size-lg);
      color: var(--bzm-color-text);
      margin: 0;
      line-height: var(--bzm-line-height-tight);
      letter-spacing: 0.02em;
    }

    .bzm-brain-card__description {
      font-size: var(--bzm-font-size-xs);
      font-weight: var(--bzm-font-weight-medium);
      color: var(--bzm-color-text-muted);
      margin: 0;
      line-height: var(--bzm-line-height-normal);
    }

    .bzm-brain-card__price {
      display: flex;
      align-items: center;
      gap: var(--bzm-space-1);
      font-size: var(--bzm-font-size-sm);
      font-weight: var(--bzm-font-weight-extrabold);
      color: var(--bzm-color-text);
      margin-top: var(--bzm-space-1);
      padding: var(--bzm-space-1) var(--bzm-space-2);
      background: var(--bzm-gray-100);
      border-radius: var(--bzm-radius-sm);
      border: 2px solid var(--bzm-color-border);
      border-width: 1.5px 2px 2px 1.5px;
    }

    .bzm-brain-card__equipped-badge {
      display: flex;
      align-items: center;
      gap: var(--bzm-space-1);
      font-size: 10px;
      font-weight: var(--bzm-font-weight-extrabold);
      color: var(--bzm-white);
      background: #6C5CE7;
      padding: var(--bzm-space-1) var(--bzm-space-2);
      border-radius: var(--bzm-radius-sm);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    @media (prefers-reduced-motion: reduce) {
      .bzm-brain-card {
        transition: none;
      }

      .bzm-brain-card:hover:not(:disabled) {
        transform: none;
      }
    }
  `,
})
/**
 * Renders a Brain item card — a power-up/modifier the player can equip in the roguelike quiz mode.
 *
 * Displays the Brain's icon, name, rarity pill, effect description, and optional Sparks price.
 * Supports equipped (glowing border) and non-interactive visual states. Comic-book card style
 * with a hard black offset shadow and hover tilt animation.
 *
 * @selector bzm-brain-card
 *
 * @example
 * ```html
 * <bzm-brain-card
 *   name="Quick Thinker"
 *   rarity="uncommon"
 *   description="+3 seconden per vraag"
 *   icon="lightning"
 *   [equipped]="true"
 *   (brainSelected)="onSelect()"
 * />
 * ```
 */
export class BzmBrainCardComponent {
  /** Display name of the Brain item. */
  readonly name = input.required<string>();

  /** Rarity tier of this Brain. */
  readonly rarity = input.required<Rarity>();

  /** Short description of the Brain's effect. */
  readonly description = input.required<string>();

  /** Phosphor icon name (without 'ph-' prefix). */
  readonly icon = input.required<string>();

  /** Whether this Brain is currently equipped. @default false */
  readonly equipped = input<boolean>(false);

  /** Whether the card can be clicked. @default true */
  readonly interactive = input<boolean>(true);

  /** Sparks price when displayed in the shop. @default undefined */
  readonly price = input<number | undefined>(undefined);

  /** Emits when the player clicks this Brain card (only when interactive). */
  readonly brainSelected = output<void>();

  protected readonly cardClasses = computed((): string => {
    const classes = ['bzm-brain-card'];
    if (this.equipped()) classes.push('bzm-brain-card--equipped');
    if (!this.interactive()) classes.push('bzm-brain-card--non-interactive');
    return classes.join(' ');
  });

  protected readonly ariaLabel = computed((): string => {
    const parts = [this.name(), this.rarity(), this.description()];
    if (this.equipped()) parts.push('(uitgerust)');
    if (this.price() !== undefined) parts.push(`${this.price()} Sparks`);
    return parts.join(' — ');
  });

  protected handleClick(): void {
    if (this.interactive()) {
      this.brainSelected.emit();
    }
  }
}
