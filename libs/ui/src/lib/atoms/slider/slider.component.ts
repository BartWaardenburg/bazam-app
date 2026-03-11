import {
  Component,
  ChangeDetectionStrategy,
  input,
  model,
  computed,
  forwardRef,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'bzm-slider',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => BzmSliderComponent),
      multi: true,
    },
  ],
  template: `
    <div class="slider" [class.slider-disabled]="disabled()">
      @if (label()) {
        <label class="slider-label">
          {{ label() }}
          <span class="slider-value">{{ displayValue() }}</span>
        </label>
      }
      <input
        type="range"
        [min]="min()"
        [max]="max()"
        [step]="step()"
        [value]="value()"
        [disabled]="disabled()"
        [style]="trackStyle()"
        [attr.aria-label]="label() || 'Slider'"
        [attr.aria-valuemin]="min()"
        [attr.aria-valuemax]="max()"
        [attr.aria-valuenow]="value()"
        (input)="onInput($event)"
      />
    </div>
  `,
  styles: `
    :host {
      display: block;
      font-family: var(--bzm-font-family);
    }

    .slider {
      display: flex;
      flex-direction: column;
      gap: var(--bzm-space-2);
    }

    .slider-label {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: var(--bzm-font-size-sm);
      font-weight: var(--bzm-font-weight-bold);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--bzm-color-text-secondary);
    }

    .slider-value {
      font-weight: var(--bzm-font-weight-extrabold);
      color: var(--bzm-color-text);
    }

    input[type="range"] {
      -webkit-appearance: none;
      appearance: none;
      width: 100%;
      height: 8px;
      background: transparent;
      cursor: pointer;
      margin: 0;
    }

    input[type="range"]:focus-visible {
      outline: 3px solid var(--bzm-cyan-500);
      outline-offset: 4px;
      border-radius: var(--bzm-radius-full);
    }

    /* ── Track ── */
    input[type="range"]::-webkit-slider-runnable-track {
      height: 8px;
      border-radius: var(--bzm-radius-full);
      border: 2px solid var(--bzm-black);
      background: linear-gradient(
        to right,
        var(--bzm-color-primary) 0%,
        var(--bzm-color-primary) var(--track-fill, 0%),
        var(--bzm-gray-200) var(--track-fill, 0%),
        var(--bzm-gray-200) 100%
      );
    }

    input[type="range"]::-moz-range-track {
      height: 8px;
      border-radius: var(--bzm-radius-full);
      border: 2px solid var(--bzm-black);
      background: var(--bzm-gray-200);
    }

    input[type="range"]::-moz-range-progress {
      height: 8px;
      border-radius: var(--bzm-radius-full) 0 0 var(--bzm-radius-full);
      background: var(--bzm-color-primary);
      border: 2px solid var(--bzm-black);
    }

    /* ── Thumb ── */
    input[type="range"]::-webkit-slider-thumb {
      -webkit-appearance: none;
      appearance: none;
      width: 22px;
      height: 22px;
      border-radius: var(--bzm-radius-full);
      background: var(--bzm-color-primary);
      border: 3px solid var(--bzm-black);
      box-shadow: var(--bzm-shadow-sm);
      margin-top: -9px;
      cursor: grab;
      transition:
        transform var(--bzm-transition-playful),
        box-shadow var(--bzm-transition-base);
    }

    input[type="range"]::-moz-range-thumb {
      width: 22px;
      height: 22px;
      border-radius: var(--bzm-radius-full);
      background: var(--bzm-color-primary);
      border: 3px solid var(--bzm-black);
      box-shadow: var(--bzm-shadow-sm);
      cursor: grab;
      transition:
        transform var(--bzm-transition-playful),
        box-shadow var(--bzm-transition-base);
    }

    input[type="range"]:hover::-webkit-slider-thumb {
      transform: scale(1.15);
      box-shadow: var(--bzm-shadow-md);
    }

    input[type="range"]:hover::-moz-range-thumb {
      transform: scale(1.15);
      box-shadow: var(--bzm-shadow-md);
    }

    input[type="range"]:active::-webkit-slider-thumb {
      cursor: grabbing;
      transform: scale(1.25);
      box-shadow: none;
    }

    input[type="range"]:active::-moz-range-thumb {
      cursor: grabbing;
      transform: scale(1.25);
      box-shadow: none;
    }

    /* ── Disabled ── */
    .slider-disabled {
      filter: grayscale(0.6);
    }

    .slider-disabled input[type="range"] {
      cursor: not-allowed;
    }

    .slider-disabled input[type="range"]::-webkit-slider-thumb {
      cursor: not-allowed;
    }

    .slider-disabled input[type="range"]::-moz-range-thumb {
      cursor: not-allowed;
    }
  `,
})
/**
 * Displays a range slider with an optional label, live value display, and Angular Reactive Forms
 * integration via `ControlValueAccessor`. Features a filled track indicator and comic-styled thumb.
 *
 * The slider visually fills the track from left to right proportional to the current value.
 * When a label is set, it is displayed alongside the formatted current value and optional suffix.
 *
 * @selector bzm-slider
 *
 * @example
 * ```html
 * <bzm-slider label="Tijdslimiet" [min]="5" [max]="60" [(value)]="timeLimit" suffix="s" />
 * <bzm-slider label="Volume" [min]="0" [max]="100" [step]="5" />
 * ```
 */
export class BzmSliderComponent implements ControlValueAccessor {
  /**
   * Minimum allowed value for the slider.
   * @default 0
   */
  readonly min = input<number>(0);

  /**
   * Maximum allowed value for the slider.
   * @default 100
   */
  readonly max = input<number>(100);

  /**
   * Step increment between allowed values.
   * @default 1
   */
  readonly step = input<number>(1);

  /**
   * Two-way bindable model for the current slider value.
   * @default 50
   */
  readonly value = model<number>(50);

  /**
   * Disables the slider, applying greyscale styling and preventing interaction.
   * @default false
   */
  readonly disabled = input<boolean>(false);

  /**
   * Optional label displayed above the slider track alongside the current value.
   * @default ''
   */
  readonly label = input<string>('');

  /**
   * Optional suffix appended to the displayed value (e.g., "s" for seconds, "%" for percent).
   * @default ''
   */
  readonly suffix = input<string>('');

  private onChange: (value: number) => void = () => {};
  private onTouched: () => void = () => {};

  protected readonly displayValue = computed(() => `${this.value()}${this.suffix()}`);

  protected readonly trackStyle = computed(() => {
    const pct = ((this.value() - this.min()) / (this.max() - this.min())) * 100;
    return `--track-fill: ${pct}%`;
  });

  /** Handles native range input changes, updates the model value, and notifies form controls. */
  onInput(event: Event): void {
    const val = Number((event.target as HTMLInputElement).value);
    this.value.set(val);
    this.onChange(val);
    this.onTouched();
  }

  /** Writes a new value from the form control to the slider model. */
  writeValue(value: number): void {
    this.value.set(value);
  }

  /** Registers the `onChange` callback provided by Angular forms. */
  registerOnChange(fn: (value: number) => void): void {
    this.onChange = fn;
  }

  /** Registers the `onTouched` callback provided by Angular forms. */
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
}
