import { Component, ChangeDetectionStrategy, input, computed } from '@angular/core';

@Component({
  selector: 'bzm-answer-feedback',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div [class]="feedbackClasses()" role="status" aria-live="polite">
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
      text-align: center;
      padding: var(--bzm-space-12) var(--bzm-space-8);
      background: var(--bzm-color-surface);
      border-radius: var(--bzm-radius-md);
      border: 4px solid var(--bzm-color-border);
      border-width: 3px 4px 5px 3px;
      box-shadow: var(--bzm-shadow-card);
    }

    .bzm-answer-feedback__title {
      margin: 0;
      font-size: var(--bzm-font-size-3xl);
      font-weight: var(--bzm-font-weight-black);
      text-shadow: 2px 2px 0 var(--bzm-black);
      -webkit-text-stroke: 1px var(--bzm-black);
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
export class BzmAnswerFeedbackComponent {
  readonly correct = input.required<boolean>();
  readonly score = input<number | undefined>(undefined);
  readonly correctTitle = input<string>('Goed zo!');
  readonly incorrectTitle = input<string>('Helaas!');
  readonly incorrectMessage = input<string>('Volgende keer beter!');

  protected readonly feedbackClasses = computed(
    () => `bzm-answer-feedback bzm-answer-feedback--${this.correct() ? 'correct' : 'incorrect'}`
  );
}
