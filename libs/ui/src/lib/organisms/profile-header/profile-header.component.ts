import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { BzmAvatarComponent } from '../../atoms/avatar/avatar.component';

@Component({
  selector: 'bzm-profile-header',
  standalone: true,
  imports: [BzmAvatarComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="profile-header" role="banner">
      <button
        class="close-btn"
        type="button"
        aria-label="Close profile"
        (click)="closeClick.emit()"
      >
<i class="ph-duotone ph-x" aria-hidden="true" style="font-size: 18px;"></i>
      </button>

      <div class="profile-content">
        <bzm-avatar
          [imageUrl]="avatarUrl()"
          [nickname]="name()"
          size="xl"
        />
        <div class="profile-info">
          <span class="profile-name">{{ name() }}</span>
          <span class="profile-username">{{ username() }}</span>
        </div>
      </div>

      <div class="halftone" aria-hidden="true"></div>
    </header>
  `,
  styles: `
    :host {
      display: block;
      font-family: var(--bzm-font-family);
    }

    .profile-header {
      position: relative;
      background: var(--bzm-color-primary);
      border: 4px solid var(--bzm-black);
      border-width: 3px 4px 5px 3px;
      border-radius: var(--bzm-radius-md);
      padding: var(--bzm-space-6) var(--bzm-space-6) var(--bzm-space-8);
      min-height: 140px;
      display: flex;
      align-items: flex-end;
      box-shadow: var(--bzm-shadow-lg);
      overflow: hidden;
    }

    .close-btn {
      position: absolute;
      top: var(--bzm-space-3);
      right: var(--bzm-space-3);
      width: 32px;
      height: 32px;
      border-radius: var(--bzm-radius-md);
      border: 3px solid var(--bzm-black);
      border-width: 2px 3px 3px 2px;
      background: var(--bzm-color-surface);
      color: var(--bzm-color-text);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      box-shadow: var(--bzm-shadow-sm);
      transition:
        transform var(--bzm-transition-playful),
        box-shadow var(--bzm-transition-base);
      z-index: 1;
      padding: 0;
    }

    .close-btn:hover {
      transform: translateY(-2px) rotate(-3deg);
      box-shadow: var(--bzm-shadow-md);
    }

    .close-btn:active {
      transform: translateY(3px);
      box-shadow: none;
    }

    .profile-content {
      display: flex;
      align-items: center;
      gap: var(--bzm-space-4);
      position: relative;
      z-index: 1;
    }

    .profile-info {
      display: flex;
      flex-direction: column;
      gap: var(--bzm-space-1);
    }

    .profile-name {
      font-size: var(--bzm-font-size-2xl);
      font-weight: var(--bzm-font-weight-black);
      color: var(--bzm-color-text-on-primary);
      line-height: var(--bzm-line-height-tight);
      text-transform: uppercase;
      letter-spacing: 0.02em;
    }

    .profile-username {
      font-size: var(--bzm-font-size-sm);
      font-weight: var(--bzm-font-weight-bold);
      color: var(--bzm-yellow-300);
    }

    .halftone {
      position: absolute;
      inset: 0;
      background:
        radial-gradient(circle, var(--bzm-black) 1.2px, transparent 1.6px);
      background-size: 10px 10px;
      opacity: 0.08;
      mask-image: linear-gradient(135deg, transparent 30%, black 100%);
      -webkit-mask-image: linear-gradient(135deg, transparent 30%, black 100%);
    }
  `,
})
/**
 * Displays a profile header banner with the user's avatar, display name,
 * username, and a close button, over a decorative halftone background.
 *
 * Typically placed at the top of a profile or settings panel. The close
 * button emits an event so the parent can handle dismissal.
 *
 * @selector bzm-profile-header
 *
 * @example
 * ```html
 * <bzm-profile-header
 *   name="Bart"
 *   username="@bartw"
 *   [avatarUrl]="user.avatarUrl"
 *   (closeClick)="closeProfile()"
 * />
 * ```
 */
export class BzmProfileHeaderComponent {
  /** Display name shown prominently in the header. */
  readonly name = input.required<string>();

  /** Username shown below the display name, typically prefixed with @. */
  readonly username = input.required<string>();

  /**
   * URL of the user's avatar image. Falls back to an initial-based avatar when not provided.
   * @default undefined
   */
  readonly avatarUrl = input<string | undefined>(undefined);

  /** Emits when the user clicks the close button in the top-right corner. */
  readonly closeClick = output<void>();
}
