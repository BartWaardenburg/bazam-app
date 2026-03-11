import { Component, ChangeDetectionStrategy, input, computed } from '@angular/core';

/** Size preset for the score display. */
export type ScoreDisplaySize = 'md' | 'lg';

@Component({
  selector: 'bzm-score-display',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div [class]="displayClasses()" role="status" [attr.aria-label]="label() + ': ' + value()">
      <span class="bzm-score-display__label">{{ label() }}</span>
      <span class="bzm-score-display__value" [style]="valueStyle()">{{ value() }}</span>
      @if (suffix()) {
        <span class="bzm-score-display__suffix">{{ suffix() }}</span>
      }
    </div>
  `,
  styles: `
    :host {
      display: block;
      font-family: var(--bzm-font-family);
    }

    .bzm-score-display {
      text-align: center;
    }

    .bzm-score-display__label {
      display: block;
      font-size: var(--bzm-font-size-sm);
      font-weight: var(--bzm-font-weight-semibold);
      color: var(--bzm-color-text-muted);
      text-transform: uppercase;
      letter-spacing: 0.1em;
    }

    .bzm-score-display__value {
      display: block;
      font-weight: var(--bzm-font-weight-black);
      -webkit-text-stroke: 1.5px var(--bzm-black);
      paint-order: stroke fill;
    }

    .size-md .bzm-score-display__value {
      font-size: var(--bzm-font-size-3xl);
      text-shadow: 2px 2px 0 var(--bzm-black);
      margin: var(--bzm-space-1) 0;
    }

    .size-lg .bzm-score-display__value {
      font-size: var(--bzm-font-size-4xl);
      text-shadow: 3px 3px 0 var(--bzm-black);
      -webkit-text-stroke: 2px var(--bzm-black);
      margin: var(--bzm-space-2) 0;
    }

    .bzm-score-display__suffix {
      display: block;
      font-size: var(--bzm-font-size-sm);
      font-weight: var(--bzm-font-weight-bold);
      color: var(--bzm-color-text-secondary);
    }
  `,
})
/**
 * Displays a prominent score or rank value with a label, bold comic-style text stroke, and optional suffix.
 *
 * Renders a centered block with an uppercase label, a large styled value, and
 * an optional suffix line. Supports two size presets and a customizable value color.
 * Announces the value to screen readers via `role="status"`.
 *
 * @selector bzm-score-display
 *
 * @example
 * ```html
 * <bzm-score-display [value]="1500" label="Score" suffix="punten" size="lg" />
 * <bzm-score-display [value]="'#3'" label="Rank" />
 * ```
 */
export class BzmScoreDisplayComponent {
  /** The score or rank value to display. Accepts both numbers and formatted strings. */
  readonly value = input.required<string | number>();

  /** Uppercase label rendered above the value. @default 'Score' */
  readonly label = input<string>('Score');

  /** Optional text displayed below the value (e.g., "punten" or "correct"). @default undefined */
  readonly suffix = input<string | undefined>(undefined);

  /** Size preset controlling the font size and text shadow of the value. @default 'md' */
  readonly size = input<ScoreDisplaySize>('md');

  /** CSS color applied to the value text. @default 'var(--bzm-color-accent)' */
  readonly color = input<string>('var(--bzm-color-accent)');

  protected readonly displayClasses = computed(
    () => `bzm-score-display size-${this.size()}`
  );

  protected readonly valueStyle = computed(
    () => `color: ${this.color()}`
  );
}
