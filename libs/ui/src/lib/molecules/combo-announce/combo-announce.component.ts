import { Component, ChangeDetectionStrategy, input, output, effect, OnDestroy } from '@angular/core';

@Component({
  selector: 'bzm-combo-announce',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (visible()) {
      <div
        class="bzm-combo-announce"
        role="alert"
        aria-live="assertive"
        (click)="dismiss()"
      >
        <div class="bzm-combo-announce__sparkles" aria-hidden="true">
          <i class="ph-duotone ph-star-four bzm-combo-announce__sparkle bzm-combo-announce__sparkle--1"></i>
          <i class="ph-duotone ph-sparkle bzm-combo-announce__sparkle bzm-combo-announce__sparkle--2"></i>
          <i class="ph-duotone ph-star-four bzm-combo-announce__sparkle bzm-combo-announce__sparkle--3"></i>
          <i class="ph-duotone ph-sparkle bzm-combo-announce__sparkle bzm-combo-announce__sparkle--4"></i>
        </div>

        <div class="bzm-combo-announce__content">
          <span class="bzm-combo-announce__label">Combo!</span>
          <h3 class="bzm-combo-announce__name">{{ comboName() }}</h3>
          <span class="bzm-combo-announce__bonus">{{ bonus() }}</span>
          <p class="bzm-combo-announce__flavor">{{ flavorText() }}</p>
        </div>

        <div class="bzm-combo-announce__border-bottom" aria-hidden="true"></div>
      </div>
    }
  `,
  styles: `
    :host {
      display: block;
      font-family: var(--bzm-font-family);
    }

    .bzm-combo-announce {
      position: relative;
      width: 100%;
      padding: var(--bzm-space-6) var(--bzm-space-8);
      background: linear-gradient(135deg, var(--bzm-color-accent) 0%, #f97316 100%);
      border: 4px solid var(--bzm-black);
      border-width: 3px 4px 5px 3px;
      border-radius: var(--bzm-radius-md);
      box-shadow: 6px 6px 0 var(--bzm-black);
      cursor: pointer;
      overflow: hidden;
      text-align: center;
      transform: translateY(-20px) scale(0.9);
      opacity: 0;
      animation: bzm-combo-enter 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
    }

    .bzm-combo-announce__content {
      position: relative;
      z-index: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--bzm-space-1);
    }

    .bzm-combo-announce__label {
      font-size: var(--bzm-font-size-sm);
      font-weight: var(--bzm-font-weight-extrabold);
      text-transform: uppercase;
      letter-spacing: 0.15em;
      color: var(--bzm-black);
      opacity: 0.7;
    }

    .bzm-combo-announce__name {
      margin: 0;
      font-family: var(--bzm-font-heading);
      font-size: clamp(2rem, 6vw, 3.5rem);
      font-weight: var(--bzm-font-weight-black);
      color: var(--bzm-white);
      text-shadow: 3px 3px 0 var(--bzm-black);
      -webkit-text-stroke: 2px var(--bzm-black);
      paint-order: stroke fill;
      line-height: var(--bzm-line-height-tight);
    }

    .bzm-combo-announce__bonus {
      display: inline-block;
      font-family: var(--bzm-font-heading);
      font-size: clamp(2.5rem, 7vw, 4rem);
      font-weight: var(--bzm-font-weight-black);
      color: var(--bzm-white);
      text-shadow: 4px 4px 0 var(--bzm-black);
      -webkit-text-stroke: 2px var(--bzm-black);
      paint-order: stroke fill;
      animation: bzm-combo-pulse 0.8s ease-in-out infinite alternate;
    }

    .bzm-combo-announce__flavor {
      margin: var(--bzm-space-1) 0 0;
      font-size: var(--bzm-font-size-base);
      font-weight: var(--bzm-font-weight-semibold);
      font-style: italic;
      color: var(--bzm-black);
      opacity: 0.85;
    }

    .bzm-combo-announce__sparkles {
      position: absolute;
      inset: 0;
      pointer-events: none;
      z-index: 0;
    }

    .bzm-combo-announce__sparkle {
      position: absolute;
      color: var(--bzm-white);
      opacity: 0.7;
      animation: bzm-sparkle-float 1.5s ease-in-out infinite alternate;
    }

    .bzm-combo-announce__sparkle--1 {
      top: 10%;
      left: 8%;
      font-size: 24px;
      animation-delay: 0s;
    }

    .bzm-combo-announce__sparkle--2 {
      top: 15%;
      right: 10%;
      font-size: 20px;
      animation-delay: 0.3s;
    }

    .bzm-combo-announce__sparkle--3 {
      bottom: 15%;
      left: 15%;
      font-size: 18px;
      animation-delay: 0.6s;
    }

    .bzm-combo-announce__sparkle--4 {
      bottom: 10%;
      right: 8%;
      font-size: 22px;
      animation-delay: 0.9s;
    }

    .bzm-combo-announce__border-bottom {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 6px;
      background: repeating-linear-gradient(
        90deg,
        var(--bzm-black) 0px,
        var(--bzm-black) 8px,
        transparent 8px,
        transparent 12px
      );
    }

    @keyframes bzm-combo-enter {
      0% {
        transform: translateY(-20px) scale(0.9);
        opacity: 0;
      }
      100% {
        transform: translateY(0) scale(1);
        opacity: 1;
      }
    }

    @keyframes bzm-combo-pulse {
      0% { transform: scale(1); }
      100% { transform: scale(1.08); }
    }

    @keyframes bzm-sparkle-float {
      0% { transform: translateY(0) rotate(0deg); opacity: 0.5; }
      100% { transform: translateY(-6px) rotate(15deg); opacity: 0.9; }
    }

    @media (prefers-reduced-motion: reduce) {
      .bzm-combo-announce {
        animation: none;
        transform: none;
        opacity: 1;
      }

      .bzm-combo-announce__bonus {
        animation: none;
      }

      .bzm-combo-announce__sparkle {
        animation: none;
      }
    }
  `,
})
/**
 * Full-width announcement banner displayed when a knowledge combo is triggered.
 *
 * Shows the combo name, bonus multiplier, and flavor text with a gradient
 * background and sparkle particle effects. Slides in from the top and emits
 * `(dismissed)` after 3 seconds or on click. The parent is responsible for
 * setting `[visible]="false"` in response to the `(dismissed)` event.
 * Respects `prefers-reduced-motion`.
 *
 * @selector bzm-combo-announce
 *
 * @example
 * ```html
 * <bzm-combo-announce
 *   comboName="Nature Explorer"
 *   bonus="+3x"
 *   flavorText="You know this planet inside out!"
 *   [visible]="true"
 *   (dismissed)="onComboDismissed()"
 * />
 * ```
 */
export class BzmComboAnnounceComponent implements OnDestroy {
  /** Name of the triggered combo. */
  readonly comboName = input.required<string>();

  /** Bonus multiplier text displayed prominently. */
  readonly bonus = input.required<string>();

  /** Descriptive flavor text for the combo. */
  readonly flavorText = input.required<string>();

  /** Controls visibility and triggers entrance animation when set to true. @default false */
  readonly visible = input<boolean>(false);

  /** Emitted when the banner is dismissed (auto-timeout or click). */
  readonly dismissed = output<void>();

  private dismissTimer: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    effect(() => {
      if (this.visible()) {
        this.clearTimer();
        this.dismissTimer = setTimeout(() => this.dismiss(), 3000);
      } else {
        this.clearTimer();
      }
    });
  }

  ngOnDestroy(): void {
    this.clearTimer();
  }

  /** Dismisses the banner and emits the dismissed event. */
  protected dismiss(): void {
    this.clearTimer();
    this.dismissed.emit();
  }

  private clearTimer(): void {
    if (this.dismissTimer !== null) {
      clearTimeout(this.dismissTimer);
      this.dismissTimer = null;
    }
  }
}
