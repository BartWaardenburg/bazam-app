import { Component, ChangeDetectionStrategy, computed, input, output } from '@angular/core';

/** Single-character letter label for answer options. */
export type AnswerLetter = 'A' | 'B' | 'C' | 'D';

@Component({
  selector: 'bzm-answer-option',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      type="button"
      [class]="containerClass()"
      [style]="containerStyle()"
      [disabled]="disabled()"
      (click)="handleClick()"
    >
      @if (disabled() && correct() === null) {
        <div class="bzm-answer-option__lock-badge" aria-hidden="true">
          <i class="ph-duotone ph-lock" style="font-size: 14px;"></i>
        </div>
      }
      <span class="bzm-answer-option__letter" [style]="letterStyle()">
        {{ letter() }}
      </span>
      <span class="bzm-answer-option__text">{{ text() }}</span>
      @if (correct() === true) {
        <span class="bzm-answer-option__icon bzm-answer-option__icon--correct">
<i class="ph-duotone ph-check" style="font-size: 20px; color: var(--bzm-color-text-on-primary);"></i>
        </span>
      }
      @if (correct() === false) {
        <span class="bzm-answer-option__icon bzm-answer-option__icon--incorrect">
<i class="ph-duotone ph-x" style="font-size: 20px; color: var(--bzm-color-text-on-primary);"></i>
        </span>
      }
    </button>
  `,
  styles: `
    :host {
      display: block;
      width: 100%;
    }

    .bzm-answer-option {
      position: relative;
      display: flex;
      align-items: center;
      gap: var(--bzm-space-4);
      width: 100%;
      padding: var(--bzm-space-4) var(--bzm-space-5);
      background: var(--bzm-color-surface);
      border: 4px solid var(--bzm-color-border);
      border-width: var(--bzm-border-width-comic);
      border-radius: var(--bzm-radius-md);
      box-shadow: var(--bzm-shadow-md);
      cursor: pointer;
      transition: transform var(--bzm-transition-playful),
                  box-shadow var(--bzm-transition-base),
                  border-color var(--bzm-transition-base);
      font-family: var(--bzm-font-family);
      outline: none;
      text-align: left;
      overflow: visible;
    }

    .bzm-answer-option:hover:not(:disabled) {
      transform: translateY(-3px) rotate(-0.5deg);
      box-shadow: var(--bzm-shadow-lg);
    }

    .bzm-answer-option:focus-visible {
      box-shadow: 0 0 0 3px var(--bzm-color-focus);
    }

    .bzm-answer-option--selected {
      border-width: 4px 5px 6px 4px;
    }

    .bzm-answer-option--correct {
      border-color: var(--bzm-color-success) !important;
      border-width: 4px 5px 6px 4px;
      background: var(--bzm-green-100);
    }

    .bzm-answer-option--incorrect {
      border-color: var(--bzm-color-error) !important;
      border-width: 4px 5px 6px 4px;
      background: var(--bzm-red-100);
    }

    .bzm-answer-option:disabled {
      cursor: not-allowed;
      filter: grayscale(0.5);
      opacity: 0.7;
    }

    .bzm-answer-option__lock-badge {
      position: absolute;
      top: -12px;
      right: -12px;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
      background-color: var(--bzm-white);
      color: var(--bzm-black);
      border: 3px solid var(--bzm-black);
      border-width: var(--bzm-border-width-comic-sm);
      border-radius: 4px;
      box-shadow: var(--bzm-shadow-sm);
      z-index: 2;
      font-size: 18px;
      pointer-events: none;
    }

    .bzm-answer-option__letter {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
      border-radius: var(--bzm-radius-md);
      font-size: var(--bzm-font-size-lg);
      font-weight: var(--bzm-font-weight-extrabold);
      flex-shrink: 0;
    }

    .bzm-answer-option__text {
      flex: 1;
      font-size: var(--bzm-font-size-base);
      font-weight: var(--bzm-font-weight-bold);
      color: var(--bzm-color-text);
      line-height: var(--bzm-line-height-snug);
    }

    .bzm-answer-option__icon {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      width: 28px;
      height: 28px;
      border-radius: 3px;
      border: 2px solid var(--bzm-black);
      border-width: 1.5px 2px 2px 1.5px;
    }

    .bzm-answer-option__icon--correct {
      background: var(--bzm-color-success);
    }

    .bzm-answer-option__icon--incorrect {
      background: var(--bzm-color-error);
    }

    .bzm-answer-option__icon i::before {
      opacity: 0;
    }
  `,
})
/**
 * Renders a single answer option button with a color-coded letter badge and correct/incorrect feedback states.
 *
 * Displays the answer text alongside a colored letter label (A-D). Supports selection
 * highlighting, correct/incorrect visual feedback with check/cross icons, and
 * keyboard-accessible focus styles. Typically used as a child of `BzmAnswerGrid`.
 *
 * @selector bzm-answer-option
 *
 * @example
 * ```html
 * <bzm-answer-option
 *   letter="A"
 *   text="Amsterdam"
 *   [selected]="true"
 *   [correct]="null"
 *   (selected)="onSelect()"
 * />
 * ```
 */
export class BzmAnswerOptionComponent {
  /** Letter label (A-D) displayed in the color-coded badge. */
  readonly letter = input.required<AnswerLetter>();

  /** Answer text displayed next to the letter badge. */
  readonly text = input.required<string>();

  /** Whether this option is currently selected by the player. @default false */
  readonly selected = input<boolean>(false);

  /** Correctness state: `true` shows a green check, `false` shows a red cross, `null` hides feedback. @default null */
  readonly correct = input<boolean | null>(null);

  /** Prevents the option from being clicked when true. @default false */
  readonly disabled = input<boolean>(false);

  /** Emits when the player clicks this answer option (only when not disabled). */
  readonly selectedEvent = output<void>({ alias: 'selected' });

  /** Maps each letter to its text color CSS variable. */
  protected readonly letterColorMap: Record<AnswerLetter, string> = {
    A: 'var(--bzm-cyan-700)',
    B: 'var(--bzm-yellow-700)',
    C: 'var(--bzm-red-700)',
    D: 'var(--bzm-green-700)',
  };

  /** Maps each letter to its background color CSS variable. */
  protected readonly letterBgMap: Record<AnswerLetter, string> = {
    A: 'var(--bzm-cyan-100)',
    B: 'var(--bzm-yellow-100)',
    C: 'var(--bzm-red-100)',
    D: 'var(--bzm-green-100)',
  };

  protected readonly containerClass = computed(() => {
    const classes = ['bzm-answer-option'];
    if (this.selected()) classes.push('bzm-answer-option--selected');
    if (this.correct() === true) classes.push('bzm-answer-option--correct');
    if (this.correct() === false) classes.push('bzm-answer-option--incorrect');
    return classes.join(' ');
  });

  /** Maps each letter to its border color CSS variable for the selected state. */
  protected readonly borderColorMap: Record<AnswerLetter, string> = {
    A: 'var(--bzm-color-answer-a)',
    B: 'var(--bzm-color-answer-b)',
    C: 'var(--bzm-color-answer-c)',
    D: 'var(--bzm-color-answer-d)',
  };

  protected readonly containerStyle = computed(() => {
    const l = this.letter();
    if (this.selected() && this.correct() === null) {
      return `border-color: ${this.borderColorMap[l]}`;
    }
    return '';
  });

  protected readonly letterStyle = computed(() => {
    const l = this.letter();
    return `color: ${this.letterColorMap[l]}; background: ${this.letterBgMap[l]}`;
  });

  /** Handles button click, emitting the `selected` output only when the option is not disabled. */
  protected handleClick(): void {
    if (!this.disabled()) {
      this.selectedEvent.emit();
    }
  }
}
