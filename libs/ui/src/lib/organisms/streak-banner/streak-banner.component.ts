import { Component, ChangeDetectionStrategy, input } from '@angular/core';

@Component({
  selector: 'bzm-streak-banner',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="streak-banner" role="status" aria-label="Streak count">
      <div class="streak-content">
        <span class="streak-label">You did</span>
        <span class="streak-count">{{ streakCount() }}</span>
        <span class="streak-suffix">streaks</span>
      </div>

      <div class="streak-action">
        <div class="streak-illustration" aria-hidden="true">
          <span class="fire">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 256 256"><path d="M208,144a80,80,0,0,1-160,0c0-30.57,14.9-58.83,31.25-80.44a8,8,0,0,1,13.37.66L120,112l39.39-39.39a8,8,0,0,1,12.5,1.6C189.33,101.84,208,130.52,208,144Z" opacity="0.2" fill="currentColor"/><path d="M183.89,153.34a57.6,57.6,0,0,1-46.56,46.55A8.75,8.75,0,0,1,136,200a8,8,0,0,1-1.32-15.89c16.57-2.79,30.63-16.85,33.44-33.45a8,8,0,0,1,15.78,2.68ZM216,144a88,88,0,0,1-176,0c0-27.92,11.3-58.73,32.58-88.92a16,16,0,0,1,26.83,1.31L121.22,96,161,56.2a16,16,0,0,1,25.12,3.12C207.78,93.56,216,120.3,216,144Zm-16,0c0-20.16-7.35-43.83-26-73.53l-40.41,40.4a8,8,0,0,1-12.92-2.13L98.42,69.2C79.48,98.36,56,127.6,56,144a72,72,0,0,0,144,0Z" fill="currentColor"/></svg>
          </span>
          <span class="star">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 256 256"><path d="M234.29,114.85l-45,38.83L203,211.75a16.4,16.4,0,0,1-24.5,17.82L128,198.49,77.47,229.57A16.4,16.4,0,0,1,53,211.75l13.76-58.07-45-38.83A16.46,16.46,0,0,1,31.08,91l59.46-5.15,23.21-55.36a16.4,16.4,0,0,1,28.5,0l23.21,55.36L224.92,91a16.46,16.46,0,0,1,9.37,23.85Z" opacity="0.2" fill="currentColor"/><path d="M239.18,97.26A16.38,16.38,0,0,0,224.92,86l-59-5.12L143.13,28.77a16.36,16.36,0,0,0-30.27,0L90.11,80.85,31.08,86a16.46,16.46,0,0,0-9.37,28.86l45,38.83L53,211.75a16.38,16.38,0,0,0,24.5,17.82L128,198.49l50.53,31.08A16.4,16.4,0,0,0,203,211.75l-13.76-58.07,45-38.83A16.38,16.38,0,0,0,239.18,97.26Zm-15.34,8.56-45,38.83a8,8,0,0,0-2.56,7.91l13.76,58.07a.37.37,0,0,1-.17.48c-.18.14-.23.11-.38,0l-50.53-31.08a8,8,0,0,0-8.38,0L80.05,211a.37.37,0,0,1-.38,0,.37.37,0,0,1-.17-.48l13.76-58.07a8,8,0,0,0-2.56-7.91l-45-38.83c-.12-.1-.27-.35,0-.57l59-5.12a8,8,0,0,0,6.67-4.87l23.21-55.36c.08-.19.27-.3.47-.3s.39.11.47.3L158.67,95a8,8,0,0,0,6.67,4.87l59,5.12C224.57,105.09,224.43,105.36,223.84,105.82Z" fill="currentColor"/></svg>
          </span>
        </div>
        <svg class="chevron" width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M9 6l6 6-6 6" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
    </div>
  `,
  styles: `
    :host {
      display: block;
      font-family: var(--bzm-font-family);
    }

    .streak-banner {
      display: flex;
      align-items: center;
      justify-content: space-between;
      background-color: var(--bzm-color-accent);
      border: 4px solid var(--bzm-black);
      border-width: 3px 4px 5px 3px;
      border-radius: var(--bzm-radius-md);
      padding: var(--bzm-space-5) var(--bzm-space-6);
      box-shadow: var(--bzm-shadow-lg);
      cursor: pointer;
      transition:
        transform var(--bzm-transition-playful),
        box-shadow var(--bzm-transition-base);
      overflow: hidden;
      position: relative;
    }

    .streak-banner:hover {
      transform: translateY(-2px);
      box-shadow: var(--bzm-shadow-lg);
    }

    .streak-banner:active {
      transform: scale(0.98);
      box-shadow: var(--bzm-shadow-sm);
    }

    .streak-content {
      display: flex;
      flex-direction: column;
      gap: var(--bzm-space-0);
    }

    .streak-label {
      font-size: var(--bzm-font-size-sm);
      font-weight: var(--bzm-font-weight-semibold);
      color: var(--bzm-color-text-on-accent);
      opacity: 0.8;
      line-height: var(--bzm-line-height-tight);
    }

    .streak-count {
      font-size: var(--bzm-font-size-4xl);
      font-weight: var(--bzm-font-weight-black);
      color: var(--bzm-color-text-on-accent);
      line-height: var(--bzm-line-height-tight);
    }

    .streak-suffix {
      font-size: var(--bzm-font-size-lg);
      font-weight: var(--bzm-font-weight-bold);
      color: var(--bzm-color-text-on-accent);
      line-height: var(--bzm-line-height-tight);
    }

    .streak-action {
      display: flex;
      align-items: center;
      gap: var(--bzm-space-3);
    }

    .streak-illustration {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--bzm-space-1);
      font-size: 28px;
      line-height: 1;
    }

    .fire {
      color: var(--bzm-color-text-on-accent);
      animation: pulse 1.5s ease-in-out infinite;
      display: flex;
    }

    .star {
      color: var(--bzm-color-text-on-accent);
      animation: pulse 1.5s ease-in-out infinite 0.3s;
      display: flex;
    }

    .chevron {
      color: var(--bzm-color-text-on-accent);
      opacity: 0.6;
      flex-shrink: 0;
    }

    @keyframes pulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.15); }
    }
  `,
})
export class BzmStreakBannerComponent {
  readonly streakCount = input.required<number>();
}
