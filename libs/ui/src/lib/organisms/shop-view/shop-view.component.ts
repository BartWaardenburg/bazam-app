import { Component, ChangeDetectionStrategy, input, output, computed } from '@angular/core';
import { BzmButtonComponent } from '../../atoms/button/button.component';
import { BzmSparkCurrencyComponent } from '../../atoms/spark-currency/spark-currency.component';
import { BzmShopItemComponent } from '../../molecules/shop-item/shop-item.component';
import { type Rarity } from '../../atoms/rarity-badge/rarity-badge.component';

/** Data shape for a single item slot in the shop. */
export interface ShopSlot {
  readonly id: string;
  readonly name: string;
  readonly type: 'brain' | 'study-card' | 'wildcard' | 'voucher';
  readonly description: string;
  readonly price: number;
  readonly icon: string;
  readonly rarity?: Rarity;
  readonly sold?: boolean;
}

@Component({
  selector: 'bzm-shop-view',
  standalone: true,
  imports: [BzmButtonComponent, BzmSparkCurrencyComponent, BzmShopItemComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="shop" role="region" aria-label="Shop">
      <!-- Header -->
      <div class="shop__header">
        <h2 class="shop__title">
          <i class="ph-duotone ph-shopping-bag" aria-hidden="true"></i>
          SHOP
        </h2>
        <div class="shop__balance">
          <bzm-spark-currency [amount]="playerSparks()" size="lg" />
        </div>
      </div>

      <!-- Brains section -->
      @if (brainItems().length > 0) {
        <section class="shop__section" aria-label="Brains">
          <h3 class="shop__section-title">
            <i class="ph-duotone ph-brain" aria-hidden="true"></i>
            Brains
          </h3>
          <div class="shop__items">
            @for (item of brainItems(); track item.id) {
              <bzm-shop-item
                [name]="item.name"
                [type]="item.type"
                [description]="item.description"
                [price]="item.price"
                [icon]="item.icon"
                [rarity]="item.rarity"
                [sold]="item.sold ?? false"
                [affordable]="item.price <= playerSparks()"
                (purchase)="onPurchase(item)"
              />
            }
          </div>
        </section>
      }

      <!-- Items section -->
      @if (consumableItems().length > 0) {
        <section class="shop__section" aria-label="Items">
          <h3 class="shop__section-title">
            <i class="ph-duotone ph-package" aria-hidden="true"></i>
            Items
          </h3>
          <div class="shop__items">
            @for (item of consumableItems(); track item.id) {
              <bzm-shop-item
                [name]="item.name"
                [type]="item.type"
                [description]="item.description"
                [price]="item.price"
                [icon]="item.icon"
                [rarity]="item.rarity"
                [sold]="item.sold ?? false"
                [affordable]="item.price <= playerSparks()"
                (purchase)="onPurchase(item)"
              />
            }
          </div>
        </section>
      }

      <!-- Voucher section -->
      @if (voucherItems().length > 0) {
        <section class="shop__section" aria-label="Voucher">
          <h3 class="shop__section-title">
            <i class="ph-duotone ph-ticket" aria-hidden="true"></i>
            Voucher
          </h3>
          <div class="shop__items shop__items--single">
            @for (item of voucherItems(); track item.id) {
              <bzm-shop-item
                [name]="item.name"
                [type]="item.type"
                [description]="item.description"
                [price]="item.price"
                [icon]="item.icon"
                [rarity]="item.rarity"
                [sold]="item.sold ?? false"
                [affordable]="item.price <= playerSparks()"
                (purchase)="onPurchase(item)"
              />
            }
          </div>
        </section>
      }

      <!-- Footer -->
      <div class="shop__footer">
        <div class="shop__reroll">
          <bzm-button
            variant="secondary"
            size="md"
            [disabled]="playerSparks() < rerollCost()"
            (click)="onReroll()"
          >
            <i class="ph-duotone ph-arrows-clockwise" aria-hidden="true"></i>
            Reroll {{ rerollCost() }}<i class="ph-duotone ph-lightning" aria-hidden="true"></i>
          </bzm-button>
          <span class="shop__reroll-hint">+1<i class="ph-duotone ph-lightning" aria-hidden="true"></i> per reroll</span>
        </div>

        <bzm-button
          variant="accent"
          size="lg"
          [fullWidth]="true"
          (click)="onClose()"
        >
          Volgend Level
          <i class="ph-duotone ph-arrow-right" aria-hidden="true"></i>
        </bzm-button>
      </div>
    </div>
  `,
  styles: `
    :host {
      display: block;
      font-family: var(--bzm-font-family);
    }

    .shop {
      background: var(--bzm-color-surface);
      border: 4px solid var(--bzm-black);
      border-width: 3px 4px 5px 3px;
      border-radius: var(--bzm-radius-lg);
      box-shadow: 6px 6px 0 var(--bzm-black);
      padding: var(--bzm-space-6);
      max-width: 560px;
    }

    /* ─── Header ─── */
    .shop__header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: var(--bzm-space-6);
    }

    .shop__title {
      margin: 0;
      font-family: var(--bzm-font-heading);
      font-size: clamp(1.8rem, 5vw, 2.4rem);
      color: var(--bzm-color-text);
      letter-spacing: 0.04em;
      display: flex;
      align-items: center;
      gap: var(--bzm-space-2);
      -webkit-text-stroke: 1px var(--bzm-black);
      paint-order: stroke fill;
    }

    .shop__title i {
      font-size: 1.2em;
      color: var(--bzm-color-accent);
    }

    .shop__balance {
      background: var(--bzm-color-bg);
      border: 3px solid var(--bzm-black);
      border-width: 2px 3px 4px 2px;
      border-radius: var(--bzm-radius-md);
      padding: var(--bzm-space-2) var(--bzm-space-4);
      box-shadow: 2px 2px 0 var(--bzm-black);
    }

    /* ─── Sections ─── */
    .shop__section {
      margin-bottom: var(--bzm-space-5);
    }

    .shop__section-title {
      margin: 0 0 var(--bzm-space-3);
      font-family: var(--bzm-font-heading);
      font-size: var(--bzm-font-size-lg);
      color: var(--bzm-color-text);
      display: flex;
      align-items: center;
      gap: var(--bzm-space-2);
      letter-spacing: 0.03em;
    }

    .shop__section-title i {
      font-size: 1.1em;
      color: var(--bzm-color-primary);
    }

    .shop__items {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: var(--bzm-space-3);
    }

    .shop__items--single {
      grid-template-columns: 1fr;
    }

    /* ─── Footer ─── */
    .shop__footer {
      display: flex;
      flex-direction: column;
      gap: var(--bzm-space-4);
      margin-top: var(--bzm-space-4);
      border-top: 3px solid var(--bzm-color-border);
      padding-top: var(--bzm-space-4);
    }

    .shop__reroll {
      display: flex;
      align-items: center;
      gap: var(--bzm-space-3);
    }

    .shop__reroll-hint {
      font-size: var(--bzm-font-size-xs);
      color: var(--bzm-color-text-muted);
      display: flex;
      align-items: center;
      gap: 2px;
    }

    .shop__reroll-hint i {
      font-size: 12px;
      color: var(--bzm-yellow-500);
    }

    /* ─── Reduced motion ─── */
    @media (prefers-reduced-motion: reduce) {
    }
  `,
})
/**
 * Renders the full shop layout shown between singleplayer roguelike levels.
 *
 * Displays purchasable items in three sections: Brains, consumable Items, and
 * Vouchers. Each item card shows an icon, name, type badge, description, and
 * price in Sparks. Items the player cannot afford are dimmed; sold items display
 * a "SOLD" overlay. A reroll button lets the player refresh the shop stock at
 * increasing cost. The "Next Level" button closes the shop.
 *
 * @selector bzm-shop-view
 *
 * @example
 * ```html
 * <bzm-shop-view
 *   [items]="shopItems()"
 *   [playerSparks]="sparks()"
 *   [rerollCost]="5"
 *   (itemPurchased)="buy($event)"
 *   (rerolled)="reroll()"
 *   (shopClosed)="nextLevel()"
 * />
 * ```
 */
export class BzmShopViewComponent {
  /** All available shop items to display. */
  readonly items = input.required<ShopSlot[]>();

  /** Player's current Sparks balance. */
  readonly playerSparks = input.required<number>();

  /** Current cost of a shop reroll in Sparks. */
  readonly rerollCost = input.required<number>();

  /** Emits the item ID when a purchase is made. */
  readonly itemPurchased = output<string>();

  /** Emits when the player rerolls the shop. */
  readonly rerolled = output<void>();

  /** Emits when the player closes the shop to proceed. */
  readonly shopClosed = output<void>();

  protected readonly brainItems = computed(
    () => this.items().filter((i) => i.type === 'brain')
  );

  protected readonly consumableItems = computed(
    () => this.items().filter((i) => i.type === 'study-card' || i.type === 'wildcard')
  );

  protected readonly voucherItems = computed(
    () => this.items().filter((i) => i.type === 'voucher')
  );

  /** Handles item purchase. */
  protected onPurchase(item: ShopSlot): void {
    if (!item.sold && this.playerSparks() >= item.price) {
      this.itemPurchased.emit(item.id);
    }
  }

  /** Handles shop reroll. */
  protected onReroll(): void {
    if (this.playerSparks() >= this.rerollCost()) {
      this.rerolled.emit();
    }
  }

  /** Handles shop close. */
  protected onClose(): void {
    this.shopClosed.emit();
  }
}
