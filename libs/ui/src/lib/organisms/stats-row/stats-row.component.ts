import { Component, ChangeDetectionStrategy, input } from '@angular/core';

@Component({
  selector: 'bzm-stats-row',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="stats-row" role="group" aria-label="Player statistics">
      <div class="stat-card">
        <div class="stat-icon stat-icon--accent" aria-hidden="true">
<i class="ph-duotone ph-trophy" style="font-size: 20px;"></i>
        </div>
        <span class="stat-label">Level</span>
        <span class="stat-value">{{ level() }}</span>
      </div>

      <div class="stat-card">
        <div class="stat-icon stat-icon--primary" aria-hidden="true">
<i class="ph-duotone ph-star" style="font-size: 20px;"></i>
        </div>
        <span class="stat-label">Points</span>
        <span class="stat-value">{{ points() }}</span>
      </div>
    </div>
  `,
  styles: `
    :host {
      display: block;
      font-family: var(--bzm-font-family);
    }

    .stats-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: var(--bzm-space-4);
    }

    .stat-card {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--bzm-space-2);
      padding: var(--bzm-space-5) var(--bzm-space-4);
      background-color: var(--bzm-color-surface);
      border: 4px solid var(--bzm-black);
      border-width: 3px 4px 4px 3px;
      border-radius: var(--bzm-radius-md);
      box-shadow: var(--bzm-shadow-card);
      transition:
        transform var(--bzm-transition-playful),
        box-shadow var(--bzm-transition-base);
    }

    .stat-card:hover {
      transform: translateY(-2px);
      box-shadow: var(--bzm-shadow-lg);
    }

    .stat-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      border-radius: 3px;
      border: 3px solid var(--bzm-black);
      border-width: 2px 3px 3px 2px;
    }

    .stat-icon--accent {
      background-color: var(--bzm-color-accent);
      color: var(--bzm-color-text-on-accent);
    }

    .stat-icon--primary {
      background-color: var(--bzm-color-primary);
      color: var(--bzm-color-text-on-primary);
    }

    .stat-label {
      font-size: var(--bzm-font-size-xs);
      font-weight: var(--bzm-font-weight-semibold);
      color: var(--bzm-color-text-muted);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .stat-value {
      font-size: var(--bzm-font-size-xl);
      font-weight: var(--bzm-font-weight-extrabold);
      color: var(--bzm-color-text);
      line-height: var(--bzm-line-height-tight);
    }
  `,
})
/**
 * Displays a two-column grid of stat cards showing the player's level and
 * total points, each with a themed icon badge.
 *
 * Cards lift slightly on hover for a playful interaction. Use this component
 * on profile or dashboard pages to summarize key player statistics.
 *
 * @selector bzm-stats-row
 *
 * @example
 * ```html
 * <bzm-stats-row level="12" [points]="4500" />
 * ```
 */
export class BzmStatsRowComponent {
  /** Player's current level, displayed as a string (e.g., "12", "Pro"). */
  readonly level = input.required<string>();

  /** Player's total accumulated points. */
  readonly points = input.required<number>();
}
