import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { BzmGameModeCardComponent, type GameModeType } from '../../molecules/game-mode-card/game-mode-card.component';

/** Configuration for a single game mode option in the selector. */
export interface GameModeOption {
  readonly mode: GameModeType;
  readonly title: string;
  readonly description: string;
  readonly icon: string;
  readonly playerRange: string;
  readonly locked?: boolean;
  readonly recommended?: boolean;
}

@Component({
  selector: 'bzm-game-mode-selector',
  standalone: true,
  imports: [BzmGameModeCardComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="bzm-game-mode-selector" role="group" aria-label="Kies een spelmodus">
      <h2 class="bzm-game-mode-selector__title">Kies een spelmodus</h2>

      <div class="bzm-game-mode-selector__grid">
        @for (option of modes(); track option.mode) {
          <bzm-game-mode-card
            [mode]="option.mode"
            [title]="option.title"
            [description]="option.description"
            [icon]="option.icon"
            [playerRange]="option.playerRange"
            [selected]="option.mode === selectedMode()"
            [locked]="option.locked ?? false"
            [recommended]="option.recommended ?? false"
            (modeSelected)="handleModeSelected($event)"
          />
        }
      </div>
    </div>
  `,
  styles: `
    :host {
      display: block;
      font-family: var(--bzm-font-family);
    }

    .bzm-game-mode-selector__title {
      font-size: var(--bzm-font-size-2xl);
      font-weight: var(--bzm-font-weight-extrabold);
      color: var(--bzm-color-text);
      text-align: center;
      margin: 0 0 var(--bzm-space-6);
    }

    .bzm-game-mode-selector__grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: var(--bzm-space-4);
    }

    @media (min-width: 640px) {
      .bzm-game-mode-selector__grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media (min-width: 960px) {
      .bzm-game-mode-selector__grid {
        grid-template-columns: repeat(3, 1fr);
      }
    }
  `,
})
/**
 * Renders a responsive grid of game mode cards for the host to select a game mode.
 *
 * Displays a "Kies een spelmodus" title above a 2-3 column responsive grid of
 * `BzmGameModeCard` components. Handles selection state and forwards mode
 * selection events.
 *
 * @selector bzm-game-mode-selector
 *
 * @example
 * ```html
 * <bzm-game-mode-selector
 *   [modes]="availableModes"
 *   [selectedMode]="'classic'"
 *   (modeSelected)="onModeSelected($event)"
 * />
 * ```
 */
export class BzmGameModeSelectorComponent {
  /** Array of available game mode options to display. */
  readonly modes = input.required<GameModeOption[]>();

  /** Currently selected game mode, or null if none selected. @default null */
  readonly selectedMode = input<GameModeType | null>(null);

  /** Emits the selected game mode identifier. */
  readonly modeSelected = output<GameModeType>();

  protected handleModeSelected(mode: GameModeType): void {
    this.modeSelected.emit(mode);
  }
}
