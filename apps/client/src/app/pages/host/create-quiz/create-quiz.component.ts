import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import type { AnswerIndex, QuestionInput } from '@bazam/shared-types';
import { BzmButtonComponent, BzmSliderComponent } from '@bazam/ui';
import { GameStateService } from '../../../services/game-state.service';
import { WebSocketService } from '../../../services/websocket.service';

const EMPTY_QUESTION: QuestionInput = {
  text: '',
  answers: ['', '', '', ''],
  correctIndex: 0,
  timeLimitSeconds: 20,
};

const SAMPLE_QUESTIONS: QuestionInput[] = [
  {
    text: 'Welke taal wordt het meest gebruikt voor web development?',
    answers: ['Python', 'JavaScript', 'C++', 'Java'],
    correctIndex: 1,
    timeLimitSeconds: 20,
  },
  {
    text: 'Wat doet CSS?',
    answers: ['Database queries', 'Server logica', 'Styling & layout', 'Routing'],
    correctIndex: 2,
    timeLimitSeconds: 15,
  },
  {
    text: 'Wat is TypeScript?',
    answers: ['Een database', 'Een CSS framework', 'Een typed superset van JavaScript', 'Een browser'],
    correctIndex: 2,
    timeLimitSeconds: 20,
  },
  {
    text: 'Waar staat HTML voor?',
    answers: ['HyperText Markup Language', 'High Tech Modern Language', 'Home Tool Markup Language', 'Hyperlink Text Mode Language'],
    correctIndex: 0,
    timeLimitSeconds: 15,
  },
  {
    text: 'Wat is Shadow DOM?',
    answers: ['Een game engine', 'Encapsulated DOM tree', 'Een JavaScript library', 'Een CSS selector'],
    correctIndex: 1,
    timeLimitSeconds: 20,
  },
];

const ANSWER_LABELS = ['A', 'B', 'C', 'D'];
const ANSWER_CLASSES = ['answer-a', 'answer-b', 'answer-c', 'answer-d'];

