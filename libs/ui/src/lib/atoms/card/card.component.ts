import { Component, ChangeDetectionStrategy, input, computed } from '@angular/core';

/** Visual style variant for cards. */
export type CardVariant = 'default' | 'outlined' | 'elevated';

@Component({
  selector: 'bzm-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div [class]="cardClasses()" [style]="cardStyle()" [attr.role]="ariaLabel() ? 'region' : null" [attr.aria-label]="ariaLabel()">
      <ng-content />
    </div>
  `,
  styles: `
    :host {
      display: block;
      font-family: var(--bzm-font-family);
    }

    .bzm-card {
      background: var(--bzm-color-surface);
      border: 4px solid var(--bzm-color-border);
      border-width: var(--bzm-border-width-comic);
      border-radius: var(--bzm-radius-md);
      padding: var(--bzm-space-8);
      box-shadow: var(--bzm-shadow-card);
      transition:
        transform var(--bzm-transition-playful),
        box-shadow var(--bzm-transition-base);
    }

    .bzm-card--outlined {
      box-shadow: none;
    }

    .bzm-card--elevated {
      box-shadow: var(--bzm-shadow-lg);
    }

    .bzm-card--interactive {
      cursor: pointer;
    }

    .bzm-card--interactive:hover {
      transform: translateY(-3px) rotate(-0.5deg);
      box-shadow: var(--bzm-shadow-lg);
    }

    .bzm-card--interactive:active {
      transform: translateY(2px);
      box-shadow: var(--bzm-shadow-sm);
    }

    @media (prefers-reduced-motion: reduce) {
      .bzm-card {
        transition: none;
      }

      .bzm-card--interactive:hover {
        transform: none;
      }

      .bzm-card--interactive:active {
        transform: none;
      }
    }
  `,
})
/**
 * Displays a comic-styled content card with configurable visual variants, optional custom border color,
 * and interactive hover/press effects. Projects content via `ng-content`.
 *
 * Use the `interactive` flag for clickable cards that respond with lift-and-tilt on hover
 * and press-down on active. Respects `prefers-reduced-motion` by disabling transform animations.
 *
 * @selector bzm-card
 *
 * @example
 * ```html
 * <bzm-card variant="elevated" [interactive]="true" ariaLabel="Quiz details">
 *   <h3>Hoofdsteden Quiz</h3>
 * </bzm-card>
 * <bzm-card [borderColor]="categoryColor">...</bzm-card>
 * ```
 */
export class BzmCardComponent {
  /**
   * Visual style variant controlling box-shadow depth.
   * - `'default'` -- standard card shadow
   * - `'outlined'` -- no shadow, border only
   * - `'elevated'` -- larger shadow for emphasis
   * @default 'default'
   */
  readonly variant = input<CardVariant>('default');

  /**
   * Optional custom CSS border color, overriding the default border color from the theme.
   * @default undefined
   */
  readonly borderColor = input<string | undefined>(undefined);

  /**
   * Enables hover lift-and-tilt and active press-down transforms for clickable cards.
   * @default false
   */
  readonly interactive = input<boolean>(false);

  /**
   * Accessible label applied to the card's `role="region"` container.
   * @default undefined
   */
  readonly ariaLabel = input<string | undefined>(undefined);

  protected readonly cardClasses = computed(() => {
    const classes = ['bzm-card'];
    const v = this.variant();
    if (v !== 'default') {
      classes.push(`bzm-card--${v}`);
    }
    if (this.interactive()) {
      classes.push('bzm-card--interactive');
    }
    return classes.join(' ');
  });

  protected readonly cardStyle = computed(() => {
    const color = this.borderColor();
    return color ? `border-color: ${color}` : '';
  });
}
