import {
  Component,
  ChangeDetectionStrategy,
  input,
  output,
  signal,
  computed,
  effect,
  ElementRef,
  viewChildren,
  afterNextRender,
} from '@angular/core';

@Component({
  selector: 'bzm-pin-input',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="bzm-pin-input" role="group" [attr.aria-label]="ariaLabel()">
      @for (digit of digits(); track $index) {
        <input
          #digitInput
          type="text"
          inputmode="numeric"
          maxlength="1"
          class="bzm-pin-input__digit"
          [class.bzm-pin-input__digit--filled]="digit !== ''"
          [class.bzm-pin-input__digit--error]="error()"
          [value]="digit"
          [disabled]="disabled()"
          [attr.aria-label]="'Cijfer ' + ($index + 1) + ' van ' + length()"
          (input)="onDigitInput($index, $event)"
          (keydown)="onKeyDown($index, $event)"
          (paste)="onPaste($event)"
          (focus)="onFocus($index)"
        />
      }
    </div>
  `,
  styles: `
    :host {
      display: block;
      font-family: var(--bzm-font-family);
    }

    .bzm-pin-input {
      display: flex;
      gap: var(--bzm-space-2);
      justify-content: center;
    }

    .bzm-pin-input__digit {
      width: clamp(2.5rem, 12vw, 3.5rem);
      height: clamp(3rem, 14vw, 4rem);
      padding: 0;
      text-align: center;
      font-family: var(--bzm-font-family);
      font-size: clamp(1.25rem, 5vw, 1.75rem);
      font-weight: var(--bzm-font-weight-extrabold);
      color: var(--bzm-color-text);
      background: var(--bzm-color-surface);
      border: 4px solid var(--bzm-color-border);
      border-width: 3px 4px 5px 3px;
      border-radius: var(--bzm-radius-md);
      box-shadow: var(--bzm-shadow-sm);
      outline: none;
      caret-color: transparent;
      transition:
        border-color var(--bzm-transition-base),
        box-shadow var(--bzm-transition-base),
        transform var(--bzm-transition-playful);
    }

    .bzm-pin-input__digit::placeholder {
      color: var(--bzm-color-text-muted);
    }

    .bzm-pin-input__digit:focus {
      border-color: var(--bzm-color-answer-a);
      box-shadow: var(--bzm-shadow-md);
      transform: translateY(-2px);
    }

    .bzm-pin-input__digit--filled {
      background: var(--bzm-color-surface);
      border-color: var(--bzm-color-border);
    }

    .bzm-pin-input__digit--error {
      border-color: var(--bzm-color-error);
    }

    .bzm-pin-input__digit:disabled {
      cursor: not-allowed;
      background: var(--bzm-gray-100);
      color: var(--bzm-color-text-muted);
      border-color: var(--bzm-gray-300);
    }

    @media (prefers-reduced-motion: reduce) {
      .bzm-pin-input__digit {
        transition: none;
      }

      .bzm-pin-input__digit:focus {
        transform: none;
      }
    }
  `,
})
/**
 * Displays a numeric PIN input with individual digit fields, clipboard paste support, and full
 * arrow key / backspace keyboard navigation. Used for entering room codes to join a game.
 *
 * Automatically advances focus to the next field on digit entry and emits a `completed` event
 * once all digits are filled. Supports auto-focus on render and programmatic reset.
 *
 * @selector bzm-pin-input
 *
 * @example
 * ```html
 * <bzm-pin-input
 *   [length]="6"
 *   [autoFocus]="true"
 *   (valueChange)="onCodeChange($event)"
 *   (completed)="joinGame($event)"
 * />
 * ```
 */
export class BzmPinInputComponent {
  /**
   * Number of individual digit fields to render.
   * @default 6
   */
  readonly length = input<number>(6);

  /**
   * Disables all digit fields, preventing user input.
   * @default false
   */
  readonly disabled = input<boolean>(false);

  /**
   * Applies error border styling to all digit fields.
   * @default false
   */
  readonly error = input<boolean>(false);

  /**
   * Accessible label for the pin input group.
   * @default 'Voer code in'
   */
  readonly ariaLabel = input<string>('Voer code in');

  /**
   * Automatically focuses the first digit field after the component renders.
   * @default false
   */
  readonly autoFocus = input<boolean>(false);

  /** Emits the concatenated digit string on every change. */
  readonly valueChange = output<string>();

  /** Emits the complete PIN string once all digit fields are filled. */
  readonly completed = output<string>();

  /** Internal signal holding the current value of each digit field. */
  readonly digits = signal<string[]>(Array(6).fill(''));

  /** Query list of native digit input elements for focus management. */
  readonly digitInputs = viewChildren<ElementRef<HTMLInputElement>>('digitInput');

  constructor() {
    effect(() => {
      const len = this.length();
      const current = this.digits();
      if (current.length !== len) {
        this.digits.set(Array(len).fill(''));
      }
    });

    afterNextRender(() => {
      if (this.autoFocus()) {
        const inputs = this.digitInputs();
        if (inputs.length > 0) {
          inputs[0].nativeElement.focus();
        }
      }
    });
  }

  /** Handles single-digit input and auto-advances to the next field. */
  onDigitInput(index: number, event: Event): void {
    const target = event.target as HTMLInputElement;
    const value = target.value.replace(/\D/g, '');

    if (value.length === 0) {
      this.updateDigit(index, '');
      return;
    }

    const digit = value[value.length - 1];
    this.updateDigit(index, digit);

    const inputs = this.digitInputs();
    if (index < this.length() - 1) {
      inputs[index + 1].nativeElement.focus();
    }
  }

  /** Handles backspace and arrow key navigation between digit fields. */
  onKeyDown(index: number, event: KeyboardEvent): void {
    const inputs = this.digitInputs();

    if (event.key === 'Backspace') {
      if (this.digits()[index] === '' && index > 0) {
        inputs[index - 1].nativeElement.focus();
        this.updateDigit(index - 1, '');
      } else {
        this.updateDigit(index, '');
      }
    }

    if (event.key === 'ArrowLeft' && index > 0) {
      inputs[index - 1].nativeElement.focus();
    }

    if (event.key === 'ArrowRight' && index < this.length() - 1) {
      inputs[index + 1].nativeElement.focus();
    }
  }

  /** Distributes pasted numeric content across all digit fields. */
  onPaste(event: ClipboardEvent): void {
    event.preventDefault();
    const pasted = (event.clipboardData?.getData('text') ?? '').replace(/\D/g, '');
    const chars = pasted.slice(0, this.length()).split('');

    const newDigits = Array(this.length()).fill('');
    chars.forEach((char, i) => {
      newDigits[i] = char;
    });
    this.digits.set(newDigits);

    const inputs = this.digitInputs();
    const focusIndex = Math.min(chars.length, this.length() - 1);
    inputs[focusIndex].nativeElement.focus();

    this.emitValue();
  }

  /** Selects the digit field content on focus for easy overwrite. */
  onFocus(index: number): void {
    const inputs = this.digitInputs();
    inputs[index].nativeElement.select();
  }

  private updateDigit(index: number, value: string): void {
    const newDigits = [...this.digits()];
    newDigits[index] = value;
    this.digits.set(newDigits);
    this.emitValue();
  }

  private emitValue(): void {
    const value = this.digits().join('');
    this.valueChange.emit(value);
    if (value.length === this.length() && !value.includes('')) {
      this.completed.emit(value);
    }
  }

  /** Clears all digits and focuses the first field. */
  reset(): void {
    this.digits.set(Array(this.length()).fill(''));
    const inputs = this.digitInputs();
    if (inputs.length > 0) {
      inputs[0].nativeElement.focus();
    }
  }
}
