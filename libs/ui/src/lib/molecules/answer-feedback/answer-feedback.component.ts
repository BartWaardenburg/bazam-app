import { Component, ChangeDetectionStrategy, input, computed } from '@angular/core';
import { BzmMascotComponent } from '../../atoms/mascot/mascot.component';

@Component({
  selector: 'bzm-answer-feedback',
  standalone: true,
  imports: [BzmMascotComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div [class]="feedbackClasses()" role="status" aria-live="polite">
      <bzm-mascot
        class="bzm-answer-feedback__mascot"
        [expression]="correct() ? 'happy' : 'sad'"
        [animate]="correct() ? 'bounce' : 'shake'"
        [badgeText]="correct() ? '!' : 'X'"
        [bodyColor]="correct() ? 'var(--bzm-color-success)' : 'var(--bzm-color-error)'"
        size="lg"
      />
      <h3 class="bzm-answer-feedback__title">{{ correct() ? correctTitle() : incorrectTitle() }}</h3>
      @if (correct() && score() !== undefined) {
        <p class="bzm-answer-feedback__score">+{{ score() }} punten</p>
      }
      @if (!correct()) {
        <p class="bzm-answer-feedback__message">{{ incorrectMessage() }}</p>
      }
    </div>
  `,
  styles: `
    :host {
      display: block;
      font-family: var(--bzm-font-family);
    }

    .bzm-answer-feedback {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      padding: var(--bzm-space-12) var(--bzm-space-8);
      background: var(--bzm-color-surface);
      border-radius: var(--bzm-radius-md);
      border: 4px solid var(--bzm-color-border);
      border-width: 3px 4px 5px 3px;
      box-shadow: var(--bzm-shadow-card);
    }

    .bzm-answer-feedback__mascot {
      margin-bottom: var(--bzm-space-4);
    }

    .bzm-answer-feedback__title {
      margin: 0;
      font-size: clamp(3rem, 8vw, 5rem);
      font-weight: var(--bzm-font-weight-black);
      text-shadow: 3px 3px 0 var(--bzm-black);
      -webkit-text-stroke: 2px var(--bzm-black);
      paint-order: stroke fill;
    }

    .bzm-answer-feedback--correct .bzm-answer-feedback__title {
      color: var(--bzm-color-success);
    }

    .bzm-answer-feedback--incorrect .bzm-answer-feedback__title {
      color: var(--bzm-color-error);
    }

    .bzm-answer-feedback__score {
      margin: var(--bzm-space-2) 0 0;
      font-weight: var(--bzm-font-weight-bold);
      font-size: var(--bzm-font-size-2xl);
      color: var(--bzm-color-accent-dark);
    }

    .bzm-answer-feedback__message {
      margin: var(--bzm-space-2) 0 0;
      font-weight: var(--bzm-font-weight-semibold);
      font-size: var(--bzm-font-size-base);
      color: var(--bzm-color-text-secondary);
    }
  `,
})
/**
 * Displays post-answer feedback with an animated mascot reaction, correctness title, and points earned.
 *
 * Shows a happy bouncing mascot with earned points for correct answers,
 * or a sad shaking mascot with an encouragement message for incorrect answers.
 * Uses `aria-live="polite"` to announce feedback to screen readers.
 *
 * @selector bzm-answer-feedback
 *
 * @example
 * ```html
 * <bzm-answer-feedback [correct]="true" [score]="150" />
 * <bzm-answer-feedback [correct]="false" incorrectMessage="Probeer het opnieuw!" />
 * ```
 */
export class BzmAnswerFeedbackComponent {
  /** Whether the player's answer was correct. Determines mascot expression, colors, and displayed text. */
  readonly correct = input.required<boolean>();

  /** Points earned for a correct answer. Displayed as "+{score} punten" when the answer is correct. @default undefined */
  readonly score = input<number | undefined>(undefined);

  /** Title text shown when the answer is correct. @default 'Goed zo!' */
  readonly correctTitle = input<string>('Goed zo!');

  /** Title text shown when the answer is incorrect. @default 'Helaas!' */
  readonly incorrectTitle = input<string>('Helaas!');

  /** Encouragement message shown below the title for incorrect answers. @default 'Volgende keer beter!' */
  readonly incorrectMessage = input<string>('Volgende keer beter!');

  protected readonly feedbackClasses = computed(
    () => `bzm-answer-feedback bzm-answer-feedback--${this.correct() ? 'correct' : 'incorrect'}`
  );
}
