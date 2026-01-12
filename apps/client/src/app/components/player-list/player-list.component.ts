import { Component, input } from '@angular/core';
import { BzmAvatarComponent } from '@bazam/ui';
import type { PlayerInfo } from '@bazam/shared-types';

@Component({
  selector: 'app-player-list',
  imports: [BzmAvatarComponent],
  template: `
    <div class="player-list">
      @for (player of players(); track player.id) {
        <div class="player-item animate-scale" [style.animation-delay]="($index * 0.06) + 's'">
          <bzm-avatar [nickname]="player.nickname" size="md" />
          <span class="nickname">{{ player.nickname }}</span>
          @if (showScores()) {
            <span class="score">{{ player.score }} pts</span>
          }
        </div>
      }
      @empty {
        <div class="empty">
          <span class="empty-icon"></span>
          <p>Wachten op spelers...</p>
        </div>
      }
    </div>
  `,
  styles: `
    .player-list {
      display: flex;
      flex-wrap: wrap;
      gap: 1.25rem;
      justify-content: center;
    }

    .player-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1rem;
      background: var(--color-surface-light);
      border-radius: 2px;
      border: 4px solid var(--color-border);
      border-width: 3px 4px 4px 3px;
      box-shadow: 4px 4px 0 var(--color-outline);

      transition: transform 0.3s var(--timing-playful);

      &:hover {
        transform: scale(1.08) rotate(-3deg);
      }

      &:nth-child(even):hover {
        transform: scale(1.08) rotate(3deg);
      }
    }

    .nickname {
      font-weight: 700;
      font-size: 0.9rem;
      color: var(--color-text);
    }

    .score {
      font-family: var(--font-heading);
      color: var(--color-accent);
      font-size: 0.9rem;
      letter-spacing: 0.04em;
    }

    .empty {
      text-align: center;
      padding: 1rem;
    }

    .empty-icon {
      font-size: 2.5rem;
      filter: drop-shadow(2px 2px 0 #000);
    }

    .empty p {
      color: var(--color-text-muted);
      font-weight: 600;
      margin-top: 0.5rem;
    }
  `,
})
export class PlayerListComponent {
  readonly players = input.required<PlayerInfo[]>();
  readonly showScores = input<boolean>(false);
}
