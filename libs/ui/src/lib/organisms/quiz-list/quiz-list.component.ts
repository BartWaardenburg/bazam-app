import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { BzmQuizCardComponent } from '../../molecules/quiz-card/quiz-card.component';

/** Data shape for a single quiz entry in the quiz list. */
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
/**
 * Renders a vertical list of quiz cards with a "Latest Quiz" header and a
 * "See All" action button.
 *
 * Each card displays the quiz title, subtitle, question count, and optional
 * progress. Clicking a card emits its index; clicking "See All" emits `-1`.
 *
 * @selector bzm-quiz-list
 *
 * @example
 * ```html
 * <bzm-quiz-list
 *   [quizzes]="latestQuizzes"
 *   (quizSelect)="onQuizSelect($event)"
 * />
 * ```
 */
export class BzmQuizListComponent {
  /** Array of quiz entries to render as cards. */
  readonly quizzes = input.required<QuizEntry[]>();

  /**
   * Emits the index of the selected quiz card, or `-1` when the
   * "See All" button is clicked.
   */
  readonly quizSelect = output<number>();
}
