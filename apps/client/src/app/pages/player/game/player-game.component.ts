import { Component, effect, inject, signal } from '@angular/core';
import { BzmAnswerOptionComponent, BzmProgressBarComponent, BzmTimerComponent } from '@bazam/ui';
import type { AnswerLetter } from '@bazam/ui';
import { GameStateService } from '../../../services/game-state.service';
import { WebSocketService } from '../../../services/websocket.service';

const ANSWER_LETTERS: AnswerLetter[] = ['A', 'B', 'C', 'D'];

@Component({
  selector: 'app-player-game',
  imports: [BzmAnswerOptionComponent, BzmProgressBarComponent, BzmTimerComponent],
  template: `
    <div class="player-game">
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
                <h3 class="animate-in">{{ q.text }}</h3>
                <bzm-timer
                  [duration]="gameState.timeLimit()"
                  [running]="true"
                  size="lg"
                />
              </div>

              @if (!gameState.hasAnswered()) {
                <div class="answers-grid">
                  @for (answer of q.answers; track $index) {
                    <bzm-answer-option
                      [letter]="answerLetter($index)"
                      [text]="answer"
                      [selected]="selectedAnswer() === $index"
                      [style.animation-delay]="($index * 0.08) + 's'"
                      (selected)="submitAnswer($index)"
                    />
                  }
                </div>
              } @else {
                <div class="result-feedback animate-scale" role="status" aria-live="polite">
                  @if (gameState.lastAnswerResult(); as result) {
                    @if (result.correct) {
                      <div class="correct">
                        <h3>Goed zo!</h3>
                        <p class="score-earned">+{{ result.score }} punten</p>
                      </div>
                    } @else {
                      <div class="incorrect">
                        <h3>Helaas!</h3>
                        <p class="try-again">Volgende keer beter!</p>
                      </div>
                    }
                  }
                </div>
              }
            </div>
          }
        }

        @case ('leaderboard') {
          <div class="leaderboard-wait animate-in">
            <h3>Tussenstand</h3>
            <p class="total-score">{{ gameState.playerScore() }} pts</p>
            <div class="waiting-spinner">
              <div class="spinner"></div>
              <p class="waiting-text">Wachten op de host...</p>
            </div>
          </div>
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

    .countdown {
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;

      & h2 {
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
      gap: 1rem;

      & h3 {
        flex: 1;
        font-size: 1.3rem;
        line-height: 1.3;
        text-transform: none;
        text-shadow: 1px 1px 0 #000;
      }
    }

    .answers-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0.75rem;
    }

    @media (max-width: 480px) {
      .answers-grid { grid-template-columns: 1fr; }
      .question-header { flex-direction: column; align-items: flex-start; }
    }

    .result-feedback {
      text-align: center;
      padding: 3rem 2rem;
      background: var(--color-surface);
      border-radius: 2px;
      border: 4px solid var(--color-border);
      border-width: 3px 4px 5px 3px;
      box-shadow: var(--shadow-hard-lg);

    }

    .correct {
      color: var(--color-correct);
    }

    .incorrect {
      color: var(--color-incorrect);
    }

    .result-feedback h3 {
      text-shadow: 2px 2px 0 #000;
    }

    .score-earned {
      font-weight: 700;
      font-size: 1.5rem;
      margin-top: 0.5rem;
      color: var(--color-accent);
    }

    .try-again {
      font-weight: 600;
      color: var(--color-text-muted);
      margin-top: 0.5rem;
    }

    .leaderboard-wait {
      text-align: center;
      padding: 2rem;
      background: var(--color-surface);
      border-radius: 2px;
      border: 4px solid var(--color-border);
      border-width: 3px 4px 5px 3px;
      box-shadow: var(--shadow-hard-lg);

      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;
    }

    .leaderboard-wait h3 {
      color: var(--color-primary);
      text-shadow: 2px 2px 0 #000;
    }

    .total-score {
      font-family: var(--font-heading);
      font-size: 3rem;
      color: var(--color-accent);
      text-shadow: 3px 3px 0 #000;
      letter-spacing: 0.05em;
    }

    .waiting-spinner {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-top: 1rem;
    }

    .spinner {
      width: 24px;
      height: 24px;
      border: 3px solid var(--color-border);
      border-top-color: var(--color-primary);
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .waiting-text {
      color: var(--color-text-muted);
      font-weight: 600;
      font-size: 0.9rem;
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

  answerLetter(index: number): AnswerLetter {
    return ANSWER_LETTERS[index];
  }

  submitAnswer(answerIndex: number): void {
    if (this.gameState.hasAnswered()) return;
    this.selectedAnswer.set(answerIndex);
    this.wsService.send({
      type: 'SUBMIT_ANSWER',
      payload: {
        questionIndex: this.gameState.questionIndex(),
        answerIndex,
        timestamp: Date.now(),
      },
    });
  }
}
