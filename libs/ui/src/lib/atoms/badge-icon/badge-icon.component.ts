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
<i class="ph-duotone ph-star" style="font-size: 32px;"></i>
          </span>
        }

        @if (locked()) {
          <div class="lock-overlay">
            <span class="lock-icon">
<i class="ph-duotone ph-lock" style="font-size: 20px;"></i>
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
/**
 * Displays an achievement badge with an icon or star placeholder, a label, and an optional locked overlay.
 *
 * When locked, the badge is desaturated and dimmed with a lock icon overlay. Use this component
 * to represent unlockable achievements, rewards, or collectible items in player profiles.
 *
 * @selector bzm-badge-icon
 *
 * @example
 * ```html
 * <bzm-badge-icon label="Quiz Master" [iconUrl]="badge.icon" />
 * <bzm-badge-icon label="Perfectionist" [locked]="true" />
 * ```
 */
export class BzmBadgeIconComponent {
  /**
   * Optional URL for the badge icon image. Falls back to a star placeholder when not provided.
   * @default undefined
   */
  readonly iconUrl = input<string | undefined>(undefined);

  /** Descriptive label displayed below the badge icon. Also used as the image alt text. */
  readonly label = input.required<string>();

  /**
   * Applies a greyscale locked overlay with a lock icon, indicating the badge has not been earned yet.
   * @default false
   */
  readonly locked = input<boolean>(false);
}
