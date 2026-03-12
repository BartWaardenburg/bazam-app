import { Component, ChangeDetectionStrategy, input, computed } from '@angular/core';

/** Data shape for a single team's score in the scoreboard. */
export interface TeamScore {
  readonly id: string;
  readonly name: string;
  readonly color: string;
  readonly icon: string;
  readonly score: number;
  readonly rank: number;
  readonly players: ReadonlyArray<{ nickname: string; score: number }>;
  readonly mvp?: string;
}

const RANK_LABELS = ['1e', '2e', '3e', '4e'] as const;

@Component({
  selector: 'bzm-team-scoreboard',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="bzm-team-scoreboard" role="region" aria-label="Team ranglijst">
      <div class="bzm-team-scoreboard__podium">
        @for (team of teams(); track team.id; let i = $index) {
          <div
            class="bzm-team-scoreboard__team"
            [class]="teamClasses(team)"
            [style.border-color]="team.color"
            [style.animation-delay]="(i * 0.2) + 's'"
          >
            <div class="bzm-team-scoreboard__rank">{{ rankLabel(i) }}</div>
            <div class="bzm-team-scoreboard__header" [style.background]="team.color">
              <i [class]="'ph-duotone ph-' + team.icon" style="font-size: 24px;"></i>
              <span class="bzm-team-scoreboard__team-name">{{ team.name }}</span>
            </div>

            <div class="bzm-team-scoreboard__score">{{ team.score }} pts</div>

            <ul class="bzm-team-scoreboard__players" role="list">
              @for (player of team.players; track player.nickname) {
                <li
                  class="bzm-team-scoreboard__player"
                  [class.bzm-team-scoreboard__player--mvp]="showMvp() && team.mvp === player.nickname"
                >
                  @if (showMvp() && team.mvp === player.nickname) {
                    <i class="ph-duotone ph-star" style="font-size: 14px; color: #eab308;"></i>
                  }
                  <span class="bzm-team-scoreboard__player-name">{{ player.nickname }}</span>
                  <span class="bzm-team-scoreboard__player-score">{{ player.score }}</span>
                </li>
              }
            </ul>
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

    .bzm-team-scoreboard__podium {
      display: flex;
      justify-content: center;
      align-items: flex-start;
      gap: var(--bzm-space-4);
      flex-wrap: wrap;
    }

    .bzm-team-scoreboard__team {
      display: flex;
      flex-direction: column;
      align-items: center;
      background: var(--bzm-color-surface);
      border: 4px solid var(--bzm-color-border);
      border-width: 3px 4px 5px 3px;
      border-radius: var(--bzm-radius-md);
      box-shadow: var(--bzm-shadow-card);
      overflow: hidden;
      min-width: 160px;
      flex: 1;
      max-width: 220px;
      animation: bzm-team-pop 0.5s var(--bzm-transition-playful) backwards;
    }

    .bzm-team-scoreboard__team--first {
      transform: scale(1.05);
      animation-name: bzm-team-pop-first;
    }

    .bzm-team-scoreboard__rank {
      font-family: var(--bzm-font-heading);
      font-size: var(--bzm-font-size-xl);
      font-weight: var(--bzm-font-weight-black);
      color: var(--bzm-color-text);
      padding: var(--bzm-space-2) 0 0;
    }

    .bzm-team-scoreboard__header {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: var(--bzm-space-2);
      width: 100%;
      padding: var(--bzm-space-3) var(--bzm-space-4);
      color: var(--bzm-white);
    }

    .bzm-team-scoreboard__team-name {
      font-size: var(--bzm-font-size-lg);
      font-weight: var(--bzm-font-weight-extrabold);
    }

    .bzm-team-scoreboard__score {
      font-size: var(--bzm-font-size-2xl);
      font-weight: var(--bzm-font-weight-black);
      color: var(--bzm-color-accent-dark);
      text-shadow: 1px 1px 0 var(--bzm-black);
      -webkit-text-stroke: 1px var(--bzm-black);
      paint-order: stroke fill;
      padding: var(--bzm-space-3) 0 var(--bzm-space-2);
    }

    .bzm-team-scoreboard__players {
      list-style: none;
      margin: 0;
      padding: 0 var(--bzm-space-3) var(--bzm-space-3);
      width: 100%;
    }

    .bzm-team-scoreboard__player {
      display: flex;
      align-items: center;
      gap: var(--bzm-space-1);
      padding: var(--bzm-space-1) 0;
      font-size: var(--bzm-font-size-sm);
      border-bottom: 1px solid var(--bzm-gray-200);
    }

    .bzm-team-scoreboard__player:last-child {
      border-bottom: none;
    }

    .bzm-team-scoreboard__player--mvp {
      font-weight: var(--bzm-font-weight-bold);
    }

    .bzm-team-scoreboard__player-name {
      flex: 1;
      color: var(--bzm-color-text);
    }

    .bzm-team-scoreboard__player-score {
      font-weight: var(--bzm-font-weight-bold);
      color: var(--bzm-color-text-secondary);
    }

    @keyframes bzm-team-pop {
      from {
        transform: scale(0) translateY(20px);
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }

    @keyframes bzm-team-pop-first {
      from {
        transform: scale(0) translateY(20px);
        opacity: 0;
      }
      to {
        transform: scale(1.05);
        opacity: 1;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .bzm-team-scoreboard__team {
        animation: none;
      }
    }
  `,
})
/**
 * Displays team standings in a podium-style layout with individual player scores
 * and optional MVP highlighting for Team Battle mode.
 *
 * Each team block features a colored header with icon and name, total score,
 * and a player list. The top team is scaled up for emphasis. MVP players are
 * highlighted with a star icon.
 *
 * @selector bzm-team-scoreboard
 *
 * @example
 * ```html
 * <bzm-team-scoreboard
 *   [teams]="teamScores"
 *   [showMvp]="true"
 * />
 * ```
 */
export class BzmTeamScoreboardComponent {
  /** Array of team scores sorted by rank. */
  readonly teams = input.required<TeamScore[]>();

  /** Whether to highlight MVP players with a star icon. @default true */
  readonly showMvp = input<boolean>(true);

  protected teamClasses(team: TeamScore): string {
    const classes = ['bzm-team-scoreboard__team'];
    if (team.rank === 1) classes.push('bzm-team-scoreboard__team--first');
    return classes.join(' ');
  }

  protected rankLabel(index: number): string {
    return RANK_LABELS[index] ?? `${index + 1}e`;
  }
}
