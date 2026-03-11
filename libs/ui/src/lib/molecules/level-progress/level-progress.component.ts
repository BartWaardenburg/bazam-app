import { Component, ChangeDetectionStrategy, input } from '@angular/core';

@Component({
  selector: 'bzm-level-progress',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="bzm-level-progress">
      <div class="bzm-level-progress__header">
        <span class="bzm-level-progress__label">{{ label() }}</span>
        <div class="bzm-level-progress__xp">
<i class="ph-duotone ph-star bzm-level-progress__star" style="font-size: 16px; color: var(--bzm-color-accent);"></i>
          <span class="bzm-level-progress__xp-text">{{ xp() }} XP</span>
        </div>
      </div>
      <div class="bzm-level-progress__track">
        <div
          class="bzm-level-progress__fill"
          [style.width.%]="clampedProgress()"
          role="progressbar"
          [attr.aria-valuenow]="progress()"
          aria-valuemin="0"
          aria-valuemax="100"
        ></div>
      </div>
      <span class="bzm-level-progress__percentage">{{ clampedProgress() }}%</span>
    </div>
  `,
  styles: `
    :host {
      display: block;
      width: 100%;
    }

    .bzm-level-progress {
      display: flex;
      flex-direction: column;
      gap: var(--bzm-space-2);
      font-family: var(--bzm-font-family);
    }

    .bzm-level-progress__header {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .bzm-level-progress__label {
      font-size: var(--bzm-font-size-sm);
      font-weight: var(--bzm-font-weight-extrabold);
      color: var(--bzm-color-text);
    }

    .bzm-level-progress__xp {
      display: flex;
      align-items: center;
      gap: var(--bzm-space-1);
    }

    .bzm-level-progress__star {
      flex-shrink: 0;
    }

    .bzm-level-progress__xp-text {
      font-size: var(--bzm-font-size-sm);
      font-weight: var(--bzm-font-weight-extrabold);
      color: var(--bzm-color-accent-dark);
    }

    .bzm-level-progress__track {
      width: 100%;
      height: 12px;
      background: var(--bzm-gray-200);
      border-radius: 3px;
      border: 3px solid var(--bzm-black);
      border-width: 2px 3px 3px 2px;
      overflow: hidden;
    }

    .bzm-level-progress__fill {
      height: 100%;
      background: var(--bzm-color-primary);
      border-radius: 1px;
      transition: width var(--bzm-transition-smooth);
    }

    .bzm-level-progress__percentage {
      font-size: var(--bzm-font-size-xs);
      font-weight: var(--bzm-font-weight-extrabold);
      color: var(--bzm-color-text-muted);
    }
  `,
})
/**
 * Displays an XP level progress bar with a descriptive label, percentage indicator, and star icon.
 *
 * Renders a labeled track that fills proportionally to the progress value,
 * accompanied by the player's current XP total. The progress value is clamped
 * to the 0-100 range for safe rendering.
 *
 * @selector bzm-level-progress
 *
 * @example
 * ```html
 * <bzm-level-progress [progress]="65" [xp]="1300" label="Level 5" />
 * ```
 */
export class BzmLevelProgressComponent {
  /** Percentage of progress toward the next level (0-100). Values outside this range are clamped. */
  readonly progress = input.required<number>();

  /** Total experience points earned by the player. Displayed alongside a star icon. */
  readonly xp = input.required<number>();

  /** Descriptive label shown above the progress bar. @default 'My Level Progress' */
  readonly label = input<string>('My Level Progress');

  /** Returns the progress value clamped between 0 and 100 for safe percentage rendering. */
  clampedProgress(): number {
    return Math.min(100, Math.max(0, this.progress()));
  }
}
