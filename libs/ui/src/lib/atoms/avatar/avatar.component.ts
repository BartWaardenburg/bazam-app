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
<i class="ph-duotone ph-lightning" style="font-size: 12px; vertical-align: middle; flex-shrink: 0;"></i>{{ streakBadge() }}
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
      bottom: -6px;
      right: -6px;
      border-radius: 3px;
      font-family: var(--bzm-font-family);
      font-weight: var(--bzm-font-weight-extrabold);
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 1px;
      border: 2px solid var(--bzm-black);
      border-width: 1.5px 2px 2px 1.5px;
      line-height: 1;
      box-shadow: var(--bzm-shadow-sm);
      white-space: nowrap;
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
      min-width: 18px;
      height: 18px;
      padding: 0 3px;
      font-size: 9px;
    }

    .badge-md {
      min-width: 22px;
      height: 22px;
      padding: 0 4px;
      font-size: 10px;
    }

    .badge-lg {
      min-width: 26px;
      height: 26px;
      padding: 0 4px;
      font-size: 11px;
    }

    .badge-xl {
      min-width: 30px;
      height: 30px;
      padding: 0 5px;
      font-size: 12px;
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
