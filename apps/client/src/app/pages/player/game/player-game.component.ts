import { Component, computed, effect, inject, signal } from '@angular/core';
import type { AnswerIndex } from '@bazam/shared-types';
import {
  BzmCountdownViewComponent,
  BzmProgressBarComponent,
  BzmQuestionHeaderComponent,
  BzmAnswerGridComponent,
  BzmAnswerFeedbackComponent,
  BzmScoreDisplayComponent,
  BzmWaitingStateComponent,
  BzmCardComponent,
  BzmPageTitleComponent,
} from '@bazam/ui';
import { GameStateService } from '../../../services/game-state.service';
import { WebSocketService } from '../../../services/websocket.service';
import { toAnswerGridItems } from '../../../utils/answer-grid.util';

const isAnswerIndex = (n: number): n is AnswerIndex => n >= 0 && n <= 3;

@Component({
  selector: 'app-player-game',
  imports: [
    BzmCountdownViewComponent,
    BzmProgressBarComponent,
    BzmQuestionHeaderComponent,
    BzmAnswerGridComponent,
    BzmAnswerFeedbackComponent,
    BzmScoreDisplayComponent,
    BzmWaitingStateComponent,
    BzmCardComponent,
    BzmPageTitleComponent,
  ],
  template: `
    <div class="player-game">
      @switch (gameState.gamePhase()) {
        @case ('countdown') {
          <bzm-countdown-view />
        }

        @case ('question') {
          @if (gameState.currentQuestion(); as q) {
            <div class="question-view">
              <bzm-progress-bar
                [current]="gameState.questionIndex()"
                [total]="gameState.totalQuestions()"
              />
              <bzm-question-header
                [questionText]="q.text"
                [timerDuration]="gameState.timeLimit()"
                [timerRunning]="true"
              />

              @if (!hasSubmitted() && !gameState.hasAnswered()) {
                <bzm-answer-grid
                  [answers]="answerGridItems()"
                  (answerSelected)="submitAnswer($event)"
                />
              } @else {
                @if (gameState.lastAnswerResult(); as result) {
                  <bzm-answer-feedback
                    [correct]="result.correct"
                    [score]="result.score"
                  />
                } @else {
                  <bzm-waiting-state message="Wachten op resultaat..." spinnerSize="sm" />
                }
              }
            </div>
          }
        }

        @case ('leaderboard') {
          <bzm-card>
            <div class="leaderboard-view">
              <bzm-page-title size="sm" color="var(--bzm-color-primary)">Tussenstand</bzm-page-title>
              <bzm-score-display
                [value]="gameState.playerScore() + ' pts'"
                label="Jouw score"
                size="lg"
              />
              <bzm-waiting-state message="Wachten op de host..." spinnerSize="sm" />
            </div>
          </bzm-card>
        }

        @default {
          <bzm-waiting-state message="Laden..." spinnerSize="sm" />
        }
      }
    </div>
  `,
  styles: `
    .player-game {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1.5rem;
      padding: 1rem;
      width: 100%;
      max-width: 600px;
    }

    .question-view {
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .leaderboard-view {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
    }
  `,
})
/**
 * Player game view that renders the active quiz experience.
 *
 * Displays different sub-views based on the current game phase:
 * - **countdown** -- Animated countdown before the first question.
 * - **question** -- Question text, timer, and interactive answer grid.
 *   After the player answers, shows correctness feedback and points earned.
 * - **leaderboard** -- The player's current score with a waiting indicator
 *   until the host advances to the next question.
 */
export class PlayerGameComponent {
  /** Injected game state for reading questions, scores, and phase transitions. */
  readonly gameState = inject(GameStateService);

  private readonly wsService = inject(WebSocketService);

  /**
   * Tracks which answer the player has tapped in the current question.
   * Reset to `null` when the question index changes.
   */
  readonly selectedAnswer = signal<number | null>(null);

  /** Whether an answer has been submitted for the current question (set immediately on tap). */
  readonly hasSubmitted = signal(false);

  constructor() {
    effect(() => {
      this.gameState.questionIndex();
      this.selectedAnswer.set(null);
      this.hasSubmitted.set(false);
    });
  }

  /** Memoized answer grid items with selection state, recalculated only when inputs change. */
  readonly answerGridItems = computed(() => {
    const q = this.gameState.currentQuestion();
    if (!q) return [];
    return toAnswerGridItems(q.answers, this.selectedAnswer());
  });

  /**
   * Submits the player's selected answer to the server.
   *
   * Guards against duplicate submissions and out-of-range indices.
   * Sends a `SUBMIT_ANSWER` message containing the question index
   * and the chosen answer.
   *
   * @param answerIndex - Zero-based index (0-3) of the selected answer.
   */
  readonly submitAnswer = (answerIndex: number): void => {
    if (this.hasSubmitted() || this.gameState.hasAnswered()) return;
    if (!isAnswerIndex(answerIndex)) return;
    this.hasSubmitted.set(true);
    this.selectedAnswer.set(answerIndex);
    this.wsService.send({
      type: 'SUBMIT_ANSWER',
      payload: {
        questionIndex: this.gameState.questionIndex(),
        answerIndex,
      },
    });
  };
}
