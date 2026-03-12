import { Component, ChangeDetectionStrategy, input, computed } from '@angular/core';

/** Number of stars representing difficulty level. */
export type StarCount = 1 | 2 | 3;

/** Size variant for the star rating display. */
export type StarRatingSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'bzm-star-rating',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span
      [class]="containerClasses()"
      role="img"
      [attr.aria-label]="ariaLabel()"
    >
      @for (star of starArray(); track $index) {
        <i class="ph-duotone ph-star star-icon"></i>
      }
    </span>
  `,
  styles: `
    :host {
      display: inline-block;
      font-family: var(--bzm-font-family);
    }

    .star-container {
      display: inline-flex;
      align-items: center;
      gap: 2px;
      line-height: 1;
    }

    .star-icon {
      color: var(--bzm-yellow-500);
      filter: drop-shadow(1px 1px 0 rgba(0, 0, 0, 0.2));
    }

    /* ─── Size: sm ─── */
    .star-container--sm .star-icon {
      font-size: 12px;
    }

    .star-container--sm {
      gap: 1px;
    }

    /* ─── Size: md ─── */
    .star-container--md .star-icon {
      font-size: 16px;
    }

    /* ─── Size: lg ─── */
    .star-container--lg .star-icon {
      font-size: 22px;
    }

    .star-container--lg {
      gap: 3px;
    }
  `,
})
/**
 * Renders a row of filled stars indicating difficulty level (1–3 stars).
 *
 * Used on category cards in the singleplayer roguelike mode to communicate
 * how challenging a quiz category is before the player selects it.
 *
 * @selector bzm-star-rating
 *
 * @example
 * ```html
 * <bzm-star-rating [stars]="1" />
 * <bzm-star-rating [stars]="3" size="lg" />
 * ```
 */
export class BzmStarRatingComponent {
  /** Number of filled stars to render (1, 2, or 3). */
  readonly stars = input.required<StarCount>();

  /**
   * Controls the size of the star icons.
   * @default 'md'
   */
  readonly size = input<StarRatingSize>('md');

  protected readonly starArray = computed(
    () => Array.from({ length: this.stars() })
  );

  protected readonly ariaLabel = computed(
    () => `Moeilijkheid: ${this.stars()} van 3 sterren`
  );

  protected readonly containerClasses = computed(
    () => `star-container star-container--${this.size()}`
  );
}
