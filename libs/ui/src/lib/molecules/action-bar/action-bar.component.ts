import { Component, ChangeDetectionStrategy, input, computed } from '@angular/core';

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
export class BzmActionBarComponent {
  readonly align = input<ActionBarAlign>('center');
  readonly direction = input<'row' | 'column'>('row');

  protected readonly barClasses = computed(
    () => `bzm-action-bar align-${this.align()} direction-${this.direction()}`
  );
}
