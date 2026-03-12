import { Component, ChangeDetectionStrategy, computed, input } from '@angular/core';

@Component({
  selector: 'bzm-rescue-banner',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (canBeRescued() || rescuerName()) {
      <div
        [class]="bannerClasses()"
        role="status"
        [attr.aria-label]="ariaLabel()"
      >
        @if (rescuerName()) {
          <div class="bzm-rescue-banner__content bzm-rescue-banner__content--rescued">
            <i class="ph-duotone ph-heart" style="font-size: 24px;"></i>
            <span class="bzm-rescue-banner__text">
              Gered door <strong>{{ rescuerName() }}</strong>!
            </span>
            <i class="ph-duotone ph-confetti" style="font-size: 20px;"></i>
          </div>
        } @else if (canBeRescued()) {
          <div class="bzm-rescue-banner__content bzm-rescue-banner__content--waiting">
            <i class="ph-duotone ph-lifebuoy" style="font-size: 24px;"></i>
            <span class="bzm-rescue-banner__text">Wacht op redding...</span>
            @if (rescuesRemaining() > 0) {
              <span class="bzm-rescue-banner__count">
                {{ rescuesRemaining() }} over
              </span>
            }
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

    .bzm-rescue-banner {
      border: 4px solid var(--bzm-color-border);
      border-width: var(--bzm-border-width-comic);
      border-radius: var(--bzm-radius-md);
      box-shadow: var(--bzm-shadow-md);
      overflow: hidden;
      animation: bzm-rescue-slide-in 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    }

    .bzm-rescue-banner--waiting {
      background: var(--bzm-color-primary);
      border-color: var(--bzm-color-primary);
    }

    .bzm-rescue-banner--rescued {
      background: var(--bzm-color-success);
      border-color: var(--bzm-color-success);
    }

    .bzm-rescue-banner__content {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: var(--bzm-space-2);
      padding: var(--bzm-space-3) var(--bzm-space-4);
      color: var(--bzm-white);
    }

    .bzm-rescue-banner__content--waiting {
      animation: bzm-rescue-pulse 2s ease-in-out infinite;
    }

    .bzm-rescue-banner__content--rescued i:first-child {
      animation: bzm-rescue-heart-pop 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
    }

    .bzm-rescue-banner__text {
      font-size: var(--bzm-font-size-base);
      font-weight: var(--bzm-font-weight-bold);
    }

    .bzm-rescue-banner__text strong {
      font-weight: var(--bzm-font-weight-extrabold);
    }

    .bzm-rescue-banner__count {
      font-size: var(--bzm-font-size-xs);
      font-weight: var(--bzm-font-weight-bold);
      background: rgba(0, 0, 0, 0.2);
      padding: 2px var(--bzm-space-2);
      border-radius: var(--bzm-radius-md);
    }

    @keyframes bzm-rescue-slide-in {
      from {
        transform: translateY(100%);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }

    @keyframes bzm-rescue-pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.7; }
    }

    @keyframes bzm-rescue-heart-pop {
      0% { transform: scale(0); }
      60% { transform: scale(1.4); }
      100% { transform: scale(1); }
    }

    @media (prefers-reduced-motion: reduce) {
      .bzm-rescue-banner {
        animation: none;
      }

      .bzm-rescue-banner__content--waiting {
        animation: none;
      }

      .bzm-rescue-banner__content--rescued i:first-child {
        animation: none;
      }
    }
  `,
})
/**
 * Displays a rescue mechanic indicator for Boss Battle co-op mode.
 *
 * Shows a pulsing "Wacht op redding..." banner when the player can be rescued
 * by a teammate, and a celebratory "Gered door [name]!" banner when rescued.
 * Slides in from the bottom with comic styling.
 *
 * @selector bzm-rescue-banner
 *
 * @example
 * ```html
 * <bzm-rescue-banner
 *   [canBeRescued]="true"
 *   [rescuesRemaining]="1"
 * />
 *
 * <bzm-rescue-banner
 *   rescuerName="Bart"
 * />
 * ```
 */
export class BzmRescueBannerComponent {
  /** Name of the player who rescued you. Shows celebration when set. @default null */
  readonly rescuerName = input<string | null>(null);

  /** Whether the player can be rescued by a teammate. @default false */
  readonly canBeRescued = input<boolean>(false);

  /** Number of rescue opportunities remaining. @default 1 */
  readonly rescuesRemaining = input<number>(1);

  protected readonly bannerClasses = computed(() => {
    const classes = ['bzm-rescue-banner'];
    if (this.rescuerName()) {
      classes.push('bzm-rescue-banner--rescued');
    } else if (this.canBeRescued()) {
      classes.push('bzm-rescue-banner--waiting');
    }
    return classes.join(' ');
  });

  protected readonly ariaLabel = computed(() => {
    if (this.rescuerName()) {
      return `Gered door ${this.rescuerName()}`;
    }
    if (this.canBeRescued()) {
      return `Wacht op redding, ${this.rescuesRemaining()} reddingen over`;
    }
    return '';
  });
}
