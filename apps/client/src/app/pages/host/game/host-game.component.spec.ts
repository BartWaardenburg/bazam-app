import { TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, signal } from '@angular/core';
import { HostGameComponent } from './host-game.component';
import { GameStateService } from '../../../services/game-state.service';
import { WebSocketService } from '../../../services/websocket.service';

const createMockWsService = () => ({
  connect: vi.fn().mockResolvedValue(undefined),
  send: vi.fn(),
  disconnect: vi.fn(),
  connectionStatus: signal('disconnected' as const),
});

const createMockGameState = () => ({
  gamePhase: signal('idle' as const),
  currentQuestion: signal(null),
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

  describe('toAnswerGridItems', () => {
    it('should map strings to objects with text property', () => {
      const result = component.toAnswerGridItems(['Yes', 'No']);
      expect(result).toEqual([{ text: 'Yes' }, { text: 'No' }]);
    });

    it('should return an empty array for empty input', () => {
      const result = component.toAnswerGridItems([]);
      expect(result).toEqual([]);
    });

    it('should map 4 answers to 4 items without a selected property', () => {
      const result = component.toAnswerGridItems(['A', 'B', 'C', 'D']);
      expect(result).toHaveLength(4);
      for (const item of result) {
        expect(item).toHaveProperty('text');
        expect(item).not.toHaveProperty('selected');
      }
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
