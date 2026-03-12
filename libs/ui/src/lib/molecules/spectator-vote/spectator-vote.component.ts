import { Component, ChangeDetectionStrategy, input, output, computed, signal } from '@angular/core';

/** A voting option with an id, label, icon, and current vote count. */
export interface VoteOption {
  readonly id: string;
  readonly label: string;
  readonly icon: string;
  readonly votes: number;
}

@Component({
  selector: 'bzm-spectator-vote',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="bzm-vote">
      <div
        class="bzm-vote__timer-bar"
        role="progressbar"
        aria-label="Resterende tijd"
        [attr.aria-valuenow]="timeRemaining()"
        [attr.aria-valuemax]="10"
        aria-valuemin="0"
      >
        <div class="bzm-vote__timer-fill" [style.width.%]="timerPercent()"></div>
      </div>

      <h3 class="bzm-vote__question">{{ question() }}</h3>

      <div class="bzm-vote__options" role="radiogroup" [attr.aria-label]="question()">
        @for (option of optionsWithPercent(); track option.id) {
          <button
            [class]="option.classes"
            [disabled]="hasVoted() || showResults()"
            [attr.aria-pressed]="selectedOptionId() === option.id"
            (click)="onVote(option.id)"
          >
            @if (showResults() || hasVoted()) {
              <div class="bzm-vote__option-bar" [style.width.%]="option.percent"></div>
            }
            <div class="bzm-vote__option-content">
              <i [class]="'ph-duotone ph-' + option.icon + ' bzm-vote__option-icon'" aria-hidden="true"></i>
              <span class="bzm-vote__option-label">{{ option.label }}</span>
              @if (showResults() || hasVoted()) {
                <span class="bzm-vote__option-percent">{{ option.percent }}%</span>
              }
            </div>
          </button>
        }
      </div>
    </div>
  `,
  styles: `
    :host {
      display: block;
      font-family: var(--bzm-font-family);
    }

    .bzm-vote {
      background: var(--bzm-color-surface, #fff);
      border: 4px solid var(--bzm-color-border, var(--bzm-black));
      border-width: 3px 4px 5px 3px;
      border-radius: var(--bzm-radius-lg, 16px);
      box-shadow: var(--bzm-shadow-card, 4px 4px 0 var(--bzm-black));
      padding: var(--bzm-space-6, 24px);
      overflow: hidden;
    }

    .bzm-vote__timer-bar {
      width: 100%;
      height: 6px;
      background: var(--bzm-gray-200, #e5e7eb);
      border-radius: 3px;
      overflow: hidden;
      margin-bottom: var(--bzm-space-4, 16px);
    }

    .bzm-vote__timer-fill {
      height: 100%;
      background: var(--bzm-color-primary, #6366f1);
      transition: width 1s linear;
      border-radius: 3px;
    }

    .bzm-vote__question {
      margin: 0 0 var(--bzm-space-4, 16px);
      font-size: var(--bzm-font-size-lg, 1.125rem);
      font-weight: var(--bzm-font-weight-extrabold, 800);
      color: var(--bzm-color-text);
      text-align: center;
    }

    .bzm-vote__options {
      display: flex;
      flex-direction: column;
      gap: var(--bzm-space-3, 12px);
    }

    .bzm-vote__option {
      position: relative;
      display: block;
      width: 100%;
      padding: var(--bzm-space-4, 16px);
      border: 4px solid var(--bzm-color-border, var(--bzm-black));
      border-width: 3px 4px 5px 3px;
      border-radius: var(--bzm-radius-md, 8px);
      background: var(--bzm-white, #fff);
      cursor: pointer;
      font-family: var(--bzm-font-family);
      text-align: left;
      transition:
        transform var(--bzm-transition-playful, 0.2s cubic-bezier(0.68, -0.55, 0.265, 1.55)),
        box-shadow var(--bzm-transition-base, 0.2s ease),
        background-color var(--bzm-transition-base, 0.2s ease);
      box-shadow: var(--bzm-shadow-sm);
      overflow: hidden;
      -webkit-tap-highlight-color: transparent;
    }

    .bzm-vote__option:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: var(--bzm-shadow-md);
    }

    .bzm-vote__option:active:not(:disabled) {
      transform: translateY(2px);
      box-shadow: none;
    }

    .bzm-vote__option:disabled {
      cursor: default;
    }

    .bzm-vote__option--selected {
      border-color: var(--bzm-color-primary, #6366f1);
      background: var(--bzm-blue-50, #eff6ff);
    }

    .bzm-vote__option--winner {
      border-color: var(--bzm-color-accent, #fbbf24);
      background: var(--bzm-yellow-50, #fefce8);
      box-shadow: 0 0 0 3px var(--bzm-color-accent, #fbbf24);
    }

    .bzm-vote__option-content {
      display: flex;
      align-items: center;
      gap: var(--bzm-space-3, 12px);
      position: relative;
      z-index: 1;
    }

    .bzm-vote__option-icon {
      font-size: 22px;
      color: var(--bzm-color-text);
      flex-shrink: 0;
    }

    .bzm-vote__option-label {
      font-size: var(--bzm-font-size-base, 1rem);
      font-weight: var(--bzm-font-weight-bold, 700);
      color: var(--bzm-color-text);
      flex: 1;
    }

    .bzm-vote__option-bar {
      position: absolute;
      top: 0;
      left: 0;
      height: 100%;
      background: var(--bzm-color-primary-light, rgba(99, 102, 241, 0.1));
      transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .bzm-vote__option--winner .bzm-vote__option-bar {
      background: var(--bzm-yellow-100, rgba(251, 191, 36, 0.2));
    }

    .bzm-vote__option-percent {
      font-size: var(--bzm-font-size-sm, 0.875rem);
      font-weight: var(--bzm-font-weight-black, 900);
      color: var(--bzm-color-text-secondary);
      flex-shrink: 0;
      z-index: 1;
    }

    @media (prefers-reduced-motion: reduce) {
      .bzm-vote__option {
        transition: none;
      }

      .bzm-vote__option-bar {
        transition: width 0.1s ease;
      }
    }
  `,
})
/**
 * Spectator voting interface for game events such as category selection or power-up choices.
 *
 * Displays a question with vertically listed comic-bordered option buttons. Before voting,
 * options show icons and labels. After voting or when results are shown, options transform
 * into result bars displaying vote counts and percentages. The winning option is highlighted.
 *
 * @selector bzm-spectator-vote
 *
 * @example
 * ```html
 * <bzm-spectator-vote
 *   question="Welke categorie komt hierna?"
 *   [options]="categoryOptions"
 *   (voteSubmitted)="onVote($event)"
 * />
 * ```
 */
export class BzmSpectatorVoteComponent {
  /** The question or prompt displayed at the top of the vote card. */
  readonly question = input.required<string>();

  /** Available voting options. */
  readonly options = input.required<VoteOption[]>();

  /** Whether the current user has already voted. @default false */
  readonly hasVoted = input<boolean>(false);

  /** Seconds remaining to vote. @default 10 */
  readonly timeRemaining = input<number>(10);

  /** Whether to reveal vote results with percentage bars. @default false */
  readonly showResults = input<boolean>(false);

  /** Emits the selected option id when a vote is cast. */
  readonly voteSubmitted = output<string>();

  protected readonly selectedOptionId = signal<string | null>(null);

  protected readonly timerPercent = computed(
    () => Math.min((this.timeRemaining() / 10) * 100, 100)
  );

  protected readonly totalVotes = computed(
    () => this.options().reduce((sum, o) => sum + o.votes, 0)
  );

  protected readonly maxVotes = computed(
    () => Math.max(...this.options().map((o) => o.votes), 1)
  );

  protected readonly optionsWithPercent = computed(() => {
    const total = this.totalVotes();
    const max = this.maxVotes();
    const selectedId = this.selectedOptionId();
    const results = this.showResults();
    return this.options().map((o) => {
      const percent = total > 0 ? Math.round((o.votes / total) * 100) : 0;
      const classes = ['bzm-vote__option'];
      if (selectedId === o.id) classes.push('bzm-vote__option--selected');
      if (results && o.votes === max && o.votes > 0) classes.push('bzm-vote__option--winner');
      return { ...o, percent, classes: classes.join(' ') };
    });
  });

  protected onVote(optionId: string): void {
    if (this.hasVoted() || this.showResults()) return;
    this.selectedOptionId.set(optionId);
    this.voteSubmitted.emit(optionId);
  }
}
