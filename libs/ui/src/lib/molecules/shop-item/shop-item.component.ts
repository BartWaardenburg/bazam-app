import { Component, ChangeDetectionStrategy, input, output, computed } from '@angular/core';
import { type Rarity } from '../../atoms/rarity-badge/rarity-badge.component';

/** Available shop item categories. */
export type ShopItemType = 'brain' | 'study-card' | 'wildcard' | 'voucher';

const TYPE_COLORS: Record<ShopItemType, string> = {
  'brain': '#a855f7',
  'study-card': '#3b82f6',
  'wildcard': '#22c55e',
  'voucher': '#f97316',
};

const TYPE_LABELS: Record<ShopItemType, string> = {
  'brain': 'Brein',
  'study-card': 'Studiekaart',
  'wildcard': 'Wildcard',
  'voucher': 'Voucher',
};

@Component({
  selector: 'bzm-shop-item',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      [class]="cardClasses()"
      [style.--type-color]="typeColor()"
      role="article"
      [attr.aria-label]="name() + ' - ' + price() + ' Sparks'"
    >
      @if (sold()) {
        <div class="bzm-shop-item__sold-overlay" aria-hidden="true">
          <span class="bzm-shop-item__sold-text">SOLD</span>
        </div>
      }

      <div class="bzm-shop-item__icon-container">
        <i [class]="safeIconClass()"></i>
      </div>

      <div class="bzm-shop-item__type-label">
        {{ typeLabel() }}
        @if (rarity()) {
          <span class="bzm-shop-item__rarity">{{ rarity() }}</span>
        }
      </div>

      <h4 class="bzm-shop-item__name">{{ name() }}</h4>
      <p class="bzm-shop-item__description">{{ description() }}</p>

      <div class="bzm-shop-item__footer">
        <div class="bzm-shop-item__price" [class.bzm-shop-item__price--unaffordable]="!affordable()">
          <span class="bzm-shop-item__spark-icon" aria-hidden="true">&#9889;</span>
          <span>{{ price() }}</span>
        </div>

        <button
          type="button"
          class="bzm-shop-item__buy-btn"
          [disabled]="sold() || !affordable()"
          (click)="handlePurchase()"
          [attr.aria-label]="'Koop ' + name() + ' voor ' + price() + ' Sparks'"
        >
          @if (sold()) {
            Uitverkocht
          } @else if (!affordable()) {
            Niet genoeg &#9889;
          } @else {
            Kopen
          }
        </button>
      </div>
    </div>
  `,
  styles: `
    :host {
      display: block;
      font-family: var(--bzm-font-family);
    }

    .bzm-shop-item {
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--bzm-space-2);
      padding: var(--bzm-space-5) var(--bzm-space-4) var(--bzm-space-4);
      background: var(--bzm-color-surface);
      border: 4px solid var(--bzm-color-border);
      border-width: 3px 4px 5px 3px;
      border-radius: var(--bzm-radius-md);
      box-shadow: var(--bzm-shadow-card);
      text-align: center;
      overflow: hidden;
      transition: transform var(--bzm-transition-playful),
                  box-shadow var(--bzm-transition-base);
    }

    .bzm-shop-item:hover:not(.bzm-shop-item--sold):not(.bzm-shop-item--unaffordable) {
      transform: translateY(-4px);
      box-shadow: var(--bzm-shadow-lg), 0 0 0 2px var(--type-color, var(--bzm-color-border));
    }

    .bzm-shop-item--sold {
      opacity: 0.55;
    }

    .bzm-shop-item--unaffordable {
      opacity: 0.7;
    }

    .bzm-shop-item__sold-overlay {
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 2;
      pointer-events: none;
    }

    .bzm-shop-item__sold-text {
      font-family: var(--bzm-font-heading);
      font-size: clamp(2rem, 5vw, 3rem);
      font-weight: var(--bzm-font-weight-black);
      color: var(--bzm-color-error);
      text-shadow: 2px 2px 0 var(--bzm-black);
      -webkit-text-stroke: 1.5px var(--bzm-black);
      paint-order: stroke fill;
      transform: rotate(-12deg);
      opacity: 0.9;
    }

    .bzm-shop-item__icon-container {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 64px;
      height: 64px;
      background: color-mix(in srgb, var(--type-color, #a855f7) 12%, transparent);
      border-radius: var(--bzm-radius-full);
      border: 3px solid color-mix(in srgb, var(--type-color, #a855f7) 25%, transparent);
    }

    .bzm-shop-item__icon {
      font-size: 32px;
      color: var(--type-color, #a855f7);
    }

    .bzm-shop-item__type-label {
      display: flex;
      align-items: center;
      gap: var(--bzm-space-2);
      font-size: var(--bzm-font-size-xs);
      font-weight: var(--bzm-font-weight-extrabold);
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: var(--type-color, #a855f7);
    }

    .bzm-shop-item__rarity {
      padding: 1px var(--bzm-space-2);
      font-size: 10px;
      font-weight: var(--bzm-font-weight-bold);
      text-transform: capitalize;
      background: color-mix(in srgb, var(--type-color, #a855f7) 15%, transparent);
      border-radius: var(--bzm-radius-full);
      border: 1.5px solid var(--type-color, #a855f7);
    }

    .bzm-shop-item__name {
      margin: 0;
      font-size: var(--bzm-font-size-lg);
      font-weight: var(--bzm-font-weight-extrabold);
      color: var(--bzm-color-text);
      line-height: var(--bzm-line-height-tight);
    }

    .bzm-shop-item__description {
      margin: 0;
      font-size: var(--bzm-font-size-sm);
      font-weight: var(--bzm-font-weight-medium);
      color: var(--bzm-color-text-muted);
      line-height: var(--bzm-line-height-normal);
    }

    .bzm-shop-item__footer {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--bzm-space-3);
      width: 100%;
      margin-top: var(--bzm-space-2);
    }

    .bzm-shop-item__price {
      display: flex;
      align-items: center;
      gap: var(--bzm-space-1);
      font-size: var(--bzm-font-size-xl);
      font-weight: var(--bzm-font-weight-black);
      color: var(--bzm-color-accent-dark);
    }

    .bzm-shop-item__price--unaffordable {
      color: var(--bzm-color-text-muted);
    }

    .bzm-shop-item__spark-icon {
      font-size: var(--bzm-font-size-lg);
    }

    .bzm-shop-item__buy-btn {
      width: 100%;
      padding: var(--bzm-space-3) var(--bzm-space-4);
      font-family: var(--bzm-font-heading);
      font-size: var(--bzm-font-size-base);
      font-weight: var(--bzm-font-weight-extrabold);
      color: var(--bzm-white);
      background: var(--type-color, var(--bzm-color-primary));
      border: 3px solid var(--bzm-black);
      border-width: 2px 3px 4px 2px;
      border-radius: var(--bzm-radius-md);
      box-shadow: 3px 3px 0 var(--bzm-black);
      cursor: pointer;
      transition: transform var(--bzm-transition-playful),
                  box-shadow var(--bzm-transition-base);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      outline: none;
    }

    .bzm-shop-item__buy-btn:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 4px 4px 0 var(--bzm-black);
    }

    .bzm-shop-item__buy-btn:active:not(:disabled) {
      transform: translateY(1px);
      box-shadow: 1px 1px 0 var(--bzm-black);
    }

    .bzm-shop-item__buy-btn:focus-visible {
      outline: 3px solid var(--bzm-cyan-300);
      outline-offset: 2px;
    }

    .bzm-shop-item__buy-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
      box-shadow: 2px 2px 0 var(--bzm-black);
    }

    @media (prefers-reduced-motion: reduce) {
      .bzm-shop-item {
        transition: none;
      }

      .bzm-shop-item:hover:not(.bzm-shop-item--sold):not(.bzm-shop-item--unaffordable) {
        transform: none;
      }

      .bzm-shop-item__buy-btn {
        transition: none;
      }
    }
  `,
})
/**
 * Individual purchasable item card for the between-levels shop.
 *
 * Displays a shop item with icon, type badge, name, description, and price in Sparks.
 * Supports sold-out state (with a rotated "SOLD" overlay) and unaffordable state
 * (dimmed with disabled button). Each item type has a distinct accent color.
 * Hover lifts the card and adds a border glow matching the type color.
 * Respects `prefers-reduced-motion`.
 *
 * @selector bzm-shop-item
 *
 * @example
 * ```html
 * <bzm-shop-item
 *   name="Galaxy Brain"
 *   type="brain"
 *   description="2x multiplier op Science vragen"
 *   [price]="150"
 *   icon="brain"
 *   rarity="uncommon"
 *   (purchase)="onBuy()"
 * />
 * ```
 */
export class BzmShopItemComponent {
  /** Display name of the shop item. */
  readonly name = input.required<string>();

  /** Category type determining the accent color. */
  readonly type = input.required<ShopItemType>();

  /** Short description of the item's effect. */
  readonly description = input.required<string>();

  /** Cost in Sparks currency. */
  readonly price = input.required<number>();

  /** Phosphor icon name (without 'ph-' prefix). */
  readonly icon = input.required<string>();

  /** Rarity tier, applicable to brain items. @default undefined */
  readonly rarity = input<Rarity | undefined>(undefined);

  /** Whether the item has already been purchased. @default false */
  readonly sold = input<boolean>(false);

  /** Whether the player has enough Sparks to buy this item. @default true */
  readonly affordable = input<boolean>(true);

  /** Emitted when the player clicks the buy button. */
  readonly purchase = output<void>();

  /** Sanitized icon class to prevent CSS class injection. */
  protected readonly safeIconClass = computed((): string => {
    const sanitized = this.icon().replace(/[^a-z0-9-]/gi, '');
    return `ph-duotone ph-${sanitized} bzm-shop-item__icon`;
  });

  /** Resolved CSS color for the item type. */
  protected readonly typeColor = computed(() => TYPE_COLORS[this.type()]);

  /** Localized type label. */
  protected readonly typeLabel = computed(() => TYPE_LABELS[this.type()]);

  /** Combined CSS classes for the card container. */
  protected readonly cardClasses = computed(() => {
    const classes = ['bzm-shop-item'];
    if (this.sold()) classes.push('bzm-shop-item--sold');
    if (!this.affordable() && !this.sold()) classes.push('bzm-shop-item--unaffordable');
    return classes.join(' ');
  });

  protected handlePurchase(): void {
    if (!this.sold() && this.affordable()) {
      this.purchase.emit();
    }
  }
}
