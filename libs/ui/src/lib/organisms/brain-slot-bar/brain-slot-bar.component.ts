import { Component, ChangeDetectionStrategy, input, output, computed } from '@angular/core';
import { type Rarity } from '../../atoms/rarity-badge/rarity-badge.component';

/** Data shape for an equipped Brain in a slot. */
export interface EquippedBrain {
  readonly id: string;
  readonly name: string;
  readonly icon: string;
  readonly rarity: Rarity;
  readonly description: string;
}

@Component({
  selector: 'bzm-brain-slot-bar',
  standalone: true,
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="bar"
      role="group"
      [attr.aria-label]="'Brains: ' + filledCount() + ' van ' + maxSlots() + ' slots gevuld'"
    >
      <div class="bar__header">
        <span class="bar__title">
          <i class="ph-duotone ph-brain" aria-hidden="true"></i>
          Brains
        </span>
        <span class="bar__count">{{ filledCount() }}/{{ maxSlots() }}</span>
      </div>

      <div class="bar__slots" role="list">
        @for (slot of slots(); track $index; let i = $index) {
          @if (slot) {
            <button
              class="bar__slot bar__slot--filled"
              [class.bar__slot--uncommon]="slot.rarity === 'uncommon'"
              [class.bar__slot--rare]="slot.rarity === 'rare'"
              [class.bar__slot--epic]="slot.rarity === 'epic'"
              [class.bar__slot--legendary]="slot.rarity === 'legendary'"
              [class.bar__slot--interactive]="interactive()"
              role="listitem"
              [attr.aria-label]="slot.name + ' — ' + slot.description"
              [title]="slot.name + ': ' + slot.description"
              [disabled]="!interactive()"
              (click)="onBrainClick(slot.id)"
            >
              <i [class]="'ph-duotone ' + slot.icon" aria-hidden="true"></i>
            </button>
          } @else {
            <div
              class="bar__slot bar__slot--empty"
              role="listitem"
              [attr.aria-label]="'Lege slot ' + (i + 1)"
            >
              <i class="ph-duotone ph-brain" aria-hidden="true"></i>
            </div>
          }
        }
      </div>
    </div>
  `,
  styles: `
    :host {
      display: block;
      font-family: var(--bzm-font-family);
    }

    .bar {
      background: var(--bzm-color-surface);
      border: 4px solid var(--bzm-black);
      border-width: 3px 4px 5px 3px;
      border-radius: var(--bzm-radius-md);
      box-shadow: 4px 4px 0 var(--bzm-black);
      padding: var(--bzm-space-4);
    }

    /* ─── Header ─── */
    .bar__header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: var(--bzm-space-3);
    }

    .bar__title {
      display: flex;
      align-items: center;
      gap: var(--bzm-space-2);
      font-family: var(--bzm-font-heading);
      font-size: var(--bzm-font-size-lg);
      color: var(--bzm-color-text);
      letter-spacing: 0.03em;
    }

    .bar__title i {
      font-size: 22px;
      color: var(--bzm-color-primary);
    }

    .bar__count {
      font-size: var(--bzm-font-size-sm);
      font-weight: var(--bzm-font-weight-bold);
      color: var(--bzm-color-text-muted);
    }

    /* ─── Slots ─── */
    .bar__slots {
      display: flex;
      gap: var(--bzm-space-2);
      justify-content: center;
    }

    .bar__slot {
      width: 56px;
      height: 56px;
      border-radius: var(--bzm-radius-full);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
      transition:
        transform var(--bzm-transition-playful),
        box-shadow var(--bzm-transition-base),
        border-color var(--bzm-transition-base);
    }

    /* ─── Empty slot ─── */
    .bar__slot--empty {
      border: 3px dashed var(--bzm-color-border);
      background: transparent;
      color: var(--bzm-color-text-muted);
      opacity: 0.5;
    }

    /* ─── Filled slot ─── */
    .bar__slot--filled {
      border: 3px solid var(--bzm-black);
      border-width: 2px 3px 4px 2px;
      background: var(--bzm-color-primary-surface);
      color: var(--bzm-color-primary);
      box-shadow: 2px 2px 0 var(--bzm-black);
      cursor: default;
      font-family: var(--bzm-font-family);
      padding: 0;
    }

    .bar__slot--filled:disabled {
      cursor: default;
      opacity: 1;
    }

    .bar__slot--interactive:not(:disabled) {
      cursor: pointer;
    }

    .bar__slot--interactive:hover:not(:disabled) {
      transform: translateY(-3px) scale(1.08);
      box-shadow: 3px 4px 0 var(--bzm-black);
    }

    .bar__slot--interactive:active:not(:disabled) {
      transform: translateY(2px);
      box-shadow: none;
    }

    /* ─── Uncommon glow (Green) ─── */
    .bar__slot--uncommon {
      border-color: #319236;
      background: linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%);
      color: #1b5e20;
      box-shadow:
        2px 2px 0 var(--bzm-black),
        0 0 12px 2px rgba(49, 146, 54, 0.4);
    }

    .bar__slot--uncommon:hover:not(:disabled).bar__slot--interactive {
      box-shadow:
        3px 4px 0 var(--bzm-black),
        0 0 16px 4px rgba(49, 146, 54, 0.5);
    }

    /* ─── Rare glow (Blue) ─── */
    .bar__slot--rare {
      border-color: #4C8BFF;
      background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
      color: #1565c0;
      box-shadow:
        2px 2px 0 var(--bzm-black),
        0 0 12px 2px rgba(76, 139, 255, 0.4);
    }

    .bar__slot--rare:hover:not(:disabled).bar__slot--interactive {
      box-shadow:
        3px 4px 0 var(--bzm-black),
        0 0 16px 4px rgba(76, 139, 255, 0.5);
    }

    /* ─── Epic glow (Purple) ─── */
    .bar__slot--epic {
      border-color: #B93CF6;
      background: linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%);
      color: #7b1fa2;
      box-shadow:
        2px 2px 0 var(--bzm-black),
        0 0 14px 3px rgba(185, 60, 246, 0.4);
    }

    .bar__slot--epic:hover:not(:disabled).bar__slot--interactive {
      box-shadow:
        3px 4px 0 var(--bzm-black),
        0 0 18px 4px rgba(185, 60, 246, 0.5);
    }

    /* ─── Legendary glow (Orange) ─── */
    .bar__slot--legendary {
      border-color: #FF8C23;
      background: linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%);
      color: #e65100;
      box-shadow:
        2px 2px 0 var(--bzm-black),
        0 0 16px 4px rgba(255, 140, 35, 0.4);
    }

    .bar__slot--legendary:hover:not(:disabled).bar__slot--interactive {
      box-shadow:
        3px 4px 0 var(--bzm-black),
        0 0 20px 6px rgba(255, 140, 35, 0.5);
    }

    /* ─── Reduced motion ─── */
    @media (prefers-reduced-motion: reduce) {
      .bar__slot {
        transition: none;
      }
    }
  `,
})
/**
 * Displays a horizontal bar of equipped Brain slots for the singleplayer
 * roguelike mode.
 *
 * Empty slots render as dashed circles with a muted brain icon. Filled slots
 * display the brain's icon in a solid circle. Uncommon brains receive a purple
 * glow effect. When `interactive` is true, clicking a filled slot emits the
 * brain's ID for detail display.
 *
 * @selector bzm-brain-slot-bar
 *
 * @example
 * ```html
 * <bzm-brain-slot-bar
 *   [brains]="equippedBrains()"
 *   [maxSlots]="3"
 *   [interactive]="true"
 *   (brainClicked)="showBrainDetail($event)"
 * />
 * ```
 */
export class BzmBrainSlotBarComponent {
  /** Array of equipped brains; `null` entries represent empty slots. */
  readonly brains = input.required<(EquippedBrain | null)[]>();

  /** Total number of Brain slots available (Explorer = 3, Champion = 5). */
  readonly maxSlots = input.required<3 | 5>();

  /**
   * Whether filled slots are clickable for viewing brain details.
   * @default false
   */
  readonly interactive = input<boolean>(false);

  /** Emits the brain ID when a filled slot is clicked in interactive mode. */
  readonly brainClicked = output<string>();

  protected readonly slots = computed(() => {
    const brains = this.brains();
    const max = this.maxSlots();
    const result: (EquippedBrain | null)[] = [];
    for (let i = 0; i < max; i++) {
      result.push(brains[i] ?? null);
    }
    return result;
  });

  protected readonly filledCount = computed(
    () => this.brains().filter((b) => b !== null).length
  );

  /** Handles slot click when interactive mode is enabled. */
  protected onBrainClick(id: string): void {
    if (this.interactive()) {
      this.brainClicked.emit(id);
    }
  }
}
