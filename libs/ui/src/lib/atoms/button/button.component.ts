import { Component, ChangeDetectionStrategy, input, computed, signal } from '@angular/core';

export type ButtonVariant = 'primary' | 'secondary' | 'accent' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'bzm-button',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="bzm-btn-wrap"
      [class.bzm-btn-wrap--full]="fullWidth()"
      [class.bzm-btn-wrap--disabled]="disabled()"
      [class.bzm-btn-shake]="shaking()"
      (click)="onWrapClick()"
    >
      <button
        [class]="buttonClasses()"
        [disabled]="disabled()"
        [style.width]="fullWidth() ? '100%' : 'auto'"
      >
        <ng-content />
      </button>
      @if (disabled()) {
        <span class="bzm-btn-badge" aria-hidden="true">
          <i class="ph-duotone ph-lock"></i>
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

    .bzm-btn-wrap--disabled {
      cursor: not-allowed;
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
      opacity: 0.7;
      filter: grayscale(0.4) saturate(0.6);
      pointer-events: none;
    }

    /* ── Shake animation for disabled click ── */
    @keyframes bzm-shake {
      0%, 100% { transform: translateX(0); }
      15% { transform: translateX(-6px) rotate(-2deg); }
      30% { transform: translateX(5px) rotate(1.5deg); }
      45% { transform: translateX(-4px) rotate(-1deg); }
      60% { transform: translateX(3px) rotate(0.5deg); }
      75% { transform: translateX(-2px); }
      90% { transform: translateX(1px); }
    }

    .bzm-btn-shake {
      animation: bzm-shake 0.4s ease-in-out;
    }

    @media (prefers-reduced-motion: reduce) {
      .bzm-btn-shake {
        animation: none;
      }
    }

    /* ── Disabled badge ── */
    .bzm-btn-badge {
      position: absolute;
      top: -12px;
      right: -12px;
      width: 36px;
      height: 36px;
      border-radius: 4px;
      background-color: var(--bzm-black);
      color: var(--bzm-white);
      display: flex;
      align-items: center;
      justify-content: center;
      border: 3px solid var(--bzm-black);
      border-width: 2px 3px 3px 2px;
      box-shadow: var(--bzm-shadow-sm);
      pointer-events: none;
      font-size: 18px;
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
      background-color: var(--bzm-color-bg);
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

  protected readonly shaking = signal(false);

  protected readonly buttonClasses = computed(
    () => `variant-${this.variant()} size-${this.size()}`
  );

  protected onWrapClick(): void {
    if (!this.disabled() || this.shaking()) return;
    this.shaking.set(true);
    setTimeout(() => this.shaking.set(false), 400);
  }
}
