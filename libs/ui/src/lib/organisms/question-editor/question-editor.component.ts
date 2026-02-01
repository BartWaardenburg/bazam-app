import { Component, ChangeDetectionStrategy, input, output, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BzmSliderComponent } from '../../atoms/slider/slider.component';
import { BzmButtonComponent } from '../../atoms/button/button.component';

export interface QuestionEditorData {
  readonly text: string;
  readonly answers: [string, string, string, string];
  readonly correctIndex: number;
  readonly timeLimitSeconds: number;
}

const ANSWER_LABELS = ['A', 'B', 'C', 'D'] as const;

const ANSWER_BG: Record<number, string> = {
  0: 'var(--bzm-cyan-100)',
  1: 'var(--bzm-yellow-100)',
  2: 'var(--bzm-red-100)',
  3: 'var(--bzm-green-100)',
};

const ANSWER_BORDER: Record<number, string> = {
  0: 'var(--bzm-color-answer-a)',
  1: 'var(--bzm-color-answer-b)',
  2: 'var(--bzm-color-answer-c)',
  3: 'var(--bzm-color-answer-d)',
};

const ANSWER_BADGE_BG: Record<number, string> = {
  0: 'var(--bzm-color-answer-a)',
  1: 'var(--bzm-color-answer-b)',
  2: 'var(--bzm-color-answer-c)',
  3: 'var(--bzm-color-answer-d)',
};

@Component({
  selector: 'bzm-question-editor',
  standalone: true,
  imports: [FormsModule, BzmSliderComponent, BzmButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="bzm-qe">
      <div class="bzm-qe__header">
        <span class="bzm-qe__number">Vraag {{ questionNumber() }}</span>
        @if (removable()) {
          <bzm-button variant="ghost" size="sm" (click)="removed.emit()" aria-label="Vraag verwijderen">
            &times;
          </bzm-button>
        }
      </div>

      <label class="bzm-qe__label">
        Vraag
        <input
          type="text"
          class="bzm-qe__input"
          [ngModel]="question().text"
          (ngModelChange)="emitChange('text', $event)"
          placeholder="Stel je vraag..."
        />
      </label>

      <div class="bzm-qe__answers">
        @for (answer of question().answers; track $index; let ai = $index) {
          <label
            class="bzm-qe__answer"
            [class.bzm-qe__answer--selected]="question().correctIndex === ai"
            [style.background]="answerBg(ai)"
            [style.border-color]="answerBorder(ai)"
          >
            <input
              type="radio"
              class="bzm-qe__radio"
              [name]="'correct-' + questionNumber()"
              [checked]="question().correctIndex === ai"
              (change)="emitChange('correctIndex', ai)"
            />
            <span
              class="bzm-qe__badge"
              [style.background]="answerBadgeBg(ai)"
              [style.color]="ai === 1 || ai === 3 ? 'var(--bzm-color-text)' : 'var(--bzm-white)'"
            >{{ answerLabel(ai) }}</span>
            <input
              type="text"
              class="bzm-qe__answer-input"
              [ngModel]="answer"
              (ngModelChange)="emitAnswerChange(ai, $event)"
              [placeholder]="'Antwoord ' + answerLabel(ai)"
            />
          </label>
        }
      </div>

      <bzm-slider
        label="Tijdslimiet"
        suffix="s"
        [min]="5"
        [max]="60"
        [step]="5"
        [value]="question().timeLimitSeconds"
        (valueChange)="emitChange('timeLimitSeconds', $event)"
      />
    </div>
  `,
  styles: `
    :host {
      display: block;
      font-family: var(--bzm-font-family);
    }

    .bzm-qe {
      display: flex;
      flex-direction: column;
      gap: var(--bzm-space-4);
    }

    .bzm-qe__header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .bzm-qe__number {
      font-family: var(--bzm-font-family);
      font-size: var(--bzm-font-size-lg);
      font-weight: var(--bzm-font-weight-extrabold);
      letter-spacing: 0.05em;
      color: var(--bzm-white);
      background: var(--bzm-color-answer-a);
      padding: var(--bzm-space-1) var(--bzm-space-4);
      border-radius: var(--bzm-radius-md);
      border: 2px solid var(--bzm-black);
    }

    .bzm-qe__label {
      display: flex;
      flex-direction: column;
      gap: var(--bzm-space-1);
      font-size: var(--bzm-font-size-sm);
      font-weight: var(--bzm-font-weight-semibold);
      color: var(--bzm-color-text-muted);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .bzm-qe__input {
      width: 100%;
      box-sizing: border-box;
      font-family: var(--bzm-font-family);
      font-size: var(--bzm-font-size-base);
      font-weight: var(--bzm-font-weight-semibold);
      padding: var(--bzm-space-3) var(--bzm-space-4);
      border: 3px solid var(--bzm-color-border);
      border-radius: var(--bzm-radius-md);
      background: var(--bzm-color-surface);
      color: var(--bzm-color-text);
      outline: none;
      transition: border-color var(--bzm-transition-base);
    }

    .bzm-qe__input:focus {
      border-color: var(--bzm-color-primary);
    }

    .bzm-qe__answers {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: var(--bzm-space-3);
    }

    @media (max-width: 480px) {
      .bzm-qe__answers { grid-template-columns: 1fr; }
    }

    .bzm-qe__answer {
      display: flex;
      flex-direction: row;
      align-items: center;
      gap: var(--bzm-space-2);
      padding: var(--bzm-space-3);
      border-radius: var(--bzm-radius-sm);
      border: 3px solid transparent;
      transition:
        border-color var(--bzm-transition-base),
        box-shadow var(--bzm-transition-base);
      cursor: pointer;
    }

    .bzm-qe__answer--selected {
      border-width: 3px;
      box-shadow: var(--bzm-shadow-sm);
    }

    .bzm-qe__radio {
      display: none;
    }

    .bzm-qe__badge {
      width: 30px;
      height: 30px;
      border-radius: var(--bzm-radius-md);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: var(--bzm-font-weight-bold);
      font-size: var(--bzm-font-size-sm);
      flex-shrink: 0;
      border: 2px solid var(--bzm-black);
    }

    .bzm-qe__answer-input {
      flex: 1;
      border: none;
      background: transparent;
      padding: var(--bzm-space-2);
      font-family: var(--bzm-font-family);
      font-weight: var(--bzm-font-weight-semibold);
      font-size: var(--bzm-font-size-sm);
      color: var(--bzm-color-text);
      outline: none;
      min-width: 0;
    }

    .bzm-qe__answer-input::placeholder {
      color: var(--bzm-color-text-muted);
    }
  `,
})
export class BzmQuestionEditorComponent {
  readonly question = input.required<QuestionEditorData>();
  readonly questionNumber = input<number>(1);
  readonly removable = input<boolean>(true);

  readonly questionChange = output<QuestionEditorData>();
  readonly removed = output<void>();

  protected answerLabel(index: number): string {
    return ANSWER_LABELS[index];
  }

  protected answerBg(index: number): string {
    return ANSWER_BG[index];
  }

  protected answerBorder(index: number): string {
    return ANSWER_BORDER[index];
  }

  protected answerBadgeBg(index: number): string {
    return ANSWER_BADGE_BG[index];
  }

  protected emitChange(field: string, value: string | number): void {
    const q = this.question();
    this.questionChange.emit({ ...q, [field]: value });
  }

  protected emitAnswerChange(index: number, value: string): void {
    const q = this.question();
    const answers = [...q.answers] as [string, string, string, string];
    answers[index] = value;
    this.questionChange.emit({ ...q, answers });
  }
}
