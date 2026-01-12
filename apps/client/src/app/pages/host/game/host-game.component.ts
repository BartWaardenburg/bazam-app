import { Component, inject } from '@angular/core';
import { GameStateService } from '../../../services/game-state.service';
import { WebSocketService } from '../../../services/websocket.service';
import { LeaderboardComponent } from '../../../components/leaderboard/leaderboard.component';
import { BzmAnswerOptionComponent, BzmButtonComponent, BzmProgressBarComponent, BzmTimerComponent } from '@bazam/ui';
import type { AnswerLetter } from '@bazam/ui';

const ANSWER_LETTERS: AnswerLetter[] = ['A', 'B', 'C', 'D'];

@Component({
  selector: 'app-host-game',
  imports: [LeaderboardComponent, BzmAnswerOptionComponent, BzmButtonComponent, BzmProgressBarComponent, BzmTimerComponent],
  template: `
    <div class="host-game">
      @switch (gameState.gamePhase()) {
        @case ('countdown') {
          <div class="countdown animate-scale">
            <h2>Maak je klaar!</h2>
          </div>
        }

        @case ('question') {
          @if (gameState.currentQuestion(); as q) {
            <div class="question-view">
              <bzm-progress-bar
                [current]="gameState.questionIndex()"
                [total]="gameState.totalQuestions()"
              />

              <div class="question-header">
                <h2 class="question-text animate-in">{{ q.text }}</h2>
                <bzm-timer
                  [duration]="gameState.timeLimit()"
                  [running]="true"
                />
              </div>

              <div class="answers-grid">
                @for (answer of q.answers; track $index) {
                  <bzm-answer-option
                    [letter]="answerLetter($index)"
                    [text]="answer"
                    [disabled]="true"
                  />
                }
              </div>

              <div class="answer-stats card">
                <span>{{ gameState.answeredCount() }} / {{ gameState.players().length }} beantwoord</span>
              </div>
            </div>
          }
        }

        @case ('leaderboard') {
          <div class="leaderboard-view animate-in">
            <h2>Tussenstand</h2>
            <app-leaderboard [entries]="gameState.sortedLeaderboard()" />
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

    .countdown {
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;

      & h2 {
        font-size: 2.5rem;
        color: var(--color-accent);
        text-shadow: 3px 3px 0 #000;
      }
    }

    .question-view {
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .question-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 1.5rem;
    }

    .question-text {
      flex: 1;
      font-size: clamp(1.1rem, 3.5vw, 1.6rem);
      line-height: 1.3;
      color: var(--color-text);
      text-shadow: 2px 2px 0 #000;
      text-transform: none;
      word-break: break-word;
    }

    .answers-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0.75rem;
    }

    @media (max-width: 500px) {
      .answers-grid { grid-template-columns: 1fr; }
      .question-header { flex-direction: column; align-items: flex-start; }
    }

    .answer-stats {
      text-align: center;
      font-weight: 700;
      color: var(--color-text-muted);
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      padding: 1rem;
      border-color: var(--color-accent);
      background: var(--color-surface);
    }

    .leaderboard-view {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 2rem;
      width: 100%;

      & h2 {
        color: var(--color-accent);
        font-size: 2rem;
        text-shadow: 3px 3px 0 #000;
      }
    }
  `,
})
export class HostGameComponent {
  readonly gameState = inject(GameStateService);
  private readonly wsService = inject(WebSocketService);

  answerLetter(index: number): AnswerLetter {
    return ANSWER_LETTERS[index];
  }

  nextQuestion(): void {
    this.wsService.send({ type: 'NEXT_QUESTION' });
  }
}
