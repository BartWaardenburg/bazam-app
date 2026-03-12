import { Component, ChangeDetectionStrategy, input, output, computed } from '@angular/core';

/** A single answer option in a Fibbage bluff round. */
export interface BluffOption {
  readonly id: string;
  readonly text: string;
  readonly isReal: boolean;
  readonly authorName?: string;
  readonly voterNames: string[];
  readonly voterCount: number;
}

/** Phase of the bluff reveal sequence. */
export type BluffRevealPhase = 'voting' | 'revealing' | 'revealed';

@Component({
  selector: 'bzm-bluff-reveal',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="bzm-bluff-reveal" aria-label="Bluf ronde">
      <!-- Question -->
      <div class="bzm-bluff-reveal__question">
        <i class="ph-duotone ph-detective bzm-bluff-reveal__question-icon" aria-hidden="true"></i>
        <h2 class="bzm-bluff-reveal__question-text">{{ question() }}</h2>
      </div>

      <!-- Options list -->
      <div class="bzm-bluff-reveal__options" role="list">
        @for (option of options(); track option.id; let i = $index) {
          <div
            [class]="optionClasses(option)"
            role="listitem"
            [style.animation-delay]="revealDelay(i)"
          >
            <button
              type="button"
              class="bzm-bluff-reveal__option-btn"
              [disabled]="phase() !== 'voting'"
              [attr.aria-pressed]="selectedOptionId() === option.id"
              (click)="onSelect(option.id)"
            >
              <!-- Number badge -->
              <span class="bzm-bluff-reveal__number">{{ i + 1 }}</span>

              <!-- Answer text -->
              <span class="bzm-bluff-reveal__text">{{ option.text }}</span>

              <!-- Labels for revealing/revealed phase -->
              @if (phase() !== 'voting') {
                @if (option.isReal) {
                  <span class="bzm-bluff-reveal__label bzm-bluff-reveal__label--real">
                    ECHT!
                  </span>
                } @else {
                  <span class="bzm-bluff-reveal__label bzm-bluff-reveal__label--fake">
                    Nep!
                  </span>
                }
              }

              <!-- Selection check during voting -->
              @if (phase() === 'voting' && selectedOptionId() === option.id) {
                <span class="bzm-bluff-reveal__selected-check" aria-hidden="true">
                  <i class="ph-duotone ph-check"></i>
                </span>
              }
            </button>

            <!-- Reveal details -->
            @if (phase() !== 'voting') {
              <div class="bzm-bluff-reveal__details">
                @if (!option.isReal && option.authorName) {
                  <span class="bzm-bluff-reveal__author">
                    <i class="ph-duotone ph-pen-nib" aria-hidden="true"></i>
                    Verzonnen door {{ option.authorName }}
                  </span>
                }
                @if (option.voterCount > 0) {
                  <div class="bzm-bluff-reveal__voters">
                    <i class="ph-duotone ph-users" aria-hidden="true"></i>
                    @for (voter of option.voterNames; track voter; let last = $last) {
                      <span class="bzm-bluff-reveal__voter">{{ voter }}{{ last ? '' : ', ' }}</span>
                    }
                    <span class="bzm-bluff-reveal__voter-label">
                      {{ option.isReal ? 'geraden' : 'erin getrapt' }}
                    </span>
                  </div>
                }
              </div>
            }
          </div>
        }
      </div>

      <!-- Score summary in revealed phase -->
      @if (phase() === 'revealed') {
        <div class="bzm-bluff-reveal__summary" role="status">
          <div class="bzm-bluff-reveal__summary-item">
            <i class="ph-duotone ph-trophy" aria-hidden="true"></i>
            <span>{{ correctVoterCount() }} {{ correctVoterCount() === 1 ? 'speler' : 'spelers' }} goed geraden</span>
          </div>
          <div class="bzm-bluff-reveal__summary-item">
            <i class="ph-duotone ph-mask-sad" aria-hidden="true"></i>
            <span>{{ fooledVoterCount() }} {{ fooledVoterCount() === 1 ? 'speler' : 'spelers' }} erin getrapt</span>
          </div>
        </div>
      }
    </div>
  `,
  styles: `
    :host {
      display: block;
      font-family: var(--bzm-font-family);
    }

    .bzm-bluff-reveal {
      max-width: 520px;
    }

    /* ── Question ── */
    .bzm-bluff-reveal__question {
      display: flex;
      align-items: flex-start;
      gap: var(--bzm-space-3);
      margin-bottom: var(--bzm-space-6);
    }

    .bzm-bluff-reveal__question-icon {
      font-size: var(--bzm-font-size-3xl);
      color: var(--bzm-color-accent);
      flex-shrink: 0;
      margin-top: 2px;
    }

    .bzm-bluff-reveal__question-text {
      margin: 0;
      font-size: clamp(1.1rem, 3.5vw, 1.5rem);
      font-weight: var(--bzm-font-weight-extrabold);
      color: var(--bzm-color-text);
      line-height: 1.3;
      text-shadow: 1px 1px 0 rgba(0, 0, 0, 0.05);
    }

    /* ── Options ── */
    .bzm-bluff-reveal__options {
      display: flex;
      flex-direction: column;
      gap: var(--bzm-space-3);
    }

    .bzm-bluff-reveal__option {
      border: 4px solid var(--bzm-color-border);
      border-width: 3px 4px 5px 3px;
      border-radius: var(--bzm-radius-md);
      background: var(--bzm-color-surface);
      box-shadow: var(--bzm-shadow-card);
      overflow: hidden;
      transition:
        border-color var(--bzm-transition-base),
        background-color var(--bzm-transition-base),
        transform var(--bzm-transition-playful);
    }

    /* ── Voting phase ── */
    .bzm-bluff-reveal__option--voting:hover {
      transform: translateY(-2px) rotate(-0.5deg);
      box-shadow: var(--bzm-shadow-lg);
    }

    .bzm-bluff-reveal__option--selected {
      border-color: var(--bzm-color-primary) !important;
      border-width: 4px 5px 6px 4px;
      background: color-mix(in srgb, var(--bzm-color-primary) 8%, var(--bzm-color-surface));
    }

    /* ── Reveal states ── */
    .bzm-bluff-reveal__option--real {
      border-color: var(--bzm-color-success) !important;
      background: color-mix(in srgb, var(--bzm-color-success) 10%, var(--bzm-color-surface));
      animation: bzm-reveal-glow 1s ease forwards;
    }

    .bzm-bluff-reveal__option--fake {
      border-color: var(--bzm-color-error) !important;
      animation: bzm-reveal-flip 0.6s ease forwards;
    }

    .bzm-bluff-reveal__option--revealing {
      animation: bzm-reveal-flip 0.6s ease forwards;
    }

    /* ── Button inside option ── */
    .bzm-bluff-reveal__option-btn {
      display: flex;
      align-items: center;
      gap: var(--bzm-space-3);
      width: 100%;
      padding: var(--bzm-space-4) var(--bzm-space-5);
      background: none;
      border: none;
      font-family: var(--bzm-font-family);
      cursor: pointer;
      text-align: left;
      outline: none;
      -webkit-tap-highlight-color: transparent;
    }

    .bzm-bluff-reveal__option-btn:focus-visible {
      box-shadow: inset 0 0 0 3px var(--bzm-cyan-300);
    }

    .bzm-bluff-reveal__option-btn:disabled {
      cursor: default;
    }

    /* ── Number badge ── */
    .bzm-bluff-reveal__number {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      border-radius: var(--bzm-radius-md);
      background: var(--bzm-color-primary);
      color: var(--bzm-color-text-on-primary);
      font-size: var(--bzm-font-size-base);
      font-weight: var(--bzm-font-weight-extrabold);
      flex-shrink: 0;
      border: 2px solid var(--bzm-black);
      border-width: 1.5px 2px 2px 1.5px;
    }

    .bzm-bluff-reveal__option--real .bzm-bluff-reveal__number {
      background: var(--bzm-color-success);
    }

    .bzm-bluff-reveal__option--fake .bzm-bluff-reveal__number {
      background: var(--bzm-color-error);
    }

    /* ── Text ── */
    .bzm-bluff-reveal__text {
      flex: 1;
      font-size: var(--bzm-font-size-base);
      font-weight: var(--bzm-font-weight-bold);
      color: var(--bzm-color-text);
      line-height: 1.4;
    }

    /* ── Labels ── */
    .bzm-bluff-reveal__label {
      font-size: var(--bzm-font-size-sm);
      font-weight: var(--bzm-font-weight-extrabold);
      text-transform: uppercase;
      letter-spacing: 0.06em;
      padding: var(--bzm-space-1) var(--bzm-space-3);
      border-radius: 3px;
      border: 2px solid var(--bzm-black);
      border-width: 1.5px 2px 2px 1.5px;
      white-space: nowrap;
      flex-shrink: 0;
    }

    .bzm-bluff-reveal__label--real {
      background: var(--bzm-color-success);
      color: var(--bzm-white, #fff);
      text-shadow: 1px 1px 0 rgba(0, 0, 0, 0.2);
    }

    .bzm-bluff-reveal__label--fake {
      background: var(--bzm-color-error);
      color: var(--bzm-white, #fff);
      text-shadow: 1px 1px 0 rgba(0, 0, 0, 0.2);
    }

    /* ── Selected check ── */
    .bzm-bluff-reveal__selected-check {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 28px;
      height: 28px;
      border-radius: 50%;
      background: var(--bzm-color-primary);
      color: var(--bzm-color-text-on-primary);
      font-size: 14px;
      flex-shrink: 0;
    }

    /* ── Details (author + voters) ── */
    .bzm-bluff-reveal__details {
      padding: 0 var(--bzm-space-5) var(--bzm-space-3);
      display: flex;
      flex-direction: column;
      gap: var(--bzm-space-1);
    }

    .bzm-bluff-reveal__author {
      display: flex;
      align-items: center;
      gap: var(--bzm-space-2);
      font-size: var(--bzm-font-size-sm);
      font-weight: var(--bzm-font-weight-bold);
      color: var(--bzm-color-text-secondary);
      font-style: italic;
    }

    .bzm-bluff-reveal__voters {
      display: flex;
      align-items: center;
      gap: var(--bzm-space-1);
      font-size: var(--bzm-font-size-sm);
      color: var(--bzm-color-text-muted);
      flex-wrap: wrap;
    }

    .bzm-bluff-reveal__voter {
      font-weight: var(--bzm-font-weight-bold);
      color: var(--bzm-color-text-secondary);
    }

    .bzm-bluff-reveal__voter-label {
      font-weight: var(--bzm-font-weight-bold);
      color: var(--bzm-color-text-muted);
    }

    /* ── Summary ── */
    .bzm-bluff-reveal__summary {
      display: flex;
      gap: var(--bzm-space-4);
      margin-top: var(--bzm-space-6);
      padding: var(--bzm-space-4) var(--bzm-space-5);
      background: var(--bzm-color-surface);
      border: 4px solid var(--bzm-color-border);
      border-width: 3px 4px 5px 3px;
      border-radius: var(--bzm-radius-md);
      box-shadow: var(--bzm-shadow-card);
      flex-wrap: wrap;
    }

    .bzm-bluff-reveal__summary-item {
      display: flex;
      align-items: center;
      gap: var(--bzm-space-2);
      font-size: var(--bzm-font-size-sm);
      font-weight: var(--bzm-font-weight-bold);
      color: var(--bzm-color-text);
    }

    .bzm-bluff-reveal__summary-item i {
      font-size: var(--bzm-font-size-xl);
    }

    /* ── Animations ── */
    @keyframes bzm-reveal-flip {
      0% { transform: scaleY(1); }
      50% { transform: scaleY(0); }
      100% { transform: scaleY(1); }
    }

    @keyframes bzm-reveal-glow {
      0% { box-shadow: var(--bzm-shadow-card); }
      50% { box-shadow: 0 0 20px color-mix(in srgb, var(--bzm-color-success) 40%, transparent), var(--bzm-shadow-card); }
      100% { box-shadow: 0 0 8px color-mix(in srgb, var(--bzm-color-success) 20%, transparent), var(--bzm-shadow-card); }
    }

    @media (prefers-reduced-motion: reduce) {
      .bzm-bluff-reveal__option--real,
      .bzm-bluff-reveal__option--fake,
      .bzm-bluff-reveal__option--revealing {
        animation: none;
      }
    }
  `,
})
/**
 * Displays the dramatic reveal sequence for Fibbage-style bluff rounds,
 * showing all fake and real answers with voting, revealing, and revealed phases.
 *
 * During the voting phase, options are clickable cards. In the revealing phase,
 * each option flips one by one to reveal whether it was fake or real. The real
 * answer glows green with an "ECHT!" label, while fakes show red with "Nep!"
 * and the author's name. A score summary appears after the full reveal.
 *
 * @selector bzm-bluff-reveal
 *
 * @example
 * ```html
 * <bzm-bluff-reveal
 *   question="Welk land heeft het meeste taarten per hoofd?"
 *   [options]="bluffOptions"
 *   [phase]="'voting'"
 *   [selectedOptionId]="myVote()"
 *   (optionSelected)="onVote($event)"
 * />
 * ```
 */
export class BzmBluffRevealComponent {
  /** The bluff question displayed at the top. */
  readonly question = input.required<string>();

  /** All answer options (fakes + real), pre-shuffled. */
  readonly options = input.required<BluffOption[]>();

  /** Current phase of the reveal sequence. @default 'voting' */
  readonly phase = input<BluffRevealPhase>('voting');

  /** ID of the option the current player voted for. @default null */
  readonly selectedOptionId = input<string | null>(null);

  /** Emits the option ID when a player votes during the voting phase. */
  readonly optionSelected = output<string>();

  /** Number of voters who correctly identified the real answer. */
  protected readonly correctVoterCount = computed(() => {
    const real = this.options().find((o) => o.isReal);
    return real?.voterCount ?? 0;
  });

  /** Number of voters fooled by fake answers. */
  protected readonly fooledVoterCount = computed(() =>
    this.options()
      .filter((o) => !o.isReal)
      .reduce((sum, o) => sum + o.voterCount, 0)
  );

  /** Computes CSS classes for an option card based on phase and state. */
  protected optionClasses(option: BluffOption): string {
    const classes = ['bzm-bluff-reveal__option'];
    const p = this.phase();

    if (p === 'voting') {
      classes.push('bzm-bluff-reveal__option--voting');
      if (this.selectedOptionId() === option.id) {
        classes.push('bzm-bluff-reveal__option--selected');
      }
    } else {
      if (p === 'revealing') {
        classes.push('bzm-bluff-reveal__option--revealing');
      }
      if (option.isReal) {
        classes.push('bzm-bluff-reveal__option--real');
      } else {
        classes.push('bzm-bluff-reveal__option--fake');
      }
    }

    return classes.join(' ');
  }

  /** Returns the animation delay for staggered reveal. */
  protected revealDelay(index: number): string {
    if (this.phase() === 'revealing') {
      return `${index * 0.8}s`;
    }
    return '0s';
  }

  /** Handles option selection during the voting phase. */
  protected onSelect(optionId: string): void {
    if (this.phase() === 'voting') {
      this.optionSelected.emit(optionId);
    }
  }
}
