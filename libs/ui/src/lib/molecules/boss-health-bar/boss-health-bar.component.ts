import { Component, ChangeDetectionStrategy, computed, input } from '@angular/core';

@Component({
  selector: 'bzm-boss-health-bar',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      [class]="containerClasses()"
      role="progressbar"
      [attr.aria-valuenow]="currentHealth()"
      [attr.aria-valuemin]="0"
      [attr.aria-valuemax]="maxHealth()"
      [attr.aria-label]="bossName() + ' gezondheid'"
      [attr.aria-valuetext]="currentHealth() + ' van ' + maxHealth() + ' HP'"
    >
      <div class="bzm-boss-health-bar__labels">
        <span class="bzm-boss-health-bar__name">
          <i class="ph-duotone ph-skull" style="font-size: 18px;"></i>
          {{ bossName() }}
        </span>
        <span class="bzm-boss-health-bar__hp">
          {{ currentHealth() }} / {{ maxHealth() }} HP
          @if (showPercentage()) {
            <span class="bzm-boss-health-bar__pct">({{ percentage() }}%)</span>
          }
        </span>
      </div>

      <div class="bzm-boss-health-bar__track">
        <div
          class="bzm-boss-health-bar__fill"
          [style.width.%]="percentage()"
          [style.background]="fillGradient()"
        ></div>
      </div>

      @if (isCritical()) {
        <div class="bzm-boss-health-bar__critical" aria-live="polite">
          <i class="ph-duotone ph-warning" style="font-size: 16px;"></i>
          BIJNA VERSLAGEN!
        </div>
      }
    </div>
  `,
  styles: `
    :host {
      display: block;
      font-family: var(--bzm-font-family);
    }

    .bzm-boss-health-bar {
      width: 100%;
    }

    .bzm-boss-health-bar__labels {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--bzm-space-2);
    }

    .bzm-boss-health-bar__name {
      display: flex;
      align-items: center;
      gap: var(--bzm-space-1);
      font-size: var(--bzm-font-size-lg);
      font-weight: var(--bzm-font-weight-extrabold);
      color: var(--bzm-color-text);
    }

    .bzm-boss-health-bar__hp {
      font-size: var(--bzm-font-size-sm);
      font-weight: var(--bzm-font-weight-bold);
      color: var(--bzm-color-text-secondary);
    }

    .bzm-boss-health-bar__pct {
      color: var(--bzm-color-text-muted);
    }

    .bzm-boss-health-bar__track {
      width: 100%;
      height: 28px;
      background: var(--bzm-gray-200);
      border: 4px solid var(--bzm-color-border);
      border-width: 3px 4px 5px 3px;
      border-radius: var(--bzm-radius-md);
      overflow: hidden;
      position: relative;
    }

    .bzm-boss-health-bar__fill {
      height: 100%;
      border-radius: 2px;
      transition: width 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94),
                  background 0.4s ease;
      position: relative;
    }

    .bzm-boss-health-bar__fill::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 40%;
      background: linear-gradient(to bottom, rgba(255,255,255,0.3), transparent);
      border-radius: 2px;
    }

    .bzm-boss-health-bar--critical .bzm-boss-health-bar__fill {
      animation: bzm-health-pulse 0.8s ease-in-out infinite;
    }

    .bzm-boss-health-bar--critical .bzm-boss-health-bar__track {
      border-color: var(--bzm-color-error);
    }

    .bzm-boss-health-bar__critical {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: var(--bzm-space-1);
      margin-top: var(--bzm-space-2);
      font-size: var(--bzm-font-size-sm);
      font-weight: var(--bzm-font-weight-extrabold);
      color: var(--bzm-color-error);
      text-transform: uppercase;
      letter-spacing: 0.1em;
      animation: bzm-critical-blink 1s ease-in-out infinite;
    }

    @keyframes bzm-health-pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.6; }
    }

    @keyframes bzm-critical-blink {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.4; }
    }

    @media (prefers-reduced-motion: reduce) {
      .bzm-boss-health-bar__fill {
        transition: none;
      }

      .bzm-boss-health-bar--critical .bzm-boss-health-bar__fill {
        animation: none;
      }

      .bzm-boss-health-bar__critical {
        animation: none;
      }
    }
  `,
})
/**
 * Renders an animated health bar for the boss character in Boss Battle mode.
 *
 * Displays a wide horizontal bar with comic border that fills left to right.
 * The gradient shifts from green to yellow to red as health depletes. Below
 * the critical threshold, the bar pulses red and a "BIJNA VERSLAGEN!" message
 * appears.
 *
 * @selector bzm-boss-health-bar
 *
 * @example
 * ```html
 * <bzm-boss-health-bar
 *   [currentHealth]="350"
 *   [maxHealth]="1000"
 *   bossName="Professor Puzzel"
 * />
 * ```
 */
export class BzmBossHealthBarComponent {
  /** Current health points of the boss. */
  readonly currentHealth = input.required<number>();

  /** Maximum health points of the boss. */
  readonly maxHealth = input.required<number>();

  /** Display name for the boss. @default 'De Baas' */
  readonly bossName = input<string>('De Baas');

  /** Whether to show the health percentage. @default true */
  readonly showPercentage = input<boolean>(true);

  /** Fraction (0-1) below which the bar turns critical (red + pulsing). @default 0.25 */
  readonly criticalThreshold = input<number>(0.25);

  protected readonly percentage = computed(() => {
    const max = this.maxHealth();
    if (max <= 0) return 0;
    return Math.max(0, Math.min(100, Math.round((this.currentHealth() / max) * 100)));
  });

  protected readonly isCritical = computed(() => {
    const max = this.maxHealth();
    if (max <= 0) return false;
    return (this.currentHealth() / max) <= this.criticalThreshold() && this.currentHealth() > 0;
  });

  protected readonly fillGradient = computed(() => {
    const pct = this.percentage();
    if (pct > 60) return 'linear-gradient(90deg, #22c55e, #4ade80)';
    if (pct > 30) return 'linear-gradient(90deg, #eab308, #facc15)';
    return 'linear-gradient(90deg, #ef4444, #f87171)';
  });

  protected readonly containerClasses = computed(() => {
    const classes = ['bzm-boss-health-bar'];
    if (this.isCritical()) classes.push('bzm-boss-health-bar--critical');
    return classes.join(' ');
  });
}
