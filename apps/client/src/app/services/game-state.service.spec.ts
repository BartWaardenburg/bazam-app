import { TestBed } from '@angular/core/testing';
import { GameStateService } from './game-state.service';
import type { AnswerResult, LeaderboardEntry, PlayerInfo, QuestionInput, QuestionPublic } from '@bazam/shared-types';

describe('GameStateService', () => {
  let service: GameStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GameStateService);
    service.reset();
  });

  // ---------------------------------------------------------------------------
  // Helpers
  // ---------------------------------------------------------------------------

  const makePlayer = (overrides: Partial<PlayerInfo> = {}): PlayerInfo => ({
    id: 'p1',
    nickname: 'Alice',
    score: 0,
    hasAnswered: false,
    ...overrides,
  });

  const makeLeaderboardEntry = (overrides: Partial<LeaderboardEntry> = {}): LeaderboardEntry => ({
    id: 'p1',
    nickname: 'Alice',
    score: 0,
    rank: 1,
    previousRank: null,
    streak: 0,
    ...overrides,
  });

  const makeAnswerResult = (overrides: Partial<AnswerResult> = {}): AnswerResult => ({
    correct: true,
    score: 100,
    totalScore: 100,
    correctIndex: 0,
    ...overrides,
  });

  const makeQuestion = (): QuestionPublic => ({
    text: 'What is 1+1?',
    answers: ['1', '2', '3', '4'],
    timeLimitSeconds: 20,
  });

  const makeQuestionInput = (): QuestionInput => ({
    text: 'What is 1+1?',
    answers: ['1', '2', '3', '4'],
    correctIndex: 1,
    timeLimitSeconds: 20,
  });

  // ---------------------------------------------------------------------------
  // Signal defaults
  // ---------------------------------------------------------------------------

  describe('signal defaults', () => {
    it('should initialize role to null', () => {
      expect(service.role()).toBeNull();
    });

    it('should initialize roomCode to null', () => {
      expect(service.roomCode()).toBeNull();
    });

    it('should initialize gamePhase to idle', () => {
      expect(service.gamePhase()).toBe('idle');
    });

    it('should initialize players to empty array', () => {
      expect(service.players()).toEqual([]);
    });

    it('should initialize currentQuestion to null', () => {
      expect(service.currentQuestion()).toBeNull();
    });

    it('should initialize questionIndex to 0', () => {
      expect(service.questionIndex()).toBe(0);
    });

    it('should initialize totalQuestions to 0', () => {
      expect(service.totalQuestions()).toBe(0);
    });

    it('should initialize timeLimit to 20', () => {
      expect(service.timeLimit()).toBe(20);
    });

    it('should initialize leaderboard to empty array', () => {
      expect(service.leaderboard()).toEqual([]);
    });

    it('should initialize playerScore to 0', () => {
      expect(service.playerScore()).toBe(0);
    });

    it('should initialize playerNickname to empty string', () => {
      expect(service.playerNickname()).toBe('');
    });

    it('should initialize lastAnswerResult to null', () => {
      expect(service.lastAnswerResult()).toBeNull();
    });

    it('should initialize questions to empty array', () => {
      expect(service.questions()).toEqual([]);
    });

    it('should initialize errorMessage to null', () => {
      expect(service.errorMessage()).toBeNull();
    });

    it('should initialize playerId to null', () => {
      expect(service.playerId()).toBeNull();
    });

    it('should initialize correctAnswerIndex to null', () => {
      expect(service.correctAnswerIndex()).toBeNull();
    });

    it('should initialize elapsedMs to 0', () => {
      expect(service.elapsedMs()).toBe(0);
    });
  });

  // ---------------------------------------------------------------------------
  // Computed: hasAnswered
  // ---------------------------------------------------------------------------

  describe('hasAnswered', () => {
    it('should return false when lastAnswerResult is null', () => {
      expect(service.hasAnswered()).toBe(false);
    });

    it('should return true when lastAnswerResult is non-null', () => {
      service.lastAnswerResult.set(makeAnswerResult());
      expect(service.hasAnswered()).toBe(true);
    });
  });

  // ---------------------------------------------------------------------------
  // Computed: sortedLeaderboard
  // ---------------------------------------------------------------------------

  describe('sortedLeaderboard', () => {
    it('should sort entries by score descending', () => {
      const entries: LeaderboardEntry[] = [
        makeLeaderboardEntry({ id: 'p1', nickname: 'Alice', score: 50, rank: 2 }),
        makeLeaderboardEntry({ id: 'p2', nickname: 'Bob', score: 200, rank: 1 }),
        makeLeaderboardEntry({ id: 'p3', nickname: 'Charlie', score: 100, rank: 3 }),
      ];
      service.leaderboard.set(entries);

      const sorted = service.sortedLeaderboard();
      expect(sorted.map((e) => e.score)).toEqual([200, 100, 50]);
      expect(sorted.map((e) => e.nickname)).toEqual(['Bob', 'Charlie', 'Alice']);
    });

    it('should return empty array when leaderboard is empty', () => {
      expect(service.sortedLeaderboard()).toEqual([]);
    });

    it('should not mutate the original leaderboard signal', () => {
      const entries: LeaderboardEntry[] = [
        makeLeaderboardEntry({ id: 'p1', score: 10 }),
        makeLeaderboardEntry({ id: 'p2', score: 50 }),
      ];
      service.leaderboard.set(entries);

      service.sortedLeaderboard();
      expect(service.leaderboard()[0].score).toBe(10);
      expect(service.leaderboard()[1].score).toBe(50);
    });
  });

  // ---------------------------------------------------------------------------
  // Computed: topThree
  // ---------------------------------------------------------------------------

  // topThree was removed — it was unused by any component

  // ---------------------------------------------------------------------------
  // Computed: answeredCount
  // ---------------------------------------------------------------------------

  describe('answeredCount', () => {
    it('should count players where hasAnswered is true', () => {
      service.players.set([
        makePlayer({ id: 'p1', hasAnswered: true }),
        makePlayer({ id: 'p2', hasAnswered: true }),
        makePlayer({ id: 'p3', hasAnswered: false }),
      ]);
      expect(service.answeredCount()).toBe(2);
    });

    it('should return 0 when players array is empty', () => {
      expect(service.answeredCount()).toBe(0);
    });

    it('should return 0 when no player has answered', () => {
      service.players.set([
        makePlayer({ id: 'p1', hasAnswered: false }),
        makePlayer({ id: 'p2', hasAnswered: false }),
      ]);
      expect(service.answeredCount()).toBe(0);
    });

    it('should return full count when all players have answered', () => {
      service.players.set([
        makePlayer({ id: 'p1', hasAnswered: true }),
        makePlayer({ id: 'p2', hasAnswered: true }),
      ]);
      expect(service.answeredCount()).toBe(2);
    });
  });

  // ---------------------------------------------------------------------------
  // Computed: isLastQuestion
  // ---------------------------------------------------------------------------

  describe('isLastQuestion', () => {
    it('should return false when not on the last question', () => {
      service.questionIndex.set(0);
      service.totalQuestions.set(5);
      expect(service.isLastQuestion()).toBe(false);
    });

    it('should return true when on the last question', () => {
      service.questionIndex.set(4);
      service.totalQuestions.set(5);
      expect(service.isLastQuestion()).toBe(true);
    });

    it('should return true when there is only one question', () => {
      service.questionIndex.set(0);
      service.totalQuestions.set(1);
      expect(service.isLastQuestion()).toBe(true);
    });

    it('should return false when totalQuestions is 0 (no questions loaded)', () => {
      service.questionIndex.set(0);
      service.totalQuestions.set(0);
      expect(service.isLastQuestion()).toBe(false);
    });

    it('should return false for middle question', () => {
      service.questionIndex.set(2);
      service.totalQuestions.set(5);
      expect(service.isLastQuestion()).toBe(false);
    });
  });

  // ---------------------------------------------------------------------------
  // reset()
  // ---------------------------------------------------------------------------

  describe('reset()', () => {
    it('should restore all signals to their default values', () => {
      // Modify every signal to a non-default value
      service.role.set('host');
      service.roomCode.set('ABC123');
      service.gamePhase.set('question');
      service.players.set([makePlayer()]);
      service.currentQuestion.set(makeQuestion());
      service.questionIndex.set(3);
      service.totalQuestions.set(10);
      service.timeLimit.set(30);
      service.elapsedMs.set(5000);
      service.leaderboard.set([makeLeaderboardEntry()]);
      service.playerScore.set(500);
      service.playerNickname.set('TestPlayer');
      service.playerId.set('player-123');
      service.lastAnswerResult.set(makeAnswerResult());
      service.correctAnswerIndex.set(2);
      service.questions.set([makeQuestionInput()]);
      service.errorMessage.set('Some error');

      // Verify non-default state
      expect(service.role()).toBe('host');
      expect(service.roomCode()).toBe('ABC123');
      expect(service.gamePhase()).toBe('question');
      expect(service.players()).toHaveLength(1);

      // Reset
      service.reset();

      // Verify all defaults are restored
      expect(service.role()).toBeNull();
      expect(service.roomCode()).toBeNull();
      expect(service.gamePhase()).toBe('idle');
      expect(service.players()).toEqual([]);
      expect(service.currentQuestion()).toBeNull();
      expect(service.questionIndex()).toBe(0);
      expect(service.totalQuestions()).toBe(0);
      expect(service.timeLimit()).toBe(20);
      expect(service.elapsedMs()).toBe(0);
      expect(service.leaderboard()).toEqual([]);
      expect(service.playerScore()).toBe(0);
      expect(service.playerNickname()).toBe('');
      expect(service.playerId()).toBeNull();
      expect(service.lastAnswerResult()).toBeNull();
      expect(service.correctAnswerIndex()).toBeNull();
      expect(service.questions()).toEqual([]);
      expect(service.errorMessage()).toBeNull();
    });

    it('should also reset computed signals to their defaults', () => {
      service.lastAnswerResult.set(makeAnswerResult());
      service.leaderboard.set([makeLeaderboardEntry({ score: 100 })]);
      service.players.set([makePlayer({ hasAnswered: true })]);
      service.questionIndex.set(4);
      service.totalQuestions.set(5);

      expect(service.hasAnswered()).toBe(true);
      expect(service.sortedLeaderboard()).toHaveLength(1);
      expect(service.answeredCount()).toBe(1);
      expect(service.isLastQuestion()).toBe(true);

      service.reset();

      expect(service.hasAnswered()).toBe(false);
      expect(service.sortedLeaderboard()).toEqual([]);
      expect(service.answeredCount()).toBe(0);
      // isLastQuestion with index 0 and total 0: returns false (no questions loaded)
      expect(service.isLastQuestion()).toBe(false);
    });
  });
});
