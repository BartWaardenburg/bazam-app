import { Component, inject } from '@angular/core';
import { GameStateService } from '../../../services/game-state.service';
import { WebSocketService } from '../../../services/websocket.service';
import {
  BzmButtonComponent,
  BzmProgressBarComponent,
  BzmCountdownViewComponent,
  BzmQuestionHeaderComponent,
  BzmAnswerGridComponent,
  BzmCardComponent,
  BzmLeaderboardComponent,
  BzmPageTitleComponent,
  type AnswerGridItem,
} from '@bazam/ui';

@Component({
  selector: 'app-host-game',
  imports: [
    BzmButtonComponent,
    BzmProgressBarComponent,
    BzmCountdownViewComponent,
    BzmQuestionHeaderComponent,
    BzmAnswerGridComponent,
    BzmCardComponent,
    BzmLeaderboardComponent,
    BzmPageTitleComponent,
  ],
  template: `
    <div class="host-game">
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
              <bzm-answer-grid
                [answers]="toAnswerGridItems(q.answers)"
                [disabled]="true"
              />
              <bzm-card borderColor="var(--bzm-color-accent)">
                <p class="answer-stats">{{ gameState.answeredCount() }} / {{ gameState.players().length }} beantwoord</p>
              </bzm-card>
            </div>
          }
        }

        @case ('leaderboard') {
          <div class="leaderboard-view">
            <bzm-page-title color="var(--bzm-color-accent)">Tussenstand</bzm-page-title>
            <bzm-leaderboard [entries]="gameState.sortedLeaderboard()" />
            <bzm-button variant="primary" size="lg" (click)="nextQuestion()">
              {{ gameState.isLastQuestion() ? 'Resultaten' : 'Volgende vraag' }}
            </bzm-button>
          </div>
        }
      }
    </div>
  `,
  styles: `
    .host-game {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1.5rem;
      padding: 1rem;
      width: 100%;
      max-width: 800px;
    }

    .question-view {
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .answer-stats {
      text-align: center;
      font-family: var(--bzm-font-family);
      font-weight: 700;
      color: var(--bzm-color-text-muted);
      margin: 0;
    }

    .leaderboard-view {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 2rem;
      width: 100%;
    }
  `,
})
/**
 * Host game view that drives the live quiz session.
 *
 * Renders different sub-views depending on the current game phase:
 * - **countdown** -- Displays an animated countdown before the first question.
 * - **question** -- Shows the question text, answer options (disabled for host),
 *   a timer, and a live count of how many players have answered.
 * - **leaderboard** -- Presents the intermediate standings with a button to
 *   advance to the next question or finish the game.
 */
export class HostGameComponent {
  /** Injected game state for reading question data, phases, and player stats. */
  readonly gameState = inject(GameStateService);

  private readonly wsService = inject(WebSocketService);

  /**
   * Maps raw answer strings to {@link AnswerGridItem} objects expected
   * by the `BzmAnswerGridComponent`.
   *
   * @param answers - Array of answer text strings from the current question.
   * @returns An array of grid items with `text` populated and no selection state.
   */
  toAnswerGridItems(answers: string[]): AnswerGridItem[] {
    return answers.map((text) => ({ text }));
  }

  /**
   * Sends a `NEXT_QUESTION` message to the server, advancing the quiz to
   * the next question or triggering the game-over sequence if this was
   * the last question.
   */
  nextQuestion(): void {
    this.wsService.send({ type: 'NEXT_QUESTION' });
  }
}
