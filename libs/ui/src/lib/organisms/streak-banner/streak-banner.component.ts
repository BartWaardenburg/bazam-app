import { Component, ChangeDetectionStrategy, input } from '@angular/core';

@Component({
  selector: 'bzm-streak-banner',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="streak-banner" role="status" aria-label="Streak count">
      <div class="streak-content">
        <span class="streak-label">You did</span>
        <span class="streak-count">{{ streakCount() }}</span>
        <span class="streak-suffix">streaks</span>
      </div>

      <div class="streak-action">
        <div class="streak-illustration" aria-hidden="true">
          <span class="fire">
<i class="ph-duotone ph-fire" style="font-size: 28px;"></i>
          </span>
          <span class="star">
<i class="ph-duotone ph-star" style="font-size: 20px;"></i>
          </span>
        </div>
<i class="ph-duotone ph-caret-right chevron" aria-hidden="true" style="font-size: 24px;"></i>
      </div>
    </div>
  `,
  styles: `
    :host {
      display: block;
      font-family: var(--bzm-font-family);
    }

    .streak-banner {
      display: flex;
      align-items: center;
      justify-content: space-between;
      background-color: var(--bzm-color-accent);
      border: 4px solid var(--bzm-black);
      border-width: 3px 4px 5px 3px;
      border-radius: var(--bzm-radius-md);
      padding: var(--bzm-space-5) var(--bzm-space-6);
      box-shadow: var(--bzm-shadow-lg);
      cursor: pointer;
      transition:
        transform var(--bzm-transition-playful),
        box-shadow var(--bzm-transition-base);
      overflow: hidden;
      position: relative;
    }

    .streak-banner:hover {
      transform: translateY(-2px);
      box-shadow: var(--bzm-shadow-lg);
    }

    .streak-banner:active {
      transform: scale(0.98);
      box-shadow: var(--bzm-shadow-sm);
    }

    .streak-content {
      display: flex;
      flex-direction: column;
      gap: var(--bzm-space-0);
    }

    .streak-label {
      font-size: var(--bzm-font-size-sm);
      font-weight: var(--bzm-font-weight-semibold);
      color: var(--bzm-color-text-on-accent);
      opacity: 0.8;
      line-height: var(--bzm-line-height-tight);
    }

    .streak-count {
      font-size: var(--bzm-font-size-4xl);
      font-weight: var(--bzm-font-weight-black);
      color: var(--bzm-color-text-on-accent);
      line-height: var(--bzm-line-height-tight);
    }

    .streak-suffix {
      font-size: var(--bzm-font-size-lg);
      font-weight: var(--bzm-font-weight-bold);
      color: var(--bzm-color-text-on-accent);
      line-height: var(--bzm-line-height-tight);
    }

    .streak-action {
      display: flex;
      align-items: center;
      gap: var(--bzm-space-3);
    }

    .streak-illustration {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--bzm-space-1);
      font-size: 28px;
      line-height: 1;
    }

    .fire {
      color: var(--bzm-color-text-on-accent);
      animation: pulse 1.5s ease-in-out infinite;
      display: flex;
    }

    .star {
      color: var(--bzm-color-text-on-accent);
      animation: pulse 1.5s ease-in-out infinite 0.3s;
      display: flex;
    }

    .chevron {
      color: var(--bzm-color-text-on-accent);
      opacity: 0.6;
      flex-shrink: 0;
    }

    @keyframes pulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.15); }
    }
  `,
})
/**
 * Renders an accent-colored banner that prominently displays the player's
 * current streak count alongside animated fire and star icons.
 *
 * The banner acts as a tappable call-to-action with hover/active states
 * and a right-pointing chevron. Use it on dashboard or profile pages to
 * encourage continued play.
 *
 * @selector bzm-streak-banner
 *
 * @example
 * ```html
 * <bzm-streak-banner [streakCount]="7" />
 * ```
 */
export class BzmStreakBannerComponent {
  /** Number of consecutive streaks to display in the banner. */
  readonly streakCount = input.required<number>();
}
