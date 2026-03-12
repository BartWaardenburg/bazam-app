import { Component, ChangeDetectionStrategy, input, computed } from '@angular/core';

/** Size preset for the reaction bubble. */
export type ReactionBubbleSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'bzm-reaction-bubble',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      [class]="bubbleClasses()"
      [style]="bubbleStyle()"
      role="img"
      [attr.aria-label]="ariaLabel()"
    >
      @if (playerName()) {
        <span class="bzm-reaction-bubble__name">{{ playerName() }}</span>
      }
      <span class="bzm-reaction-bubble__emoji">{{ emoji() }}</span>
      <div class="bzm-reaction-bubble__tail"></div>
    </div>
  `,
  styles: `
    :host {
      display: block;
      font-family: var(--bzm-font-family);
    }

    .bzm-reaction-bubble {
      position: relative;
      display: inline-flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background: var(--bzm-white, #fff);
      border: 4px solid var(--bzm-color-border, var(--bzm-black));
      border-width: 3px 4px 5px 3px;
      border-radius: 50%;
      box-shadow: var(--bzm-shadow-md);
      animation: bzm-reaction-float 3s ease-out forwards;
    }

    .bzm-reaction-bubble--sm {
      width: 40px;
      height: 40px;
    }

    .bzm-reaction-bubble--md {
      width: 56px;
      height: 56px;
    }

    .bzm-reaction-bubble--lg {
      width: 72px;
      height: 72px;
    }

    .bzm-reaction-bubble__emoji {
      line-height: 1;
      user-select: none;
    }

    .bzm-reaction-bubble--sm .bzm-reaction-bubble__emoji {
      font-size: 18px;
    }

    .bzm-reaction-bubble--md .bzm-reaction-bubble__emoji {
      font-size: 26px;
    }

    .bzm-reaction-bubble--lg .bzm-reaction-bubble__emoji {
      font-size: 34px;
    }

    .bzm-reaction-bubble__name {
      position: absolute;
      top: -20px;
      left: 50%;
      transform: translateX(-50%);
      font-size: var(--bzm-font-size-xs, 0.75rem);
      font-weight: var(--bzm-font-weight-bold, 700);
      color: var(--bzm-color-text-secondary);
      white-space: nowrap;
      background: var(--bzm-white, #fff);
      padding: 1px var(--bzm-space-2, 4px);
      border-radius: 3px;
      border: 2px solid var(--bzm-color-border, var(--bzm-black));
      border-width: 1px 2px 2px 1px;
    }

    .bzm-reaction-bubble__tail {
      position: absolute;
      bottom: -16px;
      left: 50%;
      transform: translateX(-50%);
      width: 24px;
      height: 18px;
      overflow: visible;
    }

    .bzm-reaction-bubble__tail::before {
      content: '';
      position: absolute;
      top: 0;
      left: 50%;
      transform: translateX(-50%);
      width: 0;
      height: 0;
      border-left: 11px solid transparent;
      border-right: 11px solid transparent;
      border-top: 18px solid var(--bzm-color-border, var(--bzm-black));
    }

    .bzm-reaction-bubble__tail::after {
      content: '';
      position: absolute;
      top: -1px;
      left: 50%;
      transform: translateX(-50%);
      width: 0;
      height: 0;
      border-left: 8px solid transparent;
      border-right: 8px solid transparent;
      border-top: 14px solid var(--bzm-white, #fff);
    }

    .bzm-reaction-bubble--sm .bzm-reaction-bubble__tail {
      transform: translateX(-50%) scale(0.55);
      bottom: -10px;
    }

    .bzm-reaction-bubble--md .bzm-reaction-bubble__tail {
      transform: translateX(-50%) scale(0.75);
      bottom: -13px;
    }

    @keyframes bzm-reaction-float {
      0% {
        opacity: 1;
        transform: translateY(0) rotate(var(--bzm-reaction-rotation, -3deg)) scale(0.5);
      }
      15% {
        opacity: 1;
        transform: translateY(-20px) rotate(var(--bzm-reaction-rotation, -3deg)) scale(1.1);
      }
      30% {
        opacity: 1;
        transform: translateY(-40px) rotate(calc(var(--bzm-reaction-rotation, -3deg) * -1)) scale(1);
      }
      50% {
        opacity: 1;
        transform: translateY(-70px) rotate(var(--bzm-reaction-rotation, -3deg));
      }
      70% {
        opacity: 0.8;
        transform: translateY(-100px) rotate(calc(var(--bzm-reaction-rotation, -3deg) * -0.5));
      }
      100% {
        opacity: 0;
        transform: translateY(-140px) rotate(var(--bzm-reaction-rotation, -3deg)) scale(0.8);
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .bzm-reaction-bubble {
        animation: bzm-reaction-fade 3s ease-out forwards;
      }

      @keyframes bzm-reaction-fade {
        0% { opacity: 1; }
        70% { opacity: 1; }
        100% { opacity: 0; }
      }
    }
  `,
})
/**
 * Displays a single floating emoji reaction in a comic speech bubble shape.
 *
 * The bubble floats upward with a wobble animation and fades out over 3 seconds.
 * An optional player name label appears above the bubble. Each bubble gets a
 * randomized slight rotation for an organic feel.
 *
 * @selector bzm-reaction-bubble
 *
 * @example
 * ```html
 * <bzm-reaction-bubble emoji="🎉" />
 * <bzm-reaction-bubble emoji="🔥" playerName="Bart" size="lg" />
 * ```
 */
export class BzmReactionBubbleComponent {
  /** The emoji character to display in the bubble. */
  readonly emoji = input.required<string>();

  /** Optional player name label shown above the bubble. @default '' */
  readonly playerName = input<string>('');

  /** Size preset affecting bubble dimensions. @default 'md' */
  readonly size = input<ReactionBubbleSize>('md');

  protected readonly bubbleClasses = computed(
    () => `bzm-reaction-bubble bzm-reaction-bubble--${this.size()}`
  );

  private readonly rotation = Math.floor(Math.random() * 10) - 5;

  protected readonly bubbleStyle = computed(
    () => `--bzm-reaction-rotation: ${this.rotation}deg;`
  );

  protected readonly ariaLabel = computed(() => {
    const name = this.playerName();
    return name ? `${name} reageert met ${this.emoji()}` : `Reactie: ${this.emoji()}`;
  });
}
