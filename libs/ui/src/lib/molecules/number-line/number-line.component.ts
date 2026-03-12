import { Component, ChangeDetectionStrategy, input, computed } from '@angular/core';

/** A single player's guess on the number line. */
export interface NumberLineGuess {
  readonly id: string;
  readonly nickname: string;
  readonly guess: number;
  readonly color?: string;
}

/** Default colors assigned to guesses that have no explicit color. */
const DEFAULT_COLORS = [
  'var(--bzm-color-answer-a)',
  'var(--bzm-color-answer-b)',
  'var(--bzm-color-answer-c)',
  'var(--bzm-color-answer-d)',
  'var(--bzm-color-primary)',
  'var(--bzm-color-accent)',
] as const;

@Component({
  selector: 'bzm-number-line',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="bzm-number-line" aria-label="Getallenlijn met gokken">
      <!-- Guess markers -->
      <div class="bzm-number-line__markers">
        @for (marker of markers(); track marker.id) {
          <div
            class="bzm-number-line__marker"
            [class.bzm-number-line__marker--winner]="marker.id === highlightWinnerId()"
            [style.left.%]="marker.position"
            [style.--marker-color]="marker.color"
            [attr.aria-label]="marker.nickname + ': ' + marker.guess"
          >
            @if (marker.id === highlightWinnerId()) {
              <span class="bzm-number-line__crown" aria-hidden="true">
                <i class="ph-duotone ph-crown"></i>
              </span>
            }
            <span class="bzm-number-line__dot"></span>
            <span class="bzm-number-line__name">{{ marker.nickname }}</span>
            <span class="bzm-number-line__guess-value">{{ marker.guess }}</span>
          </div>
        }
      </div>

      <!-- The line itself -->
      <div class="bzm-number-line__track">
        <div class="bzm-number-line__rail"></div>

        <!-- Correct answer marker -->
        @if (showAnswer()) {
          <div
            class="bzm-number-line__answer"
            [style.left.%]="answerPosition()"
            aria-label="Juiste antwoord: {{ correctAnswer() }}"
          >
            <span class="bzm-number-line__answer-icon">
              <i class="ph-duotone ph-star"></i>
            </span>
            <span class="bzm-number-line__answer-label">{{ correctAnswer() }}</span>
          </div>
        }

        <!-- Distance lines from guesses to answer -->
        @if (showAnswer()) {
          @for (marker of markers(); track marker.id) {
            <div
              class="bzm-number-line__distance"
              [style.left.%]="distanceLeft(marker.position, answerPosition())"
              [style.width.%]="distanceWidth(marker.position, answerPosition())"
              [style.--marker-color]="marker.color"
            ></div>
          }
        }
      </div>

      <!-- Min / Max labels -->
      <div class="bzm-number-line__bounds">
        <span class="bzm-number-line__bound">{{ min() }}</span>
        <span class="bzm-number-line__bound">{{ max() }}</span>
      </div>
    </div>
  `,
  styles: `
    :host {
      display: block;
      font-family: var(--bzm-font-family);
    }

    .bzm-number-line {
      position: relative;
      padding: 100px var(--bzm-space-6) var(--bzm-space-4);
    }

    /* ── Markers container ── */
    .bzm-number-line__markers {
      position: relative;
      height: 80px;
      margin-bottom: var(--bzm-space-2);
    }

    .bzm-number-line__marker {
      position: absolute;
      bottom: 0;
      transform: translateX(-50%);
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 2px;
      animation: bzm-marker-slide 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) backwards;
    }

    .bzm-number-line__crown {
      font-size: var(--bzm-font-size-xl);
      color: #FFD700;
      filter: drop-shadow(1px 1px 0 var(--bzm-black));
      animation: bzm-crown-bounce 0.6s ease 0.8s backwards;
    }

    .bzm-number-line__dot {
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: var(--marker-color, var(--bzm-color-primary));
      border: 3px solid var(--bzm-color-border);
      box-shadow: var(--bzm-shadow-sm);
      transition: transform var(--bzm-transition-playful);
    }

    .bzm-number-line__marker--winner .bzm-number-line__dot {
      width: 26px;
      height: 26px;
      box-shadow: 0 0 12px color-mix(in srgb, var(--marker-color, var(--bzm-color-primary)) 60%, transparent);
    }

    .bzm-number-line__name {
      font-size: var(--bzm-font-size-sm);
      font-weight: var(--bzm-font-weight-bold);
      color: var(--bzm-color-text);
      white-space: nowrap;
      text-shadow: 1px 1px 0 var(--bzm-color-surface);
    }

    .bzm-number-line__guess-value {
      font-size: 11px;
      font-weight: var(--bzm-font-weight-bold);
      color: var(--bzm-color-text-muted);
    }

    /* ── Track ── */
    .bzm-number-line__track {
      position: relative;
      height: 12px;
      margin: 0 var(--bzm-space-2);
    }

    .bzm-number-line__rail {
      position: absolute;
      top: 50%;
      left: 0;
      right: 0;
      height: 8px;
      transform: translateY(-50%);
      background: var(--bzm-color-surface);
      border: 3px solid var(--bzm-color-border);
      border-width: 2px 3px 3px 2px;
      border-radius: 4px;
      box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    /* ── Correct answer ── */
    .bzm-number-line__answer {
      position: absolute;
      top: 50%;
      transform: translate(-50%, -50%);
      display: flex;
      flex-direction: column;
      align-items: center;
      z-index: 2;
      animation: bzm-answer-pop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) 0.3s backwards;
    }

    .bzm-number-line__answer-icon {
      font-size: var(--bzm-font-size-3xl);
      color: var(--bzm-color-success);
      filter: drop-shadow(2px 2px 0 var(--bzm-black));
      line-height: 1;
    }

    .bzm-number-line__answer-label {
      font-size: var(--bzm-font-size-sm);
      font-weight: var(--bzm-font-weight-extrabold);
      color: var(--bzm-color-success);
      background: var(--bzm-color-surface);
      padding: 1px var(--bzm-space-2);
      border-radius: 3px;
      border: 2px solid var(--bzm-color-success);
      border-width: 1px 2px 2px 1px;
      white-space: nowrap;
    }

    /* ── Distance lines ── */
    .bzm-number-line__distance {
      position: absolute;
      top: 50%;
      height: 3px;
      transform: translateY(-50%);
      background: var(--marker-color, var(--bzm-color-primary));
      opacity: 0.4;
      border-radius: 2px;
      animation: bzm-distance-grow 0.4s ease 0.6s backwards;
    }

    /* ── Bounds ── */
    .bzm-number-line__bounds {
      display: flex;
      justify-content: space-between;
      margin-top: var(--bzm-space-2);
      padding: 0 var(--bzm-space-2);
    }

    .bzm-number-line__bound {
      font-size: var(--bzm-font-size-sm);
      font-weight: var(--bzm-font-weight-bold);
      color: var(--bzm-color-text-muted);
      background: var(--bzm-color-surface);
      padding: var(--bzm-space-1) var(--bzm-space-2);
      border: 3px solid var(--bzm-color-border);
      border-width: 2px 3px 3px 2px;
      border-radius: 3px;
      box-shadow: var(--bzm-shadow-sm);
    }

    /* ── Animations ── */
    @keyframes bzm-marker-slide {
      from {
        opacity: 0;
        transform: translateX(-50%) translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateX(-50%) translateY(0);
      }
    }

    @keyframes bzm-crown-bounce {
      from {
        opacity: 0;
        transform: scale(0) rotate(-20deg);
      }
      to {
        opacity: 1;
        transform: scale(1) rotate(0);
      }
    }

    @keyframes bzm-answer-pop {
      from {
        opacity: 0;
        transform: translate(-50%, -50%) scale(0);
      }
      to {
        opacity: 1;
        transform: translate(-50%, -50%) scale(1);
      }
    }

    @keyframes bzm-distance-grow {
      from {
        transform: translateY(-50%) scaleX(0);
      }
      to {
        transform: translateY(-50%) scaleX(1);
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .bzm-number-line__marker,
      .bzm-number-line__crown,
      .bzm-number-line__answer,
      .bzm-number-line__distance {
        animation: none;
      }
    }
  `,
})
/**
 * Displays a horizontal number line showing all player guesses and the correct
 * answer for "Closest Wins" reveal rounds.
 *
 * Guesses appear as colored markers positioned proportionally along the line.
 * When the answer is revealed, a star marker appears at the correct position
 * and distance lines are drawn from each guess to the answer. The winner's
 * marker is highlighted with a glow and crown icon.
 *
 * @selector bzm-number-line
 *
 * @example
 * ```html
 * <bzm-number-line
 *   [guesses]="playerGuesses"
 *   [correctAnswer]="42"
 *   [min]="0"
 *   [max]="100"
 *   [showAnswer]="true"
 *   [highlightWinnerId]="closestPlayerId"
 * />
 * ```
 */
export class BzmNumberLineComponent {
  /** All player guesses to display on the number line. */
  readonly guesses = input.required<NumberLineGuess[]>();

  /** The correct answer value, shown as a star marker when revealed. */
  readonly correctAnswer = input.required<number>();

  /** Left bound of the number line. */
  readonly min = input.required<number>();

  /** Right bound of the number line. */
  readonly max = input.required<number>();

  /** ID of the winning player (closest guess). Shows a crown and glow. @default null */
  readonly highlightWinnerId = input<string | null>(null);

  /** Whether to reveal the correct answer marker and distance lines. @default false */
  readonly showAnswer = input<boolean>(false);

  /** Computes positioned markers with colors for each guess. */
  protected readonly markers = computed(() =>
    this.guesses().map((g, i) => ({
      ...g,
      position: this.toPercent(g.guess),
      color: g.color ?? DEFAULT_COLORS[i % DEFAULT_COLORS.length],
    }))
  );

  /** Computes the position of the correct answer as a percentage. */
  protected readonly answerPosition = computed(() =>
    this.toPercent(this.correctAnswer())
  );

  /** Returns the leftmost percentage of a distance line between marker and answer. */
  protected distanceLeft(markerPos: number, answerPos: number): number {
    return Math.min(markerPos, answerPos);
  }

  /** Returns the width percentage of a distance line between marker and answer. */
  protected distanceWidth(markerPos: number, answerPos: number): number {
    return Math.abs(markerPos - answerPos);
  }

  /** Converts a numeric value to a percentage position on the line. */
  private toPercent(value: number): number {
    const lo = this.min();
    const hi = this.max();
    if (hi === lo) return 50;
    const pct = ((value - lo) / (hi - lo)) * 100;
    return Math.max(0, Math.min(100, pct));
  }
}
