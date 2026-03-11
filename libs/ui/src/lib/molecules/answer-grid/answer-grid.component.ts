import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { BzmAnswerOptionComponent, AnswerLetter } from '../answer-option/answer-option.component';

/** Data shape for a single answer entry in the answer grid. */
export interface AnswerGridItem {
  /** The answer text displayed to the player. */
  readonly text: string;
  /** Whether this answer is currently selected by the player. */
  readonly selected?: boolean;
  /** Correctness state: `true` for correct, `false` for incorrect, `null`/`undefined` for unrevealed. */
  readonly correct?: boolean | null;
  /** Whether this specific answer option is disabled (overrides the grid-level `disabled` input). */
  readonly disabled?: boolean;
}

const LETTERS: AnswerLetter[] = ['A', 'B', 'C', 'D'];

@Component({
  selector: 'bzm-answer-grid',
  standalone: true,
  imports: [BzmAnswerOptionComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="bzm-answer-grid" role="group" aria-label="Antwoorden">
      @for (answer of answers(); track $index) {
        <bzm-answer-option
          [letter]="letters[$index]"
          [text]="answer.text"
          [selected]="answer.selected ?? false"
          [correct]="answer.correct ?? null"
          [disabled]="answer.disabled ?? disabled()"
          (selected)="answerSelected.emit($index)"
        />
      }
    </div>
  `,
  styles: `
    :host {
      display: block;
    }

    .bzm-answer-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: var(--bzm-space-3);
    }

    @media (max-width: 480px) {
      .bzm-answer-grid {
        grid-template-columns: 1fr;
      }
    }
  `,
})
/**
 * Renders a 2x2 grid of answer options with color-coded letters (A-D) and selection/correctness states.
 *
 * Arranges up to four `BzmAnswerOption` components in a responsive grid that
 * collapses to a single column on small screens. Each answer automatically receives
 * its letter label based on array position.
 *
 * @selector bzm-answer-grid
 *
 * @example
 * ```html
 * <bzm-answer-grid
 *   [answers]="[
 *     { text: 'Amsterdam', selected: true },
 *     { text: 'Rotterdam' },
 *     { text: 'Den Haag', correct: true },
 *     { text: 'Utrecht', correct: false }
 *   ]"
 *   (answerSelected)="onSelect($event)"
 * />
 * ```
 */
export class BzmAnswerGridComponent {
  /** Array of answer items to render. Each item maps to an answer option (A-D) by index. */
  readonly answers = input.required<AnswerGridItem[]>();

  /** Disables all answer options in the grid, preventing selection. @default false */
  readonly disabled = input<boolean>(false);

  /** Emits the zero-based index of the selected answer when a player clicks an option. */
  readonly answerSelected = output<number>();

  protected readonly letters = LETTERS;
}
