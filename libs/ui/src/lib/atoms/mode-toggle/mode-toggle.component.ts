import { Component, ChangeDetectionStrategy, input, output, computed, ElementRef, viewChildren } from '@angular/core';

/** Game mode type for the toggle component. */
export type GameMode = 'party' | 'competitive';

@Component({
  selector: 'bzm-mode-toggle',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="bzm-mode-toggle" role="radiogroup" aria-label="Spelmodus kiezen" (keydown)="handleKeydown($event)">
      <button
        #radioBtn
        type="button"
        role="radio"
        [class]="partyClasses()"
        [attr.aria-checked]="isParty()"
        [attr.tabindex]="isParty() ? 0 : -1"
        (click)="selectMode('party')"
      >
        <i class="ph-duotone ph-confetti bzm-mode-toggle__icon" aria-hidden="true"></i>
        <span class="bzm-mode-toggle__title">Feestmodus</span>
        <span class="bzm-mode-toggle__subtitle">Veilig & leuk voor iedereen</span>
      </button>

      <button
        #radioBtn
        type="button"
        role="radio"
        [class]="competitiveClasses()"
        [attr.aria-checked]="isCompetitive()"
        [attr.tabindex]="isCompetitive() ? 0 : -1"
        (click)="selectMode('competitive')"
      >
        <i class="ph-duotone ph-trophy bzm-mode-toggle__icon" aria-hidden="true"></i>
        <span class="bzm-mode-toggle__title">Competitief</span>
        <span class="bzm-mode-toggle__subtitle">Geen limieten</span>
      </button>
    </div>
  `,
  styles: `
    :host {
      display: block;
      font-family: var(--bzm-font-family);
    }

    .bzm-mode-toggle {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: var(--bzm-space-3);
      border: 4px solid var(--bzm-color-border);
      border-width: var(--bzm-border-width-comic);
      border-radius: var(--bzm-radius-lg);
      padding: var(--bzm-space-2);
      background: var(--bzm-color-surface);
      box-shadow: var(--bzm-shadow-card);
    }

    .bzm-mode-toggle__option {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--bzm-space-2);
      padding: var(--bzm-space-5) var(--bzm-space-4);
      border: 3px solid transparent;
      border-radius: var(--bzm-radius-md);
      cursor: pointer;
      font-family: var(--bzm-font-family);
      background: transparent;
      transition:
        background-color var(--bzm-transition-base),
        border-color var(--bzm-transition-base),
        transform var(--bzm-transition-playful),
        box-shadow var(--bzm-transition-base);
      -webkit-tap-highlight-color: transparent;
      user-select: none;
    }

    .bzm-mode-toggle__option:hover {
      background: var(--bzm-color-surface);
      box-shadow: var(--bzm-shadow-sm);
    }

    .bzm-mode-toggle__option:active {
      transform: scale(0.97);
    }

    .bzm-mode-toggle__option--active {
      background: var(--bzm-color-primary);
      border-color: var(--bzm-color-border);
      border-width: 2px 3px 4px 2px;
      box-shadow: var(--bzm-shadow-md);
    }

    .bzm-mode-toggle__option--active:hover {
      background: var(--bzm-color-primary);
      box-shadow: var(--bzm-shadow-md);
    }

    .bzm-mode-toggle__icon {
      font-size: 2rem;
      line-height: 1;
      color: var(--bzm-color-text-secondary);
      transition: color var(--bzm-transition-base);
    }

    .bzm-mode-toggle__option--active .bzm-mode-toggle__icon {
      color: var(--bzm-white);
    }

    .bzm-mode-toggle__title {
      font-size: var(--bzm-font-size-base);
      font-weight: var(--bzm-font-weight-extrabold);
      text-transform: uppercase;
      letter-spacing: 0.04em;
      color: var(--bzm-color-text);
      transition: color var(--bzm-transition-base);
    }

    .bzm-mode-toggle__option--active .bzm-mode-toggle__title {
      color: var(--bzm-white);
    }

    .bzm-mode-toggle__subtitle {
      font-size: var(--bzm-font-size-xs);
      font-weight: var(--bzm-font-weight-medium);
      color: var(--bzm-color-text-muted);
      text-align: center;
      line-height: 1.3;
      transition: color var(--bzm-transition-base);
    }

    .bzm-mode-toggle__option--active .bzm-mode-toggle__subtitle {
      color: rgba(255, 255, 255, 0.8);
    }

    @media (prefers-reduced-motion: reduce) {
      .bzm-mode-toggle__option {
        transition: none;
      }

      .bzm-mode-toggle__option:active {
        transform: none;
      }
    }
  `,
})
/**
 * Displays a two-option toggle for selecting between Party Mode and Competitive Mode
 * when creating a game room. Each option renders as a card-like button with an icon,
 * title, and subtitle.
 *
 * Party Mode ("Feestmodus") is the safe, fun-for-everyone default. Competitive Mode
 * ("Competitief") removes limits for serious play. The selected option is highlighted
 * with the primary color fill.
 *
 * Uses `role="radiogroup"` with `role="radio"` buttons for accessible keyboard navigation.
 * Respects `prefers-reduced-motion` by disabling transform transitions.
 *
 * @selector bzm-mode-toggle
 *
 * @example
 * ```html
 * <bzm-mode-toggle [mode]="selectedMode" (modeChange)="selectedMode = $event" />
 * ```
 */
export class BzmModeToggleComponent {
  /**
   * Currently selected game mode.
   * @default 'party'
   */
  readonly mode = input<GameMode>('party');

  /** Emits the newly selected mode when the user clicks an option. */
  readonly modeChange = output<GameMode>();

  private readonly radioBtns = viewChildren<ElementRef<HTMLButtonElement>>('radioBtn');

  protected readonly isParty = computed(() => this.mode() === 'party');
  protected readonly isCompetitive = computed(() => this.mode() === 'competitive');

  protected readonly partyClasses = computed(() => {
    const base = 'bzm-mode-toggle__option';
    return this.isParty() ? `${base} ${base}--active` : base;
  });

  protected readonly competitiveClasses = computed(() => {
    const base = 'bzm-mode-toggle__option';
    return this.isCompetitive() ? `${base} ${base}--active` : base;
  });

  protected selectMode(newMode: GameMode): void {
    if (newMode !== this.mode()) {
      this.modeChange.emit(newMode);
    }
  }

  protected handleKeydown(event: KeyboardEvent): void {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') {
      return;
    }
    event.preventDefault();
    const nextMode: GameMode = this.mode() === 'party' ? 'competitive' : 'party';
    this.modeChange.emit(nextMode);
    const btns = this.radioBtns();
    const focusIndex = nextMode === 'party' ? 0 : 1;
    btns[focusIndex]?.nativeElement.focus();
  }
}
