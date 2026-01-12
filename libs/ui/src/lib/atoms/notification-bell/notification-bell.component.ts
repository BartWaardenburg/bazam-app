import { Component, ChangeDetectionStrategy, input, computed } from '@angular/core';

@Component({
  selector: 'bzm-notification-bell',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button class="bell-button" [attr.aria-label]="ariaLabel()">
      <svg
        class="bell-icon"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
      </svg>

      @if (hasNotification()) {
        <span class="notification-badge" [class.has-count]="showCount()">
          @if (showCount()) {
            {{ displayCount() }}
          }
        </span>
      }
    </button>
  `,
  styles: `
    :host {
      display: inline-block;
      font-family: var(--bzm-font-family);
    }

    .bell-button {
      position: relative;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      border-radius: 3px;
      border: 3px solid var(--bzm-black);
      border-width: 2px 3px 3px 2px;
      background-color: var(--bzm-color-surface);
      color: var(--bzm-color-text);
      cursor: pointer;
      box-shadow: var(--bzm-shadow-sm);
      transition:
        transform var(--bzm-transition-playful),
        box-shadow var(--bzm-transition-base);
      -webkit-tap-highlight-color: transparent;
    }

    .bell-button:hover {
      transform: translateY(-3px) rotate(-1deg);
      box-shadow: var(--bzm-shadow-md);
    }

    .bell-button:active {
      transform: translateY(4px);
      box-shadow: none;
    }

    .bell-icon {
      width: 22px;
      height: 22px;
    }

    .notification-badge {
      position: absolute;
      top: -4px;
      right: -4px;
      width: 10px;
      height: 10px;
      border-radius: 3px;
      background-color: var(--bzm-color-error);
      border: 2px solid var(--bzm-black);
      border-width: 1.5px 2px 2px 1.5px;
    }

    .notification-badge.has-count {
      width: auto;
      height: auto;
      min-width: 20px;
      padding: 0 var(--bzm-space-1);
      top: -6px;
      right: -6px;
      font-size: 10px;
      font-weight: var(--bzm-font-weight-extrabold);
      font-family: var(--bzm-font-family);
      color: var(--bzm-color-text-on-primary);
      display: flex;
      align-items: center;
      justify-content: center;
      line-height: 16px;
      box-shadow: var(--bzm-shadow-sm);
    }
  `,
})
export class BzmNotificationBellComponent {
  readonly hasNotification = input<boolean>(false);
  readonly count = input<number | undefined>(undefined);

  protected readonly showCount = computed(() => {
    const c = this.count();
    return c !== undefined && c > 0;
  });

  protected readonly displayCount = computed(() => {
    const c = this.count();
    if (c === undefined) return '';
    return c > 99 ? '99+' : String(c);
  });

  protected readonly ariaLabel = computed(() => {
    const c = this.count();
    if (c !== undefined && c > 0) {
      return `Notifications: ${c} unread`;
    }
    if (this.hasNotification()) {
      return 'Notifications: new';
    }
    return 'Notifications';
  });
}
