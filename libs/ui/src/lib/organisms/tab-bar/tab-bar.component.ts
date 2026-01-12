import { Component, ChangeDetectionStrategy, input, output, computed } from '@angular/core';

@Component({
  selector: 'bzm-tab-bar',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <nav class="tab-bar" role="tablist" aria-label="View selection">
      @for (tab of tabs(); track tab; let i = $index) {
        <button
          class="tab"
          [class.tab-active]="i === activeIndex()"
          [attr.role]="'tab'"
          [attr.aria-selected]="i === activeIndex()"
          [attr.aria-label]="tab"
          (click)="tabChange.emit(i)"
        >
          {{ tab }}
        </button>
      }
    </nav>
  `,
  styles: `
    :host {
      display: block;
      font-family: var(--bzm-font-family);
    }

    .tab-bar {
      display: flex;
      align-items: center;
      gap: var(--bzm-space-1);
      background-color: var(--bzm-color-primary-surface);
      border-radius: var(--bzm-radius-md);
      padding: var(--bzm-space-1);
    }

    .tab {
      flex: 1;
      padding: var(--bzm-space-2) var(--bzm-space-4);
      border: none;
      border-radius: var(--bzm-radius-md);
      font-family: var(--bzm-font-family);
      font-size: var(--bzm-font-size-sm);
      font-weight: var(--bzm-font-weight-bold);
      color: var(--bzm-color-text-secondary);
      background: transparent;
      cursor: pointer;
      white-space: nowrap;
      transition:
        background-color var(--bzm-transition-smooth),
        color var(--bzm-transition-smooth),
        box-shadow var(--bzm-transition-smooth),
        transform var(--bzm-transition-playful);
      user-select: none;
      -webkit-tap-highlight-color: transparent;
    }

    .tab:hover:not(.tab-active) {
      color: var(--bzm-color-text);
      background-color: oklch(100% 0 0 / 0.5);
    }

    .tab:active {
      transform: scale(0.96);
    }

    .tab-active {
      background-color: var(--bzm-color-primary);
      color: var(--bzm-color-text-on-primary);
      box-shadow: var(--bzm-shadow-primary);
    }
  `,
})
export class BzmTabBarComponent {
  readonly tabs = input.required<string[]>();
  readonly activeIndex = input<number>(0);

  readonly tabChange = output<number>();
}
