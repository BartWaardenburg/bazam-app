import { Component, ChangeDetectionStrategy, input, computed } from '@angular/core';

export type ButtonVariant = 'primary' | 'secondary' | 'accent' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'bzm-button',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      [class]="buttonClasses()"
      [disabled]="disabled()"
      [style.width]="fullWidth() ? '100%' : 'auto'"
    >
      <ng-content />
    </button>
  `,
  styles: `
    :host {
      display: inline-block;
      font-family: var(--bzm-font-family);
    }

    :host([fullWidth]) {
      display: block;
      width: 100%;
    }

    button {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: var(--bzm-space-2);
      border: 4px solid var(--bzm-black);
      border-width: 3px 4px 5px 3px;
      border-radius: var(--bzm-radius-md);
      font-family: var(--bzm-font-family);
      font-weight: var(--bzm-font-weight-extrabold);
      text-transform: uppercase;
      letter-spacing: 0.02em;
      cursor: pointer;
      transition:
        transform var(--bzm-transition-playful),
        box-shadow var(--bzm-transition-base),
        background-color var(--bzm-transition-base),
        border-color var(--bzm-transition-base);
      white-space: nowrap;
      user-select: none;
      -webkit-tap-highlight-color: transparent;

    }

    button:hover:not(:disabled) {
      transform: translateY(-3px) rotate(-1deg);
    }

    button:active:not(:disabled) {
      transform: translateY(4px);
      box-shadow: none !important;
    }

    button:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }

    /* ── Sizes ── */
    .size-sm {
      padding: var(--bzm-space-1) var(--bzm-space-4);
      font-size: var(--bzm-font-size-sm);
      min-height: 32px;
    }

    .size-md {
      padding: var(--bzm-space-2) var(--bzm-space-6);
      font-size: var(--bzm-font-size-base);
      min-height: 40px;
    }

    .size-lg {
      padding: var(--bzm-space-3) var(--bzm-space-8);
      font-size: var(--bzm-font-size-lg);
      min-height: 48px;
    }

    /* ── Variants ── */
    .variant-primary {
      background-color: var(--bzm-color-primary);
      color: var(--bzm-color-text-on-primary);
      box-shadow: var(--bzm-shadow-primary);
    }

    .variant-primary:hover:not(:disabled) {
      background-color: var(--bzm-color-primary-dark);
      box-shadow: var(--bzm-shadow-lg);
    }

    .variant-secondary {
      background-color: var(--bzm-color-surface);
      color: var(--bzm-color-primary);
      border-color: var(--bzm-black);
      box-shadow: var(--bzm-shadow-md);
    }

    .variant-secondary:hover:not(:disabled) {
      background-color: var(--bzm-color-primary-surface);
      box-shadow: var(--bzm-shadow-lg);
    }

    .variant-accent {
      background-color: var(--bzm-color-accent);
      color: var(--bzm-color-text-on-accent);
      box-shadow: var(--bzm-shadow-accent);
    }

    .variant-accent:hover:not(:disabled) {
      background-color: var(--bzm-color-accent-dark);
      box-shadow: var(--bzm-shadow-lg);
    }

    .variant-ghost {
      background-color: transparent;
      color: var(--bzm-color-primary);
    }

    .variant-ghost:hover:not(:disabled) {
      background-color: var(--bzm-color-primary-surface);
    }
  `,
})
export class BzmButtonComponent {
  readonly variant = input<ButtonVariant>('primary');
  readonly size = input<ButtonSize>('md');
  readonly disabled = input<boolean>(false);
  readonly fullWidth = input<boolean>(false);

  protected readonly buttonClasses = computed(
    () => `variant-${this.variant()} size-${this.size()}`
  );
}
