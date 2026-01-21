import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { BzmAvatarComponent } from '../../atoms/avatar/avatar.component';

export interface PlayerListItem {
  readonly id: string;
  readonly nickname: string;
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
export class BzmPlayerListComponent {
  readonly players = input.required<PlayerListItem[]>();
  readonly showScores = input<boolean>(false);
  readonly emptyText = input<string>('Wachten op spelers...');
  readonly ariaLabel = input<string>('Spelers');
}
