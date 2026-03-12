import { Component, ChangeDetectionStrategy, input, computed } from '@angular/core';

/** Horizontal alignment options for action bar content. */
export type ActionBarAlign = 'left' | 'center' | 'right' | 'space-between';

@Component({
  selector: 'bzm-action-bar',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div [class]="barClasses()" role="group">
      <ng-content />
    </div>
  `,
  styles: `
    :host {
      display: block;
    }

    .bzm-action-bar {
      display: flex;
      flex-wrap: wrap;
      gap: var(--bzm-space-3);
    }

    .bzm-action-bar--align-left { justify-content: flex-start; }
    .bzm-action-bar--align-center { justify-content: center; }
    .bzm-action-bar--align-right { justify-content: flex-end; }
    .bzm-action-bar--align-space-between { justify-content: space-between; }

    .bzm-action-bar--direction-row { flex-direction: row; }
    .bzm-action-bar--direction-column { flex-direction: column; }
  `,
})
/**
 * Displays a flexible container for grouping action buttons with configurable alignment and direction.
 *
 * Projects child content (typically `BzmButton` instances) into a flex layout
 * with configurable alignment and flow direction.
 *
 * @selector bzm-action-bar
 *
 * @example
 * ```html
 * <bzm-action-bar align="space-between">
 *   <bzm-button variant="primary">Start</bzm-button>
 *   <bzm-button variant="secondary">Cancel</bzm-button>
 * </bzm-action-bar>
 * ```
 */
export class BzmActionBarComponent {
  /** Horizontal alignment of the action buttons within the bar. @default 'center' */
  readonly align = input<ActionBarAlign>('center');

  /** Layout direction of the action buttons. @default 'row' */
  readonly direction = input<'row' | 'column'>('row');

  protected readonly barClasses = computed(
    () => `bzm-action-bar bzm-action-bar--align-${this.align()} bzm-action-bar--direction-${this.direction()}`
  );
}
