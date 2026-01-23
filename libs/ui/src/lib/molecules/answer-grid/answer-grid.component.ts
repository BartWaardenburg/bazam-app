import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { BzmAnswerOptionComponent, AnswerLetter } from '../answer-option/answer-option.component';

export interface AnswerGridItem {
  readonly text: string;
  readonly selected?: boolean;
  readonly correct?: boolean | null;
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
export class BzmAnswerGridComponent {
  readonly answers = input.required<AnswerGridItem[]>();
  readonly disabled = input<boolean>(false);

  readonly answerSelected = output<number>();

  protected readonly letters = LETTERS;
}
