import { Component, ChangeDetectionStrategy, computed, input } from '@angular/core';

/** Round type determining the visual style and label. */
export type RoundType = 'warmup' | 'challenge' | 'boss';

const ROUND_CONFIG: Record<RoundType, { label: string; icon: string }> = {
  warmup: { label: 'Warm-Up', icon: 'flame' },
  challenge: { label: 'Challenge', icon: 'trophy' },
  boss: { label: 'Boss', icon: 'skull' },
};

@Component({
  selector: 'bzm-round-target',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      [class]="containerClasses()"
      role="progressbar"
      [attr.aria-valuenow]="clampedScore()"
      [attr.aria-valuemin]="0"
      [attr.aria-valuemax]="targetScore()"
      [attr.aria-label]="ariaLabel()"
    >
      <div class="bzm-round-target__header">
        <div class="bzm-round-target__type" [style]="typeStyle()">
          <i [class]="'ph-duotone ph-' + config().icon" style="font-size: 16px;"></i>
          <span>{{ config().label }}</span>
        </div>

        @if (passed() === true) {
          <span class="bzm-round-target__status bzm-round-target__status--passed">
            <i class="ph-duotone ph-check-circle" style="font-size: 16px;"></i>
            Gehaald
          </span>
        }
        @if (passed() === false) {
          <span class="bzm-round-target__status bzm-round-target__status--failed">
            <i class="ph-duotone ph-x-circle" style="font-size: 16px;"></i>
            Gefaald
          </span>
        }
      </div>

      <div class="bzm-round-target__bar-container">
        <div class="bzm-round-target__bar-track">
          <div
            class="bzm-round-target__bar-fill"
            [class.bzm-round-target__bar-fill--passed]="passed() === true"
            [class.bzm-round-target__bar-fill--failed]="passed() === false"
            [style]="fillStyle()"
          ></div>
          <span class="bzm-round-target__percentage">{{ percentage() }}%</span>
        </div>

        <div class="bzm-round-target__labels">
          <span class="bzm-round-target__score">{{ currentScore() }}</span>
          <span class="bzm-round-target__target">{{ targetScore() }}</span>
        </div>
      </div>
    </div>
  `,
  styles: `
    :host {
      display: block;
      font-family: var(--bzm-font-family);
    }

    .bzm-round-target {
      display: flex;
      flex-direction: column;
      gap: var(--bzm-space-3);
      padding: var(--bzm-space-4);
      background: var(--bzm-color-surface);
      border: 4px solid var(--bzm-color-border);
      border-width: 3px 4px 5px 3px;
      border-radius: var(--bzm-radius-md);
      box-shadow: var(--bzm-shadow-md);
    }

    .bzm-round-target--boss {
      border-color: #E17055;
    }

    .bzm-round-target__header {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .bzm-round-target__type {
      display: inline-flex;
      align-items: center;
      gap: var(--bzm-space-1);
      font-family: var(--bzm-font-heading);
      font-size: var(--bzm-font-size-sm);
      padding: var(--bzm-space-1) var(--bzm-space-2);
      border-radius: var(--bzm-radius-sm);
      border: 2px solid var(--bzm-color-border);
      border-width: 1.5px 2px 2px 1.5px;
      letter-spacing: 0.02em;
    }

    .bzm-round-target__status {
      display: inline-flex;
      align-items: center;
      gap: var(--bzm-space-1);
      font-size: var(--bzm-font-size-xs);
      font-weight: var(--bzm-font-weight-extrabold);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .bzm-round-target__status--passed {
      color: var(--bzm-color-success);
    }

    .bzm-round-target__status--failed {
      color: var(--bzm-color-error);
    }

    .bzm-round-target__bar-container {
      display: flex;
      flex-direction: column;
      gap: var(--bzm-space-1);
    }

    .bzm-round-target__bar-track {
      position: relative;
      height: 32px;
      background: var(--bzm-gray-200);
      border: 3px solid var(--bzm-black);
      border-width: 2px 3px 3px 2px;
      border-radius: var(--bzm-radius-sm);
      overflow: hidden;
    }

    .bzm-round-target__bar-fill {
      position: absolute;
      inset: 0;
      right: auto;
      background: var(--bzm-color-primary);
      transition: width 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
    }

    .bzm-round-target__bar-fill--passed {
      background: var(--bzm-color-success);
    }

    .bzm-round-target__bar-fill--failed {
      background: var(--bzm-color-error);
    }

    .bzm-round-target__percentage {
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: var(--bzm-font-size-sm);
      font-weight: var(--bzm-font-weight-extrabold);
      color: var(--bzm-color-text);
      text-shadow: 0 1px 2px rgba(255, 255, 255, 0.8);
      z-index: 1;
    }

    .bzm-round-target__labels {
      display: flex;
      justify-content: space-between;
      padding: 0 var(--bzm-space-1);
    }

    .bzm-round-target__score {
      font-size: var(--bzm-font-size-sm);
      font-weight: var(--bzm-font-weight-extrabold);
      color: var(--bzm-color-text);
    }

    .bzm-round-target__target {
      font-size: var(--bzm-font-size-sm);
      font-weight: var(--bzm-font-weight-bold);
      color: var(--bzm-color-text-muted);
    }

    @media (prefers-reduced-motion: reduce) {
      .bzm-round-target__bar-fill {
        transition: none;
      }
    }
  `,
})
/**
 * Displays current score progress toward the round's target score in the roguelike quiz mode.
 *
 * Shows a round type label (Warm-Up / Challenge / Boss) with an icon, a large progress bar
 * filling toward the target, current and target score labels, and a centered percentage.
 * Boss rounds have a red/orange border accent. Supports passed/failed/in-progress states.
 *
 * @selector bzm-round-target
 *
 * @example
 * ```html
 * <bzm-round-target
 *   [currentScore]="450"
 *   [targetScore]="600"
 *   roundType="challenge"
 *   [passed]="null"
 * />
 * ```
 */
export class BzmRoundTargetComponent {
  /** Current score accumulated in this round. */
  readonly currentScore = input.required<number>();

  /** Target score required to pass this round. */
  readonly targetScore = input.required<number>();

  /** Type of round, determines the label, icon, and visual style. */
  readonly roundType = input.required<RoundType>();

  /** Pass/fail state: `null` means in progress, `true` means passed, `false` means failed. @default null */
  readonly passed = input<boolean | null>(null);

  protected readonly config = computed(() => ROUND_CONFIG[this.roundType()]);

  /** Clamped score for ARIA: never exceeds targetScore so aria-valuenow <= aria-valuemax. */
  protected readonly clampedScore = computed((): number =>
    Math.min(this.currentScore(), this.targetScore())
  );

  protected readonly percentage = computed((): number => {
    const target = this.targetScore();
    if (target <= 0) return 0;
    return Math.min(100, Math.round((this.currentScore() / target) * 100));
  });

  protected readonly fillStyle = computed((): string =>
    `width: ${this.percentage()}%`
  );

  protected readonly containerClasses = computed((): string => {
    const classes = ['bzm-round-target'];
    if (this.roundType() === 'boss') classes.push('bzm-round-target--boss');
    return classes.join(' ');
  });

  protected readonly typeStyle = computed((): string => {
    switch (this.roundType()) {
      case 'warmup':
        return 'background: var(--bzm-green-100); color: var(--bzm-green-700);';
      case 'challenge':
        return 'background: var(--bzm-cyan-100); color: var(--bzm-cyan-700);';
      case 'boss':
        return 'background: var(--bzm-red-100); color: var(--bzm-red-700);';
    }
  });

  protected readonly ariaLabel = computed((): string => {
    const label = this.config().label;
    const score = this.currentScore();
    const target = this.targetScore();
    const pct = this.percentage();
    const state = this.passed();

    let statusText = 'bezig';
    if (state === true) statusText = 'gehaald';
    if (state === false) statusText = 'gefaald';

    return `${label} ronde: ${score} van ${target} punten (${pct}%) — ${statusText}`;
  });
}
