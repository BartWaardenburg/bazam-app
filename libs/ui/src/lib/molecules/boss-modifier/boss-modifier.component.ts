import { Component, ChangeDetectionStrategy, computed, input } from '@angular/core';

const MODIFIER_ICONS: Record<string, string> = {
  'Blackout': 'eye-closed',
  'Time Crunch': 'hourglass-medium',
  'Scrambler': 'shuffle',
  'Fog of War': 'cloud-fog',
  'Taxman': 'coins',
  'Silent Treatment': 'speaker-slash',
  'Trickster': 'mask-happy',
  'Flip': 'arrows-counter-clockwise',
};

const DEFAULT_ICON = 'warning';

@Component({
  selector: 'bzm-boss-modifier',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (compact()) {
      <div
        class="bzm-boss-modifier bzm-boss-modifier--compact"
        role="img"
        [attr.aria-label]="'Boss modifier: ' + modifier() + ' — ' + description()"
      >
        <i [class]="'ph-duotone ph-' + iconName()" style="font-size: 18px;"></i>
        <span class="bzm-boss-modifier__name">{{ modifier() }}</span>
      </div>
    } @else {
      <div
        class="bzm-boss-modifier"
        role="img"
        [attr.aria-label]="'Boss modifier: ' + modifier() + ' — ' + description()"
      >
        <div class="bzm-boss-modifier__header">
          <div class="bzm-boss-modifier__icon">
            <i [class]="'ph-duotone ph-' + iconName()" style="font-size: 32px;"></i>
          </div>
          <h4 class="bzm-boss-modifier__name">{{ modifier() }}</h4>
        </div>
        <p class="bzm-boss-modifier__description">{{ description() }}</p>
      </div>
    }
  `,
  styles: `
    :host {
      display: block;
      font-family: var(--bzm-font-family);
    }

    .bzm-boss-modifier {
      position: relative;
      display: flex;
      flex-direction: column;
      gap: var(--bzm-space-3);
      padding: var(--bzm-space-4) var(--bzm-space-5);
      background: var(--bzm-gray-900);
      border: 4px solid #E17055;
      border-width: 3px 4px 5px 3px;
      border-radius: var(--bzm-radius-md);
      box-shadow: 4px 4px 0 var(--bzm-black);
      color: var(--bzm-white);
      animation: bzm-modifier-pulse 3s ease-in-out infinite;
    }

    .bzm-boss-modifier__header {
      display: flex;
      align-items: center;
      gap: var(--bzm-space-3);
    }

    .bzm-boss-modifier__icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 48px;
      height: 48px;
      background: rgba(225, 112, 85, 0.2);
      border-radius: var(--bzm-radius-md);
      color: #E17055;
      flex-shrink: 0;
    }

    .bzm-boss-modifier__name {
      font-family: var(--bzm-font-heading);
      font-size: var(--bzm-font-size-xl);
      color: var(--bzm-white);
      margin: 0;
      line-height: var(--bzm-line-height-tight);
      letter-spacing: 0.02em;
    }

    .bzm-boss-modifier__description {
      font-size: var(--bzm-font-size-sm);
      font-weight: var(--bzm-font-weight-medium);
      color: var(--bzm-gray-300);
      margin: 0;
      line-height: var(--bzm-line-height-normal);
    }

    /* Compact mode */
    .bzm-boss-modifier--compact {
      flex-direction: row;
      align-items: center;
      gap: var(--bzm-space-2);
      padding: var(--bzm-space-2) var(--bzm-space-3);
      box-shadow: 3px 3px 0 var(--bzm-black);
      animation: none;
    }

    .bzm-boss-modifier--compact .bzm-boss-modifier__name {
      font-family: var(--bzm-font-heading);
      font-size: var(--bzm-font-size-sm);
      margin: 0;
    }

    .bzm-boss-modifier--compact i {
      color: #E17055;
    }

    @keyframes bzm-modifier-pulse {
      0%, 100% {
        border-color: #E17055;
        box-shadow: 4px 4px 0 var(--bzm-black);
      }
      50% {
        border-color: #d63031;
        box-shadow: 4px 4px 0 var(--bzm-black),
                    0 0 16px rgba(225, 112, 85, 0.3);
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .bzm-boss-modifier {
        animation: none;
      }
    }
  `,
})
/**
 * Displays an active boss round modifier with its name, icon, and description.
 *
 * Shows a dark, ominous card with a red/orange accent border and a pulsing glow animation
 * to convey the menacing nature of the modifier. Supports a compact inline mode for
 * in-game HUD display. Each of the 8 modifiers maps to a unique Phosphor icon.
 *
 * @selector bzm-boss-modifier
 *
 * @example
 * ```html
 * <bzm-boss-modifier
 *   modifier="Blackout"
 *   description="Antwoordopties worden na 3 seconden verborgen"
 *   [compact]="false"
 * />
 * ```
 */
export class BzmBossModifierComponent {
  /** Modifier name, matched against the internal icon map. */
  readonly modifier = input.required<string>();

  /** Short description of what the modifier does. */
  readonly description = input.required<string>();

  /** Whether to render the compact (inline) variant. @default false */
  readonly compact = input<boolean>(false);

  protected readonly iconName = computed((): string =>
    MODIFIER_ICONS[this.modifier()] ?? DEFAULT_ICON
  );
}
