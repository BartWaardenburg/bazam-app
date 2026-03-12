import { Component, ChangeDetectionStrategy, input, output, computed } from '@angular/core';
import { DecimalPipe } from '@angular/common';

/** Result data for a single question within a round. */
export interface QuestionResult {
  readonly category: string;
  readonly correct: boolean;
  readonly score: number;
  readonly timeSeconds: number;
  readonly streak: number;
}

@Component({
  selector: 'bzm-round-summary',
  standalone: true,
  imports: [DecimalPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="round-summary" role="region" aria-label="Ronde samenvatting">
      <!-- Round type header -->
      <div
        class="round-summary__header"
        [class.round-summary__header--warmup]="roundType() === 'warmup'"
        [class.round-summary__header--challenge]="roundType() === 'challenge'"
        [class.round-summary__header--boss]="roundType() === 'boss'"
      >
        <span class="round-summary__round-icon" aria-hidden="true">
          <i [class]="roundIcon()" style="font-size: 28px;"></i>
        </span>
        <h2 class="round-summary__round-type">{{ roundLabel() }}</h2>
        @if (roundType() === 'boss' && bossModifier()) {
          <span class="round-summary__boss-modifier">
            <i class="ph-duotone ph-skull" aria-hidden="true" style="font-size: 16px;"></i>
            {{ bossModifier() }}
          </span>
        }
      </div>

      <!-- Pass / Fail indicator -->
      <div class="round-summary__result" [class.round-summary__result--passed]="passed()" [class.round-summary__result--failed]="!passed()">
        @if (passed()) {
          <div class="round-summary__result-icon round-summary__result-icon--passed" aria-hidden="true">
            <i class="ph-duotone ph-check-circle" style="font-size: 48px;"></i>
          </div>
          <span class="round-summary__result-text round-summary__result-text--passed">GEHAALD!</span>
        } @else {
          <div class="round-summary__result-icon round-summary__result-icon--failed" aria-hidden="true">
            <i class="ph-duotone ph-x-circle" style="font-size: 48px;"></i>
          </div>
          <span class="round-summary__result-text round-summary__result-text--failed">NIET GEHAALD</span>
        }
      </div>

      <!-- Score vs Target bar -->
      <div class="round-summary__progress" aria-label="Score voortgang">
        <div class="round-summary__progress-bar">
          <div
            class="round-summary__progress-fill"
            [class.round-summary__progress-fill--passed]="passed()"
            [class.round-summary__progress-fill--failed]="!passed()"
            [style.width.%]="progressPercent()"
          ></div>
          <div
            class="round-summary__progress-target"
            [style.left.%]="targetPercent()"
            aria-hidden="true"
          >
            <span class="round-summary__progress-target-line"></span>
          </div>
        </div>
        <div class="round-summary__progress-labels">
          <span class="round-summary__progress-score">{{ currentScore() | number }} pts</span>
          <span class="round-summary__progress-separator">/</span>
          <span class="round-summary__progress-target-text">{{ targetScore() | number }} pts</span>
        </div>
      </div>

      <!-- Question breakdown -->
      <div class="round-summary__questions" role="list" aria-label="Vraag resultaten">
        @for (question of questions(); track $index; let i = $index) {
          <div
            class="round-summary__question"
            [class.round-summary__question--correct]="question.correct"
            [class.round-summary__question--wrong]="!question.correct"
            role="listitem"
            [attr.aria-label]="question.category + (question.correct ? ' correct' : ' fout') + ' ' + question.score + ' punten'"
          >
            <span class="round-summary__question-num">{{ i + 1 }}</span>
            <span class="round-summary__question-category">
              <i class="ph-duotone ph-folder-simple" aria-hidden="true" style="font-size: 16px;"></i>
              {{ question.category }}
            </span>
            <span class="round-summary__question-result" aria-hidden="true">
              @if (question.correct) {
                <i class="ph-duotone ph-check" style="font-size: 18px;"></i>
              } @else {
                <i class="ph-duotone ph-x" style="font-size: 18px;"></i>
              }
            </span>
            <span class="round-summary__question-score">{{ question.score }}</span>
            <span class="round-summary__question-time">{{ question.timeSeconds }}s</span>
            @if (question.streak >= 3) {
              <span class="round-summary__question-streak" aria-label="Streak van {{ question.streak }}">
                <i class="ph-duotone ph-fire" aria-hidden="true" style="font-size: 14px;"></i>
                {{ question.streak }}
              </span>
            }
          </div>
        }
      </div>

      <!-- Combo section -->
      @if (comboName()) {
        <div class="round-summary__combo" role="status" aria-label="Combo bonus">
          <div class="round-summary__combo-header">
            <i class="ph-duotone ph-lightning" aria-hidden="true" style="font-size: 24px;"></i>
            <span class="round-summary__combo-name">{{ comboName() }}</span>
          </div>
          <span class="round-summary__combo-bonus">+{{ comboBonus() }} pts</span>
        </div>
      }

      <!-- Continue button -->
      <button
        class="round-summary__continue"
        type="button"
        (click)="continueClicked.emit()"
        aria-label="Doorgaan"
      >
        Doorgaan
        <i class="ph-duotone ph-arrow-right" aria-hidden="true" style="font-size: 20px;"></i>
      </button>
    </div>
  `,
  styles: `
    :host {
      display: block;
      font-family: var(--bzm-font-family);
    }

    .round-summary {
      max-width: 480px;
      margin: 0 auto;
    }

    /* Header */
    .round-summary__header {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--bzm-space-2);
      padding: var(--bzm-space-4) var(--bzm-space-4) var(--bzm-space-5);
      border-radius: var(--bzm-radius-lg);
      border: 4px solid var(--bzm-black);
      border-width: 3px 4px 5px 3px;
      margin-bottom: var(--bzm-space-5);
      text-align: center;
    }

    .round-summary__header--warmup {
      background: linear-gradient(135deg, #86efac, #4ade80);
      box-shadow: 4px 4px 0 var(--bzm-black);
    }

    .round-summary__header--challenge {
      background: linear-gradient(135deg, #93c5fd, #3b82f6);
      box-shadow: 4px 4px 0 var(--bzm-black);
    }

    .round-summary__header--boss {
      background: linear-gradient(135deg, #fca5a5, #ef4444);
      box-shadow: 4px 4px 0 var(--bzm-black);
    }

    .round-summary__round-icon {
      color: var(--bzm-white);
      filter: drop-shadow(2px 2px 0 var(--bzm-black));
    }

    .round-summary__round-type {
      margin: 0;
      font-family: var(--bzm-font-heading);
      font-size: var(--bzm-font-size-2xl);
      color: var(--bzm-white);
      text-shadow: 2px 2px 0 var(--bzm-black);
      -webkit-text-stroke: 1px var(--bzm-black);
      paint-order: stroke fill;
    }

    .round-summary__boss-modifier {
      display: inline-flex;
      align-items: center;
      gap: var(--bzm-space-1);
      padding: var(--bzm-space-1) var(--bzm-space-3);
      background: rgba(0, 0, 0, 0.3);
      border-radius: var(--bzm-radius-full);
      color: var(--bzm-white);
      font-size: var(--bzm-font-size-sm);
      font-weight: var(--bzm-font-weight-bold);
    }

    /* Result indicator */
    .round-summary__result {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--bzm-space-1);
      margin-bottom: var(--bzm-space-5);
      animation: bzm-result-pop 0.5s var(--bzm-transition-playful) backwards;
    }

    .round-summary__result-icon--passed {
      color: var(--bzm-color-success);
    }

    .round-summary__result-icon--failed {
      color: var(--bzm-color-error);
    }

    .round-summary__result-text {
      font-family: var(--bzm-font-heading);
      font-size: var(--bzm-font-size-2xl);
      font-weight: var(--bzm-font-weight-black);
    }

    .round-summary__result-text--passed {
      color: var(--bzm-color-success);
      text-shadow: 2px 2px 0 var(--bzm-black);
    }

    .round-summary__result-text--failed {
      color: var(--bzm-color-error);
      text-shadow: 2px 2px 0 var(--bzm-black);
    }

    /* Progress bar */
    .round-summary__progress {
      margin-bottom: var(--bzm-space-5);
    }

    .round-summary__progress-bar {
      position: relative;
      height: 24px;
      background: var(--bzm-gray-200);
      border-radius: var(--bzm-radius-full);
      border: 3px solid var(--bzm-black);
      overflow: visible;
    }

    .round-summary__progress-fill {
      height: 100%;
      border-radius: var(--bzm-radius-full);
      transition: width 0.8s var(--bzm-transition-playful);
    }

    .round-summary__progress-fill--passed {
      background: linear-gradient(90deg, var(--bzm-color-success), #4ade80);
    }

    .round-summary__progress-fill--failed {
      background: linear-gradient(90deg, var(--bzm-color-error), #f87171);
    }

    .round-summary__progress-target {
      position: absolute;
      top: -4px;
      bottom: -4px;
      transform: translateX(-50%);
    }

    .round-summary__progress-target-line {
      display: block;
      width: 3px;
      height: 100%;
      background: var(--bzm-black);
      border-radius: 2px;
    }

    .round-summary__progress-labels {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: var(--bzm-space-2);
      margin-top: var(--bzm-space-2);
    }

    .round-summary__progress-score {
      font-size: var(--bzm-font-size-xl);
      font-weight: var(--bzm-font-weight-black);
      color: var(--bzm-color-text);
    }

    .round-summary__progress-separator {
      font-size: var(--bzm-font-size-lg);
      color: var(--bzm-color-text-muted);
    }

    .round-summary__progress-target-text {
      font-size: var(--bzm-font-size-lg);
      font-weight: var(--bzm-font-weight-bold);
      color: var(--bzm-color-text-muted);
    }

    /* Question breakdown */
    .round-summary__questions {
      display: flex;
      flex-direction: column;
      gap: var(--bzm-space-2);
      margin-bottom: var(--bzm-space-5);
    }

    .round-summary__question {
      display: flex;
      align-items: center;
      gap: var(--bzm-space-2);
      padding: var(--bzm-space-3) var(--bzm-space-3);
      background: var(--bzm-color-surface);
      border: 3px solid var(--bzm-color-border);
      border-radius: var(--bzm-radius-md);
      animation: bzm-question-slide 0.3s ease-out backwards;
    }

    .round-summary__question--correct {
      border-left: 5px solid var(--bzm-color-success);
    }

    .round-summary__question--wrong {
      border-left: 5px solid var(--bzm-color-error);
    }

    .round-summary__question-num {
      font-size: var(--bzm-font-size-xs);
      font-weight: var(--bzm-font-weight-bold);
      color: var(--bzm-color-text-muted);
      min-width: 20px;
      text-align: center;
    }

    .round-summary__question-category {
      display: flex;
      align-items: center;
      gap: var(--bzm-space-1);
      flex: 1;
      font-size: var(--bzm-font-size-sm);
      font-weight: var(--bzm-font-weight-semibold);
      color: var(--bzm-color-text);
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .round-summary__question-result {
      flex-shrink: 0;
    }

    .round-summary__question--correct .round-summary__question-result {
      color: var(--bzm-color-success);
    }

    .round-summary__question--wrong .round-summary__question-result {
      color: var(--bzm-color-error);
    }

    .round-summary__question-score {
      font-size: var(--bzm-font-size-sm);
      font-weight: var(--bzm-font-weight-bold);
      color: var(--bzm-color-text);
      min-width: 40px;
      text-align: right;
    }

    .round-summary__question-time {
      font-size: var(--bzm-font-size-xs);
      color: var(--bzm-color-text-muted);
      min-width: 28px;
      text-align: right;
    }

    .round-summary__question-streak {
      display: inline-flex;
      align-items: center;
      gap: 2px;
      padding: 2px var(--bzm-space-1);
      background: #fbbf24;
      border-radius: var(--bzm-radius-sm);
      font-size: var(--bzm-font-size-xs);
      font-weight: var(--bzm-font-weight-bold);
      color: var(--bzm-black);
      flex-shrink: 0;
    }

    /* Combo */
    .round-summary__combo {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: var(--bzm-space-4);
      background: linear-gradient(135deg, #818cf820, #6366f120);
      border: 4px solid var(--bzm-color-primary);
      border-width: 3px 4px 5px 3px;
      border-radius: var(--bzm-radius-md);
      margin-bottom: var(--bzm-space-5);
      animation: bzm-combo-flash 0.6s ease-out;
    }

    .round-summary__combo-header {
      display: flex;
      align-items: center;
      gap: var(--bzm-space-2);
      color: var(--bzm-color-primary);
    }

    .round-summary__combo-name {
      font-size: var(--bzm-font-size-lg);
      font-weight: var(--bzm-font-weight-extrabold);
      color: var(--bzm-color-primary);
    }

    .round-summary__combo-bonus {
      font-size: var(--bzm-font-size-xl);
      font-weight: var(--bzm-font-weight-black);
      color: var(--bzm-color-accent-dark);
    }

    /* Continue button */
    .round-summary__continue {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: var(--bzm-space-2);
      width: 100%;
      padding: var(--bzm-space-4) var(--bzm-space-6);
      background: var(--bzm-color-primary);
      color: var(--bzm-white);
      border: 4px solid var(--bzm-black);
      border-width: 3px 4px 5px 3px;
      border-radius: var(--bzm-radius-md);
      font-family: var(--bzm-font-family);
      font-size: var(--bzm-font-size-lg);
      font-weight: var(--bzm-font-weight-extrabold);
      cursor: pointer;
      box-shadow: 4px 4px 0 var(--bzm-black);
      transition:
        transform var(--bzm-transition-playful),
        box-shadow var(--bzm-transition-base);
    }

    .round-summary__continue:hover {
      transform: translateY(-2px);
      box-shadow: 6px 6px 0 var(--bzm-black);
    }

    .round-summary__continue:active {
      transform: scale(0.98);
      box-shadow: 2px 2px 0 var(--bzm-black);
    }

    /* Animations */
    @keyframes bzm-result-pop {
      from {
        transform: scale(0);
        opacity: 0;
      }
      to {
        transform: scale(1);
        opacity: 1;
      }
    }

    @keyframes bzm-question-slide {
      from {
        transform: translateX(-12px);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }

    @keyframes bzm-combo-flash {
      0% { opacity: 0.6; }
      100% { opacity: 1; }
    }

    @media (prefers-reduced-motion: reduce) {
      .round-summary__result,
      .round-summary__question,
      .round-summary__combo {
        animation: none;
      }

      .round-summary__progress-fill {
        transition: none;
      }

      .round-summary__continue {
        transition: none;
      }
    }
  `,
})
/**
 * Displays end-of-round results for a singleplayer roguelike quiz round,
 * showing score vs target threshold, pass/fail status, and a per-question
 * breakdown with category, correctness, score, time, and streak indicators.
 *
 * Supports warmup, challenge, and boss round types with distinct header
 * styling. Boss rounds display an additional modifier name. Combo bonuses
 * are shown when triggered.
 *
 * @selector bzm-round-summary
 *
 * @example
 * ```html
 * <bzm-round-summary
 *   roundType="challenge"
 *   [currentScore]="1250"
 *   [targetScore]="1500"
 *   [passed]="false"
 *   [questions]="questionResults"
 *   (continueClicked)="onContinue()"
 * />
 * ```
 */
export class BzmRoundSummaryComponent {
  /** Type of round that was completed. */
  readonly roundType = input.required<'warmup' | 'challenge' | 'boss'>();

  /** Player's score for this round. */
  readonly currentScore = input.required<number>();

  /** Target score threshold to pass the round. */
  readonly targetScore = input.required<number>();

  /** Whether the player met the target score. */
  readonly passed = input.required<boolean>();

  /** Per-question breakdown results. */
  readonly questions = input.required<QuestionResult[]>();

  /** Name of the combo triggered, if any. @default null */
  readonly comboName = input<string | null>(null);

  /** Bonus points earned from the combo. @default 0 */
  readonly comboBonus = input<number>(0);

  /** Boss modifier name for boss rounds. @default null */
  readonly bossModifier = input<string | null>(null);

  /** Emits when the player clicks "Doorgaan". */
  readonly continueClicked = output<void>();

  protected readonly roundLabel = computed(() => {
    const labels: Record<string, string> = {
      warmup: 'Opwarmronde',
      challenge: 'Uitdagingronde',
      boss: 'Bossronde',
    };
    return labels[this.roundType()] ?? this.roundType();
  });

  protected readonly roundIcon = computed(() => {
    const icons: Record<string, string> = {
      warmup: 'ph-duotone ph-sun',
      challenge: 'ph-duotone ph-sword',
      boss: 'ph-duotone ph-skull',
    };
    return icons[this.roundType()] ?? 'ph-duotone ph-circle';
  });

  protected readonly progressPercent = computed(() => {
    const maxScore = Math.max(this.currentScore(), this.targetScore());
    if (maxScore === 0) return 100;
    return Math.min(100, (this.currentScore() / maxScore) * 100);
  });

  protected readonly targetPercent = computed(() => {
    const maxScore = Math.max(this.currentScore(), this.targetScore());
    if (maxScore === 0) return 100;
    return Math.min(100, (this.targetScore() / maxScore) * 100);
  });
}
