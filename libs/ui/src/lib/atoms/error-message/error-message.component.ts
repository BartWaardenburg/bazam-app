import { Component, ChangeDetectionStrategy, input } from '@angular/core';

@Component({
  selector: 'bzm-error-message',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="bzm-error" role="alert" aria-live="assertive">
      <ng-content />
    </div>
  `,
  styles: `
    :host {
      display: block;
      font-family: var(--bzm-font-family);
    }

    .bzm-error {
      color: var(--bzm-white);
      font-weight: var(--bzm-font-weight-semibold);
      text-align: center;
      font-size: var(--bzm-font-size-sm);
      background: var(--bzm-color-error);
      padding: var(--bzm-space-3);
      border-radius: var(--bzm-radius-sm);
      border: 4px solid var(--bzm-black);
      border-width: 3px 4px 4px 3px;
      box-shadow: var(--bzm-shadow-sm);
    }
  `,
})
export class BzmErrorMessageComponent {}
