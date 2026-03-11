import { Component, effect, inject, signal } from '@angular/core';
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
  type AnswerGridItem,
} from '@bazam/ui';
import { GameStateService } from '../../../services/game-state.service';
import { WebSocketService } from '../../../services/websocket.service';

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

              @if (!gameState.hasAnswered()) {
                <bzm-answer-grid
                  [answers]="toAnswerGridItems(q.answers)"
                  (answerSelected)="submitAnswer($event)"
                />
              } @else {
                @if (gameState.lastAnswerResult(); as result) {
                  <bzm-answer-feedback
                    [correct]="result.correct"
                    [score]="result.score"
                  />
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
export class PlayerGameComponent {
  readonly gameState = inject(GameStateService);
  private readonly wsService = inject(WebSocketService);
  readonly selectedAnswer = signal<number | null>(null);

  constructor() {
    effect(() => {
      this.gameState.questionIndex();
      this.selectedAnswer.set(null);
    });
  }

  toAnswerGridItems(answers: string[]): AnswerGridItem[] {
    return answers.map((text, index) => ({
      text,
      selected: this.selectedAnswer() === index,
    }));
  }

  submitAnswer(answerIndex: number): void {
    if (this.gameState.hasAnswered()) return;
    if (answerIndex < 0 || answerIndex > 3) return;
    this.selectedAnswer.set(answerIndex);
    this.wsService.send({
      type: 'SUBMIT_ANSWER',
      payload: {
        questionIndex: this.gameState.questionIndex(),
        answerIndex: answerIndex as AnswerIndex,
        timestamp: Date.now(),
      },
    });
  }
}
