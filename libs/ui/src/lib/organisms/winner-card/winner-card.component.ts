import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { BzmCardComponent } from '../../atoms/card/card.component';

@Component({
  selector: 'bzm-winner-card',
  standalone: true,
  imports: [BzmCardComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <bzm-card borderColor="var(--bzm-color-accent)" [ariaLabel]="'Winnaar: ' + name()">
      <div class="bzm-winner-card">
        <p class="bzm-winner-card__label">{{ label() }}</p>
        <p class="bzm-winner-card__name">{{ name() }}</p>
        <p class="bzm-winner-card__score">{{ score() }} {{ scoreLabel() }}</p>
      </div>
    </bzm-card>
  `,
  styles: `
    :host {
      display: block;
      font-family: var(--bzm-font-family);
    }

    .bzm-winner-card {
      text-align: center;
    }

    .bzm-winner-card__label {
      margin: 0;
      font-size: var(--bzm-font-size-sm);
      font-weight: var(--bzm-font-weight-bold);
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: var(--bzm-color-text-muted);
    }

    .bzm-winner-card__name {
      margin: var(--bzm-space-2) 0 0;
      font-family: var(--bzm-font-family);
      font-size: clamp(2.5rem, 10vw, 4rem);
      font-weight: var(--bzm-font-weight-black);
      color: var(--bzm-color-primary);
      text-shadow: 3px 3px 0 var(--bzm-black);
      -webkit-text-stroke: 1.5px var(--bzm-black);
      paint-order: stroke fill;
      line-height: var(--bzm-line-height-tight);
      letter-spacing: 0.04em;
    }

    .bzm-winner-card__score {
      margin: var(--bzm-space-1) 0 0;
      font-size: var(--bzm-font-size-lg);
      font-weight: var(--bzm-font-weight-bold);
      color: var(--bzm-color-accent-dark);
    }
  `,
})
export class BzmWinnerCardComponent {
  readonly name = input.required<string>();
  readonly score = input.required<number>();
  readonly label = input<string>('Winnaar');
  readonly scoreLabel = input<string>('punten');
}
