import { Component, ChangeDetectionStrategy, input, computed } from '@angular/core';

@Component({
  selector: 'bzm-pause-screen',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (active()) {
      <div class="bzm-pause" role="alert" aria-live="assertive">
        <div class="bzm-pause__backdrop"></div>

        <div class="bzm-pause__content">
          <div class="bzm-pause__icon" aria-hidden="true">
            <i class="ph-duotone ph-coffee" style="font-size: 64px;"></i>
          </div>

          <h1 class="bzm-pause__title">PAUZE</h1>

          <p class="bzm-pause__message">{{ message() }}</p>

          @if (hostName()) {
            <p class="bzm-pause__host">&mdash; {{ hostName() }}</p>
          }

          @if (showTimer() && resumeAt()) {
            <div class="bzm-pause__resume">
              <i class="ph-duotone ph-clock" style="font-size: 18px;"></i>
              <span>Verder: {{ resumeAt() }}</span>
            </div>
          }
        </div>
      </div>
    }
  `,
  styles: `
    :host {
      display: block;
      font-family: var(--bzm-font-family);
    }

    .bzm-pause {
      position: fixed;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 2000;
    }

    .bzm-pause__backdrop {
      position: absolute;
      inset: 0;
      background: rgba(0, 0, 0, 0.8);
      backdrop-filter: blur(6px);
      background-image:
        radial-gradient(circle, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
      background-size: 16px 16px;
    }

    .bzm-pause__content {
      position: relative;
      z-index: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--bzm-space-4);
      text-align: center;
      padding: var(--bzm-space-8);
      animation: bzm-pause-enter 0.5s var(--bzm-transition-playful);
    }

    .bzm-pause__icon {
      color: var(--bzm-color-accent);
      animation: bzm-pause-breathe 3s ease-in-out infinite;
      filter: drop-shadow(2px 2px 0 var(--bzm-black));
    }

    .bzm-pause__title {
      margin: 0;
      font-family: var(--bzm-font-heading);
      font-size: clamp(3rem, 12vw, 6rem);
      font-weight: var(--bzm-font-weight-black);
      color: var(--bzm-white);
      text-shadow:
        4px 4px 0 var(--bzm-color-primary),
        8px 8px 0 var(--bzm-black);
      -webkit-text-stroke: 3px var(--bzm-black);
      paint-order: stroke fill;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      animation: bzm-pause-breathe 3s ease-in-out infinite;
    }

    .bzm-pause__message {
      margin: 0;
      font-size: var(--bzm-font-size-xl);
      font-weight: var(--bzm-font-weight-semibold);
      color: var(--bzm-white);
      opacity: 0.9;
      max-width: 400px;
    }

    .bzm-pause__host {
      margin: 0;
      font-size: var(--bzm-font-size-base);
      font-weight: var(--bzm-font-weight-bold);
      color: var(--bzm-color-text-muted);
      font-style: italic;
    }

    .bzm-pause__resume {
      display: flex;
      align-items: center;
      gap: var(--bzm-space-2);
      padding: var(--bzm-space-3) var(--bzm-space-5);
      background: var(--bzm-color-primary-surface);
      border: 3px solid var(--bzm-color-primary);
      border-radius: var(--bzm-radius-md);
      color: var(--bzm-color-primary);
      font-size: var(--bzm-font-size-base);
      font-weight: var(--bzm-font-weight-bold);
      margin-top: var(--bzm-space-2);
    }

    @keyframes bzm-pause-enter {
      from {
        opacity: 0;
        transform: scale(0.8);
      }
      to {
        opacity: 1;
        transform: scale(1);
      }
    }

    @keyframes bzm-pause-breathe {
      0%, 100% {
        transform: scale(1);
      }
      50% {
        transform: scale(1.03);
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .bzm-pause__content {
        animation: none;
      }

      .bzm-pause__icon,
      .bzm-pause__title {
        animation: none;
      }
    }
  `,
})
/**
 * Displays a full-screen pause overlay with dramatic comic-styled "PAUZE" text,
 * a custom host message, and optional resume countdown information. Features a
 * breathing animation on the title, a coffee cup icon, and a halftone dot
 * pattern background. Renders only when `active` is true.
 *
 * @selector bzm-pause-screen
 *
 * @example
 * ```html
 * <bzm-pause-screen
 *   [active]="isPaused"
 *   message="Even naar het toilet!"
 *   hostName="Bart"
 *   [showTimer]="true"
 *   resumeAt="Over 5 minuten"
 * />
 * ```
 */
export class BzmPauseScreenComponent {
  /**
   * Custom pause message from the host.
   * @default 'Even pauze!'
   */
  readonly message = input<string>('Even pauze!');

  /**
   * Name of the host who initiated the pause.
   * @default ''
   */
  readonly hostName = input<string>('');

  /**
   * Whether the pause overlay is currently visible.
   * @default true
   */
  readonly active = input<boolean>(true);

  /**
   * Whether to show the resume timer section.
   * @default false
   */
  readonly showTimer = input<boolean>(false);

  /**
   * Optional descriptive text for when the game resumes, e.g. "Over 5 minuten".
   * @default ''
   */
  readonly resumeAt = input<string>('');
}
