import { Component, ChangeDetectionStrategy, input, computed } from '@angular/core';

/** Category of an achievement determining its color chip. */
export type AchievementCategory = 'knowledge' | 'teamwork' | 'clutch' | 'explorer' | 'dedication';

const CATEGORY_COLORS: Record<AchievementCategory, string> = {
  knowledge: '#3B82F6',
  teamwork: '#22C55E',
  clutch: '#F97316',
  explorer: '#A855F7',
  dedication: '#EF4444',
};

const CATEGORY_LABELS: Record<AchievementCategory, string> = {
  knowledge: 'Kennis',
  teamwork: 'Teamwork',
  clutch: 'Clutch',
  explorer: 'Ontdekker',
  dedication: 'Toewijding',
};

@Component({
  selector: 'bzm-achievement-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="bzm-achievement-card"
      [class.bzm-achievement-card--unlocked]="unlocked()"
      [class.bzm-achievement-card--locked]="!unlocked()"
      [attr.aria-label]="name() + (unlocked() ? ' - Ontgrendeld' : ' - Vergrendeld')"
      role="article"
    >
      @if (!unlocked()) {
        <div class="bzm-achievement-card__lock-overlay">
          <i class="ph-duotone ph-lock-simple bzm-achievement-card__lock-icon"></i>
        </div>
      }
      @if (unlocked()) {
        <div class="bzm-achievement-card__check">
          <i class="ph-duotone ph-check-circle"></i>
        </div>
      }
      <div class="bzm-achievement-card__icon-wrapper">
        <i [class]="iconClass()" class="bzm-achievement-card__icon"></i>
      </div>
      <h3 class="bzm-achievement-card__name">{{ name() }}</h3>
      <p class="bzm-achievement-card__description">{{ description() }}</p>
      <span class="bzm-achievement-card__category" [style.background-color]="categoryColor()">
        {{ categoryLabel() }}
      </span>
      @if (unlocked() && unlockedAt()) {
        <span class="bzm-achievement-card__date">{{ formattedDate() }}</span>
      }
      @if (!unlocked() && progress() > 0) {
        <div class="bzm-achievement-card__progress-wrapper">
          <div class="bzm-achievement-card__progress-track">
            <div
              class="bzm-achievement-card__progress-fill"
              [style.width.%]="clampedProgress()"
              role="progressbar"
              [attr.aria-valuenow]="progress()"
              aria-valuemin="0"
              aria-valuemax="100"
            ></div>
          </div>
          <span class="bzm-achievement-card__progress-text">{{ clampedProgress() }}%</span>
        </div>
      }
    </div>
  `,
  styles: `
    :host {
      display: block;
      font-family: var(--bzm-font-family);
    }

    .bzm-achievement-card {
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      padding: var(--bzm-space-6) var(--bzm-space-4) var(--bzm-space-4);
      background: var(--bzm-color-surface);
      border: 4px solid var(--bzm-color-border);
      border-width: var(--bzm-border-width-comic);
      border-radius: var(--bzm-radius-md);
      box-shadow: var(--bzm-shadow-card);
      transition:
        transform var(--bzm-transition-playful),
        box-shadow var(--bzm-transition-base);
      min-width: 180px;
    }

    .bzm-achievement-card:hover {
      transform: translateY(-3px) rotate(-0.5deg);
      box-shadow: var(--bzm-shadow-lg);
    }

    .bzm-achievement-card--unlocked {
      border-color: var(--bzm-color-gold);
    }

    .bzm-achievement-card--locked {
      filter: grayscale(0.7);
      opacity: 0.8;
    }

    .bzm-achievement-card--locked:hover {
      filter: grayscale(0.5);
      opacity: 0.9;
    }

    .bzm-achievement-card__lock-overlay {
      position: absolute;
      top: var(--bzm-space-2);
      right: var(--bzm-space-2);
      color: var(--bzm-color-text-muted);
      font-size: var(--bzm-font-size-lg);
    }

    .bzm-achievement-card__check {
      position: absolute;
      top: var(--bzm-space-2);
      right: var(--bzm-space-2);
      color: var(--bzm-color-success);
      font-size: var(--bzm-font-size-xl);
    }

    .bzm-achievement-card__icon-wrapper {
      width: 56px;
      height: 56px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: var(--bzm-space-3);
      border-radius: var(--bzm-radius-md);
      background: var(--bzm-color-primary);
      border: 3px solid var(--bzm-color-border);
      border-width: var(--bzm-border-width-comic-sm);
      box-shadow: var(--bzm-shadow-sm);
    }

    .bzm-achievement-card__icon {
      font-size: 28px;
      color: var(--bzm-white);
    }

    .bzm-achievement-card__name {
      margin: 0 0 var(--bzm-space-1);
      font-size: var(--bzm-font-size-base);
      font-weight: var(--bzm-font-weight-extrabold);
      color: var(--bzm-color-text);
    }

    .bzm-achievement-card__description {
      margin: 0 0 var(--bzm-space-3);
      font-size: var(--bzm-font-size-sm);
      color: var(--bzm-color-text-secondary);
      line-height: 1.4;
    }

    .bzm-achievement-card__category {
      display: inline-block;
      padding: var(--bzm-space-1) var(--bzm-space-3);
      border-radius: var(--bzm-radius-sm);
      font-size: 11px;
      font-weight: var(--bzm-font-weight-bold);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--bzm-white);
      border: 2px solid var(--bzm-color-border);
      border-width: 1px 2px 2px 1px;
    }

    .bzm-achievement-card__date {
      margin-top: var(--bzm-space-2);
      font-size: 11px;
      color: var(--bzm-color-text-muted);
      font-weight: var(--bzm-font-weight-semibold);
    }

    .bzm-achievement-card__progress-wrapper {
      width: 100%;
      margin-top: var(--bzm-space-3);
      display: flex;
      align-items: center;
      gap: var(--bzm-space-2);
    }

    .bzm-achievement-card__progress-track {
      flex: 1;
      height: 10px;
      background: var(--bzm-color-surface);
      border: 2px solid var(--bzm-color-border);
      border-width: 1px 2px 2px 1px;
      border-radius: 2px;
      overflow: hidden;
    }

    .bzm-achievement-card__progress-fill {
      height: 100%;
      background: var(--bzm-color-primary);
      border-radius: 1px;
      transition: width var(--bzm-transition-base);
    }

    .bzm-achievement-card__progress-text {
      font-size: 11px;
      font-weight: var(--bzm-font-weight-extrabold);
      color: var(--bzm-color-text-muted);
      flex-shrink: 0;
    }

    @media (prefers-reduced-motion: reduce) {
      .bzm-achievement-card {
        transition: none;
      }

      .bzm-achievement-card:hover {
        transform: none;
      }
    }
  `,
})
/**
 * Displays a single achievement card with icon, name, description, category chip,
 * and progress indicator. Locked achievements appear greyscale with a lock overlay;
 * unlocked achievements show a golden border and checkmark badge.
 *
 * @selector bzm-achievement-card
 *
 * @example
 * ```html
 * <bzm-achievement-card
 *   name="Brainiac"
 *   description="Win 10 perfecte games"
 *   icon="brain"
 *   category="knowledge"
 *   [unlocked]="true"
 * />
 * ```
 */
export class BzmAchievementCardComponent {
  /** Achievement display name. */
  readonly name = input.required<string>();

  /** Description of how to earn the achievement. */
  readonly description = input.required<string>();

  /** Phosphor icon name (without `ph-duotone` prefix). */
  readonly icon = input.required<string>();

  /** Achievement category determining the colored chip. */
  readonly category = input.required<AchievementCategory>();

  /**
   * Whether the achievement has been unlocked.
   * @default false
   */
  readonly unlocked = input<boolean>(false);

  /**
   * Progress toward unlocking, as a percentage (0-100).
   * @default 0
   */
  readonly progress = input<number>(0);

  /**
   * ISO date string of when the achievement was unlocked.
   * @default null
   */
  readonly unlockedAt = input<string | null>(null);

  protected readonly iconClass = computed(() => `ph-duotone ph-${this.icon()}`);
  protected readonly categoryColor = computed(() => CATEGORY_COLORS[this.category()]);
  protected readonly categoryLabel = computed(() => CATEGORY_LABELS[this.category()]);

  protected readonly clampedProgress = computed(() =>
    Math.min(100, Math.max(0, this.progress()))
  );

  protected readonly formattedDate = computed(() => {
    const dateStr = this.unlockedAt();
    if (!dateStr) return '';
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('nl-NL', { day: 'numeric', month: 'short', year: 'numeric' });
    } catch {
      return dateStr;
    }
  });
}
