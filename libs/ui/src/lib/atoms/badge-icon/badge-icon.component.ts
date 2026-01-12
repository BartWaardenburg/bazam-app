import { Component, ChangeDetectionStrategy, input } from '@angular/core';

@Component({
  selector: 'bzm-badge-icon',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="badge-container">
      <div class="badge-shape" [class.locked]="locked()">
        @if (iconUrl()) {
          <img
            class="badge-image"
            [src]="iconUrl()"
            [alt]="label()"
          />
        } @else {
          <span class="badge-placeholder">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 256 256"><path d="M234.29,114.85l-45,38.83L203,211.75a16.4,16.4,0,0,1-24.5,17.82L128,198.49,77.47,229.57A16.4,16.4,0,0,1,53,211.75l13.76-58.07-45-38.83A16.46,16.46,0,0,1,31.08,91l59.46-5.15,23.21-55.36a16.4,16.4,0,0,1,28.5,0l23.21,55.36L224.92,91a16.46,16.46,0,0,1,9.37,23.85Z" opacity="0.2" fill="currentColor"/><path d="M239.18,97.26A16.38,16.38,0,0,0,224.92,86l-59-5.12L143.13,28.77a16.36,16.36,0,0,0-30.27,0L90.11,80.85,31.08,86a16.46,16.46,0,0,0-9.37,28.86l45,38.83L53,211.75a16.38,16.38,0,0,0,24.5,17.82L128,198.49l50.53,31.08A16.4,16.4,0,0,0,203,211.75l-13.76-58.07,45-38.83A16.38,16.38,0,0,0,239.18,97.26Zm-15.34,8.56-45,38.83a8,8,0,0,0-2.56,7.91l13.76,58.07a.37.37,0,0,1-.17.48c-.18.14-.23.11-.38,0l-50.53-31.08a8,8,0,0,0-8.38,0L80.05,211a.37.37,0,0,1-.38,0,.37.37,0,0,1-.17-.48l13.76-58.07a8,8,0,0,0-2.56-7.91l-45-38.83c-.12-.1-.27-.35,0-.57l59-5.12a8,8,0,0,0,6.67-4.87l23.21-55.36c.08-.19.27-.3.47-.3s.39.11.47.3L158.67,95a8,8,0,0,0,6.67,4.87l59,5.12C224.57,105.09,224.43,105.36,223.84,105.82Z" fill="currentColor"/></svg>
          </span>
        }

        @if (locked()) {
          <div class="lock-overlay">
            <span class="lock-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 256 256"><path d="M208,88H48V176a8,8,0,0,0,8,8H200a8,8,0,0,0,8-8Z" opacity="0.2" fill="currentColor"/><path d="M208,80H176V56a48,48,0,0,0-96,0V80H48A16,16,0,0,0,32,96v80a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V96A16,16,0,0,0,208,80ZM96,56a32,32,0,0,1,64,0V80H96ZM208,176H48V96H208v80Zm-68-44a12,12,0,1,1-12-12A12,12,0,0,1,140,132Z" fill="currentColor"/></svg>
            </span>
          </div>
        }
      </div>
      <span class="badge-label" [class.locked-label]="locked()">
        {{ label() }}
      </span>
    </div>
  `,
  styles: `
    :host {
      display: inline-block;
      font-family: var(--bzm-font-family);
    }

    .badge-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--bzm-space-2);
      width: 80px;
    }

    .badge-shape {
      position: relative;
      width: 64px;
      height: 64px;
      border-radius: 3px;
      background: var(--bzm-red-50);
      border: 3px solid var(--bzm-black);
      border-width: 2px 3px 3px 2px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: var(--bzm-shadow-card);
      overflow: hidden;
      transition:
        filter var(--bzm-transition-base),
        opacity var(--bzm-transition-base);
    }

    .badge-shape.locked {
      filter: grayscale(1);
      opacity: 0.6;
      box-shadow: none;
    }

    .badge-image {
      width: 40px;
      height: 40px;
      object-fit: contain;
    }

    .badge-placeholder {
      color: var(--bzm-color-primary);
      line-height: 1;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .lock-overlay {
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: var(--bzm-gray-200);
    }

    .lock-icon {
      color: var(--bzm-gray-600);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .badge-label {
      font-size: var(--bzm-font-size-xs);
      font-weight: var(--bzm-font-weight-bold);
      color: var(--bzm-color-text);
      text-align: center;
      line-height: var(--bzm-line-height-tight);
      max-width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .locked-label {
      color: var(--bzm-color-text-muted);
    }
  `,
})
export class BzmBadgeIconComponent {
  readonly iconUrl = input<string | undefined>(undefined);
  readonly label = input.required<string>();
  readonly locked = input<boolean>(false);
}
