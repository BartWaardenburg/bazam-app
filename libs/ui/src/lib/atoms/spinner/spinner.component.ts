import { Component, ChangeDetectionStrategy, input, computed } from '@angular/core';

export type SpinnerSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'bzm-spinner',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      [class]="spinnerClasses()"
      role="status"
      [attr.aria-label]="ariaLabel()"
    >
      <svg viewBox="0 0 50 50" class="bzm-spinner__svg">
        <circle
          class="bzm-spinner__track"
          cx="25" cy="25" r="20"
          fill="none"
          stroke-width="5"
        />
        <circle
          class="bzm-spinner__circle"
          cx="25" cy="25" r="20"
          fill="none"
          stroke-width="5"
          stroke-linecap="round"
        />
      </svg>
    </div>
  `,
  styles: `
    :host {
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }

    .bzm-spinner {
      display: inline-flex;
    }

    .bzm-spinner__svg {
      animation: bzm-spin 1s linear infinite;
    }

    .bzm-spinner__track {
      stroke: var(--bzm-gray-200);
    }

    .bzm-spinner__circle {
      stroke: var(--bzm-color-primary);
      stroke-dasharray: 80, 200;
      stroke-dashoffset: 0;
    }

    /* ── Sizes ── */
    .size-sm .bzm-spinner__svg {
      width: 20px;
      height: 20px;
    }

    .size-md .bzm-spinner__svg {
      width: 32px;
      height: 32px;
    }

    .size-lg .bzm-spinner__svg {
      width: 48px;
      height: 48px;
    }

    @keyframes bzm-spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    @media (prefers-reduced-motion: reduce) {
      .bzm-spinner__svg {
        animation: bzm-pulse 2s ease-in-out infinite;
      }

      @keyframes bzm-pulse {
        0%, 100% { opacity: 0.4; }
        50% { opacity: 1; }
      }
    }
  `,
})
export class BzmSpinnerComponent {
  readonly size = input<SpinnerSize>('md');
  readonly ariaLabel = input<string>('Laden...');

  protected readonly spinnerClasses = computed(
    () => `bzm-spinner size-${this.size()}`
  );
}
