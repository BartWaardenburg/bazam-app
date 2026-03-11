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

    .align-left { justify-content: flex-start; }
    .align-center { justify-content: center; }
    .align-right { justify-content: flex-end; }
    .align-space-between { justify-content: space-between; }

    .direction-row { flex-direction: row; }
    .direction-column { flex-direction: column; }
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
    () => `bzm-action-bar align-${this.align()} direction-${this.direction()}`
  );
}
