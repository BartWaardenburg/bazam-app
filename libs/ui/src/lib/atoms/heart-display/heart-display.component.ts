import { Component, ChangeDetectionStrategy, computed, input } from '@angular/core';

/** Heart display size variants. */
export type HeartDisplaySize = 'sm' | 'md' | 'lg';

const SIZE_PX: Record<HeartDisplaySize, number> = {
  sm: 20,
  md: 32,
  lg: 48,
};

@Component({
  selector: 'bzm-heart-display',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="bzm-heart-display"
      role="status"
      [attr.aria-label]="hearts() + ' van ' + maxHearts() + ' levens over'"
    >
      @for (heart of heartStates(); track $index; let i = $index) {
        <span
          [class]="heartClasses(heart, i)"
          [style.font-size.px]="iconSize()"
          [style.animation-delay]="(i * 0.1) + 's'"
        >
          <i class="ph-duotone ph-heart"></i>
        </span>
      }
    </div>
  `,
  styles: `
    :host {
      display: block;
      font-family: var(--bzm-font-family);
    }

    .bzm-heart-display {
      display: flex;
      align-items: center;
      gap: var(--bzm-space-1);
    }

    .bzm-heart-display__heart {
      display: inline-flex;
      transition: transform var(--bzm-transition-smooth), opacity var(--bzm-transition-smooth);
    }

    .bzm-heart-display__heart--filled {
      color: var(--bzm-color-error);
      filter: drop-shadow(1px 1px 0 var(--bzm-black));
    }

    .bzm-heart-display__heart--empty {
      color: var(--bzm-gray-300);
      opacity: 0.5;
    }

    .bzm-heart-display__heart--last {
      animation: bzm-heart-pulse 1s ease-in-out infinite;
    }

    .bzm-heart-display__heart--animate-lost {
      animation: bzm-heart-lost 0.5s ease-out forwards;
    }

    .bzm-heart-display__heart--animate-gain {
      animation: bzm-heart-gain 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards;
    }

    @keyframes bzm-heart-pulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.2); }
    }

    @keyframes bzm-heart-lost {
      0% { transform: scale(1); opacity: 1; }
      30% { transform: scale(1.3) rotate(-10deg); }
      60% { transform: scale(0.8) rotate(5deg); opacity: 0.5; }
      100% { transform: scale(1); opacity: 0.5; }
    }

    @keyframes bzm-heart-gain {
      0% { transform: scale(0); opacity: 0; }
      60% { transform: scale(1.3); opacity: 1; }
      100% { transform: scale(1); }
    }

    @media (prefers-reduced-motion: reduce) {
      .bzm-heart-display__heart {
        transition: none;
      }

      .bzm-heart-display__heart--last,
      .bzm-heart-display__heart--animate-lost,
      .bzm-heart-display__heart--animate-gain {
        animation: none;
      }
    }
  `,
})
/**
 * Displays a row of heart icons representing the player's remaining lives
 * in Survival mode.
 *
 * Filled hearts are shown in red for remaining lives, empty/grey hearts for
 * lost lives. The last remaining heart pulses continuously as a warning.
 * Supports animated heart loss (shake + crack) and heart gain (pop-in) effects.
 *
 * @selector bzm-heart-display
 *
 * @example
 * ```html
 * <bzm-heart-display
 *   [hearts]="2"
 *   [maxHearts]="3"
 *   [animate]="true"
 *   size="md"
 * />
 * ```
 */
export class BzmHeartDisplayComponent {
  /** Current number of hearts remaining. */
  readonly hearts = input.required<number>();

  /** Maximum number of hearts. @default 3 */
  readonly maxHearts = input<number>(3);

  /** Whether to animate heart loss/gain transitions. @default true */
  readonly animate = input<boolean>(true);

  /** Size variant affecting icon dimensions. @default 'md' */
  readonly size = input<HeartDisplaySize>('md');

  protected readonly iconSize = computed(() => SIZE_PX[this.size()]);

  protected readonly heartStates = computed(() => {
    const current = this.hearts();
    const max = this.maxHearts();
    const states: ('filled' | 'empty')[] = [];
    for (let i = 0; i < max; i++) {
      states.push(i < current ? 'filled' : 'empty');
    }
    return states;
  });

  protected heartClasses(state: 'filled' | 'empty', index: number): string {
    const classes = ['bzm-heart-display__heart'];
    if (state === 'filled') {
      classes.push('bzm-heart-display__heart--filled');
      if (this.hearts() === 1 && index === 0 && this.animate()) {
        classes.push('bzm-heart-display__heart--last');
      }
    } else {
      classes.push('bzm-heart-display__heart--empty');
    }
    return classes.join(' ');
  }
}
