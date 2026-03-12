import { Component, ChangeDetectionStrategy, input, computed } from '@angular/core';

/** Size preset for the QR code component. */
export type QrCodeSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'bzm-qr-code',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="bzm-qr-code"
      [class]="containerClasses()"
      role="img"
      [attr.aria-label]="'QR code: ' + label()"
    >
      <div class="bzm-qr-code__frame">
        <img
          class="bzm-qr-code__image"
          [src]="dataUrl()"
          [alt]="label()"
          [style.width.px]="sizePx()"
          [style.height.px]="sizePx()"
        />
      </div>
      <span class="bzm-qr-code__label">{{ label() }}</span>
    </div>
  `,
  styles: `
    :host {
      display: block;
      font-family: var(--bzm-font-family);
    }

    .bzm-qr-code {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--bzm-space-4);
    }

    .bzm-qr-code__frame {
      background: var(--bzm-white);
      border: 4px solid var(--bzm-color-border);
      border-width: 3px 4px 5px 3px;
      border-radius: var(--bzm-radius-md);
      padding: var(--bzm-space-4);
      box-shadow: var(--bzm-shadow-card);
      display: flex;
      align-items: center;
      justify-content: center;
      animation: bzm-qr-pulse 3s ease-in-out infinite;
    }

    .bzm-qr-code__image {
      display: block;
      image-rendering: pixelated;
    }

    .bzm-qr-code__label {
      font-size: var(--bzm-font-size-base);
      font-weight: var(--bzm-font-weight-extrabold);
      color: var(--bzm-color-text);
      text-transform: uppercase;
      letter-spacing: 0.08em;
      text-align: center;
    }

    /* ── Sizes ── */
    .size-sm .bzm-qr-code__frame {
      padding: var(--bzm-space-3);
    }

    .size-sm .bzm-qr-code__label {
      font-size: var(--bzm-font-size-sm);
    }

    .size-lg .bzm-qr-code__frame {
      padding: var(--bzm-space-6);
      border-width: 4px 5px 6px 4px;
      box-shadow: var(--bzm-shadow-lg);
    }

    .size-lg .bzm-qr-code__label {
      font-size: var(--bzm-font-size-lg);
    }

    /* ── Pulse animation on border ── */
    @keyframes bzm-qr-pulse {
      0%, 100% {
        box-shadow: var(--bzm-shadow-card);
      }
      50% {
        box-shadow:
          0 0 0 4px var(--bzm-color-primary),
          0 0 0 8px rgba(0, 0, 0, 0.05),
          var(--bzm-shadow-card);
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .bzm-qr-code__frame {
        animation: none;
      }
    }
  `,
})
/**
 * Displays a QR code image inside a comic-styled bordered frame with a label below.
 * The frame features a subtle pulse animation to draw attention.
 *
 * Accepts a pre-generated QR code data URL (e.g., from a QR encoding library) and
 * renders it at the specified size. Used on lobby screens alongside the room code
 * for instant mobile joining via camera scan.
 *
 * Respects `prefers-reduced-motion` by disabling the pulse animation.
 *
 * @selector bzm-qr-code
 *
 * @example
 * ```html
 * <bzm-qr-code [dataUrl]="qrDataUrl" size="lg" label="Scan om mee te doen" />
 * <bzm-qr-code [dataUrl]="qrDataUrl" size="sm" label="Join met je telefoon" />
 * ```
 */
export class BzmQrCodeComponent {
  /** Data URL of the QR code image (e.g., `data:image/png;base64,...`). */
  readonly dataUrl = input.required<string>();

  /**
   * Size preset controlling the QR code image dimensions.
   * - `'sm'` -- 128px
   * - `'md'` -- 200px
   * - `'lg'` -- 280px
   * @default 'md'
   */
  readonly size = input<QrCodeSize>('md');

  /**
   * Label text displayed below the QR code image.
   * @default 'Scan om mee te doen'
   */
  readonly label = input<string>('Scan om mee te doen');

  protected readonly sizePx = computed((): number => {
    const sizeMap: Record<QrCodeSize, number> = {
      sm: 128,
      md: 200,
      lg: 280,
    };
    return sizeMap[this.size()];
  });

  protected readonly containerClasses = computed(
    () => `bzm-qr-code size-${this.size()}`
  );
}
