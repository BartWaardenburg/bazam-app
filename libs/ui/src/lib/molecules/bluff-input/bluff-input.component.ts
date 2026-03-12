import { Component, ChangeDetectionStrategy, input, output, computed, signal, effect } from '@angular/core';

@Component({
  selector: 'bzm-bluff-input',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="bzm-bluff-input">
      <!-- Timer bar -->
      <div
        class="bzm-bluff-input__timer-bar"
        [class.bzm-bluff-input__timer-bar--urgent]="isUrgent()"
        role="progressbar"
        [attr.aria-valuenow]="timeRemaining()"
        [attr.aria-valuemin]="0"
        [attr.aria-valuemax]="totalTime()"
        [attr.aria-label]="'Resterende tijd: ' + timeRemaining() + ' seconden'"
      >
        <div
          class="bzm-bluff-input__timer-fill"
          [style.width.%]="timerPercent()"
        ></div>
      </div>

      <!-- Question -->
      <div class="bzm-bluff-input__question">
        <i class="ph-duotone ph-question bzm-bluff-input__question-icon" aria-hidden="true"></i>
        <p class="bzm-bluff-input__question-text">{{ question() }}</p>
      </div>

      @if (!submitted()) {
        <!-- Input area (speech bubble) -->
        <div class="bzm-bluff-input__bubble">
          <div class="bzm-bluff-input__bubble-tail" aria-hidden="true"></div>
          <textarea
            class="bzm-bluff-input__textarea"
            [placeholder]="placeholder()"
            [disabled]="disabled()"
            [maxLength]="maxLength()"
            [value]="draft()"
            [attr.aria-label]="'Antwoord invoer'"
            (input)="onInput($event)"
            (keydown.enter)="onSubmit($event)"
            rows="2"
          ></textarea>
          <span class="bzm-bluff-input__counter" aria-hidden="true">
            {{ draft().length }} / {{ maxLength() }}
          </span>
        </div>

        <!-- Submit button -->
        <button
          type="button"
          class="bzm-bluff-input__submit"
          [disabled]="disabled() || draft().length === 0"
          (click)="onSubmit()"
        >
          <i class="ph-duotone ph-paper-plane-tilt" aria-hidden="true"></i>
          Insturen!
        </button>
      } @else {
        <!-- Submitted confirmation -->
        <div class="bzm-bluff-input__submitted" role="status">
          <div class="bzm-bluff-input__check">
            <i class="ph-duotone ph-check-circle"></i>
          </div>
          <p class="bzm-bluff-input__submitted-text">Antwoord verstuurd!</p>
          <div class="bzm-bluff-input__spinner" aria-label="Wachten op andere spelers">
            <i class="ph-duotone ph-circle-notch bzm-bluff-input__spin-icon"></i>
            <span class="bzm-bluff-input__waiting-text">Wachten op andere spelers...</span>
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

    .bzm-bluff-input {
      background: var(--bzm-color-surface);
      border: 4px solid var(--bzm-color-border);
      border-width: 3px 4px 5px 3px;
      border-radius: var(--bzm-radius-md);
      box-shadow: var(--bzm-shadow-card);
      padding: 0;
      overflow: hidden;
    }

    /* ── Timer bar ── */
    .bzm-bluff-input__timer-bar {
      height: 6px;
      background: var(--bzm-gray-200);
      overflow: hidden;
    }

    .bzm-bluff-input__timer-fill {
      height: 100%;
      background: var(--bzm-color-primary);
      transition: width 1s linear;
      border-radius: 0 3px 3px 0;
    }

    .bzm-bluff-input__timer-bar--urgent .bzm-bluff-input__timer-fill {
      background: var(--bzm-color-error);
      animation: bzm-timer-pulse 0.5s ease-in-out infinite;
    }

    /* ── Question ── */
    .bzm-bluff-input__question {
      display: flex;
      align-items: flex-start;
      gap: var(--bzm-space-3);
      padding: var(--bzm-space-5) var(--bzm-space-5) var(--bzm-space-3);
    }

    .bzm-bluff-input__question-icon {
      font-size: var(--bzm-font-size-2xl);
      color: var(--bzm-color-primary);
      flex-shrink: 0;
      margin-top: 2px;
    }

    .bzm-bluff-input__question-text {
      margin: 0;
      font-size: var(--bzm-font-size-lg);
      font-weight: var(--bzm-font-weight-extrabold);
      color: var(--bzm-color-text);
      line-height: 1.4;
    }

    /* ── Speech bubble input ── */
    .bzm-bluff-input__bubble {
      position: relative;
      margin: var(--bzm-space-2) var(--bzm-space-5) var(--bzm-space-3);
      background: var(--bzm-color-bg, #fff);
      border: 3px solid var(--bzm-color-border);
      border-width: 2px 3px 3px 2px;
      border-radius: var(--bzm-radius-md);
      box-shadow: inset 0 2px 6px rgba(0, 0, 0, 0.06);
    }

    .bzm-bluff-input__bubble-tail {
      position: absolute;
      bottom: -10px;
      left: 24px;
      width: 0;
      height: 0;
      border-left: 8px solid transparent;
      border-right: 8px solid transparent;
      border-top: 10px solid var(--bzm-color-border);
    }

    .bzm-bluff-input__bubble-tail::after {
      content: '';
      position: absolute;
      top: -12px;
      left: -6px;
      width: 0;
      height: 0;
      border-left: 6px solid transparent;
      border-right: 6px solid transparent;
      border-top: 8px solid var(--bzm-color-bg, #fff);
    }

    .bzm-bluff-input__textarea {
      display: block;
      width: 100%;
      box-sizing: border-box;
      border: none;
      background: transparent;
      font-family: var(--bzm-font-family);
      font-size: var(--bzm-font-size-base);
      font-weight: var(--bzm-font-weight-bold);
      color: var(--bzm-color-text);
      padding: var(--bzm-space-3) var(--bzm-space-4);
      resize: none;
      outline: none;
      line-height: 1.5;
    }

    .bzm-bluff-input__textarea::placeholder {
      color: var(--bzm-color-text-muted);
      font-weight: var(--bzm-font-weight-bold);
    }

    .bzm-bluff-input__textarea:disabled {
      cursor: not-allowed;
      opacity: 0.5;
    }

    .bzm-bluff-input__counter {
      position: absolute;
      bottom: var(--bzm-space-2);
      right: var(--bzm-space-3);
      font-size: 11px;
      font-weight: var(--bzm-font-weight-bold);
      color: var(--bzm-color-text-muted);
    }

    /* ── Submit button ── */
    .bzm-bluff-input__submit {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: var(--bzm-space-2);
      width: calc(100% - var(--bzm-space-5) * 2);
      margin: var(--bzm-space-4) var(--bzm-space-5) var(--bzm-space-5);
      padding: var(--bzm-space-3) var(--bzm-space-6);
      background: var(--bzm-color-accent);
      color: var(--bzm-color-text-on-accent);
      border: 4px solid var(--bzm-color-border);
      border-width: 3px 4px 5px 3px;
      border-radius: var(--bzm-radius-md);
      font-family: var(--bzm-font-family);
      font-size: var(--bzm-font-size-base);
      font-weight: var(--bzm-font-weight-extrabold);
      text-transform: uppercase;
      letter-spacing: 0.04em;
      cursor: pointer;
      box-shadow: var(--bzm-shadow-accent, var(--bzm-shadow-md));
      transition:
        transform var(--bzm-transition-playful),
        box-shadow var(--bzm-transition-base);
      -webkit-tap-highlight-color: transparent;
    }

    .bzm-bluff-input__submit:hover:not(:disabled) {
      transform: translateY(-3px) rotate(-1deg);
      box-shadow: var(--bzm-shadow-lg);
    }

    .bzm-bluff-input__submit:active:not(:disabled) {
      transform: translateY(2px);
      box-shadow: none;
    }

    .bzm-bluff-input__submit:disabled {
      cursor: not-allowed;
      opacity: 0.5;
      filter: grayscale(0.4);
    }

    /* ── Submitted state ── */
    .bzm-bluff-input__submitted {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--bzm-space-3);
      padding: var(--bzm-space-6) var(--bzm-space-5) var(--bzm-space-8);
    }

    .bzm-bluff-input__check {
      font-size: var(--bzm-font-size-4xl);
      color: var(--bzm-color-success);
      animation: bzm-check-pop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
    }

    .bzm-bluff-input__submitted-text {
      margin: 0;
      font-size: var(--bzm-font-size-lg);
      font-weight: var(--bzm-font-weight-extrabold);
      color: var(--bzm-color-success);
    }

    .bzm-bluff-input__spinner {
      display: flex;
      align-items: center;
      gap: var(--bzm-space-2);
      margin-top: var(--bzm-space-2);
    }

    .bzm-bluff-input__spin-icon {
      font-size: var(--bzm-font-size-lg);
      color: var(--bzm-color-text-muted);
      animation: bzm-spin 1s linear infinite;
    }

    .bzm-bluff-input__waiting-text {
      font-size: var(--bzm-font-size-sm);
      color: var(--bzm-color-text-muted);
      font-weight: var(--bzm-font-weight-bold);
    }

    /* ── Animations ── */
    @keyframes bzm-timer-pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.6; }
    }

    @keyframes bzm-check-pop {
      from { transform: scale(0); }
      to { transform: scale(1); }
    }

    @keyframes bzm-spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    @media (prefers-reduced-motion: reduce) {
      .bzm-bluff-input__timer-bar--urgent .bzm-bluff-input__timer-fill,
      .bzm-bluff-input__check,
      .bzm-bluff-input__spin-icon {
        animation: none;
      }
    }
  `,
})
/**
 * Displays a card-styled text input for submitting fake answers in Fibbage-style
 * bluff rounds. Shows the question prominently, a speech-bubble-shaped textarea
 * with character counter, and a submit button.
 *
 * After submission, the input is replaced with a confirmation message and a
 * spinner while waiting for other players. Includes a timer bar at the top
 * that pulses red when time is running low.
 *
 * @selector bzm-bluff-input
 *
 * @example
 * ```html
 * <bzm-bluff-input
 *   question="Wat is het langste woord in het Nederlands?"
 *   [timeRemaining]="25"
 *   [submitted]="false"
 *   (bluffSubmitted)="onBluff($event)"
 * />
 * ```
 */
export class BzmBluffInputComponent {
  /** The question being asked. Displayed at the top of the card. */
  readonly question = input.required<string>();

  /** Maximum character length for the fake answer. @default 80 */
  readonly maxLength = input<number>(80);

  /** Placeholder text in the textarea. @default 'Verzin een antwoord...' */
  readonly placeholder = input<string>('Verzin een antwoord...');

  /** Disables the textarea and submit button. @default false */
  readonly disabled = input<boolean>(false);

  /** Remaining seconds on the timer bar. @default 30 */
  readonly timeRemaining = input<number>(30);

  /** Total seconds for the timer bar. @default 30 */
  readonly totalTime = input<number>(30);

  /** Whether the player has already submitted their answer. @default false */
  readonly submitted = input<boolean>(false);

  /** Emits the player's fake answer string when submitted. */
  readonly bluffSubmitted = output<string>();

  /** Internal draft text being typed. */
  protected readonly draft = signal('');

  private readonly resetDraftEffect = effect(() => {
    if (!this.submitted()) {
      this.draft.set('');
    }
  });

  /** Timer fill percentage based on remaining time. */
  protected readonly timerPercent = computed(() =>
    Math.max(0, Math.min(100, (this.timeRemaining() / this.totalTime()) * 100))
  );

  /** Whether the timer is in the urgent zone (under 10 seconds). */
  protected readonly isUrgent = computed(() => this.timeRemaining() <= 10);

  /** Handles textarea input events. */
  onInput(event: Event): void {
    const target = event.target as HTMLTextAreaElement;
    this.draft.set(target.value);
  }

  /** Submits the bluff answer if the draft is non-empty. */
  onSubmit(event?: Event): void {
    event?.preventDefault();
    const text = this.draft().trim();
    if (text.length > 0) {
      this.bluffSubmitted.emit(text);
    }
  }
}
