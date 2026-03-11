import { TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, signal, computed } from '@angular/core';
import { describe, it, expect, beforeEach } from 'vitest';
import { PlayerGameComponent } from './player-game.component';
import { GameStateService } from '../../../services/game-state.service';
import { WebSocketService } from '../../../services/websocket.service';

describe('PlayerGameComponent', () => {
  let component: PlayerGameComponent;

  const lastAnswerResult = signal<{ correct: boolean; score: number; totalScore: number; correctIndex: number } | null>(null);
  const questionIndex = signal(0);

  const mockGameState = {
    gamePhase: signal('question' as string),
    currentQuestion: signal<{ text: string; answers: string[]; timeLimitSeconds: number } | null>(null),
    questionIndex,
    totalQuestions: signal(5),
    timeLimit: signal(20),
    playerScore: signal(0),
    lastAnswerResult,
    hasAnswered: computed(() => lastAnswerResult() !== null),
    players: signal<unknown[]>([]),
    sortedLeaderboard: computed(() => []),
  };

  const mockWsService = {
    send: vi.fn(),
    connectionStatus: signal<'disconnected' | 'connecting' | 'connected'>('connected'),
  };

  beforeEach(async () => {
    lastAnswerResult.set(null);
    questionIndex.set(0);
    mockGameState.gamePhase.set('question');
    mockGameState.currentQuestion.set(null);
    mockGameState.totalQuestions.set(5);
    mockGameState.timeLimit.set(20);
    mockGameState.playerScore.set(0);
    mockWsService.send.mockReset();

    await TestBed.configureTestingModule({
      imports: [PlayerGameComponent],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .overrideComponent(PlayerGameComponent, {
        set: {
          imports: [],
          providers: [
            { provide: GameStateService, useValue: mockGameState },
            { provide: WebSocketService, useValue: mockWsService },
          ],
        },
      })
      .compileComponents();

    const fixture = TestBed.createComponent(PlayerGameComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  // ---------------------------------------------------------------------------
  // toAnswerGridItems()
  // ---------------------------------------------------------------------------

  describe('toAnswerGridItems()', () => {
    it('should map answers to objects with text and selected=false by default', () => {
      const result = component.toAnswerGridItems(['A', 'B', 'C', 'D']);

      expect(result).toEqual([
        { text: 'A', selected: false },
        { text: 'B', selected: false },
        { text: 'C', selected: false },
        { text: 'D', selected: false },
      ]);
    });

    it('should mark the selected answer when selectedAnswer matches an index', () => {
      component.selectedAnswer.set(1);

      const result = component.toAnswerGridItems(['A', 'B', 'C', 'D']);

      expect(result).toEqual([
        { text: 'A', selected: false },
        { text: 'B', selected: true },
        { text: 'C', selected: false },
        { text: 'D', selected: false },
      ]);
    });

    it('should return an empty array when given an empty array', () => {
      const result = component.toAnswerGridItems([]);

      expect(result).toEqual([]);
    });
  });

  // ---------------------------------------------------------------------------
  // submitAnswer()
  // ---------------------------------------------------------------------------

  describe('submitAnswer()', () => {
    it('should set selectedAnswer and send SUBMIT_ANSWER message', () => {
      const fakeTimestamp = 1700000000000;
      vi.spyOn(Date, 'now').mockReturnValue(fakeTimestamp);

      component.submitAnswer(2);

      expect(component.selectedAnswer()).toBe(2);
      expect(mockWsService.send).toHaveBeenCalledWith({
        type: 'SUBMIT_ANSWER',
        payload: {
          questionIndex: 0,
          answerIndex: 2,
          timestamp: fakeTimestamp,
        },
      });

      vi.restoreAllMocks();
    });

    it('should not send when hasAnswered is true', () => {
      lastAnswerResult.set({ correct: true, score: 100, totalScore: 100, correctIndex: 0 });

      component.submitAnswer(1);

      expect(component.selectedAnswer()).toBeNull();
      expect(mockWsService.send).not.toHaveBeenCalled();
    });

    it('should not send when answerIndex is -1 (below range)', () => {
      component.submitAnswer(-1);

      expect(component.selectedAnswer()).toBeNull();
      expect(mockWsService.send).not.toHaveBeenCalled();
    });

    it('should not send when answerIndex is 4 (above range)', () => {
      component.submitAnswer(4);

      expect(component.selectedAnswer()).toBeNull();
      expect(mockWsService.send).not.toHaveBeenCalled();
    });

    it('should use the current questionIndex from game state', () => {
      const fakeTimestamp = 1700000000000;
      vi.spyOn(Date, 'now').mockReturnValue(fakeTimestamp);
      questionIndex.set(3);

      component.submitAnswer(0);

      expect(mockWsService.send).toHaveBeenCalledWith({
        type: 'SUBMIT_ANSWER',
        payload: {
          questionIndex: 3,
          answerIndex: 0,
          timestamp: fakeTimestamp,
        },
      });

      vi.restoreAllMocks();
    });
  });

  // ---------------------------------------------------------------------------
  // Effect: reset selectedAnswer on questionIndex change
  // ---------------------------------------------------------------------------

  describe('effect: reset selectedAnswer on questionIndex change', () => {
    it('should reset selectedAnswer to null when questionIndex changes', () => {
      component.selectedAnswer.set(2);
      expect(component.selectedAnswer()).toBe(2);

      questionIndex.set(1);
      TestBed.flushEffects();

      expect(component.selectedAnswer()).toBeNull();
    });

    it('should reset selectedAnswer on subsequent question changes', () => {
      component.selectedAnswer.set(3);
      questionIndex.set(1);
      TestBed.flushEffects();
      expect(component.selectedAnswer()).toBeNull();

      component.selectedAnswer.set(0);
      questionIndex.set(2);
      TestBed.flushEffects();
      expect(component.selectedAnswer()).toBeNull();
    });
  });
});
