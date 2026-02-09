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
export class HostGameComponent {
  readonly gameState = inject(GameStateService);
  private readonly wsService = inject(WebSocketService);

  toAnswerGridItems(answers: string[]): AnswerGridItem[] {
    return answers.map((text) => ({ text }));
  }

  nextQuestion(): void {
    this.wsService.send({ type: 'NEXT_QUESTION' });
  }
}
