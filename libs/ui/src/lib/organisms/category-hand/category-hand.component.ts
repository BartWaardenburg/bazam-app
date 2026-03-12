import { Component, ChangeDetectionStrategy, input, output, computed } from '@angular/core';
import { BzmStarRatingComponent } from '../../atoms/star-rating/star-rating.component';
import { BzmButtonComponent } from '../../atoms/button/button.component';

/** Data shape for a single category card in the hand. */
export interface CategoryCardData {
  readonly id: string;
  readonly category: string;
  readonly stars: 1 | 2 | 3;
}

/** Colour mapping per quiz category. */
const CATEGORY_COLORS: Record<string, string> = {
  Science: '#6C5CE7',
  History: '#E17055',
  Geography: '#00B894',
  Film: '#E84393',
  Music: '#0984E3',
  Sports: '#FDCB6E',
  Animals: '#00CEC9',
  Gaming: '#A29BFE',
};

/** Phosphor icon mapping per quiz category. */
const CATEGORY_ICONS: Record<string, string> = {
  Science: 'ph-atom',
  History: 'ph-scroll',
  Geography: 'ph-globe-hemisphere-west',
  Film: 'ph-film-slate',
  Music: 'ph-music-notes',
  Sports: 'ph-soccer-ball',
  Animals: 'ph-paw-print',
  Gaming: 'ph-game-controller',
};

/** Combo definitions based on selected categories. */
interface ComboHint {
  readonly name: string;
  readonly categories: readonly string[];
  readonly icon: string;
}

const COMBO_HINTS: ComboHint[] = [
  { name: 'Cultuur Mix', categories: ['Film', 'Music', 'History'], icon: 'ph-palette' },
  { name: 'Explorer Pack', categories: ['Geography', 'Animals', 'Science'], icon: 'ph-compass' },
  { name: 'Nerd Bundle', categories: ['Science', 'Gaming'], icon: 'ph-brain' },
  { name: 'Sportief', categories: ['Sports', 'Animals'], icon: 'ph-trophy' },
];

