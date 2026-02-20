import { Component, ChangeDetectionStrategy, input, computed } from '@angular/core';

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
      font-family: var(--bzm-font-family);
    }

    .bzm-page-title {
      margin: 0;
      font-weight: var(--bzm-font-weight-black);
      text-transform: uppercase;
      letter-spacing: 0.02em;
      line-height: var(--bzm-line-height-tight);
      -webkit-text-stroke: 1.5px var(--bzm-black);
      paint-order: stroke fill;
    }

    /* ── Sizes ── */
    .size-sm {
      font-size: clamp(1.25rem, 3vw, 1.75rem);
      text-shadow: 2px 2px 0 var(--bzm-black);
      -webkit-text-stroke: 1px var(--bzm-black);
    }

    .size-md {
      font-size: clamp(1.5rem, 4vw, 2.2rem);
      text-shadow: 3px 3px 0 var(--bzm-black);
    }

    .size-lg {
      font-size: clamp(2rem, 6vw, 3rem);
      text-shadow: 3px 3px 0 var(--bzm-black);
    }

    .size-xl {
      font-size: clamp(2.5rem, 8vw, 4rem);
      text-shadow: 4px 4px 0 var(--bzm-black);
      -webkit-text-stroke: 2px var(--bzm-black);
    }

    /* ── Alignment ── */
    .align-left { text-align: left; }
    .align-center { text-align: center; }
    .align-right { text-align: right; }
  `,
})
export class BzmPageTitleComponent {
  readonly size = input<PageTitleSize>('md');
  readonly color = input<string>('var(--bzm-color-primary)');
  readonly align = input<'left' | 'center' | 'right'>('center');

  protected readonly titleClasses = computed(
    () => `bzm-page-title size-${this.size()} align-${this.align()}`
  );

  protected readonly titleStyle = computed(
    () => `color: ${this.color()}`
  );
}
