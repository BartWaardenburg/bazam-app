import { Component, ChangeDetectionStrategy, input, output, computed, signal, effect } from '@angular/core';
import { BzmPowerUpCardComponent, type PowerUpType, type PowerUpRarity } from '../../atoms/power-up-card/power-up-card.component';

/** Data for a single held power-up in the inventory. */
export interface PowerUpSlot {
  /** Unique identifier for this power-up instance. */
  readonly id: string;
  /** Display name of the power-up. */
  readonly name: string;
  /** Phosphor icon name (without prefix). */
  readonly icon: string;
  /** Category: offensive (chaos) or defensive (boost). */
  readonly type: PowerUpType;
  /** Rarity tier of this power-up. */
  readonly rarity: PowerUpRarity;
}

@Component({
  selector: 'bzm-power-up-inventory',
  standalone: true,
  imports: [BzmPowerUpCardComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="bzm-power-up-inventory"
      role="toolbar"
      aria-label="Power-up inventaris"
    >
      @for (slotIndex of slotIndices(); track slotIndex) {
        @if (slots()[slotIndex]; as slot) {
          <button
            class="bzm-power-up-inventory__slot bzm-power-up-inventory__slot--filled"
            [class.bzm-power-up-inventory__slot--bounce]="bounceSlots().has(slotIndex)"
            type="button"
            [disabled]="!canUse()"
            [attr.aria-label]="'Gebruik ' + slot.name"
            (click)="handleSlotClick(slot.id)"
          >
            <bzm-power-up-card
              [name]="slot.name"
              [icon]="slot.icon"
              [type]="slot.type"
              [rarity]="slot.rarity"
              [compact]="true"
              [selected]="selectedId() === slot.id"
              [disabled]="!canUse()"
            />
          </button>
        } @else {
          <div
            class="bzm-power-up-inventory__slot bzm-power-up-inventory__slot--empty"
            role="img"
            aria-label="Lege slot"
          >
            <i class="ph-duotone ph-plus"></i>
          </div>
        }
      }
    </div>
  `,
  styles: `
    :host {
      display: block;
      font-family: var(--bzm-font-family);
    }

    .bzm-power-up-inventory {
      display: flex;
      gap: var(--bzm-space-3);
      align-items: center;
      padding: var(--bzm-space-3) var(--bzm-space-4);
      background: rgba(255, 255, 255, 0.85);
      border: 4px solid var(--bzm-color-border);
      border-width: 3px 4px 5px 3px;
      border-radius: var(--bzm-radius-md);
      box-shadow: var(--bzm-shadow-sm);
      backdrop-filter: blur(4px);
    }

    .bzm-power-up-inventory__slot {
      flex-shrink: 0;
    }

    .bzm-power-up-inventory__slot--filled {
      background: none;
      border: none;
      padding: 0;
      cursor: pointer;
      outline: none;
      transition: transform var(--bzm-transition-playful);
    }

    .bzm-power-up-inventory__slot--filled:hover:not(:disabled) {
      transform: scale(1.08);
    }

    .bzm-power-up-inventory__slot--filled:focus-visible {
      outline: 3px solid var(--bzm-cyan-300);
      outline-offset: 2px;
      border-radius: var(--bzm-radius-full);
    }

    .bzm-power-up-inventory__slot--filled:disabled {
      cursor: not-allowed;
    }

    .bzm-power-up-inventory__slot--bounce {
      animation: bzm-inventory-bounce 0.4s var(--bzm-transition-playful);
    }

    .bzm-power-up-inventory__slot--empty {
      display: flex;
      align-items: center;
      justify-content: center;
      min-width: 100px;
      height: 40px;
      border: 3px dashed var(--bzm-gray-300);
      border-radius: var(--bzm-radius-full);
      color: var(--bzm-gray-400);
    }

    .bzm-power-up-inventory__slot--empty i {
      font-size: 18px;
    }

    @keyframes bzm-inventory-bounce {
      0% { transform: scale(0.5); opacity: 0; }
      60% { transform: scale(1.15); }
      100% { transform: scale(1); opacity: 1; }
    }

    @media (prefers-reduced-motion: reduce) {
      .bzm-power-up-inventory__slot--filled {
        transition: none;
      }

      .bzm-power-up-inventory__slot--bounce {
        animation: none;
      }
    }
  `,
})
/**
 * Horizontal inventory bar showing the player's held power-ups (max 2 slots by default).
 *
 * Empty slots appear as dashed outlines. Filled slots render compact `BzmPowerUpCard` pills.
 * Tap a slot to select it, tap again to confirm use (emits the power-up id).
 * New power-ups bounce in. Comic-bordered bar with slight transparency.
 * Respects `prefers-reduced-motion`.
 *
 * @selector bzm-power-up-inventory
 *
 * @example
 * ```html
 * <bzm-power-up-inventory
 *   [slots]="[{ id: '1', name: 'Shield', icon: 'shield', type: 'boost', rarity: 'common' }]"
 *   [canUse]="true"
 *   (powerUpUsed)="onUse($event)"
 * />
 * ```
 */
export class BzmPowerUpInventoryComponent {
  /** Current held power-ups (0 to maxSlots items). */
  readonly slots = input.required<PowerUpSlot[]>();

  /** Maximum number of power-up slots. @default 2 */
  readonly maxSlots = input<number>(2);

  /** Whether power-ups can be activated right now. @default true */
  readonly canUse = input<boolean>(true);

  /** Emits the power-up id when the player confirms use by tapping a selected slot. */
  readonly powerUpUsed = output<string>();

  /** Tracks which slot is currently selected (tap-to-confirm pattern). */
  protected readonly selectedId = signal<string | null>(null);

  protected readonly bounceSlots = signal<Set<number>>(new Set());

  private previousSlotCount = 0;
  private bounceTimer: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    effect(() => {
      const currentCount = this.slots().length;
      if (currentCount > this.previousSlotCount) {
        const newSlots = new Set<number>();
        for (let i = this.previousSlotCount; i < currentCount; i++) {
          newSlots.add(i);
        }
        this.bounceSlots.set(newSlots);
        if (this.bounceTimer !== null) {
          clearTimeout(this.bounceTimer);
        }
        this.bounceTimer = setTimeout(() => {
          this.bounceSlots.set(new Set());
          this.bounceTimer = null;
        }, 400);
      }
      this.previousSlotCount = currentCount;
    });
  }

  protected readonly slotIndices = computed(() =>
    Array.from({ length: this.maxSlots() }, (_, i) => i)
  );

  protected handleSlotClick(id: string): void {
    if (!this.canUse()) {
      return;
    }
    if (this.selectedId() === id) {
      this.powerUpUsed.emit(id);
      this.selectedId.set(null);
    } else {
      this.selectedId.set(id);
    }
  }
}
