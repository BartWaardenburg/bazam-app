import { Component, ChangeDetectionStrategy, input } from '@angular/core';

@Component({
  selector: 'bzm-stats-row',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="stats-row" role="group" aria-label="Player statistics">
      <div class="stat-card">
        <div class="stat-icon stat-icon--accent" aria-hidden="true">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 256 256"><path d="M56,56V96a72,72,0,0,0,144,0V56Z" opacity="0.2" fill="currentColor"/><path d="M232,64H208V56a16,16,0,0,0-16-16H64A16,16,0,0,0,48,56v8H24A16,16,0,0,0,8,80v8a56.06,56.06,0,0,0,48.44,55.47A72.12,72.12,0,0,0,112,183.13V200H96a8,8,0,0,0,0,16h64a8,8,0,0,0,0-16H144V183.13a72.12,72.12,0,0,0,55.56-39.66A56.06,56.06,0,0,0,248,88V80A16,16,0,0,0,232,64ZM24,88V80H48v24a71.63,71.63,0,0,0,1.68,15.41A40.06,40.06,0,0,1,24,88ZM128,168a56,56,0,0,1-56-56V56H184v56A56,56,0,0,1,128,168Zm104-80a40.06,40.06,0,0,1-25.68,31.41A71.63,71.63,0,0,0,208,104V80h24Z" fill="currentColor"/></svg>
        </div>
        <span class="stat-label">Level</span>
        <span class="stat-value">{{ level() }}</span>
      </div>

      <div class="stat-card">
        <div class="stat-icon stat-icon--primary" aria-hidden="true">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 256 256"><path d="M234.29,114.85l-45,38.83L203,211.75a16.4,16.4,0,0,1-24.5,17.82L128,198.49,77.47,229.57A16.4,16.4,0,0,1,53,211.75l13.76-58.07-45-38.83A16.46,16.46,0,0,1,31.08,91l59.46-5.15,23.21-55.36a16.4,16.4,0,0,1,28.5,0l23.21,55.36L224.92,91a16.46,16.46,0,0,1,9.37,23.85Z" opacity="0.2" fill="currentColor"/><path d="M239.18,97.26A16.38,16.38,0,0,0,224.92,86l-59-5.12L143.13,28.77a16.36,16.36,0,0,0-30.27,0L90.11,80.85,31.08,86a16.46,16.46,0,0,0-9.37,28.86l45,38.83L53,211.75a16.38,16.38,0,0,0,24.5,17.82L128,198.49l50.53,31.08A16.4,16.4,0,0,0,203,211.75l-13.76-58.07,45-38.83A16.38,16.38,0,0,0,239.18,97.26Zm-15.34,8.56-45,38.83a8,8,0,0,0-2.56,7.91l13.76,58.07a.37.37,0,0,1-.17.48c-.18.14-.23.11-.38,0l-50.53-31.08a8,8,0,0,0-8.38,0L80.05,211a.37.37,0,0,1-.38,0,.37.37,0,0,1-.17-.48l13.76-58.07a8,8,0,0,0-2.56-7.91l-45-38.83c-.12-.1-.27-.35,0-.57l59-5.12a8,8,0,0,0,6.67-4.87l23.21-55.36c.08-.19.27-.3.47-.3s.39.11.47.3L158.67,95a8,8,0,0,0,6.67,4.87l59,5.12C224.57,105.09,224.43,105.36,223.84,105.82Z" fill="currentColor"/></svg>
        </div>
        <span class="stat-label">Points</span>
        <span class="stat-value">{{ points() }}</span>
      </div>
    </div>
  `,
  styles: `
    :host {
      display: block;
      font-family: var(--bzm-font-family);
    }

    .stats-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: var(--bzm-space-4);
    }

    .stat-card {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--bzm-space-2);
      padding: var(--bzm-space-5) var(--bzm-space-4);
      background-color: var(--bzm-color-surface);
      border: 4px solid var(--bzm-black);
      border-width: 3px 4px 4px 3px;
      border-radius: var(--bzm-radius-md);
      box-shadow: var(--bzm-shadow-card);
      transition:
        transform var(--bzm-transition-playful),
        box-shadow var(--bzm-transition-base);
    }

    .stat-card:hover {
      transform: translateY(-2px);
      box-shadow: var(--bzm-shadow-lg);
    }

    .stat-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      border-radius: 3px;
      border: 3px solid var(--bzm-black);
      border-width: 2px 3px 3px 2px;
    }

    .stat-icon--accent {
      background-color: var(--bzm-color-accent);
      color: var(--bzm-color-text-on-accent);
    }

    .stat-icon--primary {
      background-color: var(--bzm-color-primary);
      color: var(--bzm-color-text-on-primary);
    }

    .stat-label {
      font-size: var(--bzm-font-size-xs);
      font-weight: var(--bzm-font-weight-semibold);
      color: var(--bzm-color-text-muted);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .stat-value {
      font-size: var(--bzm-font-size-xl);
      font-weight: var(--bzm-font-weight-extrabold);
      color: var(--bzm-color-text);
      line-height: var(--bzm-line-height-tight);
    }
  `,
})
export class BzmStatsRowComponent {
  readonly level = input.required<string>();
  readonly points = input.required<number>();
}
