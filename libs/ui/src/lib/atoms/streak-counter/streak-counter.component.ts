import { Component, ChangeDetectionStrategy, input, computed } from '@angular/core';

/** Size variant for the streak counter display. */
export type StreakCounterSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'bzm-streak-counter',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span
      [class]="containerClasses()"
      role="status"
      [attr.aria-label]="ariaLabel()"
    >
      <i class="ph-duotone ph-fire streak-icon"></i>
      <span class="streak-count">{{ count() }}</span>
    </span>
  `,
  styles: `
    :host {
      display: inline-block;
      font-family: var(--bzm-font-family);
    }

    .streak-container {
      display: inline-flex;
      align-items: center;
      gap: var(--bzm-space-1);
      line-height: 1;
    }

    .streak-icon {
      transition:
        color var(--bzm-transition-base),
        filter var(--bzm-transition-base);
    }

    .streak-count {
      font-family: var(--bzm-font-heading);
      font-weight: var(--bzm-font-weight-extrabold);
      text-shadow: 2px 2px 0 rgba(0, 0, 0, 0.15);
      transition:
        color var(--bzm-transition-base),
        transform var(--bzm-transition-base);
    }

    /* ─── Active state ─── */
    .streak-container--active .streak-icon {
      color: #FF6D00;
      filter: drop-shadow(0 0 6px rgba(255, 109, 0, 0.6));
    }

    .streak-container--active .streak-count {
      color: var(--bzm-color-text);
      -webkit-text-stroke: 0.5px var(--bzm-black);
    }

    /* ─── Active + pulsing fire ─── */
    .streak-container--active.streak-container--pulse .streak-icon {
      animation: bzm-fire-pulse 0.8s ease-in-out infinite;
    }

    @keyframes bzm-fire-pulse {
      0%, 100% {
        transform: scale(1);
        filter: drop-shadow(0 0 6px rgba(255, 109, 0, 0.6));
      }
      50% {
        transform: scale(1.15);
        filter: drop-shadow(0 0 12px rgba(255, 109, 0, 0.9));
      }
    }

    /* ─── Inactive / zero state ─── */
    .streak-container--inactive .streak-icon {
      color: var(--bzm-gray-400);
      filter: none;
    }

    .streak-container--inactive .streak-count {
      color: var(--bzm-gray-400);
      -webkit-text-stroke: 0;
      text-shadow: none;
    }

    /* ─── Size: sm ─── */
    .streak-container--sm {
      gap: 2px;
    }

    .streak-container--sm .streak-icon {
      font-size: 14px;
    }

    .streak-container--sm .streak-count {
      font-size: var(--bzm-font-size-sm);
      -webkit-text-stroke: 0.3px var(--bzm-black);
    }

    /* ─── Size: md ─── */
    .streak-container--md .streak-icon {
      font-size: 22px;
    }

    .streak-container--md .streak-count {
      font-size: var(--bzm-font-size-xl);
    }

    /* ─── Size: lg ─── */
    .streak-container--lg {
      gap: var(--bzm-space-2);
    }

    .streak-container--lg .streak-icon {
      font-size: 32px;
    }

    .streak-container--lg .streak-count {
      font-size: var(--bzm-font-size-3xl);
      -webkit-text-stroke: 1px var(--bzm-black);
    }

    /* ─── High streak scale bump ─── */
    .streak-container--active.streak-container--high .streak-count {
      transform: scale(1.1);
    }

    .streak-container--active.streak-container--high .streak-icon {
      filter: drop-shadow(0 0 10px rgba(255, 109, 0, 0.8));
    }

    @media (prefers-reduced-motion: reduce) {
      .streak-container--active.streak-container--pulse .streak-icon {
        animation: none;
      }

      .streak-icon,
      .streak-count {
        transition: none;
      }
    }
  `,
})
/**
 * Displays the current answer streak count with a fire icon and comic-style number.
 *
 * When active with a count above zero, the fire icon pulses with an orange glow.
 * Higher streaks trigger a subtle scale bump for added impact. Inactive or zero-count
 * states render in muted gray. Used in the singleplayer roguelike mode HUD.
 *
 * @selector bzm-streak-counter
 *
 * @example
 * ```html
 * <bzm-streak-counter [count]="5" />
 * <bzm-streak-counter [count]="0" [active]="false" />
 * <bzm-streak-counter [count]="12" size="lg" />
 * ```
 */
export class BzmStreakCounterComponent {
  /** The current streak count to display. */
  readonly count = input.required<number>();

  /**
   * Controls the overall size of the icon and text.
   * @default 'md'
   */
  readonly size = input<StreakCounterSize>('md');

  /**
   * Whether the streak is currently active (player is on a roll).
   * When false or count is 0, the display is muted.
   * @default true
   */
  readonly active = input<boolean>(true);

  protected readonly isActive = computed(
    () => this.active() && this.count() > 0
  );

  protected readonly ariaLabel = computed(
    () => `Streak: ${this.count()}`
  );

  protected readonly containerClasses = computed(() => {
    const classes = ['streak-container', `streak-container--${this.size()}`];

    if (this.isActive()) {
      classes.push('streak-container--active');
      classes.push('streak-container--pulse');
      if (this.count() >= 5) {
        classes.push('streak-container--high');
      }
    } else {
      classes.push('streak-container--inactive');
    }

    return classes.join(' ');
  });
}
