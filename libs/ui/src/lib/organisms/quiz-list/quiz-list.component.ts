import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { BzmQuizCardComponent } from '../../molecules/quiz-card/quiz-card.component';

export interface QuizEntry {
  readonly title: string;
  readonly subtitle: string;
  readonly questionCount: number;
  readonly imageUrl?: string;
  readonly progress?: number;
  readonly color?: string;
}

@Component({
  selector: 'bzm-quiz-list',
  standalone: true,
  imports: [BzmQuizCardComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="quiz-list">
      <div class="quiz-list-header">
        <span class="quiz-list-title">Latest Quiz</span>
        <button
          class="quiz-list-see-all"
          type="button"
          (click)="quizSelect.emit(-1)"
        >
          See All
        </button>
      </div>

      <div class="quiz-list-items" role="list" aria-label="Quiz list">
        @for (quiz of quizzes(); track quiz.title; let i = $index) {
          <bzm-quiz-card
            [title]="quiz.title"
            [subtitle]="quiz.subtitle"
            [questionCount]="quiz.questionCount"
            [imageUrl]="quiz.imageUrl"
            [progress]="quiz.progress"
            [color]="quiz.color"
            (cardClick)="quizSelect.emit(i)"
          />
        }
      </div>
    </div>
  `,
  styles: `
    :host {
      display: block;
      font-family: var(--bzm-font-family);
    }

    .quiz-list {
      display: flex;
      flex-direction: column;
      gap: var(--bzm-space-4);
    }

    .quiz-list-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .quiz-list-title {
      font-size: var(--bzm-font-size-base);
      font-weight: var(--bzm-font-weight-extrabold);
      color: var(--bzm-color-text);
    }

    .quiz-list-see-all {
      border: none;
      background: transparent;
      font-family: var(--bzm-font-family);
      font-size: var(--bzm-font-size-sm);
      font-weight: var(--bzm-font-weight-bold);
      color: var(--bzm-color-primary);
      cursor: pointer;
      padding: var(--bzm-space-1) var(--bzm-space-2);
      border-radius: var(--bzm-radius-sm);
      transition:
        background-color var(--bzm-transition-base),
        transform var(--bzm-transition-playful);
    }

    .quiz-list-see-all:hover {
      background-color: var(--bzm-color-primary-surface);
      transform: translateX(2px);
    }

    .quiz-list-items {
      display: flex;
      flex-direction: column;
      gap: var(--bzm-space-3);
    }
  `,
})
export class BzmQuizListComponent {
  readonly quizzes = input.required<QuizEntry[]>();

  readonly quizSelect = output<number>();
}