@Component({
  selector: 'bzm-category-hand',
  standalone: true,
  imports: [BzmStarRatingComponent, BzmButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="hand" role="group" aria-label="Categorie kaarten">
      <div class="hand__fan" role="list">
        @for (card of cards(); track card.id; let i = $index) {
          <div role="listitem">
            <button
              class="hand__card"
              [class.hand__card--selected]="isSelected(card.id)"
              [class.hand__card--disabled]="isAtMax() && !isSelected(card.id)"
              [style.--card-index]="i"
              [style.--card-total]="cards().length"
              [style.--card-color]="categoryColor(card.category)"
              [attr.aria-label]="card.category + ', ' + card.stars + ' sterren' + (isSelected(card.id) ? ', geselecteerd' : '')"
              [attr.aria-pressed]="isSelected(card.id)"
              (click)="onToggle(card.id)"
            >
              <span class="hand__card-icon" aria-hidden="true">
                <i [class]="'ph-duotone ' + categoryIcon(card.category)"></i>
              </span>
              <span class="hand__card-name">{{ card.category }}</span>
              <bzm-star-rating [stars]="card.stars" size="sm" />
            </button>
          </div>
        }
      </div>

      <div class="hand__info">
        <span class="hand__counter" aria-live="polite">
          {{ selectedCount() }}/{{ maxSelections() }} geselecteerd
        </span>
      </div>

      @if (possibleCombos().length > 0) {
        <div class="hand__combos" aria-label="Mogelijke combo's">
          <span class="hand__combos-label">Mogelijke combo's:</span>
          @for (combo of possibleCombos(); track combo.name) {
            <span class="hand__combo-hint">
              <i [class]="'ph-duotone ' + combo.icon" aria-hidden="true"></i>
              {{ combo.name }}
            </span>
          }
        </div>
      }

      <div class="hand__actions">
        <bzm-button
          variant="accent"
          size="lg"
          [fullWidth]="true"
          [disabled]="!canConfirm()"
          (click)="onConfirm()"
        >
          <i class="ph-duotone ph-check-circle" aria-hidden="true"></i>
          Bevestig selectie
        </bzm-button>
      </div>
    </div>
  `,
  styles: `
    :host {
      display: block;
      font-family: var(--bzm-font-family);
    }

    .hand {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--bzm-space-4);
      padding: var(--bzm-space-6);
    }

    /* ─── Fan layout ─── */
    .hand__fan {
      display: flex;
      justify-content: center;
      position: relative;
      min-height: 200px;
      padding: var(--bzm-space-8) var(--bzm-space-4) var(--bzm-space-4);
    }

    .hand__card {
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--bzm-space-2);
      width: 100px;
      padding: var(--bzm-space-4) var(--bzm-space-2);
      margin: 0 -12px;
      background: var(--bzm-color-surface);
      border: 4px solid var(--bzm-black);
      border-width: var(--bzm-border-width-comic);
      border-radius: var(--bzm-radius-md);
      box-shadow: 4px 4px 0 var(--bzm-black);
      cursor: pointer;
      transition:
        transform var(--bzm-transition-playful),
        box-shadow var(--bzm-transition-base);
      transform-origin: bottom center;
      transform: rotate(calc((var(--card-index) - (var(--card-total) - 1) / 2) * 6deg));
      z-index: calc(var(--card-index));
      user-select: none;
      -webkit-tap-highlight-color: transparent;
      font-family: var(--bzm-font-family);
    }

    .hand__card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 6px;
      background: var(--card-color, var(--bzm-color-primary));
      border-radius: var(--bzm-radius-sm) var(--bzm-radius-sm) 0 0;
    }

    .hand__card:hover:not(.hand__card--disabled) {
      transform: rotate(calc((var(--card-index) - (var(--card-total) - 1) / 2) * 6deg)) translateY(-12px);
      box-shadow: 6px 8px 0 var(--bzm-black);
      z-index: 20;
    }

    .hand__card--selected {
      transform: rotate(calc((var(--card-index) - (var(--card-total) - 1) / 2) * 3deg)) translateY(-24px);
      border-color: var(--card-color, var(--bzm-color-accent));
      box-shadow:
        4px 4px 0 var(--bzm-black),
        0 0 16px 2px var(--card-color, var(--bzm-color-accent));
      z-index: 15;
    }

    .hand__card--selected:hover {
      transform: rotate(calc((var(--card-index) - (var(--card-total) - 1) / 2) * 3deg)) translateY(-28px);
    }

    .hand__card--disabled {
      opacity: 0.5;
      cursor: not-allowed;
      filter: grayscale(0.3);
    }

    /* ─── Card inner ─── */
    .hand__card-icon {
      font-size: 28px;
      color: var(--card-color, var(--bzm-color-primary));
      filter: drop-shadow(1px 1px 0 rgba(0, 0, 0, 0.2));
    }

    .hand__card-name {
      font-size: var(--bzm-font-size-xs);
      font-weight: var(--bzm-font-weight-extrabold);
      text-transform: uppercase;
      letter-spacing: 0.03em;
      color: var(--bzm-color-text);
      text-align: center;
      line-height: 1.2;
    }

    /* ─── Info ─── */
    .hand__info {
      text-align: center;
    }

    .hand__counter {
      font-family: var(--bzm-font-heading);
      font-size: var(--bzm-font-size-lg);
      color: var(--bzm-color-text);
      -webkit-text-stroke: 0.5px var(--bzm-black);
    }

    /* ─── Combos ─── */
    .hand__combos {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: var(--bzm-space-2);
      align-items: center;
    }

    .hand__combos-label {
      font-size: var(--bzm-font-size-xs);
      color: var(--bzm-color-text-muted);
      font-weight: var(--bzm-font-weight-bold);
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }

    .hand__combo-hint {
      display: inline-flex;
      align-items: center;
      gap: var(--bzm-space-1);
      padding: 2px var(--bzm-space-3);
      background: var(--bzm-color-surface);
      border: 2px solid var(--bzm-color-border);
      border-radius: var(--bzm-radius-full);
      font-size: var(--bzm-font-size-xs);
      font-weight: var(--bzm-font-weight-bold);
      color: var(--bzm-color-text-secondary);
    }

    .hand__combo-hint i {
      font-size: 14px;
    }

    /* ─── Actions ─── */
    .hand__actions {
      width: 100%;
      max-width: 300px;
    }

    /* ─── Reduced motion ─── */
    @media (prefers-reduced-motion: reduce) {
      .hand__card {
        transition: none;
      }
    }
  `,
})
/**
 * Displays a fan/hand of category cards that the player draws and selects from
 * at the start of a singleplayer roguelike run.
 *
 * Cards are arranged in an arc layout with slight rotation and overlap. Selected
 * cards lift up and glow in their category colour. A confirmation button is
 * enabled once the required number of selections is reached. Possible combo
 * hints are shown below the counter.
 *
 * @selector bzm-category-hand
 *
 * @example
 * ```html
 * <bzm-category-hand
 *   [cards]="drawnCards"
 *   [maxSelections]="3"
 *   [selectedIds]="selected()"
 *   (cardToggled)="toggle($event)"
 *   (selectionConfirmed)="confirm()"
 * />
 * ```
 */
export class BzmCategoryHandComponent {
  /** The drawn category cards to display in the hand. */
  readonly cards = input.required<CategoryCardData[]>();

  /** Maximum number of cards the player can select. */
  readonly maxSelections = input.required<number>();

  /** IDs of currently selected cards. */
  readonly selectedIds = input<string[]>([]);

  /** Emits the card ID when a card is toggled. */
  readonly cardToggled = output<string>();

  /** Emits when the player confirms their selection. */
  readonly selectionConfirmed = output<void>();

  protected readonly selectedCount = computed(() => this.selectedIds().length);

  protected readonly isAtMax = computed(
    () => this.selectedIds().length >= this.maxSelections()
  );

  protected readonly canConfirm = computed(
    () => this.selectedIds().length === this.maxSelections()
  );

  protected readonly possibleCombos = computed(() => {
    const selected = this.selectedIds();
    const selectedCategories = this.cards()
      .filter((c) => selected.includes(c.id))
      .map((c) => c.category);

    const available = this.cards().map((c) => c.category);

    return COMBO_HINTS.filter((combo) => {
      const matchedSelected = combo.categories.filter((c) => selectedCategories.includes(c));
      const matchedAvailable = combo.categories.filter((c) => available.includes(c));
      return matchedSelected.length >= 1 && matchedAvailable.length === combo.categories.length;
    });
  });

  /** Returns the theme colour for a category name. */
  protected categoryColor(category: string): string {
    return CATEGORY_COLORS[category] ?? 'var(--bzm-color-primary)';
  }

  /** Returns the Phosphor icon class for a category name. */
  protected categoryIcon(category: string): string {
    return CATEGORY_ICONS[category] ?? 'ph-question';
  }

  /** Checks whether a card ID is in the selected set. */
  protected isSelected(id: string): boolean {
    return this.selectedIds().includes(id);
  }

  /** Toggles a card selection, respecting the max limit. */
  protected onToggle(id: string): void {
    if (!this.isSelected(id) && this.isAtMax()) return;
    this.cardToggled.emit(id);
  }

  /** Emits confirmation when allowed. */
  protected onConfirm(): void {
    if (this.canConfirm()) {
      this.selectionConfirmed.emit();
    }
  }
}
