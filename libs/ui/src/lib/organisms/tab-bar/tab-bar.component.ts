import { Component, ChangeDetectionStrategy, input, output, computed, inject, ElementRef } from '@angular/core';

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
          [attr.tabindex]="i === activeIndex() ? 0 : -1"
          (click)="tabChange.emit(i)"
          (keydown)="onTabKeydown($event, i)"
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
/**
 * Renders a segmented tab navigation bar with active state highlighting.
 *
 * Each tab is rendered as a button with proper ARIA `role="tab"` and
 * `aria-selected` attributes. The active tab receives a primary-colored
 * background. Use this component to switch between views or filter modes.
 *
 * @selector bzm-tab-bar
 *
 * @example
 * ```html
 * <bzm-tab-bar
 *   [tabs]="['World', 'Weekly', 'Friends']"
 *   [activeIndex]="selectedTab"
 *   (tabChange)="selectedTab = $event"
 * />
 * ```
 */
export class BzmTabBarComponent {
  /** Array of tab label strings to render as buttons. */
  readonly tabs = input.required<string[]>();

  /**
   * Zero-based index of the currently active tab.
   * @default 0
   */
  readonly activeIndex = input<number>(0);

  /** Emits the zero-based index of the tab the user clicked. */
  readonly tabChange = output<number>();

  private readonly el = inject(ElementRef);

  /** Handles ArrowLeft/ArrowRight keyboard navigation between tabs. */
  protected onTabKeydown(event: KeyboardEvent, index: number): void {
    const tabs = this.tabs();
    let newIndex = index;

    if (event.key === 'ArrowRight') {
      newIndex = (index + 1) % tabs.length;
      event.preventDefault();
    } else if (event.key === 'ArrowLeft') {
      newIndex = (index - 1 + tabs.length) % tabs.length;
      event.preventDefault();
    }

    if (newIndex !== index) {
      this.tabChange.emit(newIndex);
      const buttons = (this.el.nativeElement as HTMLElement).querySelectorAll<HTMLButtonElement>('.tab');
      buttons[newIndex]?.focus();
    }
  }
}
