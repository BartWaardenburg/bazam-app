import { Component, ChangeDetectionStrategy, computed, input, output } from '@angular/core';

/** Configuration for a single team option. */
export interface TeamOption {
  readonly id: string;
  readonly name: string;
  readonly color: string;
  readonly icon: string;
  readonly playerCount: number;
}

@Component({
  selector: 'bzm-team-picker',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="bzm-team-picker" role="radiogroup" aria-label="Kies een team">
      @for (team of teams(); track team.id) {
        <button
          type="button"
          role="radio"
          [class]="teamClasses(team)"
          [style]="teamStyle(team)"
          [disabled]="isTeamFull(team)"
          [attr.aria-checked]="selectedTeamId() === team.id"
          [attr.aria-label]="team.name + (isTeamFull(team) ? ' (vol)' : '')"
          (click)="handleSelect(team)"
        >
          <div class="bzm-team-picker__icon" [style.background]="team.color">
            <i [class]="'ph-duotone ph-' + team.icon" style="font-size: 28px;"></i>
          </div>
          <span class="bzm-team-picker__name">{{ team.name }}</span>
          <span class="bzm-team-picker__count">
            <i class="ph-duotone ph-users" style="font-size: 14px;"></i>
            {{ team.playerCount }}@if (maxPerTeam() > 0) {/{{ maxPerTeam() }}}
          </span>

          @if (selectedTeamId() === team.id) {
            <span class="bzm-team-picker__check" aria-hidden="true">
              <i class="ph-duotone ph-check" style="font-size: 18px;"></i>
            </span>
          }

          @if (isTeamFull(team)) {
            <span class="bzm-team-picker__full-badge">Vol</span>
          }
        </button>
      }
    </div>
  `,
  styles: `
    :host {
      display: block;
      font-family: var(--bzm-font-family);
    }

    .bzm-team-picker {
      display: flex;
      gap: var(--bzm-space-3);
      justify-content: center;
      flex-wrap: wrap;
    }

    .bzm-team-picker__team {
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--bzm-space-2);
      padding: var(--bzm-space-4) var(--bzm-space-5);
      background: var(--bzm-color-surface);
      border: 4px solid var(--bzm-color-border);
      border-width: 3px 4px 5px 3px;
      border-radius: var(--bzm-radius-md);
      box-shadow: var(--bzm-shadow-md);
      cursor: pointer;
      transition: transform var(--bzm-transition-playful),
                  box-shadow var(--bzm-transition-base),
                  border-color var(--bzm-transition-base);
      outline: none;
      min-width: 120px;
      font-family: inherit;
    }

    .bzm-team-picker__team:hover:not(:disabled) {
      transform: translateY(-3px);
      box-shadow: var(--bzm-shadow-lg);
    }

    .bzm-team-picker__team:focus-visible {
      box-shadow: 0 0 0 3px var(--bzm-cyan-300);
    }

    .bzm-team-picker__team--selected {
      border-width: 4px 5px 6px 4px;
      transform: scale(1.05);
    }

    .bzm-team-picker__team--selected:hover:not(:disabled) {
      transform: scale(1.05) translateY(-2px);
    }

    .bzm-team-picker__team:disabled {
      cursor: not-allowed;
      opacity: 0.6;
    }

    .bzm-team-picker__team:disabled:hover {
      transform: none;
      box-shadow: var(--bzm-shadow-md);
    }

    .bzm-team-picker__icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 56px;
      height: 56px;
      border-radius: 50%;
      color: var(--bzm-white);
      border: 3px solid var(--bzm-black);
    }

    .bzm-team-picker__name {
      font-size: var(--bzm-font-size-base);
      font-weight: var(--bzm-font-weight-extrabold);
      color: var(--bzm-color-text);
    }

    .bzm-team-picker__count {
      display: flex;
      align-items: center;
      gap: var(--bzm-space-1);
      font-size: var(--bzm-font-size-xs);
      font-weight: var(--bzm-font-weight-bold);
      color: var(--bzm-color-text-secondary);
    }

    .bzm-team-picker__check {
      position: absolute;
      top: var(--bzm-space-2);
      right: var(--bzm-space-2);
      display: flex;
      align-items: center;
      justify-content: center;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      background: var(--bzm-color-success);
      color: var(--bzm-white);
      border: 2px solid var(--bzm-black);
    }

    .bzm-team-picker__full-badge {
      position: absolute;
      top: -6px;
      right: -6px;
      background: var(--bzm-color-error);
      color: var(--bzm-white);
      font-size: var(--bzm-font-size-xs);
      font-weight: var(--bzm-font-weight-extrabold);
      padding: 2px var(--bzm-space-2);
      border-radius: var(--bzm-radius-md);
      border: 2px solid var(--bzm-black);
      text-transform: uppercase;
    }

    @media (prefers-reduced-motion: reduce) {
      .bzm-team-picker__team {
        transition: none;
      }

      .bzm-team-picker__team:hover:not(:disabled) {
        transform: none;
      }

      .bzm-team-picker__team--selected:hover:not(:disabled) {
        transform: scale(1.05);
      }
    }
  `,
})
/**
 * Renders a horizontal row of team option cards for players to pick their team
 * in Team Battle mode.
 *
 * Each team card displays a colored icon, team name, and current player count.
 * Selected teams show a check icon. Teams at maximum capacity display a "Vol"
 * badge and are disabled.
 *
 * @selector bzm-team-picker
 *
 * @example
 * ```html
 * <bzm-team-picker
 *   [teams]="availableTeams"
 *   [selectedTeamId]="'red'"
 *   [maxPerTeam]="5"
 *   (teamSelected)="onTeamSelect($event)"
 * />
 * ```
 */
export class BzmTeamPickerComponent {
  /** Available teams to choose from (2-4). */
  readonly teams = input.required<TeamOption[]>();

  /** ID of the currently selected team, or null. @default null */
  readonly selectedTeamId = input<string | null>(null);

  /** Maximum players per team. 0 means unlimited. @default 0 */
  readonly maxPerTeam = input<number>(0);

  /** Emits the team ID when a team is selected. */
  readonly teamSelected = output<string>();

  protected teamClasses(team: TeamOption): string {
    const classes = ['bzm-team-picker__team'];
    if (this.selectedTeamId() === team.id) {
      classes.push('bzm-team-picker__team--selected');
    }
    return classes.join(' ');
  }

  protected teamStyle(team: TeamOption): string {
    if (this.selectedTeamId() === team.id) {
      return `border-color: ${team.color}`;
    }
    return '';
  }

  protected isTeamFull(team: TeamOption): boolean {
    const max = this.maxPerTeam();
    return max > 0 && team.playerCount >= max;
  }

  protected handleSelect(team: TeamOption): void {
    if (!this.isTeamFull(team)) {
      this.teamSelected.emit(team.id);
    }
  }
}
