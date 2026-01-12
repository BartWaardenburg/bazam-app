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
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" class="bzm-level-progress__star">
            <path d="M8 1l2.1 4.3 4.7.7-3.4 3.3.8 4.7L8 11.8 3.8 14l.8-4.7L1.2 6l4.7-.7L8 1z"
                  fill="var(--bzm-color-accent)"/>
          </svg>
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
export class BzmLevelProgressComponent {
  readonly progress = input.required<number>();
  readonly xp = input.required<number>();
  readonly label = input<string>('My Level Progress');

  clampedProgress(): number {
    return Math.min(100, Math.max(0, this.progress()));
  }
}
