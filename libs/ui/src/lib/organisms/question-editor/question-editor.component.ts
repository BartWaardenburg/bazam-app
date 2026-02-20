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

type ScalarField = Exclude<keyof QuestionEditorData, 'answers'>;

const ANSWER_COLORS: Record<number, { bg: string; border: string; badge: string; badgeText: string }> = {
  0: { bg: 'var(--bzm-color-answer-a)', border: 'var(--bzm-color-answer-a)', badge: 'var(--bzm-color-answer-a)', badgeText: 'var(--bzm-white)' },
  1: { bg: 'var(--bzm-color-answer-b)', border: 'var(--bzm-color-answer-b)', badge: 'var(--bzm-color-answer-b)', badgeText: 'var(--bzm-color-text)' },
  2: { bg: 'var(--bzm-color-answer-c)', border: 'var(--bzm-color-answer-c)', badge: 'var(--bzm-color-answer-c)', badgeText: 'var(--bzm-white)' },
  3: { bg: 'var(--bzm-color-answer-d)', border: 'var(--bzm-color-answer-d)', badge: 'var(--bzm-color-answer-d)', badgeText: 'var(--bzm-white)' },
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

      <div class="bzm-qe__question-block">
        <textarea
          class="bzm-qe__question-input"
          [ngModel]="question().text"
          (ngModelChange)="emitChange('text', $event)"
          placeholder="Typ hier je vraag..."
          rows="2"
          aria-label="Vraagtekst"
        ></textarea>
      </div>

      <div class="bzm-qe__answers-label">Antwoorden <span class="bzm-qe__answers-hint">(klik op het juiste antwoord)</span></div>

      <div class="bzm-qe__answers">
        @for (answer of question().answers; track $index; let ai = $index) {
          <label
            class="bzm-qe__answer"
            [class.bzm-qe__answer--selected]="question().correctIndex === ai"
            [style.--answer-color]="answerColor(ai).border"
          >
            <input
              type="radio"
              class="bzm-qe__radio"
              [name]="'correct-' + questionNumber()"
              [checked]="question().correctIndex === ai"
              (change)="emitChange('correctIndex', ai)"
              [attr.aria-label]="'Markeer antwoord ' + answerLabel(ai) + ' als correct'"
            />
            <span
              class="bzm-qe__badge"
              [style.background]="answerColor(ai).badge"
              [style.color]="answerColor(ai).badgeText"
            >{{ answerLabel(ai) }}</span>
            <input
              type="text"
              class="bzm-qe__answer-input"
              [ngModel]="answer"
              (ngModelChange)="emitAnswerChange(ai, $event)"
              [placeholder]="'Antwoord ' + answerLabel(ai) + '...'"
            />
            @if (question().correctIndex === ai) {
              <span class="bzm-qe__check" aria-hidden="true">&#10003;</span>
            }
          </label>
        }
      </div>

      <div class="bzm-qe__timer">
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
    </div>
  `,
  styles: `
    :host {
      display: block;
    }

    .bzm-qe {
      display: flex;
      flex-direction: column;
      gap: var(--bzm-space-5);
    }

    /* ── Header ── */
    .bzm-qe__header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .bzm-qe__number {
      font-family: var(--bzm-font-heading);
      font-size: clamp(1.3rem, 3vw, 1.8rem);
      font-weight: 400;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      color: var(--bzm-white);
      background: var(--bzm-color-answer-a);
      padding: var(--bzm-space-2) var(--bzm-space-5);
      border-radius: var(--bzm-radius-md);
      border: 3px solid var(--bzm-black);
      box-shadow: 3px 3px 0 var(--bzm-black);
    }

    /* ── Question input ── */
    .bzm-qe__question-block {
      width: 100%;
    }

    .bzm-qe__question-input {
      width: 100%;
      box-sizing: border-box;
      font-family: var(--bzm-font-family);
      font-size: clamp(1.1rem, 2.5vw, 1.4rem);
      font-weight: var(--bzm-font-weight-bold);
      padding: var(--bzm-space-5) var(--bzm-space-5);
      border: 4px solid var(--bzm-color-border);
      border-width: 3px 4px 5px 3px;
      border-radius: var(--bzm-radius-md);
      background: var(--bzm-color-surface);
      color: var(--bzm-color-text);
      outline: none;
      resize: vertical;
      min-height: 80px;
      line-height: 1.4;
      transition:
        border-color var(--bzm-transition-base),
        box-shadow var(--bzm-transition-base);
    }

    .bzm-qe__question-input:focus {
      border-color: var(--bzm-color-primary);
      box-shadow: var(--bzm-shadow-card);
    }

    .bzm-qe__question-input::placeholder {
      color: var(--bzm-color-text-muted);
      font-weight: var(--bzm-font-weight-medium);
    }

    /* ── Answers ── */
    .bzm-qe__answers-label {
      font-family: var(--bzm-font-family);
      font-size: var(--bzm-font-size-sm);
      font-weight: var(--bzm-font-weight-bold);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--bzm-color-text-secondary);
    }

    .bzm-qe__answers-hint {
      text-transform: none;
      font-weight: var(--bzm-font-weight-medium);
      color: var(--bzm-color-text-muted);
      font-size: var(--bzm-font-size-xs);
      letter-spacing: 0;
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
      gap: var(--bzm-space-3);
      padding: var(--bzm-space-4);
      border-radius: var(--bzm-radius-md);
      border: 3px solid var(--answer-color);
      border-width: 3px 4px 4px 3px;
      background: var(--bzm-color-surface);
      cursor: pointer;
      position: relative;
      transition:
        transform var(--bzm-transition-playful),
        box-shadow var(--bzm-transition-base),
        background var(--bzm-transition-base);
    }

    .bzm-qe__answer:hover {
      transform: translateY(-2px);
      box-shadow: var(--bzm-shadow-sm);
    }

    .bzm-qe__answer--selected {
      background: color-mix(in srgb, var(--answer-color) 12%, var(--bzm-color-surface));
      box-shadow: var(--bzm-shadow-card);
      border-width: 4px;
    }

    .bzm-qe__radio {
      position: absolute;
      width: 1px;
      height: 1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      white-space: nowrap;
    }

    .bzm-qe__radio:focus-visible + .bzm-qe__badge {
      outline: 3px solid var(--bzm-cyan-500);
      outline-offset: 2px;
    }

    .bzm-qe__badge {
      width: 36px;
      height: 36px;
      border-radius: var(--bzm-radius-md);
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: var(--bzm-font-heading);
      font-weight: 400;
      font-size: clamp(1rem, 2vw, 1.2rem);
      flex-shrink: 0;
      border: 3px solid var(--bzm-black);
      box-shadow: 2px 2px 0 var(--bzm-black);
    }

    .bzm-qe__answer-input {
      flex: 1;
      border: none;
      background: transparent;
      padding: var(--bzm-space-2) 0;
      font-family: var(--bzm-font-family);
      font-weight: var(--bzm-font-weight-semibold);
      font-size: clamp(0.95rem, 2vw, 1.1rem);
      color: var(--bzm-color-text);
      outline: none;
      min-width: 0;
    }

    .bzm-qe__answer-input::placeholder {
      color: var(--bzm-color-text-muted);
      font-weight: var(--bzm-font-weight-regular);
    }

    .bzm-qe__check {
      width: 28px;
      height: 28px;
      border-radius: var(--bzm-radius-full);
      background: var(--bzm-color-success);
      color: var(--bzm-white);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.9rem;
      font-weight: var(--bzm-font-weight-bold);
      flex-shrink: 0;
      border: 2px solid var(--bzm-black);
    }

    /* ── Timer ── */
    .bzm-qe__timer {
      padding-top: var(--bzm-space-2);
      border-top: 2px dashed var(--bzm-gray-200);
    }

    @media (prefers-reduced-motion: reduce) {
      .bzm-qe__answer {
        transition: none;
      }
      .bzm-qe__answer:hover {
        transform: none;
      }
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

  protected answerColor(index: number): { bg: string; border: string; badge: string; badgeText: string } {
    return ANSWER_COLORS[index];
  }

  protected emitChange(field: ScalarField, value: string | number): void {
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
