import { Component, ChangeDetectionStrategy, input, computed, signal, effect } from '@angular/core';

/** Data shape for a player in the intermission standings. */
export interface IntermissionPlayer {
  readonly id: string;
  readonly nickname: string;
  readonly totalScore: number;
  readonly rank: number;
  readonly rankChange: number;
}

@Component({
  selector: 'bzm-round-intermission',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="bzm-intermission" role="status" aria-live="polite">
      <div class="bzm-intermission__backdrop"></div>

      <div class="bzm-intermission__content">
        <h1 class="bzm-intermission__title">
          RONDE {{ roundNumber() }} KLAAR!
        </h1>

        <div class="bzm-intermission__standings" role="list" aria-label="Tussenstand">
          <h2 class="bzm-intermission__standings-title">Tussenstand</h2>
          @for (player of visibleStandings(); track player.id; let i = $index) {
            <div
              class="bzm-intermission__player"
              role="listitem"
              [style.animation-delay]="(i * 0.1) + 's'"
            >
              <span class="bzm-intermission__rank">{{ player.rank }}</span>
              <span class="bzm-intermission__nickname">{{ player.nickname }}</span>
              <span [class]="rankChangeClass(player.rankChange)">
                {{ rankChangeLabel(player.rankChange) }}
              </span>
              <span class="bzm-intermission__score">{{ player.totalScore }} pts</span>
            </div>
          }
        </div>

        <div class="bzm-intermission__next">
          <i [class]="'ph-duotone ph-' + nextModeIcon()" style="font-size: 24px;"></i>
          <span class="bzm-intermission__next-text">
            Volgende ronde: <strong>{{ nextMode() }}</strong>
          </span>
        </div>

        <div class="bzm-intermission__countdown" aria-label="Volgende ronde begint binnenkort">
          <div
            class="bzm-intermission__countdown-bar"
            [style.animation-duration]="countdownSeconds() + 's'"
          ></div>
          <span class="bzm-intermission__countdown-text">
            Volgende ronde in {{ remaining() }}s
          </span>
        </div>
      </div>
    </div>
  `,
  styles: `
    :host {
      display: block;
      font-family: var(--bzm-font-family);
    }

    .bzm-intermission {
      position: fixed;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }

    .bzm-intermission__backdrop {
      position: absolute;
      inset: 0;
      background: rgba(0, 0, 0, 0.75);
      backdrop-filter: blur(4px);
    }

    .bzm-intermission__content {
      position: relative;
      z-index: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--bzm-space-6);
      width: 90%;
      max-width: 480px;
      padding: var(--bzm-space-8);
      animation: bzm-intermission-enter 0.5s var(--bzm-transition-playful);
    }

    .bzm-intermission__title {
      margin: 0;
      font-family: var(--bzm-font-heading);
      font-size: clamp(1.8rem, 6vw, 3rem);
      font-weight: var(--bzm-font-weight-black);
      color: var(--bzm-color-accent);
      text-shadow: 3px 3px 0 var(--bzm-black);
      -webkit-text-stroke: 2px var(--bzm-black);
      paint-order: stroke fill;
      text-transform: uppercase;
      text-align: center;
      letter-spacing: 0.04em;
      animation: bzm-title-pop 0.6s var(--bzm-transition-playful);
    }

    .bzm-intermission__standings {
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: var(--bzm-space-2);
    }

    .bzm-intermission__standings-title {
      margin: 0;
      font-size: var(--bzm-font-size-sm);
      font-weight: var(--bzm-font-weight-extrabold);
      color: var(--bzm-white);
      text-transform: uppercase;
      letter-spacing: 0.1em;
      opacity: 0.7;
    }

    .bzm-intermission__player {
      display: flex;
      align-items: center;
      gap: var(--bzm-space-3);
      padding: var(--bzm-space-3) var(--bzm-space-4);
      background: var(--bzm-color-surface);
      border: 4px solid var(--bzm-color-border);
      border-width: var(--bzm-border-width-comic);
      border-radius: var(--bzm-radius-md);
      box-shadow: var(--bzm-shadow-sm);
      animation: bzm-player-slide 0.4s var(--bzm-transition-playful) backwards;
    }

    .bzm-intermission__rank {
      font-size: var(--bzm-font-size-lg);
      font-weight: var(--bzm-font-weight-black);
      color: var(--bzm-color-primary);
      min-width: 28px;
      text-align: center;
    }

    .bzm-intermission__nickname {
      flex: 1;
      font-size: var(--bzm-font-size-base);
      font-weight: var(--bzm-font-weight-bold);
      color: var(--bzm-color-text);
    }

    .bzm-intermission__rank-change {
      font-size: var(--bzm-font-size-sm);
      font-weight: var(--bzm-font-weight-extrabold);
      min-width: 32px;
      text-align: center;
    }

    .bzm-intermission__rank-change--up {
      color: var(--bzm-color-success);
    }

    .bzm-intermission__rank-change--down {
      color: var(--bzm-color-error);
    }

    .bzm-intermission__rank-change--same {
      color: var(--bzm-color-text-muted);
    }

    .bzm-intermission__score {
      font-size: var(--bzm-font-size-base);
      font-weight: var(--bzm-font-weight-extrabold);
      color: var(--bzm-color-accent-dark);
      white-space: nowrap;
    }

    .bzm-intermission__next {
      display: flex;
      align-items: center;
      gap: var(--bzm-space-3);
      padding: var(--bzm-space-3) var(--bzm-space-5);
      background: var(--bzm-color-primary-surface);
      border: 3px solid var(--bzm-color-primary);
      border-radius: var(--bzm-radius-md);
      color: var(--bzm-color-primary);
    }

    .bzm-intermission__next-text {
      font-size: var(--bzm-font-size-base);
      color: var(--bzm-color-text);
    }

    .bzm-intermission__next-text strong {
      font-weight: var(--bzm-font-weight-extrabold);
      color: var(--bzm-color-primary);
    }

    .bzm-intermission__countdown {
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--bzm-space-2);
    }

    .bzm-intermission__countdown-bar {
      width: 100%;
      height: 6px;
      border-radius: 9999px;
      background: var(--bzm-color-primary);
      transform-origin: left;
      animation: bzm-countdown-shrink linear forwards;
    }

    .bzm-intermission__countdown-text {
      font-size: var(--bzm-font-size-sm);
      font-weight: var(--bzm-font-weight-bold);
      color: var(--bzm-white);
      opacity: 0.8;
    }

    @keyframes bzm-intermission-enter {
      from {
        opacity: 0;
        transform: scale(0.9);
      }
      to {
        opacity: 1;
        transform: scale(1);
      }
    }

    @keyframes bzm-title-pop {
      0% {
        transform: scale(0);
        opacity: 0;
      }
      60% {
        transform: scale(1.15);
      }
      100% {
        transform: scale(1);
        opacity: 1;
      }
    }

    @keyframes bzm-player-slide {
      from {
        opacity: 0;
        transform: translateX(-20px);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }

    @keyframes bzm-countdown-shrink {
      from {
        transform: scaleX(1);
      }
      to {
        transform: scaleX(0);
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .bzm-intermission__content,
      .bzm-intermission__title,
      .bzm-intermission__player,
      .bzm-intermission__countdown-bar {
        animation: none;
      }
    }
  `,
})
/**
 * Displays a full-screen intermission overlay between party rounds, showing
 * current standings with rank change indicators, a preview of the next round's
 * game mode, and a countdown bar until the next round begins. Features
 * staggered entrance animations for each player row.
 *
 * @selector bzm-round-intermission
 *
 * @example
 * ```html
 * <bzm-round-intermission
 *   [roundNumber]="2"
 *   [totalRounds]="5"
 *   nextMode="Blitz"
 *   nextModeIcon="lightning"
 *   [standings]="currentStandings"
 *   [countdownSeconds]="15"
 * />
 * ```
 */
export class BzmRoundIntermissionComponent {
  /** The round number that was just completed. */
  readonly roundNumber = input.required<number>();

  /** Total number of rounds in the party session. */
  readonly totalRounds = input.required<number>();

  /** Display name of the next round's game mode. */
  readonly nextMode = input.required<string>();

  /** Phosphor icon name for the next round's game mode (without 'ph-' prefix). */
  readonly nextModeIcon = input.required<string>();

  /** Current overall standings sorted by rank. */
  readonly standings = input.required<IntermissionPlayer[]>();

  /**
   * Countdown time in seconds until the next round starts.
   * @default 15
   */
  readonly countdownSeconds = input<number>(15);

  /**
   * Maximum number of standings rows to display.
   * @default 5
   */
  readonly maxStandings = input<number>(5);

  protected readonly remaining = signal(0);

  constructor() {
    effect((onCleanup) => {
      const seconds = this.countdownSeconds();
      this.remaining.set(seconds);

      const id = setInterval(() => {
        this.remaining.update(v => {
          if (v <= 1) {
            clearInterval(id);
            return 0;
          }
          return v - 1;
        });
      }, 1000);

      onCleanup(() => clearInterval(id));
    });
  }

  /** The standings limited to the configured maximum. */
  protected readonly visibleStandings = computed(() =>
    this.standings().slice(0, this.maxStandings())
  );

  /** Returns the CSS class for a rank change indicator. */
  protected rankChangeClass(change: number): string {
    const base = 'bzm-intermission__rank-change';
    if (change > 0) return `${base} ${base}--up`;
    if (change < 0) return `${base} ${base}--down`;
    return `${base} ${base}--same`;
  }

  /** Returns the display label for a rank change value. */
  protected rankChangeLabel(change: number): string {
    if (change > 0) return `+${change}`;
    if (change < 0) return `${change}`;
    return '\u2014';
  }
}
