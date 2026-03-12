import {
  Component,
  ChangeDetectionStrategy,
  computed,
  input,
  output,
  signal,
  OnDestroy,
  effect,
} from '@angular/core';

/** Size preset for the timer display. */
export type TimerSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'bzm-timer',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div [class]="containerClass()" [style]="containerSizeStyle()">
      <span class="bzm-timer__value" [style]="valueFontStyle()">
        {{ remainingSeconds() }}
      </span>
      <div class="bzm-timer__track">
        <div
          class="bzm-timer__fill"
          [style.width.%]="fillPercent()"
          role="progressbar"
          aria-label="Resterende tijd"
          [attr.aria-valuenow]="remainingSeconds()"
          [attr.aria-valuemax]="duration()"
          aria-valuemin="0"
        ></div>
      </div>
    </div>
  `,
  styles: `
    :host {
      display: inline-block;
      font-family: var(--bzm-font-family);
    }

    .bzm-timer {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: var(--bzm-space-2);
      background: var(--bzm-color-surface);
      border-radius: var(--bzm-radius-sm);
      border: 4px solid var(--bzm-black);
      border-width: var(--bzm-border-width-comic);
      box-shadow: var(--bzm-shadow-md);
      padding: var(--bzm-space-3);
    }

    .bzm-timer--warning {
      background: var(--bzm-yellow-100);
      border-color: var(--bzm-yellow-700);
    }

    .bzm-timer--danger {
      background: var(--bzm-red-100);
      border-color: var(--bzm-color-error);
      animation: bzm-timer-shake 0.3s ease-in-out infinite;
    }

    @keyframes bzm-timer-shake {
      0%, 100% { transform: rotate(0deg); }
      25% { transform: rotate(-2deg); }
      75% { transform: rotate(2deg); }
    }

    .bzm-timer__value {
      font-weight: var(--bzm-font-weight-extrabold);
      color: var(--bzm-color-text);
      line-height: 1;
    }

    .bzm-timer--warning .bzm-timer__value {
      color: var(--bzm-yellow-800);
    }

    .bzm-timer--danger .bzm-timer__value {
      color: var(--bzm-color-error);
    }

    .bzm-timer__track {
      width: 100%;
      height: 6px;
      background: var(--bzm-gray-200);
      border-radius: 2px;
      border: 2px solid var(--bzm-black);
      border-width: 1px 2px 2px 1px;
      overflow: hidden;
    }

    .bzm-timer__fill {
      height: 100%;
      background: var(--bzm-color-primary);
      border-radius: 1px;
      transition: width 0.3s ease;
    }

    .bzm-timer--warning .bzm-timer__fill {
      background: var(--bzm-color-accent);
    }

    .bzm-timer--danger .bzm-timer__fill {
      background: var(--bzm-color-error);
    }

    @media (prefers-reduced-motion: reduce) {
      .bzm-timer--danger {
        animation: none;
      }
      .bzm-timer__fill {
        transition: none;
      }
    }
  `,
})
/**
 * Manages a countdown timer with visual warning/danger states and a shrinking progress fill bar.
 *
 * Counts down from `duration` (or `initialRemaining`) in one-second intervals when `running` is true.
 * Automatically transitions through three visual states:
 * - Normal: default styling when more than 30% of time remains
 * - Warning: yellow background when less than 30% remains
 * - Danger: red background with a shake animation when 3 seconds or fewer remain
 *
 * Emits `timerComplete` when the countdown reaches zero. Cleans up the interval on destroy.
 *
 * @selector bzm-timer
 *
 * @example
 * ```html
 * <bzm-timer [duration]="30" [running]="true" size="md" (timerComplete)="onTimeUp()" />
 * ```
 */
export class BzmTimerComponent implements OnDestroy {
  /** Total duration in seconds for the countdown. Also used to calculate the fill percentage. */
  readonly duration = input.required<number>();

  /** Optional initial remaining seconds. When provided, the timer starts from this value instead of `duration`. @default undefined */
  readonly initialRemaining = input<number | undefined>(undefined);

  /** Whether the timer is actively counting down. Toggling this starts or stops the interval. @default false */
  readonly running = input<boolean>(false);

  /** Size preset controlling the timer's dimensions and font size. @default 'md' */
  readonly size = input<TimerSize>('md');

  /** Emits when the countdown reaches zero. */
  readonly timerComplete = output<void>();

  /** Reactive signal holding the current remaining seconds. Updates every second while running. */
  readonly remainingSeconds = signal(0);

  private intervalId: ReturnType<typeof setInterval> | null = null;

  private initialized = false;

  private readonly timerEffect = effect(() => {
    const dur = this.duration();
    const isRunning = this.running();
    const initial = this.initialRemaining();

    if (!this.initialized) {
      this.remainingSeconds.set(initial ?? dur);
      this.initialized = true;
    } else {
      this.remainingSeconds.set(dur);
    }

    if (isRunning) {
      this.startTimer();
    } else {
      this.stopTimer();
    }
  });

  /** Maps each size preset to pixel dimensions for the timer container. */
  protected readonly sizeMap: Record<TimerSize, { width: number; height: number }> = {
    sm: { width: 56, height: 56 },
    md: { width: 80, height: 80 },
    lg: { width: 104, height: 104 },
  };

  protected readonly fillPercent = computed(() => {
    const dur = this.duration();
    if (dur <= 0) return 0;
    return (this.remainingSeconds() / dur) * 100;
  });

  protected readonly containerClass = computed(() => {
    const remaining = this.remainingSeconds();
    const dur = this.duration();
    const classes = ['bzm-timer'];
    if (remaining <= 3 && remaining < dur) {
      classes.push('bzm-timer--danger');
    } else if (dur > 0 && remaining / dur < 0.3) {
      classes.push('bzm-timer--warning');
    }
    return classes.join(' ');
  });

  protected readonly containerSizeStyle = computed(() => {
    const s = this.sizeMap[this.size()];
    return `width: ${s.width}px; height: ${s.height}px`;
  });

  protected readonly valueFontStyle = computed(() => {
    const s = this.size();
    const fontSize =
      s === 'sm'
        ? 'var(--bzm-font-size-lg)'
        : s === 'md'
          ? 'var(--bzm-font-size-2xl)'
          : 'var(--bzm-font-size-3xl)';
    return `font-size: ${fontSize}`;
  });

  /** Stops the countdown interval to prevent memory leaks on component teardown. */
  ngOnDestroy(): void {
    this.stopTimer();
  }

  private startTimer(): void {
    this.stopTimer();
    this.intervalId = setInterval(() => {
      const current = this.remainingSeconds();
      if (current <= 0) {
        this.stopTimer();
        this.timerComplete.emit();
        return;
      }
      this.remainingSeconds.set(current - 1);
    }, 1000);
  }

  private stopTimer(): void {
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
}
