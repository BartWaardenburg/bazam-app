import { Component, ChangeDetectionStrategy, input, output, computed, signal } from '@angular/core';

/** A selectable reaction emoji with a display label. */
export interface ReactionOption {
  readonly emoji: string;
  readonly label: string;
}

/** Default curated set of safe emoji reactions. */
const DEFAULT_REACTIONS: readonly ReactionOption[] = [
  { emoji: '🎉', label: 'Feest' },
  { emoji: '😮', label: 'Wauw' },
  { emoji: '🔥', label: 'Fire' },
  { emoji: '👏', label: 'Applaus' },
  { emoji: '😂', label: 'Haha' },
  { emoji: '💪', label: 'Sterk' },
  { emoji: '⭐', label: 'Ster' },
  { emoji: '🏆', label: 'Kampioen' },
] as const;

@Component({
  selector: 'bzm-reaction-picker',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="bzm-reaction-picker" role="group" aria-label="Reacties kiezen">
      @if (isDisabled()) {
        <div class="bzm-reaction-picker__cooldown" aria-live="polite" aria-atomic="true">
          <span class="bzm-reaction-picker__cooldown-text">{{ cooldownSeconds() }}s</span>
        </div>
      }
      <div class="bzm-reaction-picker__list" [class.bzm-reaction-picker__list--disabled]="isDisabled()">
        @for (reaction of reactions(); track reaction.emoji) {
          <button
            class="bzm-reaction-picker__btn"
            [class.bzm-reaction-picker__btn--pressed]="pressedEmoji() === reaction.emoji"
            [disabled]="isDisabled()"
            [attr.aria-label]="reaction.label"
            [title]="reaction.label"
            (click)="onReactionClick(reaction.emoji)"
          >
            <span class="bzm-reaction-picker__emoji">{{ reaction.emoji }}</span>
          </button>
        }
      </div>
    </div>
  `,
  styles: `
    :host {
      display: block;
      font-family: var(--bzm-font-family);
    }

    .bzm-reaction-picker {
      position: relative;
    }

    .bzm-reaction-picker__list {
      display: flex;
      gap: var(--bzm-space-2, 8px);
      overflow-x: auto;
      padding: var(--bzm-space-2, 8px) var(--bzm-space-1, 4px);
      scrollbar-width: none;
      -ms-overflow-style: none;
    }

    .bzm-reaction-picker__list::-webkit-scrollbar {
      display: none;
    }

    .bzm-reaction-picker__list--disabled {
      opacity: 0.5;
      pointer-events: none;
    }

    .bzm-reaction-picker__btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 48px;
      height: 48px;
      border: 4px solid var(--bzm-color-border, var(--bzm-black));
      border-width: var(--bzm-border-width-comic);
      border-radius: 50%;
      background: var(--bzm-white, #fff);
      cursor: pointer;
      flex-shrink: 0;
      transition:
        transform var(--bzm-transition-playful, 0.2s cubic-bezier(0.68, -0.55, 0.265, 1.55)),
        box-shadow var(--bzm-transition-base, 0.2s ease);
      box-shadow: var(--bzm-shadow-sm);
      -webkit-tap-highlight-color: transparent;
    }

    .bzm-reaction-picker__btn:hover:not(:disabled) {
      transform: scale(1.15) translateY(-2px);
      box-shadow: var(--bzm-shadow-md);
    }

    .bzm-reaction-picker__btn:active:not(:disabled) {
      transform: scale(0.95);
      box-shadow: none;
    }

    .bzm-reaction-picker__btn--pressed {
      animation: bzm-reaction-pop 0.3s ease-out;
    }

    .bzm-reaction-picker__btn:disabled {
      cursor: not-allowed;
      opacity: 0.4;
    }

    .bzm-reaction-picker__emoji {
      font-size: 22px;
      line-height: 1;
      user-select: none;
    }

    .bzm-reaction-picker__cooldown {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      z-index: 1;
      background: var(--bzm-color-surface, #fff);
      border: 4px solid var(--bzm-color-border, var(--bzm-black));
      border-width: var(--bzm-border-width-comic);
      border-radius: var(--bzm-radius-md, 8px);
      padding: var(--bzm-space-2, 8px) var(--bzm-space-4, 16px);
      box-shadow: var(--bzm-shadow-md);
    }

    .bzm-reaction-picker__cooldown-text {
      font-size: var(--bzm-font-size-sm, 0.875rem);
      font-weight: var(--bzm-font-weight-bold, 700);
      color: var(--bzm-color-text-secondary);
    }

    @keyframes bzm-reaction-pop {
      0% { transform: scale(1); }
      50% { transform: scale(1.3); }
      100% { transform: scale(1); }
    }

    @media (prefers-reduced-motion: reduce) {
      .bzm-reaction-picker__btn {
        transition: none;
      }

      .bzm-reaction-picker__btn--pressed {
        animation: none;
      }

      .bzm-reaction-picker__btn:hover:not(:disabled) {
        transform: scale(1.05);
      }
    }
  `,
})
/**
 * Emoji reaction picker shown during the leaderboard phase for players to send reactions.
 *
 * Displays a horizontally scrollable row of emoji buttons. Tapping a button emits the
 * selected emoji and briefly scales the button as confirmation. Supports a disabled
 * state with a cooldown timer overlay for rate limiting.
 *
 * @selector bzm-reaction-picker
 *
 * @example
 * ```html
 * <bzm-reaction-picker (reactionSelected)="onReaction($event)" />
 * <bzm-reaction-picker [disabled]="true" [cooldownSeconds]="3" />
 * ```
 */
export class BzmReactionPickerComponent {
  /** Available reaction options. Defaults to a curated set of safe emojis. */
  readonly reactions = input<readonly ReactionOption[]>(DEFAULT_REACTIONS);

  /** Whether the picker is disabled (rate-limited). @default false */
  readonly disabled = input<boolean>(false);

  /** Cooldown seconds shown when disabled. @default 0 */
  readonly cooldownSeconds = input<number>(0);

  /** Emits the selected emoji character when a reaction button is tapped. */
  readonly reactionSelected = output<string>();

  protected readonly pressedEmoji = signal<string | null>(null);

  protected readonly isDisabled = computed(() => this.disabled() || this.cooldownSeconds() > 0);

  protected onReactionClick(emoji: string): void {
    this.pressedEmoji.set(emoji);
    this.reactionSelected.emit(emoji);
    setTimeout(() => this.pressedEmoji.set(null), 300);
  }
}
