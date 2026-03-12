import { Component, ChangeDetectionStrategy, input, computed } from '@angular/core';

@Component({
  selector: 'bzm-achievement-toast',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="toast"
      [class.toast--visible]="visible()"
      [class.toast--hidden]="!visible()"
      role="alert"
      aria-live="assertive"
    >
      <div class="toast__sparkles">
        <span class="sparkle sparkle--1" aria-hidden="true">&#10022;</span>
        <span class="sparkle sparkle--2" aria-hidden="true">&#10022;</span>
        <span class="sparkle sparkle--3" aria-hidden="true">&#9733;</span>
        <span class="sparkle sparkle--4" aria-hidden="true">&#10022;</span>
        <span class="sparkle sparkle--5" aria-hidden="true">&#9733;</span>
      </div>
      <div class="toast__header">
        <i class="ph-duotone ph-trophy toast__trophy"></i>
        <span class="toast__title">ACHIEVEMENT UNLOCKED!</span>
        <i class="ph-duotone ph-trophy toast__trophy"></i>
      </div>
      <div class="toast__content">
        <i [class]="iconClass()" class="toast__icon"></i>
        <span class="toast__name">{{ name() }}</span>
      </div>
    </div>
  `,
  styles: `
    :host {
      display: block;
      font-family: var(--bzm-font-family);
      position: relative;
    }

    .toast {
      position: relative;
      background: linear-gradient(135deg, #FFF8DC 0%, #FFD700 30%, #FFF8A0 60%, #FFD700 100%);
      border: 4px solid var(--bzm-color-border);
      border-width: var(--bzm-border-width-comic);
      border-radius: var(--bzm-radius-md);
      padding: var(--bzm-space-4) var(--bzm-space-6);
      box-shadow: var(--bzm-shadow-lg), 0 0 20px rgba(255, 215, 0, 0.3);
      text-align: center;
      overflow: hidden;
      transform: translateY(-120%);
      opacity: 0;
      transition:
        transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1),
        opacity 0.3s ease;
    }

    .toast--visible {
      transform: translateY(0);
      opacity: 1;
    }

    .toast--hidden {
      transform: translateY(-120%);
      opacity: 0;
    }

    .toast__sparkles {
      position: absolute;
      inset: 0;
      pointer-events: none;
      overflow: hidden;
    }

    .sparkle {
      position: absolute;
      color: var(--bzm-color-gold);
      opacity: 0;
      font-size: 16px;
    }

    .toast--visible .sparkle {
      animation: bzm-sparkle-float 2s ease-in-out infinite;
    }

    .sparkle--1 { top: 10%; left: 5%; animation-delay: 0s; }
    .sparkle--2 { top: 20%; right: 8%; animation-delay: 0.3s; }
    .sparkle--3 { bottom: 15%; left: 12%; animation-delay: 0.6s; }
    .sparkle--4 { top: 5%; right: 20%; animation-delay: 0.9s; }
    .sparkle--5 { bottom: 10%; right: 5%; animation-delay: 1.2s; }

    @keyframes bzm-sparkle-float {
      0%, 100% { opacity: 0; transform: scale(0.5) rotate(0deg); }
      50% { opacity: 1; transform: scale(1.2) rotate(180deg); }
    }

    .toast__header {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: var(--bzm-space-2);
      margin-bottom: var(--bzm-space-2);
    }

    .toast__trophy {
      font-size: var(--bzm-font-size-lg);
      color: #B8860B;
    }

    .toast__title {
      font-size: var(--bzm-font-size-sm);
      font-weight: var(--bzm-font-weight-black);
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: #8B6914;
    }

    .toast__content {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: var(--bzm-space-2);
    }

    .toast__icon {
      font-size: var(--bzm-font-size-xl);
      color: #5C4813;
    }

    .toast__name {
      font-size: var(--bzm-font-size-lg);
      font-weight: var(--bzm-font-weight-extrabold);
      color: #3D2E0A;
    }

    @media (prefers-reduced-motion: reduce) {
      .toast {
        transition: opacity var(--bzm-transition-base);
      }

      .toast--visible {
        transform: translateY(0);
      }

      .toast--hidden {
        transform: translateY(0);
        opacity: 0;
      }

      .toast--visible .sparkle {
        animation: none;
        opacity: 0.6;
      }
    }
  `,
})
/**
 * Displays a golden achievement-unlocked notification toast with sparkle effects.
 * Slides down from the top when visible and includes trophy icons flanking the header.
 *
 * Typically positioned at the top of the viewport using absolute/fixed positioning
 * by the parent container. Auto-dismissal timing is handled externally.
 *
 * @selector bzm-achievement-toast
 *
 * @example
 * ```html
 * <bzm-achievement-toast
 *   name="Brainiac"
 *   icon="ph-brain"
 *   [visible]="showToast"
 * />
 * ```
 */
export class BzmAchievementToastComponent {
  /** Achievement name displayed in the toast. */
  readonly name = input.required<string>();

  /** Phosphor icon name (without `ph-duotone` prefix) for the achievement. */
  readonly icon = input.required<string>();

  /**
   * Controls visibility with slide-in/slide-out animation.
   * @default true
   */
  readonly visible = input<boolean>(true);

  protected readonly iconClass = computed(() => `ph-duotone ph-${this.icon()}`);
}
