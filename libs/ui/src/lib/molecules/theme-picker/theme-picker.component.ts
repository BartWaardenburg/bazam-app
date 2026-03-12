import { Component, ChangeDetectionStrategy, input, output, computed } from '@angular/core';

/** Data shape for a selectable theme option. */
export interface ThemeOption {
  readonly id: string;
  readonly name: string;
  readonly primaryColor: string;
  readonly accentColor: string;
  readonly backgroundColor: string;
  readonly icon: string;
  readonly preview?: string;
}

@Component({
  selector: 'bzm-theme-picker',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="bzm-theme-picker" role="radiogroup" aria-label="Thema kiezen">
      @for (theme of themes(); track theme.id) {
        <button
          type="button"
          class="bzm-theme-picker__card"
          [class.bzm-theme-picker__card--selected]="theme.id === selectedThemeId()"
          [attr.aria-checked]="theme.id === selectedThemeId()"
          [attr.aria-label]="theme.name"
          role="radio"
          (click)="selectTheme(theme.id)"
        >
          <div
            class="bzm-theme-picker__preview"
            [style]="previewStyle(theme)"
          >
            <div class="bzm-theme-picker__preview-header" [style.background]="theme.primaryColor"></div>
            <div class="bzm-theme-picker__preview-body">
              <div class="bzm-theme-picker__preview-block" [style.background]="theme.primaryColor"></div>
              <div class="bzm-theme-picker__preview-block bzm-theme-picker__preview-block--sm" [style.background]="theme.accentColor"></div>
            </div>
          </div>

          @if (theme.id === selectedThemeId()) {
            <div class="bzm-theme-picker__check" aria-hidden="true">
              <i class="ph-duotone ph-check-circle" style="font-size: 22px;"></i>
            </div>
          }

          <div class="bzm-theme-picker__info">
            <i [class]="'ph-duotone ph-' + theme.icon" style="font-size: 16px;"></i>
            <span class="bzm-theme-picker__name">{{ theme.name }}</span>
          </div>
        </button>
      }
    </div>
  `,
  styles: `
    :host {
      display: block;
      font-family: var(--bzm-font-family);
    }

    .bzm-theme-picker {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
      gap: var(--bzm-space-4);
    }

    .bzm-theme-picker__card {
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: stretch;
      background: var(--bzm-color-surface);
      border: 4px solid var(--bzm-color-border);
      border-width: 3px 4px 5px 3px;
      border-radius: var(--bzm-radius-md);
      box-shadow: var(--bzm-shadow-sm);
      cursor: pointer;
      transition: transform var(--bzm-transition-playful),
                  box-shadow var(--bzm-transition-base),
                  border-color var(--bzm-transition-base);
      overflow: hidden;
      outline: none;
      padding: 0;
      font-family: inherit;
    }

    .bzm-theme-picker__card:hover {
      transform: translateY(-4px);
      box-shadow: var(--bzm-shadow-lg);
    }

    .bzm-theme-picker__card:focus-visible {
      box-shadow: 0 0 0 3px var(--bzm-cyan-300);
    }

    .bzm-theme-picker__card--selected {
      border-width: 4px 5px 6px 4px;
      border-color: var(--bzm-color-primary);
      box-shadow: var(--bzm-shadow-md);
    }

    .bzm-theme-picker__card--selected:hover {
      transform: translateY(-2px);
    }

    .bzm-theme-picker__preview {
      width: 100%;
      height: 80px;
      border-radius: 4px 4px 0 0;
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }

    .bzm-theme-picker__preview-header {
      height: 20px;
      width: 100%;
    }

    .bzm-theme-picker__preview-body {
      flex: 1;
      display: flex;
      gap: 6px;
      padding: 8px;
      align-items: flex-start;
    }

    .bzm-theme-picker__preview-block {
      width: 40%;
      height: 20px;
      border-radius: 3px;
      opacity: 0.9;
    }

    .bzm-theme-picker__preview-block--sm {
      width: 30%;
      height: 14px;
    }

    .bzm-theme-picker__check {
      position: absolute;
      top: var(--bzm-space-2);
      right: var(--bzm-space-2);
      color: var(--bzm-color-primary);
      z-index: 1;
      filter: drop-shadow(1px 1px 0 var(--bzm-white));
    }

    .bzm-theme-picker__info {
      display: flex;
      align-items: center;
      gap: var(--bzm-space-2);
      padding: var(--bzm-space-3) var(--bzm-space-3);
      color: var(--bzm-color-text);
    }

    .bzm-theme-picker__name {
      font-size: var(--bzm-font-size-sm);
      font-weight: var(--bzm-font-weight-bold);
    }

    @media (prefers-reduced-motion: reduce) {
      .bzm-theme-picker__card {
        transition: none;
      }

      .bzm-theme-picker__card:hover {
        transform: none;
      }

      .bzm-theme-picker__card--selected:hover {
        transform: none;
      }
    }
  `,
})
/**
 * Displays a grid of theme preview cards for the host to customize the game's
 * visual style. Each card shows a miniature color preview of the theme's primary,
 * accent, and background colors, along with the theme name and icon. The
 * selected theme receives a checkmark badge and highlighted border.
 *
 * @selector bzm-theme-picker
 *
 * @example
 * ```html
 * <bzm-theme-picker
 *   [themes]="availableThemes"
 *   [selectedThemeId]="'standaard'"
 *   (themeSelected)="onThemeSelect($event)"
 * />
 * ```
 */
export class BzmThemePickerComponent {
  /** Available themes to display. */
  readonly themes = input.required<ThemeOption[]>();

  /**
   * ID of the currently selected theme, or null if none selected.
   * @default null
   */
  readonly selectedThemeId = input<string | null>(null);

  /** Emits the theme ID when a theme card is clicked. */
  readonly themeSelected = output<string>();

  /** Handles theme card click, emitting the selected theme's ID. */
  selectTheme(themeId: string): void {
    this.themeSelected.emit(themeId);
  }

  /** Computes inline styles for the preview area background. */
  protected previewStyle(theme: ThemeOption): string {
    return `background: ${theme.backgroundColor}`;
  }
}
