import { Component, ChangeDetectionStrategy, input, output, computed, OnInit, OnDestroy, signal } from '@angular/core';
import type { PowerUpType } from '../../atoms/power-up-card/power-up-card.component';

/** Shape of the power-up data passed to the activation overlay. */
export interface PowerUpActivationData {
  /** Display name of the power-up. */
  readonly name: string;
  /** Phosphor icon name (without prefix). */
  readonly icon: string;
  /** Category: offensive (chaos) or defensive (boost). */
  readonly type: PowerUpType;
  /** Description of what the power-up does. */
  readonly description: string;
}

@Component({
  selector: 'bzm-power-up-activation',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="bzm-power-up-activation" role="dialog" aria-modal="true" [attr.aria-label]="'Gebruik ' + powerUp().name + '?'">
      <div class="bzm-power-up-activation__backdrop" (click)="handleSkip()"></div>
      <div [class]="cardClasses()">
        <div class="bzm-power-up-activation__timer-ring">
          <svg viewBox="0 0 100 100" class="bzm-power-up-activation__svg">
            <circle
              cx="50" cy="50" r="44"
              fill="none"
              stroke="var(--bzm-gray-200)"
              stroke-width="6"
            />
            <circle
              cx="50" cy="50" r="44"
              fill="none"
              [attr.stroke]="ringColor()"
              stroke-width="6"
              stroke-linecap="round"
              stroke-dasharray="276.46"
              [attr.stroke-dashoffset]="timerOffset()"
              class="bzm-power-up-activation__ring-progress"
            />
          </svg>
          <div class="bzm-power-up-activation__icon-container">
            <i [class]="iconClass()"></i>
          </div>
        </div>
        <h3 class="bzm-power-up-activation__name">{{ powerUp().name }}</h3>
        <p class="bzm-power-up-activation__desc">{{ powerUp().description }}</p>
        <div class="bzm-power-up-activation__actions">
          <button
            type="button"
            class="bzm-power-up-activation__btn bzm-power-up-activation__btn--primary"
            (click)="handleActivate()"
          >
            Gebruiken!
          </button>
          <button
            type="button"
            class="bzm-power-up-activation__btn bzm-power-up-activation__btn--ghost"
            (click)="handleSkip()"
          >
            Bewaar
          </button>
        </div>
        <span class="bzm-power-up-activation__time" aria-live="polite">
          {{ _remainingTime() }}s
        </span>
      </div>
    </div>
  `,
  styles: `
    :host {
      display: block;
      font-family: var(--bzm-font-family);
    }

    .bzm-power-up-activation {
      position: fixed;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }

    .bzm-power-up-activation__backdrop {
      position: absolute;
      inset: 0;
      background: rgba(0, 0, 0, 0.6);
      backdrop-filter: blur(4px);
    }

    .bzm-power-up-activation__card {
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--bzm-space-4);
      padding: var(--bzm-space-8) var(--bzm-space-6);
      background: var(--bzm-color-surface);
      border: 4px solid var(--bzm-color-border);
      border-width: var(--bzm-border-width-comic);
      border-radius: var(--bzm-radius-md);
      box-shadow: var(--bzm-shadow-lg);
      text-align: center;
      min-width: 280px;
      max-width: 340px;
      animation: bzm-activation-pop 0.35s var(--bzm-transition-playful) forwards;
    }

    .bzm-power-up-activation__card--chaos {
      border-color: var(--bzm-red-500);
    }

    .bzm-power-up-activation__card--boost {
      border-color: var(--bzm-green-500);
    }

    /* ─── Timer ring ─── */
    .bzm-power-up-activation__timer-ring {
      position: relative;
      width: 96px;
      height: 96px;
    }

    .bzm-power-up-activation__svg {
      width: 100%;
      height: 100%;
      transform: rotate(-90deg);
    }

    .bzm-power-up-activation__ring-progress {
      transition: stroke-dashoffset 1s linear;
    }

    .bzm-power-up-activation__icon-container {
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      animation: bzm-float 2s ease-in-out infinite;
    }

    .bzm-power-up-activation__icon-container i {
      font-size: 40px;
      color: var(--bzm-color-text);
    }

    .bzm-power-up-activation__card--chaos .bzm-power-up-activation__icon-container i {
      color: var(--bzm-red-600);
    }

    .bzm-power-up-activation__card--boost .bzm-power-up-activation__icon-container i {
      color: var(--bzm-green-600);
    }

    /* ─── Text ─── */
    .bzm-power-up-activation__name {
      margin: 0;
      font-size: var(--bzm-font-size-2xl);
      font-weight: var(--bzm-font-weight-extrabold);
      color: var(--bzm-color-text);
    }

    .bzm-power-up-activation__desc {
      margin: 0;
      font-size: var(--bzm-font-size-sm);
      font-weight: var(--bzm-font-weight-medium);
      color: var(--bzm-color-text-secondary);
      line-height: var(--bzm-line-height-normal);
    }

    .bzm-power-up-activation__time {
      font-size: var(--bzm-font-size-xs);
      font-weight: var(--bzm-font-weight-bold);
      color: var(--bzm-color-text-muted);
    }

    /* ─── Buttons ─── */
    .bzm-power-up-activation__actions {
      display: flex;
      gap: var(--bzm-space-3);
      width: 100%;
    }

    .bzm-power-up-activation__btn {
      flex: 1;
      padding: var(--bzm-space-3) var(--bzm-space-4);
      border: 4px solid var(--bzm-color-border);
      border-width: var(--bzm-border-width-comic);
      border-radius: var(--bzm-radius-md);
      font-family: var(--bzm-font-family);
      font-size: var(--bzm-font-size-base);
      font-weight: var(--bzm-font-weight-bold);
      cursor: pointer;
      transition:
        transform var(--bzm-transition-playful),
        box-shadow var(--bzm-transition-base);
      box-shadow: var(--bzm-shadow-sm);
    }

    .bzm-power-up-activation__btn:hover {
      transform: translateY(-2px);
      box-shadow: var(--bzm-shadow-md);
    }

    .bzm-power-up-activation__btn:active {
      transform: translateY(1px);
      box-shadow: none;
    }

    .bzm-power-up-activation__btn--primary {
      background: var(--bzm-color-accent);
      color: var(--bzm-color-text-on-accent);
    }

    .bzm-power-up-activation__btn--ghost {
      background: var(--bzm-color-surface);
      color: var(--bzm-color-text-secondary);
    }

    /* ─── Animations ─── */
    @keyframes bzm-activation-pop {
      0% { transform: scale(0.7); opacity: 0; }
      100% { transform: scale(1); opacity: 1; }
    }

    @keyframes bzm-float {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-6px); }
    }

    @media (prefers-reduced-motion: reduce) {
      .bzm-power-up-activation__card {
        animation: none;
      }

      .bzm-power-up-activation__icon-container {
        animation: none;
      }

      .bzm-power-up-activation__btn {
        transition: none;
      }

      .bzm-power-up-activation__ring-progress {
        transition: none;
      }
    }
  `,
})
/**
 * Modal overlay prompt asking the player whether to use a power-up during the pre-question countdown.
 *
 * Centers a card with an animated icon inside a countdown ring, the power-up name and description,
 * and two action buttons ("Gebruiken!" / "Bewaar"). A timer ring counts down the remaining seconds.
 * Auto-skips when the timer reaches 0. Respects `prefers-reduced-motion`.
 *
 * @selector bzm-power-up-activation
 *
 * @example
 * ```html
 * <bzm-power-up-activation
 *   [powerUp]="{ name: 'Shield', icon: 'shield', type: 'boost', description: 'Beschermt tegen chaos.' }"
 *   [timeRemaining]="3"
 *   (activated)="onActivate()"
 *   (skipped)="onSkip()"
 * />
 * ```
 */
export class BzmPowerUpActivationComponent implements OnInit, OnDestroy {
  /** Power-up data to display in the overlay. */
  readonly powerUp = input.required<PowerUpActivationData>();

  /** Seconds left to decide. The countdown ring uses this value. @default 3 */
  readonly timeRemaining = input<number>(3);

  /** Emitted when the player confirms activation. */
  readonly activated = output<void>();

  /** Emitted when the player declines or the timer expires. */
  readonly skipped = output<void>();

  private timerHandle: ReturnType<typeof setInterval> | null = null;
  private maxTime = 0;
  private destroyed = false;

  protected readonly _remainingTime = signal(0);

  protected readonly iconClass = computed(
    () => `ph-duotone ph-${this.powerUp().icon}`
  );

  protected readonly cardClasses = computed(
    () => `bzm-power-up-activation__card bzm-power-up-activation__card--${this.powerUp().type}`
  );

  protected readonly ringColor = computed(() =>
    this.powerUp().type === 'chaos' ? 'var(--bzm-red-500)' : 'var(--bzm-green-500)'
  );

  protected readonly timerOffset = computed(() => {
    const remaining = this._remainingTime();
    const max = this.maxTime || remaining;
    const fraction = max > 0 ? remaining / max : 0;
    return 276.46 * (1 - fraction);
  });

  ngOnInit(): void {
    this.maxTime = this.timeRemaining();
    this._remainingTime.set(this.timeRemaining());

    this.timerHandle = setInterval(() => {
      if (this.destroyed) return;
      this._remainingTime.update(t => t - 1);
      if (this._remainingTime() <= 0) {
        this.handleSkip();
      }
    }, 1000);
  }

  ngOnDestroy(): void {
    this.destroyed = true;
    this.clearTimer();
  }

  protected handleActivate(): void {
    this.clearTimer();
    this.activated.emit();
  }

  protected handleSkip(): void {
    this.clearTimer();
    this.skipped.emit();
  }

  private clearTimer(): void {
    if (this.timerHandle !== null) {
      clearInterval(this.timerHandle);
      this.timerHandle = null;
    }
  }
}
