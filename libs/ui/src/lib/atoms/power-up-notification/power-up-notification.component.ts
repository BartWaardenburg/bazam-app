import { Component, ChangeDetectionStrategy, input, computed } from '@angular/core';

/** Context in which the notification is shown. */
export type PowerUpNotificationType = 'activated' | 'earned' | 'effect';

@Component({
  selector: 'bzm-power-up-notification',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (visible()) {
      <div [class]="notificationClasses()" role="alert" aria-live="assertive">
        <i [class]="iconClass()"></i>
        <span class="bzm-power-up-notification__message">{{ message() }}</span>
      </div>
    }
  `,
  styles: `
    :host {
      display: block;
      font-family: var(--bzm-font-family);
      position: relative;
    }

    .bzm-power-up-notification {
      display: inline-flex;
      align-items: center;
      gap: var(--bzm-space-3);
      padding: var(--bzm-space-3) var(--bzm-space-5);
      border: 4px solid var(--bzm-color-border);
      border-width: var(--bzm-border-width-comic);
      border-radius: var(--bzm-radius-full);
      box-shadow: var(--bzm-shadow-md);
      animation: bzm-notification-slide-in 0.35s var(--bzm-transition-playful) forwards;
    }

    /* ─── Type colors ─── */
    .bzm-power-up-notification--activated {
      background: var(--bzm-yellow-100);
      border-color: var(--bzm-yellow-400);
    }

    .bzm-power-up-notification--activated i {
      color: var(--bzm-yellow-500);
    }

    .bzm-power-up-notification--earned {
      background: var(--bzm-green-100);
      border-color: var(--bzm-green-500);
    }

    .bzm-power-up-notification--earned i {
      color: var(--bzm-green-600);
    }

    .bzm-power-up-notification--effect {
      background: var(--bzm-red-100);
      border-color: var(--bzm-red-500);
    }

    .bzm-power-up-notification--effect i {
      color: var(--bzm-red-600);
    }

    /* ─── Icon ─── */
    .bzm-power-up-notification i {
      font-size: 22px;
      flex-shrink: 0;
    }

    /* ─── Message ─── */
    .bzm-power-up-notification__message {
      font-weight: var(--bzm-font-weight-bold);
      font-size: var(--bzm-font-size-sm);
      color: var(--bzm-color-text);
      line-height: var(--bzm-line-height-snug);
    }

    /* ─── Animations ─── */
    @keyframes bzm-notification-slide-in {
      from {
        transform: translateY(-100%);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .bzm-power-up-notification {
        animation: bzm-notification-fade-in 0.2s ease forwards;
      }

      @keyframes bzm-notification-fade-in {
        from { opacity: 0; }
        to { opacity: 1; }
      }
    }
  `,
})
/**
 * Brief flash notification pill shown when a power-up is activated, earned, or takes effect.
 *
 * Slides down from its position (or fades when `prefers-reduced-motion` is active).
 * Color-coded by notification type: yellow for activated, green for earned, red for effect.
 * Uses `aria-live="assertive"` so screen readers announce the event immediately.
 *
 * @selector bzm-power-up-notification
 *
 * @example
 * ```html
 * <bzm-power-up-notification
 *   message="Je hebt Shield verdiend!"
 *   type="earned"
 *   icon="shield"
 *   [visible]="true"
 * />
 * ```
 */
export class BzmPowerUpNotificationComponent {
  /** Notification text displayed next to the icon. */
  readonly message = input.required<string>();

  /** Determines the pill color scheme: yellow, green, or red. @default 'activated' */
  readonly type = input<PowerUpNotificationType>('activated');

  /** Phosphor icon name (without prefix). @default 'lightning' */
  readonly icon = input<string>('lightning');

  /** Controls visibility — when false, the notification is removed from the DOM. @default true */
  readonly visible = input<boolean>(true);

  protected readonly iconClass = computed(
    () => `ph-duotone ph-${this.icon()}`
  );

  protected readonly notificationClasses = computed(
    () => `bzm-power-up-notification bzm-power-up-notification--${this.type()}`
  );
}
