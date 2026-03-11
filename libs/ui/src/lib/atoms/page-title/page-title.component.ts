import { Component, ChangeDetectionStrategy, input, computed } from '@angular/core';

/** Size preset for the page title component. */
export type PageTitleSize = 'sm' | 'md' | 'lg' | 'xl';

@Component({
  selector: 'bzm-page-title',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h2
      [class]="titleClasses()"
      [style]="titleStyle()"
    >
      <ng-content />
    </h2>
  `,
  styles: `
    :host {
      display: block;
    }

    .bzm-page-title {
      margin: 0;
      font-family: var(--bzm-font-heading);
      font-weight: 400;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      line-height: 1.1;
      paint-order: stroke fill;
    }

    /* ── Sizes ── */
    .size-sm {
      font-size: clamp(2.5rem, 7vw, 3.5rem);
      text-shadow: 3px 3px 0 var(--bzm-black);
      -webkit-text-stroke: 2.5px var(--bzm-black);
    }

    .size-md {
      font-size: clamp(3rem, 9vw, 5rem);
      text-shadow: 4px 4px 0 var(--bzm-black);
      -webkit-text-stroke: 3px var(--bzm-black);
    }

    .size-lg {
      font-size: clamp(4rem, 12vw, 7rem);
      text-shadow: 5px 5px 0 var(--bzm-black);
      -webkit-text-stroke: 4px var(--bzm-black);
    }

    .size-xl {
      font-size: clamp(5rem, 14vw, 9rem);
      text-shadow: 6px 6px 0 var(--bzm-black);
      -webkit-text-stroke: 5px var(--bzm-black);
    }

    /* ── Alignment ── */
    .align-left { text-align: left; }
    .align-center { text-align: center; }
    .align-right { text-align: right; }
  `,
})
/**
 * Displays a comic-styled page heading with text stroke, drop shadow, and configurable size,
 * color, and alignment. Projects heading content via `ng-content`.
 *
 * Uses the display/heading font family with `paint-order: stroke fill` for a bold outlined
 * text effect. Sizes scale responsively using `clamp()` for consistent appearance across viewports.
 *
 * @selector bzm-page-title
 *
 * @example
 * ```html
 * <bzm-page-title size="lg" color="var(--bzm-color-accent)">BAZAM!</bzm-page-title>
 * <bzm-page-title size="sm" align="left">Scorebord</bzm-page-title>
 * ```
 */
export class BzmPageTitleComponent {
  /**
   * Size preset controlling font size, text stroke width, and text shadow offset.
   * Scales responsively from mobile to desktop via `clamp()`.
   * @default 'md'
   */
  readonly size = input<PageTitleSize>('md');

  /**
   * CSS color value for the heading text.
   * @default 'var(--bzm-color-primary)'
   */
  readonly color = input<string>('var(--bzm-color-primary)');

  /**
   * Horizontal text alignment of the heading.
   * @default 'center'
   */
  readonly align = input<'left' | 'center' | 'right'>('center');

  protected readonly titleClasses = computed(
    () => `bzm-page-title size-${this.size()} align-${this.align()}`
  );

  protected readonly titleStyle = computed(
    () => `color: ${this.color()}`
  );
}
