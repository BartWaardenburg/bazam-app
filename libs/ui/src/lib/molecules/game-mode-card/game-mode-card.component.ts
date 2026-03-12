import { Component, ChangeDetectionStrategy, computed, input, output } from '@angular/core';

/** Available game mode identifiers for multiplayer modes. */
export type GameModeType = 'classic' | 'team-battle' | 'boss-battle' | 'blitz' | 'survival' | 'survival-royale';

const MODE_COLORS: Record<GameModeType, string> = {
  'classic': 'var(--bzm-mode-classic, #3b82f6)',
  'team-battle': 'var(--bzm-mode-team-battle, #22c55e)',
  'boss-battle': 'var(--bzm-mode-boss-battle, #ef4444)',
  'blitz': 'var(--bzm-mode-blitz, #f97316)',
  'survival': 'var(--bzm-mode-survival, #a855f7)',
  'survival-royale': 'var(--bzm-mode-survival-royale, #eab308)',
};

const MODE_GRADIENTS: Record<GameModeType, string> = {
  'classic': 'linear-gradient(135deg, var(--bzm-mode-classic, #3b82f6) 0%, var(--bzm-mode-classic-dark, #1d4ed8) 100%)',
  'team-battle': 'linear-gradient(135deg, var(--bzm-mode-team-battle, #22c55e) 0%, var(--bzm-mode-team-battle-dark, #16a34a) 100%)',
  'boss-battle': 'linear-gradient(135deg, var(--bzm-mode-boss-battle, #ef4444) 0%, var(--bzm-mode-boss-battle-dark, #dc2626) 100%)',
  'blitz': 'linear-gradient(135deg, var(--bzm-mode-blitz, #f97316) 0%, var(--bzm-mode-blitz-dark, #ea580c) 100%)',
  'survival': 'linear-gradient(135deg, var(--bzm-mode-survival, #a855f7) 0%, var(--bzm-mode-survival-dark, #9333ea) 100%)',
  'survival-royale': 'linear-gradient(135deg, var(--bzm-mode-survival-royale, #eab308) 0%, var(--bzm-mode-survival-royale-dark, #ca8a04) 100%)',
};

