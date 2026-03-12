import { TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, signal, computed } from '@angular/core';
import { HostGameComponent } from './host-game.component';
import { GameStateService } from '../../../services/game-state.service';
import { WebSocketService } from '../../../services/websocket.service';

const createMockWsService = () => {
  const connectionStatus = signal('disconnected' as const);
  return {
    connect: vi.fn().mockResolvedValue(undefined),
    send: vi.fn(),
    disconnect: vi.fn(),
    connectionStatus,
    isConnecting: computed(() => connectionStatus() === 'connecting'),
  };
};

const createMockGameState = () => ({
  gamePhase: signal('idle' as const),
  currentQuestion: signal<{ text: string; answers: [string, string, string, string]; timeLimitSeconds: number } | null>(null),
  questionIndex: signal(0),
  totalQuestions: signal(0),
  timeLimit: signal(20),
  players: signal([]),
  leaderboard: signal([]),
  sortedLeaderboard: signal([]),
  answeredCount: signal(0),
  isLastQuestion: signal(false),
  hasAnswered: signal(false),
  lastAnswerResult: signal(null),
  playerScore: signal(0),
  correctAnswerIndex: signal(null),
  errorMessage: signal<string | null>(null),
});

describe('HostGameComponent', () => {
  let component: HostGameComponent;
  let mockWsService: ReturnType<typeof createMockWsService>;
  let mockGameState: ReturnType<typeof createMockGameState>;

  beforeEach(async () => {
    mockWsService = createMockWsService();
    mockGameState = createMockGameState();

    await TestBed.configureTestingModule({
      imports: [HostGameComponent],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .overrideComponent(HostGameComponent, {
        set: {
          providers: [
            { provide: GameStateService, useValue: mockGameState },
            { provide: WebSocketService, useValue: mockWsService },
          ],
        },
      })
      .compileComponents();

    const fixture = TestBed.createComponent(HostGameComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  describe('answerGridItems', () => {
    it('should return empty array when no question is set', () => {
      expect(component.answerGridItems()).toEqual([]);
    });

    it('should map question answers to grid items', () => {
      mockGameState.currentQuestion.set({
        text: 'Test?',
        answers: ['A', 'B', 'C', 'D'],
        timeLimitSeconds: 20,
      });

      const result = component.answerGridItems();
      expect(result).toEqual([
        { text: 'A' },
        { text: 'B' },
        { text: 'C' },
        { text: 'D' },
      ]);
    });
  });

  describe('nextQuestion', () => {
    it('should send a NEXT_QUESTION message via the WebSocket service', () => {
      component.nextQuestion();
      expect(mockWsService.send).toHaveBeenCalledOnce();
      expect(mockWsService.send).toHaveBeenCalledWith({ type: 'NEXT_QUESTION' });
    });
  });
});
