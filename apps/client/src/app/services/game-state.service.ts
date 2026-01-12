import { computed, Injectable, signal } from '@angular/core';
import type { AnswerResult, GamePhase, LeaderboardEntry, PlayerInfo, QuestionInput, QuestionPublic } from '@bazam/shared-types';

@Injectable({ providedIn: 'root' })
export class GameStateService {
  readonly role = signal<'host' | 'player' | null>(null);
  readonly roomCode = signal<string | null>(null);
  readonly gamePhase = signal<GamePhase>('idle');
  readonly players = signal<PlayerInfo[]>([]);
  readonly currentQuestion = signal<QuestionPublic | null>(null);
  readonly questionIndex = signal<number>(0);
  readonly totalQuestions = signal<number>(0);
  readonly timeLimit = signal<number>(20);
  readonly leaderboard = signal<LeaderboardEntry[]>([]);
  readonly playerScore = signal<number>(0);
  readonly playerNickname = signal<string>('');
  readonly lastAnswerResult = signal<AnswerResult | null>(null);
  readonly questions = signal<QuestionInput[]>([]);
  readonly errorMessage = signal<string | null>(null);

  readonly hasAnswered = computed(() => this.lastAnswerResult() !== null);
  readonly sortedLeaderboard = computed(() =>
    [...this.leaderboard()].sort((a, b) => b.score - a.score)
  );
  readonly topThree = computed(() => this.sortedLeaderboard().slice(0, 3));
  readonly answeredCount = computed(() => this.players().filter((p) => p.hasAnswered).length);
  readonly isLastQuestion = computed(() => this.questionIndex() >= this.totalQuestions() - 1);

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
