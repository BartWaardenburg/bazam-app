import { TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, signal } from '@angular/core';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { GameStateService } from '../../../services/game-state.service';
import { WebSocketService } from '../../../services/websocket.service';
import { CreateQuizComponent } from './create-quiz.component';

const createMockGameState = () => ({
  role: signal<'host' | 'player' | null>(null),
  roomCode: signal<string | null>(null),
  questions: signal<unknown[]>([]),
  errorMessage: signal<string | null>(null),
  reset: vi.fn(),
});

const createMockWsService = () => ({
  connect: vi.fn().mockResolvedValue(undefined),
  send: vi.fn(),
  disconnect: vi.fn(),
  connectionStatus: signal<'disconnected' | 'connecting' | 'connected'>('disconnected'),
});

describe('CreateQuizComponent', () => {
  let component: CreateQuizComponent;
  let mockGameState: ReturnType<typeof createMockGameState>;
  let mockWsService: ReturnType<typeof createMockWsService>;

  beforeEach(async () => {
    mockGameState = createMockGameState();
    mockWsService = createMockWsService();

    await TestBed.configureTestingModule({
      imports: [CreateQuizComponent],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .overrideComponent(CreateQuizComponent, {
        set: {
          imports: [],
          providers: [
            { provide: GameStateService, useValue: mockGameState },
            { provide: WebSocketService, useValue: mockWsService },
          ],
        },
      })
      .compileComponents();

    const fixture = TestBed.createComponent(CreateQuizComponent);
    component = fixture.componentInstance;
  });

  it('should start with 1 empty question', () => {
    const questions = component.questions();

    expect(questions).toHaveLength(1);
    expect(questions[0].text).toBe('');
    expect(questions[0].answers).toEqual(['', '', '', '']);
    expect(questions[0].correctIndex).toBe(0);
    expect(questions[0].timeLimitSeconds).toBe(20);
  });

  it('should add a question when addQuestion is called', () => {
    component.addQuestion();

    expect(component.questions()).toHaveLength(2);
  });

  it('should remove a question at the given index', () => {
    component.addQuestion();
    expect(component.questions()).toHaveLength(2);

    component.removeQuestion(0);

    expect(component.questions()).toHaveLength(1);
  });

  it('should update a question at the given index via onQuestionChange', () => {
    component.onQuestionChange(0, {
      text: 'Updated question?',
      answers: ['A', 'B', 'C', 'D'],
      correctIndex: 2,
      timeLimitSeconds: 15,
    });

    const updated = component.questions()[0];
    expect(updated.text).toBe('Updated question?');
    expect(updated.answers).toEqual(['A', 'B', 'C', 'D']);
    expect(updated.correctIndex).toBe(2);
    expect(updated.timeLimitSeconds).toBe(15);
  });

  it('should load 5 sample questions with content', () => {
    component.loadSampleQuestions();

    const questions = component.questions();
    expect(questions).toHaveLength(5);
    expect(questions.every((q) => q.text.trim().length > 0)).toBe(true);
    expect(questions.every((q) => q.answers.every((a) => a.trim().length > 0))).toBe(true);
  });

  describe('isValid', () => {
    it('should return false when question text is empty', () => {
      expect(component.isValid()).toBe(false);
    });

    it('should return false when an answer is empty', () => {
      component.onQuestionChange(0, {
        text: 'A question?',
        answers: ['A', '', 'C', 'D'],
        correctIndex: 0,
        timeLimitSeconds: 20,
      });

      expect(component.isValid()).toBe(false);
    });

    it('should return true when all fields are filled', () => {
      component.onQuestionChange(0, {
        text: 'A question?',
        answers: ['A', 'B', 'C', 'D'],
        correctIndex: 0,
        timeLimitSeconds: 20,
      });

      expect(component.isValid()).toBe(true);
    });

    it('should return false for whitespace-only text', () => {
      component.onQuestionChange(0, {
        text: '   ',
        answers: ['A', 'B', 'C', 'D'],
        correctIndex: 0,
        timeLimitSeconds: 20,
      });

      expect(component.isValid()).toBe(false);
    });
  });

  describe('createRoom', () => {
    it('should set role to host and send CREATE_ROOM on success', async () => {
      component.onQuestionChange(0, {
        text: 'Test?',
        answers: ['A', 'B', 'C', 'D'],
        correctIndex: 1,
        timeLimitSeconds: 20,
      });

      await component.createRoom();

      expect(mockWsService.connect).toHaveBeenCalled();
      expect(mockGameState.role()).toBe('host');
      expect(mockGameState.questions().length).toBeGreaterThan(0);
      expect(mockWsService.send).toHaveBeenCalledWith({
        type: 'CREATE_ROOM',
        payload: {
          hostName: 'Host',
          questions: component.questions(),
        },
      });
    });

    it('should clear any previous error message before connecting', async () => {
      mockGameState.errorMessage.set('Previous error');

      await component.createRoom();

      expect(mockGameState.errorMessage()).toBeNull();
    });

    it('should reset role and set error message on connection failure', async () => {
      mockWsService.connect.mockRejectedValue(new Error('Connection failed'));

      await component.createRoom();

      expect(mockGameState.role()).toBeNull();
      expect(mockGameState.questions()).toEqual([]);
      expect(mockGameState.errorMessage()).toBe(
        'Kan geen verbinding maken met de server. Probeer het opnieuw.'
      );
    });
  });
});
