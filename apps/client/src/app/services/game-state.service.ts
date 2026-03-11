import { computed, Injectable, signal } from '@angular/core';
import type { AnswerResult, GamePhase, LeaderboardEntry, PlayerInfo, QuestionInput, QuestionPublic } from '@bazam/shared-types';

/**
 * Centralized reactive game state store built on Angular signals.
 *
 * Holds all mutable state for a single game session -- role assignment,
 * room metadata, question progression, scoring, and error handling.
 * Both host and player components inject this service to read and display
 * the current game state; the {@link WebSocketService} is the sole writer
 * for most signals.
 *
 * @example
 * ```ts
 * const gameState = inject(GameStateService);
 * const phase = gameState.gamePhase(); // 'idle' | 'lobby' | 'question' | ...
 * ```
 */
@Injectable({ providedIn: 'root' })
export class GameStateService {
  // ---------------------------------------------------------------------------
  // Writable signals -- primary game state
  // ---------------------------------------------------------------------------

  /**
   * Role of the current user in the active session.
   *
   * Set to `'host'` when creating a room, `'player'` when joining,
   * or `null` when no session is active.
   */
  readonly role = signal<'host' | 'player' | null>(null);

  /**
   * Six-digit alphanumeric room code identifying the current game session.
   * `null` when no room has been created or joined.
   */
  readonly roomCode = signal<string | null>(null);

  /**
   * Current phase of the game lifecycle.
   * Drives which view is rendered in both host and player components.
   *
   * Transitions: idle -> lobby -> countdown -> question -> leaderboard -> finished
   */
  readonly gamePhase = signal<GamePhase>('idle');

  /** Live roster of all players currently connected to the room. */
  readonly players = signal<PlayerInfo[]>([]);

  /**
   * The current question being displayed to players.
   * Contains answer text but not the correct answer index (server-authoritative).
   * `null` between questions or before the game starts.
   */
  readonly currentQuestion = signal<QuestionPublic | null>(null);

  /** Zero-based index of the current question within the quiz. */
  readonly questionIndex = signal<number>(0);

  /** Total number of questions in the active quiz session. */
  readonly totalQuestions = signal<number>(0);

  /** Time limit for the current question in seconds. Defaults to 20. */
  readonly timeLimit = signal<number>(20);

  /** Leaderboard entries received from the server after each question closes. */
  readonly leaderboard = signal<LeaderboardEntry[]>([]);

  /** The current player's cumulative score across all answered questions. */
  readonly playerScore = signal<number>(0);

  /** The current player's chosen display name (set during the join flow). */
  readonly playerNickname = signal<string>('');

  /**
   * Result of the player's most recent answer submission.
   * Contains correctness, points earned, and updated total score.
   * Reset to `null` when a new question begins.
   */
  readonly lastAnswerResult = signal<AnswerResult | null>(null);

  /** Questions authored by the host, stored locally until the room is created. */
  readonly questions = signal<QuestionInput[]>([]);

  /** User-facing error message. `null` when there is no active error. */
  readonly errorMessage = signal<string | null>(null);

  // ---------------------------------------------------------------------------
  // Computed signals -- derived state
  // ---------------------------------------------------------------------------

  /**
   * Whether the player has already submitted an answer for the current question.
   * Derived from {@link lastAnswerResult} being non-null.
   */
  readonly hasAnswered = computed(() => this.lastAnswerResult() !== null);

  /** Leaderboard entries sorted by score in descending order. */
  readonly sortedLeaderboard = computed(() =>
    [...this.leaderboard()].sort((a, b) => b.score - a.score)
  );

  /** Top three players extracted from the sorted leaderboard. */
  readonly topThree = computed(() => this.sortedLeaderboard().slice(0, 3));

  /** Number of players who have submitted an answer for the current question. */
  readonly answeredCount = computed(() => this.players().filter((p) => p.hasAnswered).length);

  /**
   * Whether the current question is the last one in the quiz.
   * Used to toggle "Next question" vs. "Results" button labels.
   */
  readonly isLastQuestion = computed(() => this.questionIndex() >= this.totalQuestions() - 1);

  /**
   * Resets every signal to its initial default value.
   * Called when a session ends (disconnect, play-again, or navigate home).
   */
  reset(): void {
    this.role.set(null);
    this.roomCode.set(null);
    this.gamePhase.set('idle');
    this.players.set([]);
    this.currentQuestion.set(null);
    this.questionIndex.set(0);
    this.totalQuestions.set(0);
    this.timeLimit.set(20);
    this.leaderboard.set([]);
    this.playerScore.set(0);
    this.playerNickname.set('');
    this.lastAnswerResult.set(null);
    this.questions.set([]);
    this.errorMessage.set(null);
  }
}
