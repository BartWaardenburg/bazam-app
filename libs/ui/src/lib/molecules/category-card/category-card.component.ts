import { Component, ChangeDetectionStrategy, computed, input, output } from '@angular/core';

/** Star difficulty level for a category card. */
export type StarLevel = 1 | 2 | 3;

interface CategoryMeta {
  readonly icon: string;
  readonly color: string;
}

const CATEGORY_MAP: Record<string, CategoryMeta> = {
  'Science & Nature': { icon: 'flask', color: '#6C5CE7' },
  'History': { icon: 'scroll', color: '#E17055' },
  'Geography': { icon: 'globe-hemisphere-west', color: '#00B894' },
  'Film & TV': { icon: 'film-strip', color: '#E84393' },
  'Music': { icon: 'music-notes', color: '#0984E3' },
  'Sports': { icon: 'soccer-ball', color: '#FDCB6E' },
  'Animals & Nature': { icon: 'paw-print', color: '#00CEC9' },
  'Gaming & Internet': { icon: 'game-controller', color: '#A29BFE' },
};

const DEFAULT_META: CategoryMeta = { icon: 'question', color: '#999999' };

@Component({
  selector: 'bzm-category-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      type="button"
      [class]="cardClasses()"
      [style]="cardStyle()"
      [disabled]="disabled() || played()"
      [attr.aria-label]="ariaLabel()"
      (click)="handleClick()"
    >
      @if (played()) {
        <div class="bzm-category-card__played-overlay" aria-hidden="true">
          <i class="ph-duotone ph-check-circle" style="font-size: 28px;"></i>
        </div>
      }

      <div class="bzm-category-card__icon" [style]="iconStyle()">
        <i [class]="'ph-duotone ph-' + meta().icon" style="font-size: 32px;"></i>
      </div>

      <span class="bzm-category-card__name">{{ category() }}</span>

      <div class="bzm-category-card__stars" aria-hidden="true">
        @for (star of starArray(); track $index) {
          <i
            class="ph-duotone ph-star"
            [style]="'font-size: 14px; color: ' + meta().color"
          ></i>
        }
      </div>
    </button>
  `,
  styles: `
    :host {
      display: block;
      font-family: var(--bzm-font-family);
    }

    .bzm-category-card {
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--bzm-space-2);
      width: 100px;
      padding: var(--bzm-space-3) var(--bzm-space-2) var(--bzm-space-2);
      background: var(--bzm-color-surface);
      border: 4px solid var(--bzm-color-border);
      border-width: 3px 4px 5px 3px;
      border-radius: var(--bzm-radius-md);
      box-shadow: var(--bzm-shadow-md);
      cursor: pointer;
      transition: transform var(--bzm-transition-playful),
                  box-shadow var(--bzm-transition-base),
                  border-color var(--bzm-transition-base);
      text-align: center;
      overflow: hidden;
      outline: none;
      font-family: inherit;
    }

    .bzm-category-card:hover:not(:disabled) {
      transform: translateY(-4px) rotate(-1deg);
      box-shadow: var(--bzm-shadow-lg);
    }

    .bzm-category-card:focus-visible {
      box-shadow: 0 0 0 3px var(--bzm-cyan-300);
    }

    .bzm-category-card--selected {
      border-width: 4px 5px 6px 4px;
      transform: translateY(-2px);
    }

    .bzm-category-card--selected:hover:not(:disabled) {
      transform: translateY(-4px) rotate(-0.5deg);
    }

    .bzm-category-card--disabled {
      cursor: not-allowed;
      filter: grayscale(0.8);
      opacity: 0.5;
    }

    .bzm-category-card--disabled:hover {
      transform: none;
      box-shadow: var(--bzm-shadow-md);
    }

    .bzm-category-card--played {
      opacity: 0.6;
      filter: grayscale(0.4);
    }

    .bzm-category-card--played:hover:not(:disabled) {
      transform: none;
      box-shadow: var(--bzm-shadow-md);
    }

    .bzm-category-card__played-overlay {
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(255, 255, 255, 0.5);
      border-radius: var(--bzm-radius-md);
      z-index: 2;
      color: var(--bzm-color-success);
    }

    .bzm-category-card__icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 56px;
      height: 56px;
      border-radius: var(--bzm-radius-md);
      color: var(--bzm-white);
    }

    .bzm-category-card__name {
      font-size: var(--bzm-font-size-xs);
      font-weight: var(--bzm-font-weight-bold);
      color: var(--bzm-color-text);
      line-height: var(--bzm-line-height-tight);
      max-width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }

    .bzm-category-card__stars {
      display: flex;
      gap: 2px;
    }

    @media (prefers-reduced-motion: reduce) {
      .bzm-category-card {
        transition: none;
      }

      .bzm-category-card:hover:not(:disabled) {
        transform: none;
      }

      .bzm-category-card--selected:hover:not(:disabled) {
        transform: none;
      }
    }
  `,
})
/**
 * Renders a selectable category card for the singleplayer roguelike quiz mode.
 *
 * Displays a category icon, name, and star difficulty rating. Supports selected,
 * disabled, and played visual states. Each of the 8 categories maps to a unique
 * Phosphor icon and accent color. Comic-book card style with hover lift animation.
 *
 * @selector bzm-category-card
 *
 * @example
 * ```html
 * <bzm-category-card
 *   category="Science & Nature"
 *   [stars]="2"
 *   [selected]="false"
 *   (cardSelected)="onSelect()"
 * />
 * ```
 */
export class BzmCategoryCardComponent {
  /** Category name, matched against the internal icon/color map. */
  readonly category = input.required<string>();

  /** Star difficulty level (1-3) shown below the category name. */
  readonly stars = input.required<StarLevel>();

  /** Whether this card is currently selected by the player. @default false */
  readonly selected = input<boolean>(false);

  /** Prevents the card from being clicked when true. @default false */
  readonly disabled = input<boolean>(false);

  /** Whether this category has already been played this round. @default false */
  readonly played = input<boolean>(false);

  /** Emits when the player clicks this category card (only when not disabled and not played). */
  readonly cardSelected = output<void>();

  protected readonly meta = computed((): CategoryMeta =>
    CATEGORY_MAP[this.category()] ?? DEFAULT_META
  );

  protected readonly starArray = computed((): number[] =>
    Array.from({ length: this.stars() }, (_, i) => i)
  );

  protected readonly cardClasses = computed((): string => {
    const classes = ['bzm-category-card'];
    if (this.selected()) classes.push('bzm-category-card--selected');
    if (this.disabled()) classes.push('bzm-category-card--disabled');
    if (this.played()) classes.push('bzm-category-card--played');
    return classes.join(' ');
  });

  protected readonly cardStyle = computed((): string => {
    const color = this.meta().color;
    if (this.selected()) {
      return `border-color: ${color}; background: ${color}10`;
    }
    return '';
  });

  protected readonly iconStyle = computed((): string => {
    const color = this.meta().color;
    return `background: ${color}`;
  });

  protected readonly ariaLabel = computed((): string => {
    const name = this.category();
    const starText = this.stars() === 1 ? '1 ster' : `${this.stars()} sterren`;
    if (this.played()) return `${name} (${starText}, gespeeld)`;
    if (this.disabled()) return `${name} (${starText}, niet beschikbaar)`;
    return `${name} (${starText})`;
  });

  protected handleClick(): void {
    if (!this.disabled() && !this.played()) {
      this.cardSelected.emit();
    }
  }
}
