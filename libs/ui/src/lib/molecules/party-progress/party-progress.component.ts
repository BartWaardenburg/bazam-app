import { Component, ChangeDetectionStrategy, input, computed } from '@angular/core';

/** Data shape for a single round in a party session. */
export interface PartyRound {
  readonly id: string;
  readonly roundNumber: number;
  readonly mode: string;
  readonly modeIcon: string;
  readonly status: 'upcoming' | 'active' | 'completed';
  readonly winnerName?: string;
}

@Component({
  selector: 'bzm-party-progress',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="bzm-party-progress"
      role="progressbar"
      [attr.aria-label]="'Ronde ' + currentRound() + ' van ' + totalRounds()"
      [attr.aria-valuenow]="currentRound()"
      [attr.aria-valuemin]="1"
      [attr.aria-valuemax]="totalRounds()"
    >
      <div class="bzm-party-progress__track">
        @for (round of rounds(); track round.id; let i = $index; let last = $last) {
          <div class="bzm-party-progress__node-group">
            <div
              [class]="nodeClasses(round)"
              [attr.aria-label]="'Ronde ' + round.roundNumber + ': ' + round.mode + ' (' + round.status + ')'"
            >
              @if (round.status === 'completed') {
                <i class="ph-duotone ph-check" style="font-size: 16px;"></i>
              } @else {
                <i [class]="'ph-duotone ph-' + round.modeIcon" style="font-size: 16px;"></i>
              }
            </div>
            @if (round.winnerName && round.status === 'completed') {
              <span class="bzm-party-progress__winner">{{ round.winnerName }}</span>
            }
            @if (round.status === 'active') {
              <span class="bzm-party-progress__label">Ronde {{ round.roundNumber }}</span>
            }
            @if (!last) {
              <div
                class="bzm-party-progress__connector"
                [class.bzm-party-progress__connector--completed]="round.status === 'completed'"
              ></div>
            }
          </div>
        }
      </div>
    </div>
  `,
  styles: `
    :host {
      display: block;
      font-family: var(--bzm-font-family);
    }

    .bzm-party-progress {
      width: 100%;
      overflow-x: auto;
      scrollbar-width: thin;
      -webkit-overflow-scrolling: touch;
    }

    .bzm-party-progress__track {
      display: flex;
      align-items: flex-start;
      min-width: max-content;
      padding: var(--bzm-space-4) var(--bzm-space-2);
    }

    .bzm-party-progress__node-group {
      display: flex;
      flex-direction: column;
      align-items: center;
      position: relative;
    }

    .bzm-party-progress__node {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      border: 3px solid var(--bzm-color-border);
      background: var(--bzm-color-surface);
      color: var(--bzm-color-text-muted);
      flex-shrink: 0;
      position: relative;
      z-index: 1;
      transition: transform var(--bzm-transition-playful),
                  border-color var(--bzm-transition-base),
                  background var(--bzm-transition-base);
    }

    .bzm-party-progress__node--upcoming {
      border-style: dashed;
      border-color: var(--bzm-color-text-muted);
      background: var(--bzm-color-bg);
      color: var(--bzm-color-text-muted);
    }

    .bzm-party-progress__node--active {
      width: 48px;
      height: 48px;
      border-color: var(--bzm-color-primary);
      border-width: 4px;
      background: var(--bzm-color-primary-surface);
      color: var(--bzm-color-primary);
      box-shadow: 0 0 0 4px rgba(var(--bzm-color-primary-rgb), 0.2);
      animation: bzm-pulse-ring 2s ease-in-out infinite;
    }

    .bzm-party-progress__node--completed {
      border-color: var(--bzm-color-success);
      background: var(--bzm-color-success);
      color: var(--bzm-white);
      border-width: 3px;
      border-style: solid;
    }

    .bzm-party-progress__connector {
      width: 40px;
      height: 3px;
      background: var(--bzm-color-text-muted);
      opacity: 0.3;
      position: absolute;
      top: 20px;
      left: 100%;
      transform: translateX(-2px);
      z-index: 0;
    }

    .bzm-party-progress__node--active ~ .bzm-party-progress__connector {
      top: 24px;
    }

    .bzm-party-progress__connector--completed {
      background: var(--bzm-color-success);
      opacity: 1;
    }

    .bzm-party-progress__winner {
      margin-top: var(--bzm-space-1);
      font-size: 10px;
      font-weight: var(--bzm-font-weight-bold);
      color: var(--bzm-color-success);
      white-space: nowrap;
      max-width: 60px;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .bzm-party-progress__label {
      margin-top: var(--bzm-space-1);
      font-size: 10px;
      font-weight: var(--bzm-font-weight-extrabold);
      color: var(--bzm-color-primary);
      white-space: nowrap;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    @keyframes bzm-pulse-ring {
      0%, 100% {
        box-shadow: 0 0 0 4px rgba(var(--bzm-color-primary-rgb), 0.2);
      }
      50% {
        box-shadow: 0 0 0 8px rgba(var(--bzm-color-primary-rgb), 0.05);
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .bzm-party-progress__node--active {
        animation: none;
      }

      .bzm-party-progress__node {
        transition: none;
      }
    }
  `,
})
/**
 * Displays a horizontal timeline of round indicators for a multi-round party
 * session. Each round is shown as a circle node with the game mode icon.
 * Completed rounds are green with a checkmark, the active round pulses with
 * a colored border, and upcoming rounds are dashed/grey. Winner names appear
 * below completed rounds.
 *
 * @selector bzm-party-progress
 *
 * @example
 * ```html
 * <bzm-party-progress
 *   [rounds]="partyRounds"
 *   [currentRound]="2"
 *   [totalRounds]="5"
 * />
 * ```
 */
export class BzmPartyProgressComponent {
  /** All rounds in the party session. */
  readonly rounds = input.required<PartyRound[]>();

  /** Current round number (1-indexed). */
  readonly currentRound = input.required<number>();

  /** Total number of rounds in the party session. */
  readonly totalRounds = input.required<number>();

  /** Computes the CSS class list for a round node based on its status. */
  protected nodeClasses(round: PartyRound): string {
    const classes = ['bzm-party-progress__node'];
    classes.push(`bzm-party-progress__node--${round.status}`);
    return classes.join(' ');
  }
}
