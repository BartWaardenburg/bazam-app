import { Component, ChangeDetectionStrategy, input, computed } from '@angular/core';

/** Visual variant for the cheer message. */
export type CheerVariant = 'default' | 'excited' | 'encouraging';

@Component({
  selector: 'bzm-cheer-message',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div [class]="cheerClasses()" role="status" aria-live="polite">
      <span class="bzm-cheer__name">{{ playerName() }}</span>
      <p class="bzm-cheer__message">{{ message() }}</p>
      @if (variant() === 'excited') {
        <span class="bzm-cheer__decoration bzm-cheer__decoration--star" aria-hidden="true">⭐</span>
        <span class="bzm-cheer__decoration bzm-cheer__decoration--star-2" aria-hidden="true">⭐</span>
      }
      @if (variant() === 'encouraging') {
        <span class="bzm-cheer__decoration bzm-cheer__decoration--heart" aria-hidden="true">❤️</span>
        <span class="bzm-cheer__decoration bzm-cheer__decoration--heart-2" aria-hidden="true">❤️</span>
      }
      <div class="bzm-cheer__tail"></div>
    </div>
  `,
  styles: `
    :host {
      display: block;
      font-family: var(--bzm-font-family);
    }

    .bzm-cheer {
      position: relative;
      display: inline-block;
      padding: var(--bzm-space-4, 16px) var(--bzm-space-6, 24px);
      border: 4px solid var(--bzm-color-border, var(--bzm-black));
      border-width: var(--bzm-border-width-comic);
      border-radius: var(--bzm-radius-lg, 16px);
      box-shadow: var(--bzm-shadow-card, 4px 4px 0 var(--bzm-black));
      max-width: 320px;
      animation: bzm-cheer-slide 3s ease-in-out forwards;
    }

    .bzm-cheer--default {
      background: var(--bzm-white, #fff);
    }

    .bzm-cheer--excited {
      background: var(--bzm-yellow-100, #fef9c3);
    }

    .bzm-cheer--encouraging {
      background: var(--bzm-teal-100, #ccfbf1);
    }

    .bzm-cheer__name {
      display: block;
      font-size: var(--bzm-font-size-xs, 0.75rem);
      font-weight: var(--bzm-font-weight-bold, 700);
      color: var(--bzm-color-text-secondary);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: var(--bzm-space-1, 4px);
    }

    .bzm-cheer__message {
      margin: 0;
      font-size: var(--bzm-font-size-lg, 1.125rem);
      font-weight: var(--bzm-font-weight-extrabold, 800);
      color: var(--bzm-color-text);
      text-shadow: 1px 1px 0 rgba(0, 0, 0, 0.1);
      line-height: 1.3;
    }

    .bzm-cheer--excited .bzm-cheer__message {
      color: var(--bzm-yellow-900, #713f12);
      text-shadow: 1px 1px 0 rgba(0, 0, 0, 0.05);
    }

    .bzm-cheer--encouraging .bzm-cheer__message {
      color: var(--bzm-teal-900, #134e4a);
      text-shadow: 1px 1px 0 rgba(0, 0, 0, 0.05);
    }

    .bzm-cheer__decoration {
      position: absolute;
      font-size: 14px;
      animation: bzm-cheer-sparkle 1s ease-in-out infinite;
    }

    .bzm-cheer__decoration--star {
      top: -6px;
      right: -6px;
    }

    .bzm-cheer__decoration--star-2 {
      bottom: -4px;
      left: -4px;
      animation-delay: 0.5s;
    }

    .bzm-cheer__decoration--heart {
      top: -6px;
      right: -6px;
    }

    .bzm-cheer__decoration--heart-2 {
      bottom: -4px;
      left: -4px;
      animation-delay: 0.5s;
    }

    .bzm-cheer__tail {
      position: absolute;
      right: -16px;
      top: calc(50% - 4px);
      width: 16px;
      height: 20px;
      overflow: visible;
    }

    .bzm-cheer__tail::before {
      content: '';
      position: absolute;
      top: 4px;
      left: 0;
      width: 0;
      height: 0;
      border-top: 10px solid transparent;
      border-bottom: 10px solid transparent;
      border-left: 14px solid var(--bzm-black);
    }

    .bzm-cheer__tail::after {
      content: '';
      position: absolute;
      top: 7px;
      left: -1px;
      width: 0;
      height: 0;
      border-top: 7px solid transparent;
      border-bottom: 7px solid transparent;
      border-left: 10px solid var(--bzm-white, #fff);
    }

    .bzm-cheer--excited .bzm-cheer__tail::after {
      border-left-color: var(--bzm-yellow-100, #fef9c3);
    }

    .bzm-cheer--encouraging .bzm-cheer__tail::after {
      border-left-color: var(--bzm-teal-100, #ccfbf1);
    }

    @keyframes bzm-cheer-slide {
      0% {
        opacity: 0;
        transform: translateX(40px);
      }
      10% {
        opacity: 1;
        transform: translateX(0);
      }
      80% {
        opacity: 1;
        transform: translateX(0);
      }
      100% {
        opacity: 0;
        transform: translateX(-20px);
      }
    }

    @keyframes bzm-cheer-sparkle {
      0%, 100% {
        opacity: 1;
        transform: scale(1);
      }
      50% {
        opacity: 0.6;
        transform: scale(1.2);
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .bzm-cheer {
        animation: bzm-cheer-fade 3s ease-in-out forwards;
      }

      .bzm-cheer__decoration {
        animation: none;
      }

      @keyframes bzm-cheer-fade {
        0% { opacity: 0; }
        10% { opacity: 1; }
        80% { opacity: 1; }
        100% { opacity: 0; }
      }
    }
  `,
})
/**
 * Displays a positive cheer text message in a comic speech bubble on the host screen.
 *
 * The bubble slides in from the right, stays visible for 3 seconds, then slides out.
 * Supports three visual variants: default (neutral), excited (yellow/gold with star
 * decorations), and encouraging (green/teal with heart decorations).
 *
 * @selector bzm-cheer-message
 *
 * @example
 * ```html
 * <bzm-cheer-message message="Nice one!" playerName="Bart" />
 * <bzm-cheer-message message="You've got this!" playerName="Lisa" variant="encouraging" />
 * ```
 */
export class BzmCheerMessageComponent {
  /** The cheer text to display. */
  readonly message = input.required<string>();

  /** Name of the player who sent the cheer. */
  readonly playerName = input.required<string>();

  /** Visual variant controlling background color and decorations. @default 'default' */
  readonly variant = input<CheerVariant>('default');

  protected readonly cheerClasses = computed(
    () => `bzm-cheer bzm-cheer--${this.variant()}`
  );
}
