import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { BzmCardComponent } from '../../atoms/card/card.component';
import { BzmMascotComponent } from '../../atoms/mascot/mascot.component';

@Component({
  selector: 'bzm-winner-card',
  standalone: true,
  imports: [BzmCardComponent, BzmMascotComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <bzm-card borderColor="var(--bzm-color-accent)" [ariaLabel]="'Winnaar: ' + name()">
      <div class="bzm-winner-card">
        <div class="bzm-winner-card__mascot">
          <bzm-mascot
            expression="excited"
            animate="bounce"
            badgeText="!"
            size="lg"
            bodyColor="var(--bzm-color-accent)"
          />
        </div>
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

    .bzm-winner-card__mascot {
      margin-bottom: var(--bzm-space-4);
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
/**
 * Displays a celebratory winner card featuring an excited bouncing mascot,
 * the winning player's name in bold comic-style text, and their final score.
 *
 * Typically shown on the results screen at the end of a quiz game. The card
 * uses an accent-colored border and the mascot's bounce animation to convey
 * excitement.
 *
 * @selector bzm-winner-card
 *
 * @example
 * ```html
 * <bzm-winner-card
 *   name="Bart"
 *   [score]="4200"
 *   label="Winnaar"
 *   scoreLabel="punten"
 * />
 * ```
 */
export class BzmWinnerCardComponent {
  /** Display name of the winning player. */
  readonly name = input.required<string>();

  /** Final score achieved by the winner. */
  readonly score = input.required<number>();

  /**
   * Label text shown above the player name (e.g., "Winnaar", "Winner").
   * @default 'Winnaar'
   */
  readonly label = input<string>('Winnaar');

  /**
   * Unit label displayed after the score value (e.g., "punten", "points").
   * @default 'punten'
   */
  readonly scoreLabel = input<string>('punten');
}
