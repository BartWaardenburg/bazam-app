import { Component, ChangeDetectionStrategy, input, output, computed } from '@angular/core';

const CATEGORY_COLORS: Record<string, string> = {
  'science': '#3b82f6',
  'nature': '#22c55e',
  'history': '#a855f7',
  'geography': '#f97316',
  'entertainment': '#ec4899',
  'sports': '#ef4444',
  'music': '#8b5cf6',
  'art': '#14b8a6',
  'technology': '#06b6d4',
  'food': '#f59e0b',
};

const DEFAULT_CATEGORY_COLOR = '#22c55e';

@Component({
  selector: 'bzm-learn-more',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="bzm-learn-more"
      [style.--category-color]="categoryColor()"
      [class.bzm-learn-more--collapsed]="!expanded()"
      role="region"
      aria-label="Leermoment"
    >
      <button
        type="button"
        class="bzm-learn-more__header"
        (click)="toggleExpand.emit()"
        [attr.aria-expanded]="expanded()"
        [attr.aria-controls]="contentId"
      >
        <div class="bzm-learn-more__icon-wrapper">
          <i class="ph-duotone ph-lightbulb bzm-learn-more__icon"></i>
        </div>
        <h4 class="bzm-learn-more__title">Wist je dat...?</h4>
        <i
          [class]="'ph-duotone ' + (expanded() ? 'ph-caret-up' : 'ph-caret-down') + ' bzm-learn-more__chevron'"
        ></i>
      </button>

      @if (expanded()) {
        <div class="bzm-learn-more__body" [id]="contentId">
          <div class="bzm-learn-more__correct">
            <span class="bzm-learn-more__correct-label">Het juiste antwoord was:</span>
            <span class="bzm-learn-more__correct-answer">{{ correctAnswer() }}</span>
          </div>

          <p class="bzm-learn-more__fact">{{ fact() }}</p>

          <div class="bzm-learn-more__category">
            <i class="ph-duotone ph-tag bzm-learn-more__category-icon"></i>
            <span class="bzm-learn-more__category-name">{{ category() }}</span>
          </div>
        </div>
      }
    </div>
  `,
  styles: `
    :host {
      display: block;
      font-family: var(--bzm-font-family);
    }

    .bzm-learn-more {
      background: var(--bzm-color-surface);
      border: 4px solid var(--bzm-color-border);
      border-width: 3px 4px 5px 3px;
      border-radius: var(--bzm-radius-md);
      border-left: 6px solid var(--category-color, #22c55e);
      box-shadow: var(--bzm-shadow-card);
      overflow: hidden;
    }

    .bzm-learn-more__header {
      display: flex;
      align-items: center;
      gap: var(--bzm-space-3);
      width: 100%;
      padding: var(--bzm-space-4) var(--bzm-space-5);
      background: linear-gradient(
        135deg,
        color-mix(in srgb, var(--category-color, #22c55e) 8%, transparent) 0%,
        transparent 100%
      );
      border: none;
      cursor: pointer;
      font-family: inherit;
      text-align: left;
      outline: none;
    }

    .bzm-learn-more__header:focus-visible {
      box-shadow: inset 0 0 0 3px var(--bzm-cyan-300);
    }

    .bzm-learn-more__icon-wrapper {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      background: color-mix(in srgb, var(--category-color, #22c55e) 15%, transparent);
      border-radius: var(--bzm-radius-full);
      flex-shrink: 0;
    }

    .bzm-learn-more__icon {
      font-size: 22px;
      color: var(--category-color, #22c55e);
    }

    .bzm-learn-more__title {
      margin: 0;
      flex: 1;
      font-family: var(--bzm-font-heading);
      font-size: var(--bzm-font-size-lg);
      font-weight: var(--bzm-font-weight-extrabold);
      color: var(--bzm-color-text);
    }

    .bzm-learn-more__chevron {
      font-size: 20px;
      color: var(--bzm-color-text-muted);
      transition: transform var(--bzm-transition-base);
      flex-shrink: 0;
    }

    .bzm-learn-more__body {
      padding: 0 var(--bzm-space-5) var(--bzm-space-5);
      display: flex;
      flex-direction: column;
      gap: var(--bzm-space-4);
      animation: bzm-learn-more-expand 0.3s ease-out;
    }

    .bzm-learn-more__correct {
      display: flex;
      flex-direction: column;
      gap: var(--bzm-space-1);
      padding: var(--bzm-space-3) var(--bzm-space-4);
      background: color-mix(in srgb, var(--category-color, #22c55e) 8%, transparent);
      border-radius: var(--bzm-radius-sm);
      border: 2px solid color-mix(in srgb, var(--category-color, #22c55e) 20%, transparent);
    }

    .bzm-learn-more__correct-label {
      font-size: var(--bzm-font-size-xs);
      font-weight: var(--bzm-font-weight-semibold);
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: var(--bzm-color-text-muted);
    }

    .bzm-learn-more__correct-answer {
      font-size: var(--bzm-font-size-lg);
      font-weight: var(--bzm-font-weight-extrabold);
      color: var(--category-color, #22c55e);
    }

    .bzm-learn-more__fact {
      margin: 0;
      font-size: var(--bzm-font-size-base);
      font-weight: var(--bzm-font-weight-medium);
      color: var(--bzm-color-text-secondary);
      line-height: var(--bzm-line-height-relaxed);
    }

    .bzm-learn-more__category {
      display: flex;
      align-items: center;
      gap: var(--bzm-space-2);
    }

    .bzm-learn-more__category-icon {
      font-size: 16px;
      color: var(--category-color, #22c55e);
    }

    .bzm-learn-more__category-name {
      font-size: var(--bzm-font-size-sm);
      font-weight: var(--bzm-font-weight-bold);
      color: var(--category-color, #22c55e);
      text-transform: capitalize;
    }

    @keyframes bzm-learn-more-expand {
      0% {
        opacity: 0;
        transform: translateY(-8px);
      }
      100% {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .bzm-learn-more__body {
        animation: none;
      }

      .bzm-learn-more__chevron {
        transition: none;
      }
    }
  `,
})
/**
 * Expandable fun-fact card displayed after a wrong answer to turn mistakes into learning moments.
 *
 * Shows the correct answer prominently alongside an educational fact, framed
 * with a lightbulb icon and positive green tints to encourage continued play.
 * The left border uses a category-specific accent color. Supports collapse/expand toggling.
 *
 * @selector bzm-learn-more
 *
 * @example
 * ```html
 * <bzm-learn-more
 *   fact="De Eiffeltoren groeit in de zomer tot 15 cm door uitzetting van het metaal."
 *   correctAnswer="De Eiffeltoren"
 *   category="geography"
 *   [expanded]="true"
 *   (toggleExpand)="onToggle()"
 * />
 * ```
 */
export class BzmLearnMoreComponent {
  /** Unique ID for the collapsible content region, safe for multiple instances. */
  protected readonly contentId = `learn-more-${Math.random().toString(36).slice(2, 8)}`;

  /** The educational fact to display. */
  readonly fact = input.required<string>();

  /** The correct answer that the player missed. */
  readonly correctAnswer = input.required<string>();

  /** Category name used to determine the accent color. */
  readonly category = input.required<string>();

  /** Whether the card body is expanded. @default true */
  readonly expanded = input<boolean>(true);

  /** Emitted when the header is clicked to toggle expand/collapse. */
  readonly toggleExpand = output<void>();

  /** Resolved CSS color for the category accent. */
  protected readonly categoryColor = computed(() => {
    const key = this.category().toLowerCase();
    return CATEGORY_COLORS[key] ?? DEFAULT_CATEGORY_COLOR;
  });
}
