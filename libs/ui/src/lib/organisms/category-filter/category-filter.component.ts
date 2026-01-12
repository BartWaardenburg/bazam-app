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
export class BzmCategoryFilterComponent {
  readonly categories = input.required<string[]>();
  readonly activeCategory = input.required<string>();

  readonly categoryChange = output<string>();

  protected readonly chipColor = (category: string): string | undefined => {
    if (category === this.activeCategory()) {
      if (category === 'All') return 'var(--bzm-color-accent)';
      return 'var(--bzm-color-primary)';
    }
    return undefined;
  };
}
