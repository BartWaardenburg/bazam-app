import { Component, ChangeDetectionStrategy, input, computed } from '@angular/core';

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
export class BzmScoreDisplayComponent {
  readonly value = input.required<string | number>();
  readonly label = input<string>('Score');
  readonly suffix = input<string | undefined>(undefined);
  readonly size = input<ScoreDisplaySize>('md');
  readonly color = input<string>('var(--bzm-color-accent)');

  protected readonly displayClasses = computed(
    () => `bzm-score-display size-${this.size()}`
  );

  protected readonly valueStyle = computed(
    () => `color: ${this.color()}`
  );
}
