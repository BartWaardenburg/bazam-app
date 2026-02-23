import { Component, ChangeDetectionStrategy, input, output, computed, ElementRef, viewChild } from '@angular/core';

export type InputSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'bzm-input',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (label()) {
      <label class="bzm-input__label" [for]="inputId()">{{ label() }}</label>
    }
    <input
      #inputEl
      [id]="inputId()"
      [class]="inputClasses()"
      [type]="type()"
      [placeholder]="placeholder()"
      [disabled]="disabled()"
      [value]="value()"
      [attr.maxlength]="maxLength()"
      [attr.aria-label]="ariaLabel() || label()"
      [attr.aria-invalid]="error() ? 'true' : null"
      [attr.aria-describedby]="error() ? inputId() + '-error' : null"
      (input)="onInput($event)"
      (keydown.enter)="enterPressed.emit()"
    />
    @if (error()) {
      <span class="bzm-input__error" [id]="inputId() + '-error'" role="alert">{{ error() }}</span>
    }
  `,
  styles: `
    :host {
      display: block;
      font-family: var(--bzm-font-family);
    }

    .bzm-input__label {
      display: block;
      margin-bottom: var(--bzm-space-1);
      font-size: var(--bzm-font-size-sm);
      font-weight: var(--bzm-font-weight-semibold);
      color: var(--bzm-color-text-muted);
      text-transform: uppercase;
      letter-spacing: 0.08em;
    }

    input {
      display: block;
      width: 100%;
      box-sizing: border-box;
      font-family: var(--bzm-font-family);
      background: var(--bzm-color-surface);
      color: var(--bzm-color-text);
      border: 4px solid var(--bzm-color-border);
      border-width: 3px 4px 5px 3px;
      border-radius: var(--bzm-radius-md);
      box-shadow: var(--bzm-shadow-md);
      outline: none;
      transition:
        border-color var(--bzm-transition-base),
        box-shadow var(--bzm-transition-base);
    }

    input::placeholder {
      color: var(--bzm-color-text-muted);
    }

    input:focus {
      border-color: var(--bzm-color-answer-a);
      box-shadow: var(--bzm-shadow-sm);
    }

    input:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    /* ── Sizes ── */
    .size-sm {
      padding: var(--bzm-space-2) var(--bzm-space-3);
      font-size: var(--bzm-font-size-sm);
    }

    .size-md {
      padding: var(--bzm-space-3) var(--bzm-space-5);
      font-size: var(--bzm-font-size-base);
    }

    .size-lg {
      padding: var(--bzm-space-4) var(--bzm-space-5);
      font-size: var(--bzm-font-size-lg);
    }

    /* ── Error state ── */
    .input--error {
      border-color: var(--bzm-color-error);
    }

    .input--error:focus {
      border-color: var(--bzm-color-error);
    }

    .bzm-input__error {
      display: block;
      margin-top: var(--bzm-space-1);
      font-size: var(--bzm-font-size-xs);
      font-weight: var(--bzm-font-weight-bold);
      color: var(--bzm-color-error);
    }
  `,
})
export class BzmInputComponent {
  readonly label = input<string | undefined>(undefined);
  readonly placeholder = input<string>('');
  readonly value = input<string>('');
  readonly type = input<string>('text');
  readonly size = input<InputSize>('md');
  readonly disabled = input<boolean>(false);
  readonly error = input<string | undefined>(undefined);
  readonly maxLength = input<number | undefined>(undefined);
  readonly ariaLabel = input<string | undefined>(undefined);
  readonly inputId = input<string>('bzm-input');

  readonly valueChange = output<string>();
  readonly enterPressed = output<void>();

  readonly inputEl = viewChild<ElementRef<HTMLInputElement>>('inputEl');

  protected readonly inputClasses = computed(() => {
    const classes = [`size-${this.size()}`];
    if (this.error()) {
      classes.push('input--error');
    }
    return classes.join(' ');
  });

  onInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.valueChange.emit(target.value);
  }

  focus(): void {
    this.inputEl()?.nativeElement.focus();
  }
}
