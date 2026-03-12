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
  const currentQuestion = signal<{ text: string; answers: [string, string, string, string]; timeLimitSeconds: number } | null>(null);

  const mockGameState = {
    gamePhase: signal('question' as string),
    currentQuestion,
    questionIndex,
    totalQuestions: signal(5),
    timeLimit: signal(20),
    playerScore: signal(0),
    lastAnswerResult,
    hasAnswered: computed(() => lastAnswerResult() !== null),
    players: signal<unknown[]>([]),
    sortedLeaderboard: computed(() => []),
    correctAnswerIndex: signal(null),
    errorMessage: signal<string | null>(null),
    elapsedMs: signal(0),
  };

  const mockWsService = {
    send: vi.fn(),
    connectionStatus: signal<'disconnected' | 'connecting' | 'connected'>('connected'),
    isConnecting: computed(() => false),
  };

  beforeEach(async () => {
    lastAnswerResult.set(null);
    questionIndex.set(0);
    currentQuestion.set(null);
    mockGameState.gamePhase.set('question');
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
  // answerGridItems (computed)
  // ---------------------------------------------------------------------------

  describe('answerGridItems', () => {
    it('should return empty array when no question is set', () => {
      expect(component.answerGridItems()).toEqual([]);
    });

    it('should map answers to objects with text only when no answer is selected', () => {
      currentQuestion.set({
        text: 'Test?',
        answers: ['A', 'B', 'C', 'D'],
        timeLimitSeconds: 20,
      });

      expect(component.answerGridItems()).toEqual([
        { text: 'A' },
        { text: 'B' },
        { text: 'C' },
        { text: 'D' },
      ]);
    });

    it('should mark the selected answer when selectedAnswer matches an index', () => {
      currentQuestion.set({
        text: 'Test?',
        answers: ['A', 'B', 'C', 'D'],
        timeLimitSeconds: 20,
      });
      component.selectedAnswer.set(1);

      expect(component.answerGridItems()).toEqual([
        { text: 'A', selected: false },
        { text: 'B', selected: true },
        { text: 'C', selected: false },
        { text: 'D', selected: false },
      ]);
    });
  });

  // ---------------------------------------------------------------------------
  // submitAnswer()
  // ---------------------------------------------------------------------------

  describe('submitAnswer()', () => {
    it('should set selectedAnswer, hasSubmitted, and send SUBMIT_ANSWER message', () => {
      component.submitAnswer(2);

      expect(component.selectedAnswer()).toBe(2);
      expect(component.hasSubmitted()).toBe(true);
      expect(mockWsService.send).toHaveBeenCalledWith({
        type: 'SUBMIT_ANSWER',
        payload: {
          questionIndex: 0,
          answerIndex: 2,
        },
      });
    });

    it('should not send when hasAnswered is true', () => {
      lastAnswerResult.set({ correct: true, score: 100, totalScore: 100, correctIndex: 0 });

      component.submitAnswer(1);

      expect(component.selectedAnswer()).toBeNull();
      expect(mockWsService.send).not.toHaveBeenCalled();
    });

    it('should not send when hasSubmitted is true (double-submit prevention)', () => {
      component.submitAnswer(1);
      mockWsService.send.mockReset();

      component.submitAnswer(2);

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
      questionIndex.set(3);

      component.submitAnswer(0);

      expect(mockWsService.send).toHaveBeenCalledWith({
        type: 'SUBMIT_ANSWER',
        payload: {
          questionIndex: 3,
          answerIndex: 0,
        },
      });
    });
  });
});
