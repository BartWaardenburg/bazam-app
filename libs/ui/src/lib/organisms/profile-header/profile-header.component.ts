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
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
          <path d="M14 4L4 14M4 4l10 10" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
        </svg>
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
export class BzmProfileHeaderComponent {
  readonly name = input.required<string>();
  readonly username = input.required<string>();
  readonly avatarUrl = input<string | undefined>(undefined);

  readonly closeClick = output<void>();
}
