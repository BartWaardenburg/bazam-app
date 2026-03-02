import { Component, ChangeDetectionStrategy, computed, input } from '@angular/core';

@Component({
  selector: 'bzm-progress-bar',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="bzm-progress-bar">
      @for (segment of segments(); track $index) {
        <div
          class="bzm-progress-bar__segment"
          [class.bzm-progress-bar__segment--completed]="segment === 'completed'"
          [class.bzm-progress-bar__segment--active]="segment === 'active'"
        ></div>
      }
      <span class="bzm-progress-bar__label">{{ current() + 1 }} / {{ total() }}</span>
    </div>
  `,
  styles: `
    :host {
      display: block;
      width: 100%;
    }

    .bzm-progress-bar {
      display: flex;
      gap: 6px;
      align-items: center;
    }

    .bzm-progress-bar__segment {
      flex: 1;
      height: 10px;
      border-radius: 2px;
      background: var(--bzm-gray-200);
      transition: background 0.4s ease,
                  transform 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
      border: 3px solid var(--bzm-black);
      border-width: 2px 3px 3px 2px;

    }

    .bzm-progress-bar__segment--completed {
      background: var(--bzm-color-primary);
    }

    .bzm-progress-bar__segment--active {
      background: var(--bzm-color-accent);
      animation: bzm-pulse-segment 1.5s ease-in-out infinite;
    }

    .bzm-progress-bar__label {
      font-family: var(--bzm-font-family);
      font-size: var(--bzm-font-size-sm);
      font-weight: var(--bzm-font-weight-bold);
      color: var(--bzm-color-text);
      margin-inline-start: var(--bzm-space-3);
      white-space: nowrap;
      background: var(--bzm-white);
      padding: var(--bzm-space-1) var(--bzm-space-3);
      border-radius: 2px;
      border: 3px solid var(--bzm-black);
      border-width: 2px 3px 3px 2px;
      box-shadow: var(--bzm-shadow-sm);
      letter-spacing: 0.05em;

    }

    @keyframes bzm-pulse-segment {
      0%, 100% { opacity: 1; transform: scaleY(1); }
      50% { opacity: 0.7; transform: scaleY(1.3); }
    }
  `,
})
export class BzmProgressBarComponent {
  readonly current = input.required<number>();
  readonly total = input.required<number>();

  readonly segments = computed(() => {
    const c = this.current();
    const t = this.total();
    const result: ('pending' | 'completed' | 'active')[] = [];
    for (let i = 0; i < t; i++) {
      if (i < c) result.push('completed');
      else if (i === c) result.push('active');
      else result.push('pending');
    }
    return result;
  });
}