@Component({
  selector: 'app-create-quiz',
  imports: [FormsModule, BzmButtonComponent, BzmSliderComponent],
  template: `
    <div class="create-quiz">
      <h2 class="animate-in">Quiz aanmaken</h2>

      <div class="quick-start card animate-in" style="animation-delay: 0.05s">
        <p>Snel starten?</p>
        <bzm-button variant="accent" (click)="loadSampleQuestions()">
          Voorbeeldvragen laden
        </bzm-button>
      </div>

      @for (question of questions(); track $index) {
        <div class="question-card card animate-in" [style.animation-delay]="($index * 0.05 + 0.1) + 's'">
          <div class="question-header">
            <span class="question-number">Vraag {{ $index + 1 }}</span>
            <bzm-button variant="ghost" size="sm" (click)="removeQuestion($index)" aria-label="Vraag verwijderen">
              &times;
            </bzm-button>
          </div>

          <label>
            Vraag
            <input
              type="text"
              [ngModel]="question.text"
              (ngModelChange)="updateQuestion($index, 'text', $event)"
              placeholder="Stel je vraag..."
            />
          </label>

          <div class="answers-grid">
            @for (answer of question.answers; track $index; let ai = $index) {
              <label [class]="'answer ' + answerClass(ai)">
                <input
                  type="radio"
                  [name]="'correct-' + $index"
                  [checked]="question.correctIndex === ai"
                  (change)="updateQuestion($index, 'correctIndex', ai)"
                />
                <span class="answer-badge">{{ answerLabel(ai) }}</span>
                <input
                  type="text"
                  [ngModel]="answer"
                  (ngModelChange)="updateAnswer($index, ai, $event)"
                  [placeholder]="'Antwoord ' + answerLabel(ai)"
                  class="answer-input"
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
            [value]="question.timeLimitSeconds"
            (valueChange)="updateQuestion($index, 'timeLimitSeconds', $event)"
          />
        </div>
      }

      @if (gameState.errorMessage(); as error) {
        <p class="error animate-in" role="alert">{{ error }}</p>
      }

      <div class="actions animate-in">
        <bzm-button variant="secondary" (click)="addQuestion()">+ Vraag toevoegen</bzm-button>
        <bzm-button
          variant="primary"
          [fullWidth]="true"
          [disabled]="!isValid() || isConnecting()"
          (click)="createRoom()"
        >
          {{ isConnecting() ? 'Verbinden...' : 'Start Quiz' }}
        </bzm-button>
      </div>
    </div>
  `,
  styles: `
    .create-quiz {
      width: 100%;
      max-width: 700px;
      padding: 1rem;
      display: flex;
      flex-direction: column;
      gap: 1.5rem;

      & h2 {
        text-align: center;
        color: var(--color-primary);
        text-shadow: 3px 3px 0 #000;
      }
    }

    .quick-start {
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.75rem;
      background: var(--color-surface);
      border: 3px dashed var(--color-accent);
      transform: rotate(-0.5deg);
    }

    .quick-start p {
      font-weight: 700;
      color: var(--color-accent);
      font-size: 1.1rem;
    }

    .question-card {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      transition: transform 0.2s var(--timing-playful);

      &:hover {
        transform: rotate(0.3deg);
      }
    }

    .question-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .question-number {
      font-family: var(--font-heading);
      font-size: 1.2rem;
      letter-spacing: 0.05em;
      color: #fff;
      background: var(--color-cyan);
      padding: 0.3rem 1rem;
      border-radius: var(--radius-md);
      border: 2px solid var(--color-outline);
    }

    label {
      display: flex;
      flex-direction: column;
      gap: 0.35rem;
      font-size: 0.9rem;
      font-weight: 600;
      color: var(--color-text-muted);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .answers-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0.75rem;
    }

    @media (max-width: 480px) {
      .answers-grid { grid-template-columns: 1fr; }
      .card { padding: 1.25rem; }
    }

    .answer {
      flex-direction: row;
      align-items: center;
      gap: 0.5rem;
      padding: 0.65rem;
      border-radius: 2px;
      border: 3px solid transparent;
      transition: border-color 0.2s ease, box-shadow 0.2s ease;
      text-transform: none;

      &.answer-a { background: rgba(0, 188, 212, 0.1); border-color: #00BCD4; }
      &.answer-b { background: rgba(255, 214, 10, 0.1); border-color: #FFD60A; }
      &.answer-c { background: rgba(255, 59, 48, 0.1); border-color: #FF3B30; }
      &.answer-d { background: rgba(52, 199, 89, 0.1); border-color: #34C759; }

      &:has(input[type="radio"]:checked) {
        border-width: 3px;
        box-shadow: var(--shadow-hard);

        &.answer-a { border-color: #00BCD4; }
        &.answer-b { border-color: #FFD60A; }
        &.answer-c { border-color: #FF3B30; }
        &.answer-d { border-color: #34C759; }
      }
    }

    .answer-badge {
      width: 30px;
      height: 30px;
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 0.85rem;
      color: white;
      flex-shrink: 0;
      border: 2px solid var(--color-outline);

      .answer-a & { background: #00BCD4; }
      .answer-b & { background: #FFD60A; color: #1A1A1A; }
      .answer-c & { background: #FF3B30; }
      .answer-d & { background: #34C759; color: #1A1A1A; }
    }

    .answer-input {
      flex: 1;
      border: none;
      background: transparent;
      padding: 0.5rem;
      font-weight: 600;
      color: var(--color-text);
    }

    input[type="radio"] {
      display: none;
    }

    .error {
      color: #fff;
      font-weight: 600;
      text-align: center;
      font-size: 0.9rem;
      background: var(--color-primary);
      padding: 0.75rem;
      border-radius: 2px;
      border: 4px solid var(--color-outline);
      border-width: 3px 4px 4px 3px;
      box-shadow: 4px 4px 0 var(--color-outline);
    }

    .actions {
      display: flex;
      gap: 1rem;
      justify-content: center;
      flex-wrap: wrap;
    }
  `,
})
export class CreateQuizComponent {
  readonly gameState = inject(GameStateService);
  private readonly wsService = inject(WebSocketService);
  readonly isConnecting = computed(() => this.wsService.connectionStatus() === 'connecting');

  readonly questions = signal<QuestionInput[]>([structuredClone(EMPTY_QUESTION)]);

  answerLabel(index: number): string {
    return ANSWER_LABELS[index];
  }

  answerClass(index: number): string {
    return ANSWER_CLASSES[index];
  }

  addQuestion(): void {
    this.questions.update((qs) => [...qs, structuredClone(EMPTY_QUESTION)]);
  }

  removeQuestion(index: number): void {
    this.questions.update((qs) => qs.filter((_, i) => i !== index));
  }

  updateQuestion(index: number, field: keyof QuestionInput, value: string | number): void {
    this.questions.update((qs) => {
      const updated = structuredClone(qs);
      const q = updated[index];
      if (field === 'text') q.text = value as string;
      else if (field === 'correctIndex') q.correctIndex = value as AnswerIndex;
      else if (field === 'timeLimitSeconds') q.timeLimitSeconds = value as number;
      return updated;
    });
  }

  updateAnswer(qIndex: number, aIndex: number, value: string): void {
    this.questions.update((qs) => {
      const updated = structuredClone(qs);
      updated[qIndex].answers[aIndex] = value;
      return updated;
    });
  }

  loadSampleQuestions(): void {
    this.questions.set(structuredClone(SAMPLE_QUESTIONS));
  }

  isValid(): boolean {
    return this.questions().every(
      (q) => q.text.trim() && q.answers.every((a) => a.trim())
    );
  }

  async createRoom(): Promise<void> {
    this.gameState.role.set('host');
    this.gameState.questions.set(this.questions());
    this.gameState.errorMessage.set(null);

    try {
      await this.wsService.connect();
      this.wsService.send({
        type: 'CREATE_ROOM',
        payload: { hostName: 'Host', questions: this.questions() },
      });
    } catch {
      this.gameState.errorMessage.set('Kan geen verbinding maken met de server. Probeer het opnieuw.');
    }
  }
}
