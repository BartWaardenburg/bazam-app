import { Component, ChangeDetectionStrategy, computed, input } from '@angular/core';

@Component({
  selector: 'bzm-comeback-banner',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (active()) {
      <div
        [class]="bannerClasses()"
        role="status"
        [attr.aria-label]="ariaLabel()"
      >
        @if (isComplete()) {
          <div class="bzm-comeback-banner__content bzm-comeback-banner__content--complete">
            <i class="ph-duotone ph-confetti" style="font-size: 24px;"></i>
            <span class="bzm-comeback-banner__title">JE BENT TERUG!</span>
            <i class="ph-duotone ph-confetti" style="font-size: 24px;"></i>
          </div>
        } @else {
          <div class="bzm-comeback-banner__content">
            <div class="bzm-comeback-banner__header">
              <i class="ph-duotone ph-fire" style="font-size: 24px;"></i>
              <span class="bzm-comeback-banner__title">COMEBACK RONDE!</span>
              <i class="ph-duotone ph-fire" style="font-size: 24px;"></i>
            </div>

            <div class="bzm-comeback-banner__progress">
              @for (dot of progressDots(); track $index) {
                <span
                  class="bzm-comeback-banner__dot"
                  [class.bzm-comeback-banner__dot--filled]="dot"
                ></span>
              }
            </div>

            <span class="bzm-comeback-banner__hint">
              Nog {{ remaining() }} goed nodig
            </span>
          </div>
        }
      </div>
    }
  `,
  styles: `
    :host {
      display: block;
      font-family: var(--bzm-font-family);
    }

    .bzm-comeback-banner {
      border: 4px solid var(--bzm-color-border);
      border-width: var(--bzm-border-width-comic);
      border-radius: var(--bzm-radius-md);
      box-shadow: var(--bzm-shadow-md);
      overflow: hidden;
    }

    .bzm-comeback-banner--active {
      background: linear-gradient(135deg, var(--bzm-color-fire) 0%, #ea580c 100%);
      border-color: #ea580c;
      animation: bzm-comeback-pulse 2s ease-in-out infinite;
    }

    .bzm-comeback-banner--complete {
      background: linear-gradient(135deg, var(--bzm-color-success) 0%, #16a34a 100%);
      border-color: #16a34a;
      animation: bzm-comeback-celebrate 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
    }

    .bzm-comeback-banner__content {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--bzm-space-2);
      padding: var(--bzm-space-4) var(--bzm-space-5);
      color: var(--bzm-white);
    }

    .bzm-comeback-banner__content--complete {
      flex-direction: row;
      justify-content: center;
    }

    .bzm-comeback-banner__header {
      display: flex;
      align-items: center;
      gap: var(--bzm-space-2);
    }

    .bzm-comeback-banner__title {
      font-size: var(--bzm-font-size-xl);
      font-weight: var(--bzm-font-weight-black);
      letter-spacing: 0.05em;
      text-shadow: 2px 2px 0 rgba(0, 0, 0, 0.3);
    }

    .bzm-comeback-banner__progress {
      display: flex;
      gap: var(--bzm-space-2);
    }

    .bzm-comeback-banner__dot {
      width: 16px;
      height: 16px;
      border-radius: 50%;
      border: 2px solid var(--bzm-white);
      background: transparent;
      transition: background 0.3s ease, transform 0.3s ease;
    }

    .bzm-comeback-banner__dot--filled {
      background: var(--bzm-white);
      transform: scale(1.1);
    }

    .bzm-comeback-banner__hint {
      font-size: var(--bzm-font-size-sm);
      font-weight: var(--bzm-font-weight-bold);
      opacity: 0.85;
    }

    @keyframes bzm-comeback-pulse {
      0%, 100% { box-shadow: var(--bzm-shadow-md); }
      50% { box-shadow: 0 0 20px rgba(249, 115, 22, 0.4), var(--bzm-shadow-md); }
    }

    @keyframes bzm-comeback-celebrate {
      0% { transform: scale(0.8); opacity: 0; }
      60% { transform: scale(1.05); }
      100% { transform: scale(1); opacity: 1; }
    }

    @media (prefers-reduced-motion: reduce) {
      .bzm-comeback-banner--active,
      .bzm-comeback-banner--complete {
        animation: none;
      }

      .bzm-comeback-banner__dot {
        transition: none;
      }
    }
  `,
})
/**
 * Displays a "Comeback Ronde!" indicator for Survival mode when a player
 * has lost all hearts and is attempting to rejoin.
 *
 * Shows progress dots indicating how many correct answers are needed to come back.
 * When all required answers are achieved, displays a "JE BENT TERUG!" celebration.
 * Not rendered when inactive.
 *
 * @selector bzm-comeback-banner
 *
 * @example
 * ```html
 * <bzm-comeback-banner
 *   [active]="true"
 *   [correctNeeded]="2"
 *   [correctSoFar]="1"
 * />
 * ```
 */
export class BzmComebackBannerComponent {
  /** Whether the comeback round is currently active. @default false */
  readonly active = input<boolean>(false);

  /** Number of correct answers needed to rejoin. @default 2 */
  readonly correctNeeded = input<number>(2);

  /** Number of correct answers achieved so far. @default 0 */
  readonly correctSoFar = input<number>(0);

  protected readonly isComplete = computed(() =>
    this.correctSoFar() >= this.correctNeeded()
  );

  protected readonly remaining = computed(() =>
    Math.max(0, this.correctNeeded() - this.correctSoFar())
  );

  protected readonly progressDots = computed(() => {
    const needed = this.correctNeeded();
    const soFar = this.correctSoFar();
    const dots: boolean[] = [];
    for (let i = 0; i < needed; i++) {
      dots.push(i < soFar);
    }
    return dots;
  });

  protected readonly bannerClasses = computed(() => {
    const classes = ['bzm-comeback-banner'];
    if (this.isComplete()) {
      classes.push('bzm-comeback-banner--complete');
    } else {
      classes.push('bzm-comeback-banner--active');
    }
    return classes.join(' ');
  });

  protected readonly ariaLabel = computed(() => {
    if (this.isComplete()) {
      return 'Je bent terug in het spel';
    }
    return `Comeback ronde: ${this.correctSoFar()} van ${this.correctNeeded()} correct`;
  });
}
