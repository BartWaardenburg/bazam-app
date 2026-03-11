import { Component, ChangeDetectionStrategy, input, output, computed } from '@angular/core';
import { BzmChipComponent } from '../../atoms/chip/chip.component';

@Component({
  selector: 'bzm-category-filter',
  standalone: true,
  imports: [BzmChipComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="category-filter">
      <span class="category-heading">Category</span>
      <div class="category-scroll" role="listbox" aria-label="Category filter">
        @for (category of categories(); track category) {
          <bzm-chip
            [label]="category"
            [active]="category === activeCategory()"
            [color]="chipColor(category)"
            (toggled)="categoryChange.emit(category)"
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

    .category-filter {
      display: flex;
      flex-direction: column;
      gap: var(--bzm-space-3);
    }

    .category-heading {
      font-size: var(--bzm-font-size-base);
      font-weight: var(--bzm-font-weight-extrabold);
      color: var(--bzm-color-text);
      padding-left: var(--bzm-space-1);
    }

    .category-scroll {
      display: flex;
      gap: var(--bzm-space-2);
      overflow-x: auto;
      padding: var(--bzm-space-2) var(--bzm-space-1) var(--bzm-space-3);
      margin: calc(var(--bzm-space-2) * -1) calc(var(--bzm-space-1) * -1) calc(var(--bzm-space-3) * -1);
      scrollbar-width: none;
      -ms-overflow-style: none;
    }

    .category-scroll::-webkit-scrollbar {
      display: none;
    }
  `,
})
/**
 * Displays a horizontally scrollable row of selectable category chips.
 *
 * Use this component to let users filter content by category. The active
 * category is visually highlighted and the component emits the selected
 * category string on change.
 *
 * @selector bzm-category-filter
 *
 * @example
 * ```html
 * <bzm-category-filter
 *   [categories]="['All', 'Science', 'History']"
 *   [activeCategory]="'All'"
 *   (categoryChange)="onCategoryChange($event)"
 * />
 * ```
 */
export class BzmCategoryFilterComponent {
  /** List of category names to render as selectable chips. */
  readonly categories = input.required<string[]>();

  /** Currently active category, used to highlight the matching chip. */
  readonly activeCategory = input.required<string>();

  /** Emits the category name when the user selects a different chip. */
  readonly categoryChange = output<string>();

  protected readonly chipColor = (category: string): string | undefined => {
    if (category === this.activeCategory()) {
      if (category === 'All') return 'var(--bzm-color-accent)';
      return 'var(--bzm-color-primary)';
    }
    return undefined;
  };
}
