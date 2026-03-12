import { Component, ChangeDetectionStrategy, input, output, computed } from '@angular/core';

/** Size preset for the numeric input. */
export type NumericInputSize = 'md' | 'lg';

@Component({
  selector: 'bzm-numeric-input',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div [class]="containerClasses()" role="group" aria-label="Numerieke invoer">
      <button
        type="button"
        class="bzm-numeric-input__stepper"
        [disabled]="disabled() || atMin()"
        aria-label="Verlagen"
        (click)="decrement()"
      >
        <i class="ph-duotone ph-minus"></i>
      </button>

      <input
        type="text"
        inputmode="text"
        pattern="[-]?[0-9]*"
        class="bzm-numeric-input__field"
        [class.bzm-numeric-input__field--lg]="size() === 'lg'"
        [placeholder]="placeholder()"
        [disabled]="disabled()"
        [value]="displayValue()"
        [attr.aria-label]="placeholder()"
        (input)="onInput($event)"
        (keydown)="onKeydown($event)"
      />

      <button
        type="button"
        class="bzm-numeric-input__stepper"
        [disabled]="disabled() || atMax()"
        aria-label="Verhogen"
        (click)="increment()"
      >
        <i class="ph-duotone ph-plus"></i>
      </button>
    </div>
  `,
  styles: `
    :host {
      display: block;
      font-family: var(--bzm-font-family);
    }

    .bzm-numeric-input {
      display: flex;
      align-items: center;
      gap: var(--bzm-space-3);
      justify-content: center;
    }

    .bzm-numeric-input--disabled {
      filter: grayscale(0.6);
      opacity: 0.7;
    }

    .bzm-numeric-input__stepper {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 56px;
      height: 56px;
      border: 4px solid var(--bzm-color-border);
      border-width: 3px 4px 5px 3px;
      border-radius: var(--bzm-radius-md);
      background: var(--bzm-color-surface);
      color: var(--bzm-color-text);
      font-size: var(--bzm-font-size-xl);
      cursor: pointer;
      box-shadow: var(--bzm-shadow-sm);
      transition:
        transform var(--bzm-transition-playful),
        box-shadow var(--bzm-transition-base),
        background-color var(--bzm-transition-base);
      -webkit-tap-highlight-color: transparent;
      user-select: none;
    }

    .bzm-numeric-input__stepper:hover:not(:disabled) {
      transform: translateY(-2px) rotate(-1deg);
      box-shadow: var(--bzm-shadow-md);
      background: var(--bzm-color-primary);
      color: var(--bzm-color-text-on-primary);
    }

    .bzm-numeric-input__stepper:active:not(:disabled) {
      transform: translateY(2px);
      box-shadow: none;
    }

    .bzm-numeric-input__stepper:disabled {
      cursor: not-allowed;
      opacity: 0.4;
      pointer-events: none;
    }

    .bzm-numeric-input__stepper i::before {
      opacity: 0;
    }

    .bzm-numeric-input__field {
      flex: 0 1 200px;
      min-width: 0;
      text-align: center;
      font-family: var(--bzm-font-family);
      font-weight: var(--bzm-font-weight-extrabold);
      font-size: 2rem;
      color: var(--bzm-color-text);
      background: var(--bzm-color-surface);
      border: 4px solid var(--bzm-color-border);
      border-width: 3px 4px 5px 3px;
      border-radius: var(--bzm-radius-md);
      box-shadow: inset 0 2px 6px rgba(0, 0, 0, 0.1), var(--bzm-shadow-md);
      padding: var(--bzm-space-3) var(--bzm-space-4);
      outline: none;
      transition:
        border-color var(--bzm-transition-base),
        box-shadow var(--bzm-transition-base);
    }

    .bzm-numeric-input__field--lg {
      font-size: 3rem;
      padding: var(--bzm-space-4) var(--bzm-space-5);
      flex: 0 1 260px;
    }

    .bzm-numeric-input__field::placeholder {
      color: var(--bzm-color-text-muted);
      font-size: var(--bzm-font-size-lg);
      font-weight: var(--bzm-font-weight-bold);
    }

    .bzm-numeric-input__field:focus {
      border-color: var(--bzm-color-primary);
      box-shadow:
        inset 0 2px 6px rgba(0, 0, 0, 0.1),
        0 0 0 3px color-mix(in srgb, var(--bzm-color-primary) 30%, transparent);
    }

    .bzm-numeric-input__field:disabled {
      cursor: not-allowed;
      background: var(--bzm-gray-100);
      color: var(--bzm-color-text-muted);
      border-color: var(--bzm-gray-300);
    }

    @media (prefers-reduced-motion: reduce) {
      .bzm-numeric-input__stepper {
        transition: none;
      }
    }
  `,
})
/**
 * Displays a large comic-styled numeric input with +/- stepper buttons
 * for "Closest Wins" guess questions.
 *
 * Features touch-friendly stepper buttons, numeric keyboard on mobile,
 * inner shadow styling, and optional min/max value clamping.
 * Respects `prefers-reduced-motion` for stepper animations.
 *
 * @selector bzm-numeric-input
 *
 * @example
 * ```html
 * <bzm-numeric-input
 *   [value]="guess()"
 *   placeholder="Typ je gok..."
 *   [min]="0"
 *   [max]="1000"
 *   (valueChange)="guess.set($event)"
 * />
 * ```
 */
export class BzmNumericInputComponent {
  /** Current numeric value. `null` means the input is empty. @default null */
  readonly value = input<number | null>(null);

  /** Placeholder text shown when the input is empty. @default 'Typ je gok...' */
  readonly placeholder = input<string>('Typ je gok...');

  /** Minimum allowed value. `null` means no lower bound. @default null */
  readonly min = input<number | null>(null);

  /** Maximum allowed value. `null` means no upper bound. @default null */
  readonly max = input<number | null>(null);

  /** Disables the input and stepper buttons. @default false */
  readonly disabled = input<boolean>(false);

  /** Size preset controlling input font size and padding. @default 'lg' */
  readonly size = input<NumericInputSize>('lg');

  /** Emits the updated numeric value when the user types or uses steppers. */
  readonly valueChange = output<number | null>();

  protected readonly displayValue = computed(() => {
    const v = this.value();
    return v === null ? '' : String(v);
  });

  protected readonly atMin = computed(() => {
    const v = this.value();
    const m = this.min();
    return v !== null && m !== null && v <= m;
  });

  protected readonly atMax = computed(() => {
    const v = this.value();
    const m = this.max();
    return v !== null && m !== null && v >= m;
  });

  protected readonly containerClasses = computed(() => {
    const classes = ['bzm-numeric-input'];
    if (this.disabled()) classes.push('bzm-numeric-input--disabled');
    return classes.join(' ');
  });

  /** Handles raw text input, parsing to a number and clamping within bounds. */
  onInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    const raw = target.value.replace(/[^0-9\-]/g, '');

    if (raw === '' || raw === '-') {
      this.valueChange.emit(null);
      return;
    }

    const parsed = parseInt(raw, 10);
    if (isNaN(parsed)) {
      this.valueChange.emit(null);
      return;
    }

    this.valueChange.emit(this.clamp(parsed));
  }

  /** Handles arrow key increments and decrements. */
  onKeydown(event: KeyboardEvent): void {
    if (event.key === 'ArrowUp') {
      event.preventDefault();
      this.increment();
    } else if (event.key === 'ArrowDown') {
      event.preventDefault();
      this.decrement();
    }
  }

  /** Increments the value by 1, respecting the max bound. */
  increment(): void {
    const current = this.value() ?? 0;
    this.valueChange.emit(this.clamp(current + 1));
  }

  /** Decrements the value by 1, respecting the min bound. */
  decrement(): void {
    const current = this.value() ?? 0;
    this.valueChange.emit(this.clamp(current - 1));
  }

  private clamp(value: number): number {
    const lo = this.min();
    const hi = this.max();
    if (lo !== null && value < lo) return lo;
    if (hi !== null && value > hi) return hi;
    return value;
  }
}
