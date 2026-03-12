import { Component, ChangeDetectionStrategy, input, output, computed } from '@angular/core';

/** A single category option with vote count for the voting UI. */
export interface CategoryVoteOption {
  readonly id: string;
  readonly name: string;
  readonly icon: string;
  readonly color: string;
  readonly votes: number;
}

@Component({
  selector: 'bzm-category-vote',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="bzm-category-vote" role="group" aria-label="Categorie stemming">
      <h3 class="bzm-category-vote__title">Kies de volgende categorie!</h3>

      <div class="bzm-category-vote__timer-bar">
        <div
          class="bzm-category-vote__timer-fill"
          [class.bzm-category-vote__timer-fill--urgent]="isUrgent()"
          [style.width.%]="timerPercent()"
          role="progressbar"
          [attr.aria-valuenow]="timeRemaining()"
          aria-valuemin="0"
          [attr.aria-valuemax]="voteDuration()"
          [attr.aria-label]="'Nog ' + timeRemaining() + ' seconden'"
        ></div>
      </div>

      @if (hasExtraWeight()) {
        <div class="bzm-category-vote__extra-weight" aria-label="Je stem telt dubbel">
          <i class="ph-duotone ph-star" style="font-size: 16px;"></i>
          <span>Je stem telt dubbel!</span>
        </div>
      }

      <div class="bzm-category-vote__grid">
        @for (option of options(); track option.id) {
          <button
            type="button"
            [class]="cardClasses(option)"
            [style]="cardStyle(option)"
            [disabled]="hasVoted() && selectedId() !== option.id"
            [attr.aria-label]="optionAriaLabel(option)"
            [attr.aria-pressed]="selectedId() === option.id"
            (click)="handleVote(option.id)"
          >
            @if (selectedId() === option.id) {
              <div class="bzm-category-vote__check" aria-hidden="true">
                <i class="ph-duotone ph-check-circle" style="font-size: 24px;"></i>
              </div>
            }

            @if (showResults() && isWinner(option)) {
              <div class="bzm-category-vote__crown" aria-hidden="true">
                <i class="ph-duotone ph-crown" style="font-size: 20px; color: #FFD700;"></i>
              </div>
            }

            <div class="bzm-category-vote__icon" [style.background]="option.color">
              <i [class]="'ph-duotone ph-' + option.icon" style="font-size: 28px;"></i>
            </div>

            <span class="bzm-category-vote__name">{{ option.name }}</span>

            @if (hasExtraWeight() && selectedId() === option.id) {
              <span class="bzm-category-vote__badge">2x</span>
            }

            @if (showResults()) {
              <div class="bzm-category-vote__result">
                <div class="bzm-category-vote__bar-track">
                  <div
                    class="bzm-category-vote__bar-fill"
                    [style.width.%]="votePercent(option)"
                    [style.background]="option.color"
                  ></div>
                </div>
                <span class="bzm-category-vote__vote-count">
                  {{ option.votes }} {{ option.votes === 1 ? 'stem' : 'stemmen' }}
                </span>
              </div>
            }
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

    .bzm-category-vote {
      width: 100%;
      max-width: 520px;
    }

    .bzm-category-vote__title {
      font-family: var(--bzm-font-heading);
      font-size: var(--bzm-font-size-xl);
      font-weight: var(--bzm-font-weight-extrabold);
      color: var(--bzm-color-text);
      text-align: center;
      margin: 0 0 var(--bzm-space-4);
    }

    .bzm-category-vote__timer-bar {
      width: 100%;
      height: 6px;
      background: var(--bzm-color-surface);
      border-radius: 3px;
      margin-bottom: var(--bzm-space-4);
      overflow: hidden;
    }

    .bzm-category-vote__timer-fill {
      height: 100%;
      background: var(--bzm-color-primary);
      border-radius: 3px;
      transition: width 1s linear;
    }

    .bzm-category-vote__timer-fill--urgent {
      background: var(--bzm-color-error);
      animation: bzm-timer-blink 0.5s ease-in-out infinite;
    }

    .bzm-category-vote__extra-weight {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: var(--bzm-space-1);
      padding: var(--bzm-space-2);
      margin-bottom: var(--bzm-space-3);
      background: linear-gradient(135deg, #FFF8E1, #FFD54F);
      border: 4px solid #FFC107;
      border-width: var(--bzm-border-width-comic);
      border-radius: var(--bzm-radius-md);
      font-size: var(--bzm-font-size-sm);
      font-weight: var(--bzm-font-weight-bold);
      color: #E65100;
    }

    .bzm-category-vote__grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: var(--bzm-space-3);
    }

    .bzm-category-vote__card {
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--bzm-space-2);
      padding: var(--bzm-space-4) var(--bzm-space-3);
      background: var(--bzm-color-surface);
      border: 4px solid var(--bzm-color-border);
      border-width: var(--bzm-border-width-comic);
      border-radius: var(--bzm-radius-md);
      box-shadow: var(--bzm-shadow-card);
      cursor: pointer;
      transition: transform var(--bzm-transition-playful),
                  box-shadow var(--bzm-transition-base),
                  border-color var(--bzm-transition-base);
      text-align: center;
      outline: none;
      font-family: inherit;
      overflow: hidden;
    }

    .bzm-category-vote__card:hover:not(:disabled) {
      transform: translateY(-3px) rotate(-0.5deg);
      box-shadow: var(--bzm-shadow-lg);
    }

    .bzm-category-vote__card:focus-visible {
      box-shadow: 0 0 0 3px var(--bzm-color-primary);
    }

    .bzm-category-vote__card:disabled {
      cursor: not-allowed;
      opacity: 0.5;
      filter: grayscale(0.4);
    }

    .bzm-category-vote__card:disabled:hover {
      transform: none;
      box-shadow: var(--bzm-shadow-card);
    }

    .bzm-category-vote__card--selected {
      border-width: 4px 5px 6px 4px;
      transform: translateY(-2px);
    }

    .bzm-category-vote__card--winner {
      animation: bzm-winner-pulse 1s ease-in-out infinite;
    }

    .bzm-category-vote__check {
      position: absolute;
      top: var(--bzm-space-2);
      right: var(--bzm-space-2);
      color: var(--bzm-color-success);
    }

    .bzm-category-vote__crown {
      position: absolute;
      top: var(--bzm-space-1);
      left: var(--bzm-space-2);
    }

    .bzm-category-vote__icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 52px;
      height: 52px;
      border-radius: var(--bzm-radius-md);
      color: var(--bzm-white);
    }

    .bzm-category-vote__name {
      font-size: var(--bzm-font-size-sm);
      font-weight: var(--bzm-font-weight-bold);
      color: var(--bzm-color-text);
      line-height: 1.2;
    }

    .bzm-category-vote__badge {
      position: absolute;
      top: var(--bzm-space-1);
      left: var(--bzm-space-1);
      background: #FFD700;
      color: var(--bzm-black);
      font-size: 10px;
      font-weight: var(--bzm-font-weight-extrabold);
      padding: 2px 6px;
      border-radius: var(--bzm-radius-sm);
      border: 2px solid var(--bzm-black);
    }

    .bzm-category-vote__result {
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .bzm-category-vote__bar-track {
      width: 100%;
      height: 8px;
      background: rgba(0, 0, 0, 0.08);
      border-radius: 4px;
      overflow: hidden;
    }

    .bzm-category-vote__bar-fill {
      height: 100%;
      border-radius: 4px;
      transition: width 0.6s var(--bzm-transition-playful);
    }

    .bzm-category-vote__vote-count {
      font-size: 11px;
      font-weight: var(--bzm-font-weight-semibold);
      color: var(--bzm-color-text-muted);
    }

    @keyframes bzm-timer-blink {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.6; }
    }

    @keyframes bzm-winner-pulse {
      0%, 100% { box-shadow: var(--bzm-shadow-card); }
      50% { box-shadow: 0 0 16px rgba(255, 215, 0, 0.5), var(--bzm-shadow-lg); }
    }

    @media (max-width: 400px) {
      .bzm-category-vote__grid {
        grid-template-columns: 1fr;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .bzm-category-vote__card {
        transition: none;
      }

      .bzm-category-vote__card:hover:not(:disabled) {
        transform: none;
      }

      .bzm-category-vote__card--winner {
        animation: none;
        box-shadow: 0 0 16px rgba(255, 215, 0, 0.5), var(--bzm-shadow-lg);
      }

      .bzm-category-vote__timer-fill--urgent {
        animation: none;
      }

      .bzm-category-vote__bar-fill {
        transition: none;
      }
    }
  `,
})
/**
 * Category voting UI for multiplayer category selection every 3 questions.
 *
 * Displays a grid of category cards that players can vote on to choose
 * the next quiz category. Includes a countdown timer bar, optional "double
 * vote" indicator for bottom-half players, and results view with vote
 * percentages and a crown icon on the winning category.
 *
 * @selector bzm-category-vote
 *
 * @example
 * ```html
 * <bzm-category-vote
 *   [options]="categories"
 *   [hasVoted]="false"
 *   [timeRemaining]="8"
 *   (voteSubmitted)="onVote($event)"
 * />
 * ```
 */
export class BzmCategoryVoteComponent {
  /** Array of category options to display as voteable cards. */
  readonly options = input.required<CategoryVoteOption[]>();

  /**
   * Whether the current player has already cast their vote.
   * @default false
   */
  readonly hasVoted = input<boolean>(false);

  /**
   * The id of the category the player selected, or null if none.
   * @default null
   */
  readonly selectedId = input<string | null>(null);

  /**
   * Seconds remaining to vote.
   * @default 10
   */
  readonly timeRemaining = input<number>(10);

  /**
   * Whether the player has extra voting weight (bottom half of leaderboard).
   * @default false
   */
  readonly hasExtraWeight = input<boolean>(false);

  /**
   * Whether to show voting results with percentages.
   * @default false
   */
  readonly showResults = input<boolean>(false);

  /**
   * Total vote duration in seconds, used for timer percentage calculation.
   * @default 10
   */
  readonly voteDuration = input<number>(10);

  /** Emits the category id when the player casts a vote. */
  readonly voteSubmitted = output<string>();

  protected readonly timerPercent = computed(
    (): number => Math.max(0, Math.min(100, (this.timeRemaining() / this.voteDuration()) * 100))
  );

  protected readonly isUrgent = computed(
    (): boolean => this.timeRemaining() <= 3
  );

  protected readonly totalVotes = computed(
    (): number => this.options().reduce((sum, o) => sum + o.votes, 0)
  );

  protected readonly maxVotes = computed(
    (): number => Math.max(...this.options().map(o => o.votes), 0)
  );

  protected votePercent(option: CategoryVoteOption): number {
    const total = this.totalVotes();
    if (total === 0) return 0;
    return Math.round((option.votes / total) * 100);
  }

  protected isWinner(option: CategoryVoteOption): boolean {
    return option.votes > 0 && option.votes === this.maxVotes();
  }

  protected cardClasses(option: CategoryVoteOption): string {
    const classes = ['bzm-category-vote__card'];
    if (this.selectedId() === option.id) {
      classes.push('bzm-category-vote__card--selected');
    }
    if (this.showResults() && this.isWinner(option)) {
      classes.push('bzm-category-vote__card--winner');
    }
    return classes.join(' ');
  }

  protected cardStyle(option: CategoryVoteOption): string {
    if (this.selectedId() === option.id) {
      return `border-color: ${option.color};`;
    }
    return '';
  }

  protected optionAriaLabel(option: CategoryVoteOption): string {
    const base = option.name;
    if (this.showResults()) {
      return `${base}, ${option.votes} stemmen (${this.votePercent(option)}%)`;
    }
    if (this.selectedId() === option.id) {
      return `${base} (geselecteerd)`;
    }
    return base;
  }

  protected handleVote(categoryId: string): void {
    if (!this.hasVoted()) {
      this.voteSubmitted.emit(categoryId);
    }
  }
}