@Component({
  selector: 'bzm-game-mode-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      type="button"
      [class]="cardClasses()"
      [style]="cardStyle()"
      [disabled]="locked()"
      (click)="handleClick()"
      [attr.aria-label]="title() + (locked() ? ' (vergrendeld)' : '')"
    >
      @if (recommended()) {
        <span class="bzm-game-mode-card__badge" aria-label="Aanbevolen">
          Aanbevolen
        </span>
      }

      @if (locked()) {
        <div class="bzm-game-mode-card__lock-badge" aria-hidden="true">
          <i class="ph-duotone ph-lock" style="font-size: 14px;"></i>
        </div>
      }

      <div class="bzm-game-mode-card__icon-container" [style]="iconBgStyle()">
        <i [class]="'ph-duotone ph-' + icon()" style="font-size: 40px;"></i>
      </div>

      <h3 class="bzm-game-mode-card__title">{{ title() }}</h3>
      <p class="bzm-game-mode-card__description">{{ description() }}</p>

      <div class="bzm-game-mode-card__footer">
        <i class="ph-duotone ph-users" style="font-size: 16px;"></i>
        <span>{{ playerRange() }}</span>
      </div>

      @if (selected()) {
        <div class="bzm-game-mode-card__selected-check" aria-hidden="true">
          <i class="ph-duotone ph-check-circle" style="font-size: 24px;"></i>
        </div>
      }
    </button>
  `,
  styles: `
    :host {
      display: block;
      font-family: var(--bzm-font-family);
    }

    .bzm-game-mode-card {
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--bzm-space-2);
      width: 100%;
      padding: var(--bzm-space-6) var(--bzm-space-4) var(--bzm-space-4);
      background: var(--bzm-color-surface);
      border: 4px solid var(--bzm-color-border);
      border-width: var(--bzm-border-width-comic);
      border-radius: var(--bzm-radius-md);
      box-shadow: var(--bzm-shadow-md);
      cursor: pointer;
      transition: transform var(--bzm-transition-playful),
                  box-shadow var(--bzm-transition-base),
                  border-color var(--bzm-transition-base);
      text-align: center;
      overflow: visible;
      outline: none;
      font-family: inherit;
    }

    .bzm-game-mode-card:hover:not(:disabled) {
      transform: translateY(-4px) rotate(-1deg);
      box-shadow: var(--bzm-shadow-lg);
    }

    .bzm-game-mode-card:focus-visible {
      box-shadow: 0 0 0 3px var(--bzm-color-focus);
    }

    .bzm-game-mode-card--selected {
      border-width: 4px 5px 6px 4px;
      transform: scale(1.03);
    }

    .bzm-game-mode-card--selected:hover:not(:disabled) {
      transform: scale(1.03) translateY(-2px) rotate(-0.5deg);
    }

    .bzm-game-mode-card--locked {
      cursor: not-allowed;
      filter: grayscale(0.8);
      opacity: 0.7;
    }

    .bzm-game-mode-card--locked:hover {
      transform: none;
      box-shadow: var(--bzm-shadow-md);
    }

    .bzm-game-mode-card__lock-badge {
      position: absolute;
      top: var(--bzm-space-2);
      right: var(--bzm-space-2);
      display: flex;
      align-items: center;
      justify-content: center;
      width: 28px;
      height: 28px;
      background: var(--bzm-color-surface);
      border: 3px solid var(--bzm-color-border);
      border-width: var(--bzm-border-width-comic-sm);
      border-radius: var(--bzm-radius-md);
      z-index: 2;
      color: var(--bzm-color-text-muted);
    }

    .bzm-game-mode-card__icon-container {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 72px;
      height: 72px;
      border-radius: var(--bzm-radius-md);
      color: var(--bzm-white);
      margin-bottom: var(--bzm-space-1);
    }

    .bzm-game-mode-card__title {
      font-size: var(--bzm-font-size-lg);
      font-weight: var(--bzm-font-weight-extrabold);
      color: var(--bzm-color-text);
      margin: 0;
      line-height: var(--bzm-line-height-tight);
    }

    .bzm-game-mode-card__description {
      font-size: var(--bzm-font-size-sm);
      font-weight: var(--bzm-font-weight-medium);
      color: var(--bzm-color-text-muted);
      margin: 0;
      line-height: var(--bzm-line-height-normal);
    }

    .bzm-game-mode-card__footer {
      display: flex;
      align-items: center;
      gap: var(--bzm-space-1);
      font-size: var(--bzm-font-size-xs);
      font-weight: var(--bzm-font-weight-bold);
      color: var(--bzm-color-text-secondary);
      margin-top: var(--bzm-space-1);
    }

    .bzm-game-mode-card__badge {
      position: absolute;
      top: -10px;
      right: -8px;
      background: var(--bzm-color-accent);
      color: var(--bzm-color-text-on-accent);
      font-size: var(--bzm-font-size-xs);
      font-weight: var(--bzm-font-weight-extrabold);
      padding: var(--bzm-space-1) var(--bzm-space-2);
      border-radius: var(--bzm-radius-md);
      border: 3px solid var(--bzm-black);
      border-width: var(--bzm-border-width-comic-sm);
      transform: rotate(3deg);
      z-index: 3;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      box-shadow: var(--bzm-shadow-sm);
      animation: bzm-badge-wobble 2s ease-in-out infinite;
    }

    .bzm-game-mode-card__selected-check {
      position: absolute;
      top: var(--bzm-space-2);
      left: var(--bzm-space-2);
      z-index: 3;
    }

    @keyframes bzm-badge-wobble {
      0%, 100% { transform: rotate(3deg); }
      50% { transform: rotate(-2deg); }
    }

    @media (prefers-reduced-motion: reduce) {
      .bzm-game-mode-card {
        transition: none;
      }

      .bzm-game-mode-card:hover:not(:disabled) {
        transform: none;
      }

      .bzm-game-mode-card--selected:hover:not(:disabled) {
        transform: scale(1.03);
      }

      .bzm-game-mode-card__badge {
        animation: none;
      }
    }
  `,
})
/**
 * Renders a selection card for a single game mode with icon, title, description,
 * and player range. Supports selected, locked, and recommended visual states.
 *
 * Each mode has a unique accent color gradient. Locked cards are greyed out with
 * a lock overlay. The recommended badge appears as a comic splat in the corner.
 *
 * @selector bzm-game-mode-card
 *
 * @example
 * ```html
 * <bzm-game-mode-card
 *   mode="classic"
 *   title="Klassiek"
 *   description="Standaard quiz met optionele power-ups"
 *   icon="game-controller"
 *   playerRange="2-30 spelers"
 *   [selected]="true"
 *   (modeSelected)="onSelect($event)"
 * />
 * ```
 */
export class BzmGameModeCardComponent {
  /** Game mode identifier. */
  readonly mode = input.required<GameModeType>();

  /** Display title for the game mode. */
  readonly title = input.required<string>();

  /** Short description of the game mode. */
  readonly description = input.required<string>();

  /** Phosphor icon name (without 'ph-' prefix). */
  readonly icon = input.required<string>();

  /** Player range text, e.g. "2-30 spelers". */
  readonly playerRange = input.required<string>();

  /** Whether this card is currently selected. @default false */
  readonly selected = input<boolean>(false);

  /** Whether this mode is locked (not yet available). @default false */
  readonly locked = input<boolean>(false);

  /** Whether to show the "Aanbevolen" recommendation badge. @default false */
  readonly recommended = input<boolean>(false);

  /** Emits the game mode identifier when the card is clicked. */
  readonly modeSelected = output<GameModeType>();

  protected readonly cardClasses = computed(() => {
    const classes = ['bzm-game-mode-card'];
    if (this.selected()) classes.push('bzm-game-mode-card--selected');
    if (this.locked()) classes.push('bzm-game-mode-card--locked');
    return classes.join(' ');
  });

  protected readonly cardStyle = computed(() => {
    const m = this.mode();
    const color = MODE_COLORS[m];
    if (this.selected()) {
      return `border-color: ${color}`;
    }
    return '';
  });

  protected readonly iconBgStyle = computed(() => {
    const m = this.mode();
    return `background: ${MODE_GRADIENTS[m]}`;
  });

  protected handleClick(): void {
    if (!this.locked()) {
      this.modeSelected.emit(this.mode());
    }
  }
}
