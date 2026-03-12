import { Component, ChangeDetectionStrategy, input, computed } from '@angular/core';

@Component({
  selector: 'bzm-spectator-bar',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="bzm-spectator-bar" role="status" aria-live="polite">
      <div class="bzm-spectator-bar__count">
        <i class="ph-duotone ph-eye bzm-spectator-bar__icon" aria-hidden="true"></i>
        <span class="bzm-spectator-bar__number" [class.bzm-spectator-bar__number--pop]="spectatorCount() > 0">
          {{ spectatorCount() }}
        </span>
      </div>

      @if (showHype()) {
        <div class="bzm-spectator-bar__hype">
          <span [class]="hypeLabelClasses()">{{ hypeLabel() }}</span>
          <div class="bzm-spectator-bar__meter">
            <div
              [class]="hypeFillClasses()"
              [style.width.%]="hypeLevel()"
              role="progressbar"
              [attr.aria-valuenow]="hypeLevel()"
              aria-valuemax="100"
              aria-valuemin="0"
              aria-label="Hype meter"
            ></div>
          </div>
        </div>
      }
    </div>
  `,
  styles: `
    :host {
      display: block;
      font-family: var(--bzm-font-family);
    }

    .bzm-spectator-bar {
      display: flex;
      align-items: center;
      gap: var(--bzm-space-4, 16px);
      background: rgba(0, 0, 0, 0.7);
      border: 4px solid var(--bzm-color-border, var(--bzm-black));
      border-width: 3px 4px 5px 3px;
      border-radius: var(--bzm-radius-md, 8px);
      padding: var(--bzm-space-3, 12px) var(--bzm-space-4, 16px);
    }

    .bzm-spectator-bar__count {
      display: flex;
      align-items: center;
      gap: var(--bzm-space-2, 8px);
      flex-shrink: 0;
    }

    .bzm-spectator-bar__icon {
      font-size: 20px;
      color: var(--bzm-white, #fff);
    }

    .bzm-spectator-bar__number {
      font-size: var(--bzm-font-size-lg, 1.125rem);
      font-weight: var(--bzm-font-weight-extrabold, 800);
      color: var(--bzm-white, #fff);
      min-width: 24px;
      text-align: center;
    }

    .bzm-spectator-bar__number--pop {
      animation: bzm-spectator-pop 0.3s ease-out;
    }

    .bzm-spectator-bar__hype {
      display: flex;
      align-items: center;
      gap: var(--bzm-space-3, 12px);
      flex: 1;
      min-width: 0;
    }

    .bzm-spectator-bar__hype-label {
      font-size: var(--bzm-font-size-xs, 0.75rem);
      font-weight: var(--bzm-font-weight-black, 900);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      white-space: nowrap;
      flex-shrink: 0;
    }

    .bzm-spectator-bar__hype-label--low {
      color: var(--bzm-blue-400, #60a5fa);
    }

    .bzm-spectator-bar__hype-label--mid {
      color: var(--bzm-yellow-400, #facc15);
    }

    .bzm-spectator-bar__hype-label--high {
      color: var(--bzm-red-400, #f87171);
      animation: bzm-hype-pulse 0.6s ease-in-out infinite;
    }

    .bzm-spectator-bar__meter {
      flex: 1;
      height: 10px;
      background: rgba(255, 255, 255, 0.15);
      border-radius: 5px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-width: 1px 2px 2px 1px;
      overflow: hidden;
      min-width: 60px;
    }

    .bzm-spectator-bar__fill {
      height: 100%;
      border-radius: 3px;
      transition: width 0.5s ease;
    }

    .bzm-spectator-bar__fill--low {
      background: var(--bzm-blue-400, #60a5fa);
    }

    .bzm-spectator-bar__fill--mid {
      background: var(--bzm-yellow-400, #facc15);
    }

    .bzm-spectator-bar__fill--high {
      background: var(--bzm-red-400, #f87171);
      animation: bzm-hype-glow 0.8s ease-in-out infinite;
    }

    @keyframes bzm-spectator-pop {
      0% { transform: scale(1); }
      50% { transform: scale(1.3); }
      100% { transform: scale(1); }
    }

    @keyframes bzm-hype-pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.6; }
    }

    @keyframes bzm-hype-glow {
      0%, 100% { box-shadow: 0 0 4px var(--bzm-red-400, #f87171); }
      50% { box-shadow: 0 0 10px var(--bzm-red-400, #f87171); }
    }

    @media (prefers-reduced-motion: reduce) {
      .bzm-spectator-bar__number--pop,
      .bzm-spectator-bar__hype-label--high {
        animation: none;
      }

      .bzm-spectator-bar__fill--high {
        animation: none;
      }

      .bzm-spectator-bar__fill {
        transition: width 0.1s ease;
      }
    }
  `,
})
/**
 * Displays spectator count and a hype meter on the host screen.
 *
 * Shows an eye icon with the current spectator count on the left, and an animated
 * hype meter bar on the right. The hype level transitions through three visual states:
 * low (0-33, blue, "Rustig"), medium (34-66, yellow, "Spannend!"), and high
 * (67-100, red/fire, "WAANZINNIG!"). High hype levels pulse for emphasis.
 *
 * @selector bzm-spectator-bar
 *
 * @example
 * ```html
 * <bzm-spectator-bar [spectatorCount]="42" [hypeLevel]="75" />
 * <bzm-spectator-bar [spectatorCount]="10" [hypeLevel]="20" [showHype]="false" />
 * ```
 */
export class BzmSpectatorBarComponent {
  /** Number of spectators currently watching. */
  readonly spectatorCount = input.required<number>();

  /** Hype level percentage from 0 to 100. */
  readonly hypeLevel = input.required<number>();

  /** Whether to show the hype meter. @default true */
  readonly showHype = input<boolean>(true);

  protected readonly hypeCategory = computed(() => {
    const level = this.hypeLevel();
    if (level <= 33) return 'low' as const;
    if (level <= 66) return 'mid' as const;
    return 'high' as const;
  });

  protected readonly hypeLabel = computed(() => {
    const category = this.hypeCategory();
    if (category === 'low') return 'Rustig';
    if (category === 'mid') return 'Spannend!';
    return 'WAANZINNIG!';
  });

  protected readonly hypeLabelClasses = computed(
    () => `bzm-spectator-bar__hype-label bzm-spectator-bar__hype-label--${this.hypeCategory()}`
  );

  protected readonly hypeFillClasses = computed(
    () => `bzm-spectator-bar__fill bzm-spectator-bar__fill--${this.hypeCategory()}`
  );
}
