import { Component, ChangeDetectionStrategy, input, output, computed } from '@angular/core';
import { BzmAvatarComponent } from '../../atoms/avatar/avatar.component';

export interface FriendEntry {
  readonly nickname: string;
  readonly avatarUrl?: string;
}

@Component({
  selector: 'bzm-friend-row',
  standalone: true,
  imports: [BzmAvatarComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="friend-row">
      <div class="friend-row-header">
        <span class="friend-row-title">My Friends</span>
        <button
          class="friend-row-see-all"
          type="button"
          (click)="seeAllClick.emit()"
        >
          See All
        </button>
      </div>

      <div class="friend-row-avatars">
        @for (friend of visibleFriends(); track friend.nickname) {
          <div class="friend-avatar-wrapper">
            <bzm-avatar
              [imageUrl]="friend.avatarUrl"
              [nickname]="friend.nickname"
              size="md"
            />
          </div>
        }

        @if (overflowCount() > 0) {
          <div class="friend-avatar-wrapper">
            <div class="friend-overflow">
              <span class="friend-overflow-text">+{{ overflowCount() }}</span>
            </div>
          </div>
        }
      </div>
    </div>
  `,
  styles: `
    :host {
      display: block;
      font-family: var(--bzm-font-family);
    }

    .friend-row {
      display: flex;
      flex-direction: column;
      gap: var(--bzm-space-3);
    }

    .friend-row-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .friend-row-title {
      font-size: var(--bzm-font-size-base);
      font-weight: var(--bzm-font-weight-extrabold);
      color: var(--bzm-color-text);
    }

    .friend-row-see-all {
      border: none;
      background: transparent;
      font-family: var(--bzm-font-family);
      font-size: var(--bzm-font-size-sm);
      font-weight: var(--bzm-font-weight-bold);
      color: var(--bzm-color-primary);
      cursor: pointer;
      padding: var(--bzm-space-1) var(--bzm-space-2);
      border-radius: var(--bzm-radius-sm);
      transition:
        background-color var(--bzm-transition-base),
        transform var(--bzm-transition-playful);
    }

    .friend-row-see-all:hover {
      background-color: var(--bzm-color-surface);
      transform: translateX(2px);
    }

    .friend-row-avatars {
      display: flex;
      align-items: center;
      gap: var(--bzm-space-2);
      overflow-x: auto;
      padding: var(--bzm-space-2) var(--bzm-space-1) var(--bzm-space-3);
      margin: calc(var(--bzm-space-2) * -1) calc(var(--bzm-space-1) * -1) calc(var(--bzm-space-3) * -1);
      scrollbar-width: none;
      -ms-overflow-style: none;
    }

    .friend-row-avatars::-webkit-scrollbar {
      display: none;
    }

    .friend-avatar-wrapper {
      flex-shrink: 0;
      display: flex;
      align-items: center;
      transition: transform var(--bzm-transition-playful);
    }

    .friend-avatar-wrapper:hover {
      transform: translateY(-4px) scale(1.1);
      z-index: 1;
    }

    .friend-overflow {
      width: 40px;
      height: 40px;
      border-radius: 3px;
      background-color: var(--bzm-color-surface);
      border: 3px solid var(--bzm-black);
      border-width: 2px 3px 3px 2px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: var(--bzm-shadow-sm);
    }

    .friend-overflow-text {
      font-size: var(--bzm-font-size-xs);
      font-weight: var(--bzm-font-weight-extrabold);
      color: var(--bzm-color-primary);
    }
  `,
})
export class BzmFriendRowComponent {
  readonly friends = input.required<FriendEntry[]>();
  readonly maxVisible = input<number>(6);

  readonly seeAllClick = output<void>();

  protected readonly visibleFriends = computed(() =>
    this.friends().slice(0, this.maxVisible())
  );

  protected readonly overflowCount = computed(() => {
    const total = this.friends().length;
    const max = this.maxVisible();
    return total > max ? total - max : 0;
  });
}
