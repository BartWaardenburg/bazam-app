import { Component, ChangeDetectionStrategy, input, computed } from '@angular/core';

export type AvatarSize = 'sm' | 'md' | 'lg' | 'xl';

const SIZE_MAP: Record<AvatarSize, number> = {
  sm: 32,
  md: 40,
  lg: 52,
  xl: 68,
};

const AVATAR_COLORS = [
  'var(--bzm-red-500)',
  'var(--bzm-yellow-400)',
  'var(--bzm-green-500)',
  'var(--bzm-cyan-500)',
  'var(--bzm-red-300)',
  'var(--bzm-green-600)',
  'var(--bzm-yellow-500)',
  'var(--bzm-cyan-600)',
];

const hashString = (str: string): number => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
    hash |= 0;
  }
  return Math.abs(hash);
};

@Component({
  selector: 'bzm-avatar',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="avatar-wrapper" [style.width.px]="sizePx()" [style.height.px]="sizePx()">
      @if (imageUrl()) {
        <img
          class="avatar-image"
          [src]="imageUrl()"
          [alt]="nickname()"
          [style.width.px]="sizePx()"
          [style.height.px]="sizePx()"
        />
      } @else {
        <div
          class="avatar-initials"
          [style.width.px]="sizePx()"
          [style.height.px]="sizePx()"
          [style.background-color]="bgColor()"
          [style.font-size.px]="initialsFontSize()"
        >
          {{ initials() }}
        </div>
      }

      @if (rankBadge() !== undefined) {
        <span class="badge badge-rank" [class]="badgeSizeClass()">
          {{ rankBadge() }}
        </span>
      }

      @if (streakBadge() !== undefined && rankBadge() === undefined) {
        <span class="badge badge-streak" [class]="badgeSizeClass()">
          <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 256 256" style="vertical-align: middle; margin-right: 1px;"><path d="M96,240l16-80L40,136l120-120L144,96l72,24Z" opacity="0.2" fill="currentColor"/><path d="M215.79,118.17a8,8,0,0,0-5-5.66L153.18,90.9l14.66-73.33a8,8,0,0,0-13.69-7l-112,120a8,8,0,0,0,3,13l57.63,21.61L88.16,238.43a8,8,0,0,0,13.69,7l112-120A8,8,0,0,0,215.79,118.17ZM109.37,214l10.47-52.38a8,8,0,0,0-5-9.06L62,132.71l84.62-90.66L136.16,94.43a8,8,0,0,0,5,9.06l52.8,19.8Z" fill="currentColor"/></svg>{{ streakBadge() }}
        </span>
      }
    </div>
  `,
  styles: `
    :host {
      display: inline-flex;
      font-family: var(--bzm-font-family);
    }

    .avatar-wrapper {
      position: relative;
      display: inline-flex;
      flex-shrink: 0;
    }

    .avatar-image {
      border-radius: 3px;
      object-fit: cover;
      background-color: var(--bzm-color-surface);
      border: 3px solid var(--bzm-black);
      border-width: 2px 3px 3px 2px;
      box-shadow: var(--bzm-shadow-sm);
    }

    .avatar-initials {
      border-radius: 3px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--bzm-color-text-on-primary);
      font-weight: var(--bzm-font-weight-extrabold);
      font-family: var(--bzm-font-family);
      border: 3px solid var(--bzm-black);
      border-width: 2px 3px 3px 2px;
      box-shadow: var(--bzm-shadow-sm);
      text-transform: uppercase;
      line-height: 1;
    }

    .badge {
      position: absolute;
      bottom: -4px;
      right: -4px;
      border-radius: 3px;
      font-family: var(--bzm-font-family);
      font-weight: var(--bzm-font-weight-extrabold);
      display: flex;
      align-items: center;
      justify-content: center;
      border: 2px solid var(--bzm-black);
      border-width: 1.5px 2px 2px 1.5px;
      line-height: 1;
      box-shadow: var(--bzm-shadow-sm);
    }

    .badge-rank {
      background-color: var(--bzm-color-accent);
      color: var(--bzm-color-text-on-accent);
    }

    .badge-streak {
      background-color: var(--bzm-color-success);
      color: var(--bzm-color-text-on-primary);
    }

    .badge-sm {
      width: 16px;
      height: 16px;
      font-size: 8px;
    }

    .badge-md {
      width: 18px;
      height: 18px;
      font-size: 9px;
    }

    .badge-lg {
      width: 22px;
      height: 22px;
      font-size: 10px;
    }

    .badge-xl {
      width: 26px;
      height: 26px;
      font-size: 11px;
    }
  `,
})
export class BzmAvatarComponent {
  readonly nickname = input.required<string>();
  readonly imageUrl = input<string | undefined>(undefined);
  readonly size = input<AvatarSize>('md');
  readonly rankBadge = input<number | undefined>(undefined);
  readonly streakBadge = input<number | undefined>(undefined);

  protected readonly sizePx = computed(() => SIZE_MAP[this.size()]);

  protected readonly initials = computed(() => {
    const name = this.nickname();
    if (!name) return '?';
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return parts[0][0] + parts[1][0];
    }
    return name.slice(0, 2);
  });

  protected readonly bgColor = computed(
    () => AVATAR_COLORS[hashString(this.nickname()) % AVATAR_COLORS.length]
  );

  protected readonly initialsFontSize = computed(() => {
    const px = SIZE_MAP[this.size()];
    return Math.round(px * 0.36);
  });

  protected readonly badgeSizeClass = computed(() => `badge-${this.size()}`);
}
