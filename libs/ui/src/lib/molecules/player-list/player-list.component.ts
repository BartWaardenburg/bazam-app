import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { BzmAvatarComponent } from '../../atoms/avatar/avatar.component';

/** Data shape for a single player entry in the player list. */
export interface PlayerListItem {
  /** Unique identifier for the player, used as a tracking key for rendering. */
  readonly id: string;
  /** Player's display name shown below their avatar. */
  readonly nickname: string;
  /** Optional point score displayed when `showScores` is enabled on the list. */
  readonly score?: number;
}

@Component({
  selector: 'bzm-player-list',
  standalone: true,
  imports: [BzmAvatarComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="bzm-player-list" role="list" [attr.aria-label]="ariaLabel()">
      @for (player of players(); track player.id) {
        <div
          class="bzm-player-list__item"
          role="listitem"
          [style.animation-delay]="($index * 0.06) + 's'"
        >
          <bzm-avatar [nickname]="player.nickname" size="md" />
          <span class="bzm-player-list__nickname">{{ player.nickname }}</span>
          @if (showScores() && player.score !== undefined) {
            <span class="bzm-player-list__score">{{ player.score }} pts</span>
          }
        </div>
      } @empty {
        <div class="bzm-player-list__empty">
          <p>{{ emptyText() }}</p>
        </div>
      }
    </div>
  `,
  styles: `
    :host {
      display: block;
      font-family: var(--bzm-font-family);
    }

    .bzm-player-list {
      display: flex;
      flex-wrap: wrap;
      gap: var(--bzm-space-5);
      justify-content: center;
    }

    .bzm-player-list__item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--bzm-space-2);
      padding: var(--bzm-space-3) var(--bzm-space-4);
      background: var(--bzm-color-surface);
      border-radius: var(--bzm-radius-sm);
      border: 4px solid var(--bzm-color-border);
      border-width: 3px 4px 4px 3px;
      box-shadow: var(--bzm-shadow-sm);
      transition: transform var(--bzm-transition-playful);
      animation: bzm-player-pop 0.3s var(--bzm-transition-playful) backwards;
    }

    .bzm-player-list__item:hover {
      transform: scale(1.08) rotate(-3deg);
    }

    .bzm-player-list__item:nth-child(even):hover {
      transform: scale(1.08) rotate(3deg);
    }

    .bzm-player-list__nickname {
      font-weight: var(--bzm-font-weight-bold);
      font-size: var(--bzm-font-size-sm);
      color: var(--bzm-color-text);
    }

    .bzm-player-list__score {
      font-family: var(--bzm-font-family);
      font-weight: var(--bzm-font-weight-extrabold);
      color: var(--bzm-color-accent-dark);
      font-size: var(--bzm-font-size-sm);
      letter-spacing: 0.04em;
    }

    .bzm-player-list__empty {
      text-align: center;
      padding: var(--bzm-space-4);
    }

    .bzm-player-list__empty p {
      color: var(--bzm-color-text-muted);
      font-weight: var(--bzm-font-weight-semibold);
      margin: var(--bzm-space-2) 0 0;
    }

    @keyframes bzm-player-pop {
      from {
        transform: scale(0);
        opacity: 0;
      }
      to {
        transform: scale(1);
        opacity: 1;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .bzm-player-list__item {
        animation: none;
        transition: none;
      }

      .bzm-player-list__item:hover,
      .bzm-player-list__item:nth-child(even):hover {
        transform: none;
      }
    }
  `,
})
/**
 * Renders a wrapping grid of player avatar cards with optional scores and a staggered pop-in animation.
 *
 * Displays each player as a card with an avatar and nickname in a centered flex-wrap layout.
 * Cards animate in with a staggered delay and tilt playfully on hover. Shows an empty-state
 * message when no players are present. Respects `prefers-reduced-motion`.
 *
 * @selector bzm-player-list
 *
 * @example
 * ```html
 * <bzm-player-list
 *   [players]="[{ id: '1', nickname: 'Bart', score: 500 }]"
 *   [showScores]="true"
 *   emptyText="Nog geen spelers..."
 * />
 * ```
 */
export class BzmPlayerListComponent {
  /** Array of player entries to render. Each player is displayed as an avatar card. */
  readonly players = input.required<PlayerListItem[]>();

  /** Whether to show point scores alongside each player's nickname. @default false */
  readonly showScores = input<boolean>(false);

  /** Text displayed when the players array is empty. @default 'Wachten op spelers...' */
  readonly emptyText = input<string>('Wachten op spelers...');

  /** Accessible label for the player list container. @default 'Spelers' */
  readonly ariaLabel = input<string>('Spelers');
}
