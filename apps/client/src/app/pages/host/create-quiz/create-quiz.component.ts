import { Component, computed, inject, signal } from '@angular/core';
import type { AnswerIndex, QuestionInput } from '@bazam/shared-types';
import {
  BzmButtonComponent,
  BzmPageTitleComponent,
  BzmCardComponent,
  BzmQuestionEditorComponent,
  BzmErrorMessageComponent,
  BzmActionBarComponent,
  type QuestionEditorData,
} from '@bazam/ui';
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

@Component({
  selector: 'app-create-quiz',
  imports: [
    BzmButtonComponent,
    BzmPageTitleComponent,
    BzmCardComponent,
    BzmQuestionEditorComponent,
    BzmErrorMessageComponent,
    BzmActionBarComponent,
  ],
  template: `
    <div class="create-quiz">
      <bzm-page-title size="lg" color="var(--bzm-color-primary)">Quiz aanmaken</bzm-page-title>

      <bzm-card borderColor="var(--bzm-color-accent)">
        <div class="quick-start">
          <p>Snel starten?</p>
          <bzm-button variant="accent" (click)="loadSampleQuestions()">
            Voorbeeldvragen laden
          </bzm-button>
        </div>
      </bzm-card>

      @for (question of questions(); track $index) {
        <bzm-card>
          <bzm-question-editor
            [question]="question"
            [questionNumber]="$index + 1"
            [removable]="questions().length > 1"
            (questionChange)="onQuestionChange($index, $event)"
            (removed)="removeQuestion($index)"
          />
        </bzm-card>
      }

      @if (gameState.errorMessage(); as error) {
        <bzm-error-message>{{ error }}</bzm-error-message>
      }

      <bzm-action-bar direction="column">
        <bzm-button variant="secondary" (click)="addQuestion()">+ Vraag toevoegen</bzm-button>
        <bzm-button
          variant="primary"
          [fullWidth]="true"
          [disabled]="!isValid() || isConnecting()"
          (click)="createRoom()"
        >
          {{ isConnecting() ? 'Verbinden...' : 'Start Quiz' }}
        </bzm-button>
      </bzm-action-bar>
    </div>
  `,
  styles: `
    .create-quiz {
      width: 100%;
      max-width: 700px;
      padding: 1rem 1.5rem;
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .quick-start {
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.75rem;
    }

    .quick-start p {
      margin: 0;
      font-family: var(--bzm-font-family);
      font-weight: 700;
      color: var(--bzm-color-accent-dark);
      font-size: 1.1rem;
    }
  `,
})
export class CreateQuizComponent {
  readonly gameState = inject(GameStateService);
  private readonly wsService = inject(WebSocketService);
  readonly isConnecting = computed(() => this.wsService.connectionStatus() === 'connecting');

  readonly questions = signal<QuestionInput[]>([structuredClone(EMPTY_QUESTION)]);

  addQuestion(): void {
    this.questions.update((qs) => [...qs, structuredClone(EMPTY_QUESTION)]);
  }

  removeQuestion(index: number): void {
    this.questions.update((qs) => qs.filter((_, i) => i !== index));
  }

  onQuestionChange(index: number, data: QuestionEditorData): void {
    this.questions.update((qs) => {
      const updated = structuredClone(qs);
      updated[index] = {
        text: data.text,
        answers: [...data.answers] as [string, string, string, string],
        correctIndex: data.correctIndex as AnswerIndex,
        timeLimitSeconds: data.timeLimitSeconds,
      };
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
