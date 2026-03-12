import { Component, ChangeDetectionStrategy, input, computed, signal, effect } from '@angular/core';

/** Size variant for the spark currency display. */
export type SparkCurrencySize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'bzm-spark-currency',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span
      [class]="containerClasses()"
      role="status"
      [attr.aria-label]="ariaLabel()"
    >
      @if (showIcon()) {
        <i class="ph-duotone ph-lightning spark-icon"></i>
      }
      <span class="spark-amount">{{ formattedAmount() }}</span>
    </span>
  `,
  styles: `
    :host {
      display: inline-block;
      font-family: var(--bzm-font-family);
    }

    .spark-container {
      display: inline-flex;
      align-items: center;
      gap: var(--bzm-space-1);
      font-family: var(--bzm-font-heading);
      line-height: 1;
    }

    .spark-icon {
      color: var(--bzm-yellow-500);
      filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.3));
    }

    .spark-amount {
      font-weight: var(--bzm-font-weight-extrabold);
      color: var(--bzm-color-text);
      -webkit-text-stroke: 0.5px var(--bzm-black);
      text-shadow: 2px 2px 0 rgba(0, 0, 0, 0.15);
    }

    /* ─── Size: sm ─── */
    .spark-container--sm {
      gap: 2px;
    }

    .spark-container--sm .spark-icon {
      font-size: 14px;
    }

    .spark-container--sm .spark-amount {
      font-size: var(--bzm-font-size-sm);
      -webkit-text-stroke: 0.3px var(--bzm-black);
    }

    /* ─── Size: md ─── */
    .spark-container--md .spark-icon {
      font-size: 20px;
    }

    .spark-container--md .spark-amount {
      font-size: var(--bzm-font-size-lg);
    }

    /* ─── Size: lg ─── */
    .spark-container--lg {
      gap: var(--bzm-space-2);
    }

    .spark-container--lg .spark-icon {
      font-size: 28px;
    }

    .spark-container--lg .spark-amount {
      font-size: var(--bzm-font-size-2xl);
      -webkit-text-stroke: 1px var(--bzm-black);
    }

    /* ─── Animated pulse ─── */
    .spark-container--animated .spark-amount {
      animation: bzm-spark-pulse 0.4s ease-out;
    }

    .spark-container--animated .spark-icon {
      animation: bzm-spark-icon-flash 0.4s ease-out;
    }

    @keyframes bzm-spark-pulse {
      0% { transform: scale(1); }
      40% { transform: scale(1.25); }
      100% { transform: scale(1); }
    }

    @keyframes bzm-spark-icon-flash {
      0% { transform: scale(1); filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.3)); }
      40% { transform: scale(1.3); filter: drop-shadow(0 0 8px var(--bzm-yellow-400)); }
      100% { transform: scale(1); filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.3)); }
    }

    @media (prefers-reduced-motion: reduce) {
      .spark-container--animated .spark-amount,
      .spark-container--animated .spark-icon {
        animation: none;
      }
    }
  `,
})
/**
 * Displays a Sparks currency amount with a lightning bolt icon and comic-style bold text.
 *
 * Used throughout the singleplayer roguelike mode to show the player's current Sparks balance.
 * Supports an animated mode that triggers a pulse effect when the amount changes.
 *
 * @selector bzm-spark-currency
 *
 * @example
 * ```html
 * <bzm-spark-currency [amount]="350" />
 * <bzm-spark-currency [amount]="1200" size="lg" [animated]="true" />
 * ```
 */
export class BzmSparkCurrencyComponent {
  /** The number of Sparks to display. */
  readonly amount = input.required<number>();

  /**
   * Controls the overall size of the icon and text.
   * @default 'md'
   */
  readonly size = input<SparkCurrencySize>('md');

  /**
   * Whether to show the lightning bolt icon before the amount.
   * @default true
   */
  readonly showIcon = input<boolean>(true);

  /**
   * When true, the number and icon play a brief pulse animation (e.g. on value change).
   * @default false
   */
  readonly animated = input<boolean>(false);

  /** Internal signal toggled off/on to re-trigger CSS animation. */
  private readonly triggerAnimation = signal(false);

  constructor() {
    effect(() => {
      // Read amount so the effect re-runs when it changes.
      this.amount();

      if (!this.animated()) {
        return;
      }

      // Toggle off, then back on in the next microtask to restart the CSS animation.
      this.triggerAnimation.set(false);
      queueMicrotask(() => this.triggerAnimation.set(true));
    });
  }

  protected readonly formattedAmount = computed(() => {
    const n = this.amount();
    if (n >= 10_000) {
      const k = n / 1_000;
      return k % 1 === 0 ? k + 'k' : k.toFixed(1) + 'k';
    }
    return n.toLocaleString('nl-NL');
  });

  protected readonly ariaLabel = computed(
    () => `${this.amount()} Sparks`
  );

  protected readonly containerClasses = computed(() => {
    const classes = ['spark-container', `spark-container--${this.size()}`];
    if (this.animated() && this.triggerAnimation()) {
      classes.push('spark-container--animated');
    }
    return classes.join(' ');
  });
}
