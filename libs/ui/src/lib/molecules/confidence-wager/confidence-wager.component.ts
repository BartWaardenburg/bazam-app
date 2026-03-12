import { Component, ChangeDetectionStrategy, input, output, computed, signal } from '@angular/core';

/** Wager tier amounts. */
const WAGER_TIERS = [100, 200, 300] as const;

/** Labels for each wager tier. */
const WAGER_LABELS = ['Veilig', 'Durf', 'Alles of niets'] as const;

@Component({
  selector: 'bzm-confidence-wager',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="bzm-wager" [class.bzm-wager--disabled]="disabled()">
      <div
        class="bzm-wager__timer-bar"
        role="progressbar"
        aria-label="Resterende tijd"
        [attr.aria-valuenow]="timeRemaining()"
        [attr.aria-valuemax]="5"
        aria-valuemin="0"
      >
        <div class="bzm-wager__timer-fill" [style.width.%]="timerPercent()"></div>
      </div>

      <h3 class="bzm-wager__title">Hoeveel durf je in te zetten?</h3>

      <div class="bzm-wager__buttons">
        @for (tier of tiers(); track tier.amount; let i = $index) {
          <button
            [class]="tier.buttonClass"
            [disabled]="disabled() || tier.locked"
            [attr.aria-label]="tier.amount + ' punten inzetten'"
            (click)="onWager(tier.amount)"
          >
            @if (tier.locked) {
              <i class="ph-duotone ph-lock bzm-wager__lock-icon" aria-hidden="true"></i>
            }
            <span class="bzm-wager__amount">{{ tier.amount }}</span>
            <span class="bzm-wager__label">{{ tier.label }}</span>
          </button>
        }
      </div>

      <button
        class="bzm-wager__skip"
        [disabled]="disabled()"
        (click)="wagerSkipped.emit()"
      >
        Overslaan
      </button>
    </div>
  `,
  styles: `
    :host {
      display: block;
      font-family: var(--bzm-font-family);
    }

    .bzm-wager {
      background: var(--bzm-color-surface, #fff);
      border: 4px solid var(--bzm-color-border, var(--bzm-black));
      border-width: 3px 4px 5px 3px;
      border-radius: var(--bzm-radius-lg, 16px);
      box-shadow: var(--bzm-shadow-card, 4px 4px 0 var(--bzm-black));
      padding: var(--bzm-space-6, 24px);
      text-align: center;
    }

    .bzm-wager--disabled {
      opacity: 0.6;
      pointer-events: none;
    }

    .bzm-wager__timer-bar {
      width: 100%;
      height: 8px;
      background: var(--bzm-gray-200, #e5e7eb);
      border-radius: 4px;
      border: 2px solid var(--bzm-color-border, var(--bzm-black));
      border-width: 1px 2px 2px 1px;
      overflow: hidden;
      margin-bottom: var(--bzm-space-4, 16px);
    }

    .bzm-wager__timer-fill {
      height: 100%;
      background: var(--bzm-color-accent, #fbbf24);
      transition: width 1s linear;
      border-radius: 2px;
    }

    .bzm-wager__title {
      margin: 0 0 var(--bzm-space-6, 24px);
      font-size: var(--bzm-font-size-lg, 1.125rem);
      font-weight: var(--bzm-font-weight-extrabold, 800);
      color: var(--bzm-color-text);
      text-shadow: 1px 1px 0 rgba(0, 0, 0, 0.1);
    }

    .bzm-wager__buttons {
      display: flex;
      gap: var(--bzm-space-4, 16px);
      justify-content: center;
      align-items: flex-end;
      margin-bottom: var(--bzm-space-4, 16px);
    }

    .bzm-wager__btn {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      border: 4px solid var(--bzm-color-border, var(--bzm-black));
      border-width: 3px 4px 5px 3px;
      border-radius: 50%;
      background: var(--bzm-color-primary, #6366f1);
      cursor: pointer;
      font-family: var(--bzm-font-family);
      transition:
        transform var(--bzm-transition-playful, 0.2s cubic-bezier(0.68, -0.55, 0.265, 1.55)),
        box-shadow var(--bzm-transition-base, 0.2s ease);
      box-shadow: var(--bzm-shadow-md);
      -webkit-tap-highlight-color: transparent;
    }

    .bzm-wager__btn:hover:not(:disabled) {
      transform: translateY(-4px);
      box-shadow: var(--bzm-shadow-lg, 6px 6px 0 var(--bzm-black));
    }

    .bzm-wager__btn:active:not(:disabled) {
      transform: translateY(2px);
      box-shadow: none;
    }

    .bzm-wager__btn--sm {
      width: 72px;
      height: 72px;
    }

    .bzm-wager__btn--md {
      width: 88px;
      height: 88px;
    }

    .bzm-wager__btn--lg {
      width: 104px;
      height: 104px;
    }

    .bzm-wager__btn--selected {
      animation: bzm-wager-bounce 0.5s ease;
      outline: 4px solid var(--bzm-color-accent, #fbbf24);
      outline-offset: 4px;
      box-shadow: var(--bzm-shadow-md);
    }

    .bzm-wager__btn:disabled {
      cursor: not-allowed;
      opacity: 0.4;
      background: var(--bzm-gray-300, #d1d5db);
    }

    .bzm-wager__amount {
      font-size: var(--bzm-font-size-xl, 1.25rem);
      font-weight: var(--bzm-font-weight-black, 900);
      color: var(--bzm-white, #fff);
      line-height: 1;
    }

    .bzm-wager__btn:disabled .bzm-wager__amount {
      color: var(--bzm-gray-500, #6b7280);
    }

    .bzm-wager__label {
      display: block;
      margin-top: var(--bzm-space-2, 8px);
      font-size: var(--bzm-font-size-xs, 0.75rem);
      font-weight: var(--bzm-font-weight-bold, 700);
      color: var(--bzm-color-text-secondary);
      text-align: center;
    }

    .bzm-wager__lock-icon {
      font-size: 14px;
      color: var(--bzm-gray-500, #6b7280);
      margin-bottom: 2px;
    }

    .bzm-wager__skip {
      background: none;
      border: none;
      font-family: var(--bzm-font-family);
      font-size: var(--bzm-font-size-sm, 0.875rem);
      font-weight: var(--bzm-font-weight-semibold, 600);
      color: var(--bzm-color-text-secondary);
      cursor: pointer;
      text-decoration: underline;
      padding: var(--bzm-space-2, 8px) var(--bzm-space-4, 16px);
      -webkit-tap-highlight-color: transparent;
    }

    .bzm-wager__skip:hover:not(:disabled) {
      color: var(--bzm-color-text);
    }

    .bzm-wager__skip:disabled {
      cursor: not-allowed;
      opacity: 0.4;
    }

    @keyframes bzm-wager-bounce {
      0%, 100% { transform: scale(1); }
      25% { transform: scale(1.15); }
      50% { transform: scale(0.95); }
      75% { transform: scale(1.05); }
    }

    @media (prefers-reduced-motion: reduce) {
      .bzm-wager__btn {
        transition: none;
      }

      .bzm-wager__btn--selected {
        animation: none;
      }
    }
  `,
})
/**
 * Three-button wager UI where players bet on their own performance during quiz rounds.
 *
 * Displays three coin-styled buttons (100, 200, 300) with increasing sizes, a countdown
 * timer bar, and a skip option. Buttons that would exceed the maximum wager cap (based
 * on a percentage of the player's current score) are disabled with a lock icon.
 *
 * @selector bzm-confidence-wager
 *
 * @example
 * ```html
 * <bzm-confidence-wager [currentScore]="1500" (wagerPlaced)="onWager($event)" (wagerSkipped)="onSkip()" />
 * ```
 */
export class BzmConfidenceWagerComponent {
  /** Player's current score, used for max cap calculation. */
  readonly currentScore = input.required<number>();

  /** Maximum percentage of score a player can wager. @default 30 */
  readonly maxPercentage = input<number>(30);

  /** Seconds left to decide. @default 5 */
  readonly timeRemaining = input<number>(5);

  /** Whether the entire wager UI is disabled. @default false */
  readonly disabled = input<boolean>(false);

  /** Emits the wager amount (100, 200, or 300) when a tier is selected. */
  readonly wagerPlaced = output<number>();

  /** Emits when the player chooses to skip wagering. */
  readonly wagerSkipped = output<void>();

  protected readonly selectedWager = signal<number | null>(null);

  protected readonly maxWager = computed(
    () => Math.floor(this.currentScore() * (this.maxPercentage() / 100))
  );

  protected readonly timerPercent = computed(
    () => Math.min((this.timeRemaining() / 5) * 100, 100)
  );

  protected readonly tiers = computed(() => {
    const max = this.maxWager();
    const selected = this.selectedWager();

    return WAGER_TIERS.map((amount, i) => {
      const sizes = ['sm', 'md', 'lg'] as const;
      const locked = amount > max;
      const isSelected = selected === amount;
      const sizeClass = `bzm-wager__btn--${sizes[i]}`;
      const selectedClass = isSelected ? 'bzm-wager__btn--selected' : '';

      return {
        amount,
        label: WAGER_LABELS[i],
        locked,
        buttonClass: `bzm-wager__btn ${sizeClass} ${selectedClass}`.trim(),
      };
    });
  });

  protected onWager(amount: number): void {
    this.selectedWager.set(amount);
    this.wagerPlaced.emit(amount);
  }
}
