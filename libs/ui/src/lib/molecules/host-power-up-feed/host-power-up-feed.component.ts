import { Component, ChangeDetectionStrategy, input, computed } from '@angular/core';
import type { PowerUpType } from '../../atoms/power-up-card/power-up-card.component';

/** A single power-up activity event in the host feed. */
export interface PowerUpFeedItem {
  /** Unique identifier for this feed entry. */
  readonly id: string;
  /** Display name of the player who used the power-up. */
  readonly playerName: string;
  /** Display name of the power-up that was used. */
  readonly powerUpName: string;
  /** Phosphor icon name (without prefix). */
  readonly powerUpIcon: string;
  /** Category of the power-up. */
  readonly type: PowerUpType;
  /** Unix timestamp (ms) of when the event occurred. */
  readonly timestamp: number;
}

@Component({
  selector: 'bzm-host-power-up-feed',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="bzm-host-power-up-feed" role="log" aria-label="Power-up activiteiten" aria-live="polite">
      @for (item of visibleItems(); track item.id) {
        <div
          [class]="itemClasses(item.type)"
          [style.animation-delay]="($index * 0.08) + 's'"
        >
          <span class="bzm-host-power-up-feed__player">{{ item.playerName }}</span>
          <span class="bzm-host-power-up-feed__used">gebruikte</span>
          <span class="bzm-host-power-up-feed__power-up">
            <i [class]="'ph-duotone ph-' + item.powerUpIcon"></i>
            {{ item.powerUpName }}
          </span>
        </div>
      } @empty {
        <div class="bzm-host-power-up-feed__empty">
          <i class="ph-duotone ph-lightning-slash"></i>
          <span>Nog geen power-ups gebruikt</span>
        </div>
      }
    </div>
  `,
  styles: `
    :host {
      display: block;
      font-family: var(--bzm-font-family);
    }

    .bzm-host-power-up-feed {
      display: flex;
      flex-direction: column;
      gap: var(--bzm-space-2);
      padding: var(--bzm-space-3);
      background: rgba(255, 255, 255, 0.8);
      border: 4px solid var(--bzm-color-border);
      border-width: var(--bzm-border-width-comic);
      border-radius: var(--bzm-radius-md);
      box-shadow: var(--bzm-shadow-sm);
      backdrop-filter: blur(4px);
      min-width: 220px;
      max-width: 320px;
      overflow: hidden;
    }

    .bzm-host-power-up-feed__item {
      display: flex;
      align-items: center;
      gap: var(--bzm-space-2);
      padding: var(--bzm-space-2) var(--bzm-space-3);
      border-radius: var(--bzm-radius-sm);
      font-size: var(--bzm-font-size-sm);
      line-height: var(--bzm-line-height-snug);
      animation: bzm-feed-slide-in 0.3s var(--bzm-transition-playful) backwards;
    }

    .bzm-host-power-up-feed__item--chaos {
      background: var(--bzm-red-50);
      border-left: 3px solid var(--bzm-red-500);
    }

    .bzm-host-power-up-feed__item--boost {
      background: var(--bzm-green-50);
      border-left: 3px solid var(--bzm-green-500);
    }

    .bzm-host-power-up-feed__player {
      font-weight: var(--bzm-font-weight-extrabold);
      color: var(--bzm-color-text);
    }

    .bzm-host-power-up-feed__used {
      font-weight: var(--bzm-font-weight-regular);
      color: var(--bzm-color-text-muted);
    }

    .bzm-host-power-up-feed__power-up {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      font-weight: var(--bzm-font-weight-bold);
      color: var(--bzm-color-text);
    }

    .bzm-host-power-up-feed__item--chaos .bzm-host-power-up-feed__power-up i {
      color: var(--bzm-red-600);
    }

    .bzm-host-power-up-feed__item--boost .bzm-host-power-up-feed__power-up i {
      color: var(--bzm-green-600);
    }

    .bzm-host-power-up-feed__power-up i {
      font-size: 16px;
    }

    .bzm-host-power-up-feed__empty {
      display: flex;
      align-items: center;
      gap: var(--bzm-space-2);
      padding: var(--bzm-space-3);
      color: var(--bzm-color-text-muted);
      font-size: var(--bzm-font-size-sm);
      font-weight: var(--bzm-font-weight-semibold);
    }

    .bzm-host-power-up-feed__empty i {
      font-size: 18px;
    }

    @keyframes bzm-feed-slide-in {
      from {
        transform: translateY(-8px);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .bzm-host-power-up-feed__item {
        animation: bzm-feed-fade-in 0.2s ease backwards;
      }

      @keyframes bzm-feed-fade-in {
        from { opacity: 0; }
        to { opacity: 1; }
      }
    }
  `,
})
/**
 * Real-time activity feed of power-up usage shown on the host's screen.
 *
 * Renders a vertical list of events ("[Player] gebruikte [Icon + Name]") with type-based
 * color accents (red for chaos, green for boost). Items slide in from the right, older items
 * beyond `maxVisible` are hidden. Shows an empty state when no events exist.
 * Respects `prefers-reduced-motion`.
 *
 * @selector bzm-host-power-up-feed
 *
 * @example
 * ```html
 * <bzm-host-power-up-feed
 *   [items]="[{ id: '1', playerName: 'Bart', powerUpName: 'Scramble', powerUpIcon: 'shuffle', type: 'chaos', timestamp: Date.now() }]"
 *   [maxVisible]="4"
 * />
 * ```
 */
export class BzmHostPowerUpFeedComponent {
  /** Feed items sorted newest-first. */
  readonly items = input.required<PowerUpFeedItem[]>();

  /** Maximum number of items visible at once. @default 4 */
  readonly maxVisible = input<number>(4);

  protected readonly visibleItems = computed(() =>
    this.items().slice(0, this.maxVisible())
  );

  protected itemClasses(type: PowerUpType): string {
    return `bzm-host-power-up-feed__item bzm-host-power-up-feed__item--${type}`;
  }
}
