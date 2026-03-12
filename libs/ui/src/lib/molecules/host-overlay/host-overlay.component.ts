import { Component, ChangeDetectionStrategy, input, computed } from '@angular/core';

/** Data shape for a single overlay stat message. */
export interface OverlayStat {
  readonly id: string;
  readonly message: string;
  readonly icon?: string;
  readonly type: 'streak' | 'nobody' | 'everyone' | 'highlight' | 'record';
}

/** Position options for the overlay panel. */
export type OverlayPosition = 'top-right' | 'bottom-left' | 'bottom-right';

const STAT_COLORS: Record<OverlayStat['type'], string> = {
  streak: '#f97316',
  nobody: '#ef4444',
  everyone: '#22c55e',
  highlight: '#eab308',
  record: '#a855f7',
};

const STAT_ICONS: Record<OverlayStat['type'], string> = {
  streak: 'fire',
  nobody: 'skull',
  everyone: 'confetti',
  highlight: 'star',
  record: 'trophy',
};

@Component({
  selector: 'bzm-host-overlay',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div [class]="containerClasses()" role="log" aria-live="polite" aria-label="Spelstatistieken">
      @for (stat of visibleStats(); track stat.id; let i = $index) {
        <div
          class="bzm-host-overlay__stat"
          [style]="statStyle(stat)"
          [style.animation-delay]="(i * 0.15) + 's'"
        >
          <i [class]="'ph-duotone ph-' + resolveIcon(stat)" style="font-size: 18px;"></i>
          <span class="bzm-host-overlay__message">{{ stat.message }}</span>
        </div>
      }
    </div>
  `,
  styles: `
    :host {
      display: block;
      font-family: var(--bzm-font-family);
      pointer-events: none;
    }

    .bzm-host-overlay {
      display: flex;
      flex-direction: column;
      gap: var(--bzm-space-2);
      max-width: 320px;
    }

    .bzm-host-overlay--top-right {
      align-items: flex-end;
    }

    .bzm-host-overlay--bottom-left {
      align-items: flex-start;
    }

    .bzm-host-overlay--bottom-right {
      align-items: flex-end;
    }

    .bzm-host-overlay__stat {
      display: flex;
      align-items: center;
      gap: var(--bzm-space-2);
      padding: var(--bzm-space-2) var(--bzm-space-4);
      background: rgba(0, 0, 0, 0.75);
      backdrop-filter: blur(8px);
      border: 4px solid var(--bzm-color-border);
      border-width: var(--bzm-border-width-comic);
      border-radius: 9999px;
      box-shadow: var(--bzm-shadow-md);
      pointer-events: auto;
      animation: bzm-stat-slide-in 0.4s var(--bzm-transition-playful) backwards;
    }

    .bzm-host-overlay__message {
      font-size: var(--bzm-font-size-sm);
      font-weight: var(--bzm-font-weight-bold);
      color: var(--bzm-white);
      white-space: nowrap;
    }

    @keyframes bzm-stat-slide-in {
      from {
        opacity: 0;
        transform: translateX(-20px);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }

    .bzm-host-overlay--top-right .bzm-host-overlay__stat,
    .bzm-host-overlay--bottom-right .bzm-host-overlay__stat {
      animation-name: bzm-stat-slide-in-right;
    }

    @keyframes bzm-stat-slide-in-right {
      from {
        opacity: 0;
        transform: translateX(20px);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .bzm-host-overlay__stat {
        animation: none;
      }
    }
  `,
})
/**
 * Displays a positioned overlay panel of live commentary stats during gameplay
 * on the host screen. Each stat appears as a comic-bordered pill with a
 * type-specific icon and color accent. Stats animate in from the side and stack
 * vertically. Intended for absolute/fixed positioning by the parent container.
 *
 * @selector bzm-host-overlay
 *
 * @example
 * ```html
 * <bzm-host-overlay
 *   [stats]="liveStats"
 *   position="bottom-left"
 *   [maxVisible]="3"
 * />
 * ```
 */
export class BzmHostOverlayComponent {
  /** Stats to display in the overlay. */
  readonly stats = input.required<OverlayStat[]>();

  /**
   * Position hint for the overlay panel.
   * @default 'bottom-left'
   */
  readonly position = input<OverlayPosition>('bottom-left');

  /**
   * Maximum number of visible stat pills at once.
   * @default 3
   */
  readonly maxVisible = input<number>(3);

  /** The stats limited to the configured maximum. */
  protected readonly visibleStats = computed(() =>
    this.stats().slice(0, this.maxVisible())
  );

  /** Computes CSS classes for the container based on position. */
  protected readonly containerClasses = computed(() =>
    `bzm-host-overlay bzm-host-overlay--${this.position()}`
  );

  /** Returns inline style with the stat's accent color for the border. */
  protected statStyle(stat: OverlayStat): string {
    const color = STAT_COLORS[stat.type];
    return `border-color: ${color}; color: ${color}`;
  }

  /** Resolves the icon name — uses the stat's own icon or falls back to the type default. */
  protected resolveIcon(stat: OverlayStat): string {
    return stat.icon ?? STAT_ICONS[stat.type];
  }
}
