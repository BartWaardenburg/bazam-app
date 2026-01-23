import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { BzmTimerComponent } from '../timer/timer.component';

@Component({
  selector: 'bzm-question-header',
  standalone: true,
  imports: [BzmTimerComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="bzm-question-header">
      <h3 class="bzm-question-header__text">{{ questionText() }}</h3>
      @if (showTimer()) {
        <bzm-timer
          [duration]="timerDuration()"
          [running]="timerRunning()"
        />
      }
    </div>
  `,
  styles: `
    :host {
      display: block;
      font-family: var(--bzm-font-family);
    }

    .bzm-question-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: var(--bzm-space-6);
    }

    .bzm-question-header__text {
      flex: 1;
      margin: 0;
      font-size: clamp(1.1rem, 3.5vw, 1.6rem);
      font-weight: var(--bzm-font-weight-extrabold);
      line-height: var(--bzm-line-height-snug);
      color: var(--bzm-color-text);
    }

    @media (max-width: 480px) {
      .bzm-question-header {
        flex-direction: column;
        align-items: flex-start;
      }
    }
  `,
})
export class BzmQuestionHeaderComponent {
  readonly questionText = input.required<string>();
  readonly showTimer = input<boolean>(true);
  readonly timerDuration = input<number>(30);
  readonly timerRunning = input<boolean>(false);
}
