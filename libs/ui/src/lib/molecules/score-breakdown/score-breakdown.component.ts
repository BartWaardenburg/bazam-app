import { Component, ChangeDetectionStrategy, input, computed } from '@angular/core';

/** A brain multiplier applied during score calculation. */
export interface BrainMultiplier {
  readonly name: string;
  readonly value: number;
}

@Component({
  selector: 'bzm-score-breakdown',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="bzm-score-breakdown"
      [class.bzm-score-breakdown--animated]="animated()"
      role="list"
      aria-label="Score berekening"
    >
      <div class="bzm-score-breakdown__row" role="listitem" [style.animation-delay]="'0ms'">
        <span class="bzm-score-breakdown__label">
          <i class="ph-duotone ph-target bzm-score-breakdown__row-icon"></i>
          Basis
        </span>
        <span class="bzm-score-breakdown__value">
          {{ basePoints() }} pts
        </span>
      </div>

      <div class="bzm-score-breakdown__row" role="listitem" [style.animation-delay]="'100ms'">
        <span class="bzm-score-breakdown__label">
          <i class="ph-duotone ph-tag bzm-score-breakdown__row-icon"></i>
          Categorie
          <span class="bzm-score-breakdown__mult">&times;{{ categoryMult() }}</span>
        </span>
        <span class="bzm-score-breakdown__value">
          = {{ afterCategory() }}
        </span>
      </div>

      @for (brain of brainMults(); track brain.name; let i = $index) {
        <div class="bzm-score-breakdown__row bzm-score-breakdown__row--brain" role="listitem" [style.animation-delay]="(200 + i * 100) + 'ms'">
          <span class="bzm-score-breakdown__label">
            <i class="ph-duotone ph-brain bzm-score-breakdown__row-icon bzm-score-breakdown__row-icon--brain"></i>
            {{ brain.name }}
            <span class="bzm-score-breakdown__mult">&times;{{ brain.value }}</span>
          </span>
          <span class="bzm-score-breakdown__value">
            = {{ runningTotals()[i] }}
          </span>
        </div>
      }

      @if (comboBonus() > 1) {
        <div class="bzm-score-breakdown__row bzm-score-breakdown__row--combo" role="listitem" [style.animation-delay]="comboDelay() + 'ms'">
          <span class="bzm-score-breakdown__label">
            <i class="ph-duotone ph-fire bzm-score-breakdown__row-icon bzm-score-breakdown__row-icon--combo"></i>
            Combo
            <span class="bzm-score-breakdown__mult">&times;{{ comboBonus() }}</span>
          </span>
          <span class="bzm-score-breakdown__value">
            = {{ afterCombo() }}
          </span>
        </div>
      }

      <div class="bzm-score-breakdown__divider" [style.animation-delay]="totalDelay() + 'ms'" aria-hidden="true"></div>

      <div class="bzm-score-breakdown__row bzm-score-breakdown__row--total" role="listitem" [style.animation-delay]="(totalDelay() + 50) + 'ms'">
        <span class="bzm-score-breakdown__label bzm-score-breakdown__label--total">
          <i class="ph-duotone ph-trophy bzm-score-breakdown__row-icon bzm-score-breakdown__row-icon--total"></i>
          Totaal
        </span>
        <span class="bzm-score-breakdown__value bzm-score-breakdown__value--total">
          {{ totalScore() }} pts
        </span>
      </div>
    </div>
  `,
  styles: `
    :host {
      display: block;
      font-family: var(--bzm-font-family);
    }

    .bzm-score-breakdown {
      padding: var(--bzm-space-5) var(--bzm-space-5);
      background: var(--bzm-color-surface);
      border: 4px solid var(--bzm-color-border);
      border-width: 3px 4px 5px 3px;
      border-radius: var(--bzm-radius-md);
      box-shadow: var(--bzm-shadow-card);
    }

    .bzm-score-breakdown__row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: var(--bzm-space-2) var(--bzm-space-3);
      border-radius: var(--bzm-radius-sm);
    }

    .bzm-score-breakdown--animated .bzm-score-breakdown__row,
    .bzm-score-breakdown--animated .bzm-score-breakdown__divider {
      opacity: 0;
      transform: translateX(-12px);
      animation: bzm-breakdown-reveal 0.35s ease-out forwards;
    }

    .bzm-score-breakdown__row:hover {
      background: var(--bzm-gray-50, rgba(0, 0, 0, 0.02));
    }

    .bzm-score-breakdown__row--brain {
      background: color-mix(in srgb, #a855f7 5%, transparent);
    }

    .bzm-score-breakdown__row--combo {
      background: color-mix(in srgb, #f97316 5%, transparent);
    }

    .bzm-score-breakdown__label {
      display: flex;
      align-items: center;
      gap: var(--bzm-space-2);
      font-size: var(--bzm-font-size-sm);
      font-weight: var(--bzm-font-weight-semibold);
      color: var(--bzm-color-text-secondary);
    }

    .bzm-score-breakdown__label--total {
      font-size: var(--bzm-font-size-base);
      font-weight: var(--bzm-font-weight-extrabold);
      color: var(--bzm-color-text);
    }

    .bzm-score-breakdown__row-icon {
      font-size: 18px;
      color: var(--bzm-color-text-muted);
      flex-shrink: 0;
    }

    .bzm-score-breakdown__row-icon--brain {
      color: #a855f7;
    }

    .bzm-score-breakdown__row-icon--combo {
      color: #f97316;
    }

    .bzm-score-breakdown__row-icon--total {
      color: var(--bzm-color-accent);
      font-size: 20px;
    }

    .bzm-score-breakdown__mult {
      font-size: var(--bzm-font-size-xs);
      font-weight: var(--bzm-font-weight-bold);
      color: var(--bzm-color-text-muted);
      padding: 1px var(--bzm-space-1);
      background: var(--bzm-gray-100, rgba(0, 0, 0, 0.05));
      border-radius: var(--bzm-radius-sm);
    }

    .bzm-score-breakdown__value {
      font-size: var(--bzm-font-size-sm);
      font-weight: var(--bzm-font-weight-bold);
      color: var(--bzm-color-text);
      font-variant-numeric: tabular-nums;
      text-align: right;
      min-width: 80px;
    }

    .bzm-score-breakdown__value--total {
      font-family: var(--bzm-font-heading);
      font-size: var(--bzm-font-size-2xl);
      font-weight: var(--bzm-font-weight-black);
      color: var(--bzm-color-accent);
      text-shadow: 2px 2px 0 var(--bzm-black);
      -webkit-text-stroke: 1px var(--bzm-black);
      paint-order: stroke fill;
    }

    .bzm-score-breakdown__divider {
      height: 3px;
      margin: var(--bzm-space-3) var(--bzm-space-3);
      background: repeating-linear-gradient(
        90deg,
        var(--bzm-color-border) 0px,
        var(--bzm-color-border) 6px,
        transparent 6px,
        transparent 10px
      );
      border-radius: 2px;
    }

    .bzm-score-breakdown__row--total {
      padding-top: var(--bzm-space-3);
    }

    @keyframes bzm-breakdown-reveal {
      0% {
        opacity: 0;
        transform: translateX(-12px);
      }
      100% {
        opacity: 1;
        transform: translateX(0);
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .bzm-score-breakdown--animated .bzm-score-breakdown__row,
      .bzm-score-breakdown--animated .bzm-score-breakdown__divider {
        animation: none;
        opacity: 1;
        transform: none;
      }
    }
  `,
})
/**
 * Displays a step-by-step scoring calculation breakdown for a single question answer.
 *
 * Shows base points, category multiplier, brain multipliers, and optional combo bonus
 * in a vertical stack with running totals. The total score is displayed prominently
 * at the bottom with comic-style text stroke. Supports a cascade reveal animation
 * where each line appears sequentially. Uses tabular-nums for aligned number columns.
 *
 * @selector bzm-score-breakdown
 *
 * @example
 * ```html
 * <bzm-score-breakdown
 *   [basePoints]="100"
 *   [categoryMult]="1.5"
 *   [brainMults]="[{ name: 'Science Brain', value: 2.0 }]"
 *   [comboBonus]="3.0"
 *   [totalScore]="900"
 *   [animated]="true"
 * />
 * ```
 */
export class BzmScoreBreakdownComponent {
  /** Base points earned for the question (100/250/500 depending on difficulty). */
  readonly basePoints = input.required<number>();

  /** Category mastery multiplier (1.0/1.5/2.5). */
  readonly categoryMult = input.required<number>();

  /** Array of brain multipliers applied during calculation. */
  readonly brainMults = input.required<BrainMultiplier[]>();

  /** Combo bonus multiplier. Only displayed when greater than 1.0. @default 1.0 */
  readonly comboBonus = input<number>(1.0);

  /** Final calculated score after all multipliers. */
  readonly totalScore = input.required<number>();

  /** Whether to animate lines appearing in sequence. @default false */
  readonly animated = input<boolean>(false);

  /** Score after applying category multiplier. */
  protected readonly afterCategory = computed(
    () => Math.round(this.basePoints() * this.categoryMult())
  );

  /** Pre-computed running totals after each brain multiplier. */
  protected readonly runningTotals = computed((): number[] => {
    const brains = this.brainMults();
    const totals: number[] = [];
    let total = this.afterCategory();
    for (const brain of brains) {
      total = Math.round(total * brain.value);
      totals.push(total);
    }
    return totals;
  });

  /** Score after applying the combo bonus. */
  protected readonly afterCombo = computed(() => {
    const brains = this.brainMults();
    let total = this.afterCategory();
    for (const brain of brains) {
      total = Math.round(total * brain.value);
    }
    return Math.round(total * this.comboBonus());
  });

  /** Animation delay for the combo row. */
  protected readonly comboDelay = computed(
    () => 200 + this.brainMults().length * 100
  );

  /** Animation delay for the total divider and row. */
  protected readonly totalDelay = computed(() => {
    let delay = 200 + this.brainMults().length * 100;
    if (this.comboBonus() > 1) delay += 100;
    return delay;
  });
}
