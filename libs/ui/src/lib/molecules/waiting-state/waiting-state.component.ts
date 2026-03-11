import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { BzmMascotComponent } from '../../atoms/mascot/mascot.component';

@Component({
  selector: 'bzm-waiting-state',
  standalone: true,
  imports: [BzmMascotComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="bzm-waiting-state" role="status" [attr.aria-label]="message()">
      <bzm-mascot
        expression="neutral"
        animate="bounce"
        [showBadge]="true"
        badgeText="?"
        [size]="spinnerSize()"
      />
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
/**
 * Displays a waiting indicator with a bouncing mascot and a customizable status message.
 *
 * Renders a centered column with an animated mascot (neutral expression, question-mark badge)
 * and a muted text message. Used as a placeholder while waiting for game events such as
 * the host starting the game or the next question loading.
 *
 * @selector bzm-waiting-state
 *
 * @example
 * ```html
 * <bzm-waiting-state message="De host start het spel..." spinnerSize="md" />
 * ```
 */
export class BzmWaitingStateComponent {
  /** Status message displayed below the mascot. @default 'Even geduld...' */
  readonly message = input<string>('Even geduld...');

  /** Size of the bouncing mascot animation. @default 'lg' */
  readonly spinnerSize = input<'sm' | 'md' | 'lg'>('lg');
}
