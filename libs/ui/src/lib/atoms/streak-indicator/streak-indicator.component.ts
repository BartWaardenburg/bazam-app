import { Component, ChangeDetectionStrategy, input, computed } from '@angular/core';


/** Size variant for the streak indicator. */
export type StreakIndicatorSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'bzm-streak-indicator',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (streak() > 0) {
      <div
        [class]="containerClasses()"
        role="status"
        [attr.aria-label]="ariaLabel()"
      >
        <div class="bzm-streak-indicator__icon-wrap">
          <i [class]="iconClasses" [style]="iconStyle()"></i>
        </div>
        <span class="bzm-streak-indicator__count">{{ streak() }}</span>
        @if (showLabel() && labelText()) {
          <span class="bzm-streak-indicator__label">{{ labelText() }}</span>
        }
      </div>
    }
  `,
  styles: `
    :host {
      display: block;
      font-family: var(--bzm-font-family);
    }

    .bzm-streak-indicator {
      display: inline-flex;
      align-items: center;
      gap: var(--bzm-space-2);
      padding: var(--bzm-space-2) var(--bzm-space-3);
      border-radius: var(--bzm-radius-md);
      transition: background var(--bzm-transition-base);
    }

    /* ─── Muted (streak 1-2) ─── */
    .bzm-streak-indicator--muted {
      background: var(--bzm-color-surface);
    }

    .bzm-streak-indicator--muted .bzm-streak-indicator__icon-wrap i {
      color: var(--bzm-color-text-muted);
    }

    .bzm-streak-indicator--muted .bzm-streak-indicator__count {
      color: var(--bzm-color-text-secondary);
      font-family: var(--bzm-font-heading);
      font-weight: var(--bzm-font-weight-bold);
      font-size: var(--bzm-font-size-lg);
    }

    /* ─── On fire (streak 3-4) ─── */
    .bzm-streak-indicator--on-fire {
      background: linear-gradient(135deg, #FFF3E0, #FFE0B2);
      border: 4px solid #FFB74D;
      border-width: 3px 4px 5px 3px;
      box-shadow: var(--bzm-shadow-md);
    }

    .bzm-streak-indicator--on-fire .bzm-streak-indicator__icon-wrap i {
      color: #FF6D00;
      filter: drop-shadow(0 0 8px rgba(255, 109, 0, 0.6));
      animation: bzm-streak-pulse 0.8s ease-in-out infinite;
    }

    .bzm-streak-indicator--on-fire .bzm-streak-indicator__count {
      color: var(--bzm-color-text);
      font-family: var(--bzm-font-heading);
      font-weight: var(--bzm-font-weight-extrabold);
      font-size: var(--bzm-font-size-2xl);
      text-shadow: 2px 2px 0 rgba(0, 0, 0, 0.15);
    }

    .bzm-streak-indicator--on-fire .bzm-streak-indicator__label {
      color: #E65100;
      font-weight: var(--bzm-font-weight-bold);
      font-size: var(--bzm-font-size-sm);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    /* ─── Unstoppable (streak 5+) ─── */
    .bzm-streak-indicator--unstoppable {
      background: linear-gradient(135deg, #FFF8E1, #FFD54F);
      border: 4px solid #FFC107;
      border-width: 3px 4px 5px 3px;
      box-shadow: 0 0 16px rgba(255, 193, 7, 0.4), var(--bzm-shadow-lg);
    }

    .bzm-streak-indicator--unstoppable .bzm-streak-indicator__icon-wrap i {
      color: #FF6D00;
      filter: drop-shadow(0 0 12px rgba(255, 109, 0, 0.9));
      animation: bzm-streak-pulse-intense 0.6s ease-in-out infinite;
    }

    .bzm-streak-indicator--unstoppable .bzm-streak-indicator__count {
      color: var(--bzm-color-text);
      font-family: var(--bzm-font-heading);
      font-weight: var(--bzm-font-weight-black);
      font-size: var(--bzm-font-size-3xl);
      text-shadow: 2px 2px 0 rgba(0, 0, 0, 0.2);
      -webkit-text-stroke: 0.5px var(--bzm-black);
    }

    .bzm-streak-indicator--unstoppable .bzm-streak-indicator__label {
      color: #BF360C;
      font-weight: var(--bzm-font-weight-extrabold);
      font-size: var(--bzm-font-size-sm);
      text-transform: uppercase;
      letter-spacing: 0.06em;
      animation: bzm-streak-shake 0.4s ease-in-out infinite;
    }

    /* ─── Size: sm ─── */
    .bzm-streak-indicator--sm {
      padding: var(--bzm-space-1) var(--bzm-space-2);
      gap: var(--bzm-space-1);
      transform: scale(0.8);
      transform-origin: left center;
    }

    /* ─── Size: md ─── */
    .bzm-streak-indicator--md {
      /* default sizing */
    }

    /* ─── Size: lg ─── */
    .bzm-streak-indicator--lg {
      padding: var(--bzm-space-3) var(--bzm-space-4);
      gap: var(--bzm-space-3);
      transform: scale(1.2);
      transform-origin: left center;
    }

    .bzm-streak-indicator__icon-wrap {
      display: flex;
      align-items: center;
      justify-content: center;
      line-height: 1;
    }

    .bzm-streak-indicator__count {
      line-height: 1;
    }

    .bzm-streak-indicator__label {
      line-height: 1;
    }

    @keyframes bzm-streak-pulse {
      0%, 100% {
        transform: scale(1);
        filter: drop-shadow(0 0 8px rgba(255, 109, 0, 0.6));
      }
      50% {
        transform: scale(1.2);
        filter: drop-shadow(0 0 14px rgba(255, 109, 0, 0.9));
      }
    }

    @keyframes bzm-streak-pulse-intense {
      0%, 100% {
        transform: scale(1);
        filter: drop-shadow(0 0 12px rgba(255, 109, 0, 0.9));
      }
      50% {
        transform: scale(1.3);
        filter: drop-shadow(0 0 20px rgba(255, 109, 0, 1));
      }
    }

    @keyframes bzm-streak-shake {
      0%, 100% { transform: translateX(0); }
      25% { transform: translateX(-1px); }
      75% { transform: translateX(1px); }
    }

    @media (prefers-reduced-motion: reduce) {
      .bzm-streak-indicator--on-fire .bzm-streak-indicator__icon-wrap i,
      .bzm-streak-indicator--unstoppable .bzm-streak-indicator__icon-wrap i {
        animation: none;
      }

      .bzm-streak-indicator--unstoppable .bzm-streak-indicator__label {
        animation: none;
      }

      .bzm-streak-indicator,
      .bzm-streak-indicator__icon-wrap i {
        transition: none;
      }
    }
  `,
})
/**
 * Visual streak counter showing consecutive correct answers with escalating intensity.
 *
 * Renders nothing when streak is 0. At streak 1-2 a muted flame and count appear.
 * At streak 3+ ("on fire") the indicator gains a warm gradient background, pulsing
 * glow, and "OP DREEF!" label. At streak 5+ ("unstoppable") intensity increases
 * further with a golden border, shake animation, and "ONVERSLAANBAAR!" label.
 * All animations respect `prefers-reduced-motion`.
 *
 * @selector bzm-streak-indicator
 *
 * @example
 * ```html
 * <bzm-streak-indicator [streak]="3" [isOnFire]="true" />
 * <bzm-streak-indicator [streak]="7" [isOnFire]="true" size="lg" />
 * <bzm-streak-indicator [streak]="1" />
 * ```
 */
export class BzmStreakIndicatorComponent {
  /** Current streak count (0 = no streak, component renders nothing). */
  readonly streak = input.required<number>();

  /**
   * True when streak >= 3, triggering the "on fire" visual state.
   * @default false
   */
  readonly isOnFire = input<boolean>(false);

  /**
   * Controls the overall scale of the indicator.
   * @default 'md'
   */
  readonly size = input<StreakIndicatorSize>('md');

  /**
   * Whether to show the label text ("OP DREEF!" / "ONVERSLAANBAAR!").
   * @default true
   */
  readonly showLabel = input<boolean>(true);

  protected readonly isUnstoppable = computed(
    () => this.isOnFire() && this.streak() >= 5
  );

  protected readonly labelText = computed((): string => {
    if (this.isUnstoppable()) return 'ONVERSLAANBAAR!';
    if (this.isOnFire()) return 'OP DREEF!';
    return '';
  });

  protected readonly ariaLabel = computed((): string => {
    const count = this.streak();
    if (this.isUnstoppable()) return `Streak: ${count}, onverslaanbaar!`;
    if (this.isOnFire()) return `Streak: ${count}, op dreef!`;
    return `Streak: ${count}`;
  });

  protected readonly iconClasses = 'ph-duotone ph-fire' as const;

  protected readonly iconStyle = computed((): string => {
    if (this.isUnstoppable()) return 'font-size: 32px;';
    if (this.isOnFire()) return 'font-size: 28px;';
    return 'font-size: 20px;';
  });

  protected readonly containerClasses = computed((): string => {
    const classes = ['bzm-streak-indicator', `bzm-streak-indicator--${this.size()}`];

    if (this.isUnstoppable()) {
      classes.push('bzm-streak-indicator--unstoppable');
    } else if (this.isOnFire()) {
      classes.push('bzm-streak-indicator--on-fire');
    } else {
      classes.push('bzm-streak-indicator--muted');
    }

    return classes.join(' ');
  });
}
