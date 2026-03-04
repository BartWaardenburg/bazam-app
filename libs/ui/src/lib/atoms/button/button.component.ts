import { Component, ChangeDetectionStrategy, input, computed } from '@angular/core';

export type ButtonVariant = 'primary' | 'secondary' | 'accent' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'bzm-button',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="bzm-btn-wrap" [class.bzm-btn-wrap--full]="fullWidth()">
      <button
        [class]="buttonClasses()"
        [disabled]="disabled()"
        [style.width]="fullWidth() ? '100%' : 'auto'"
      >
        <ng-content />
      </button>
      @if (disabled()) {
        <span class="bzm-btn-badge" aria-hidden="true">
          <svg viewBox="0 0 16 16" fill="currentColor" width="10" height="10">
            <path d="M11.5 6V4.5a3.5 3.5 0 1 0-7 0V6H3v7.5A1.5 1.5 0 0 0 4.5 15h7a1.5 1.5 0 0 0 1.5-1.5V6h-1.5zm-5.5-.5V6h4V4.5a2 2 0 1 0-4 0z"/>
          </svg>
        </span>
      }
    </div>
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

    .bzm-btn-wrap {
      position: relative;
      display: inline-block;
    }

    .bzm-btn-wrap--full {
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
      cursor: not-allowed;
      filter: grayscale(0.6);
      color: var(--bzm-color-text-muted);
    }

    /* ── Disabled badge ── */
    .bzm-btn-badge {
      position: absolute;
      top: -8px;
      right: -8px;
      width: 24px;
      height: 24px;
      border-radius: 3px;
      background-color: var(--bzm-color-text-muted);
      color: var(--bzm-white);
      display: flex;
      align-items: center;
      justify-content: center;
      border: 2px solid var(--bzm-black);
      border-width: 1.5px 2px 2px 1.5px;
      box-shadow: var(--bzm-shadow-sm);
      pointer-events: none;
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
