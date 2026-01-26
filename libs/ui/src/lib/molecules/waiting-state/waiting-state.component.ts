import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { BzmSpinnerComponent } from '../../atoms/spinner/spinner.component';

@Component({
  selector: 'bzm-waiting-state',
  standalone: true,
  imports: [BzmSpinnerComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="bzm-waiting-state" role="status" [attr.aria-label]="message()">
      <bzm-spinner [size]="spinnerSize()" />
      <p class="bzm-waiting-state__message">{{ message() }}</p>
    </div>
  `,
  styles: `
    :host {
      display: block;
      font-family: var(--bzm-font-family);
    }

    .bzm-waiting-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--bzm-space-4);
      padding: var(--bzm-space-8);
    }

    .bzm-waiting-state__message {
      margin: 0;
      font-size: var(--bzm-font-size-base);
      font-weight: var(--bzm-font-weight-semibold);
      color: var(--bzm-color-text-muted);
      text-align: center;
    }
  `,
})
export class BzmWaitingStateComponent {
  readonly message = input<string>('Even geduld...');
  readonly spinnerSize = input<'sm' | 'md' | 'lg'>('lg');
}
