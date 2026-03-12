import { Component, ChangeDetectionStrategy, input, output, linkedSignal } from '@angular/core';

/** Supported age band ranges for difficulty calibration. */
export type AgeBand = '8-10' | '11-13' | '14-16' | '17-20';

interface AgeBandOption {
  readonly band: AgeBand;
  readonly label: string;
  readonly description: string;
  readonly icon: string;
  readonly tint: string;
  readonly tintLight: string;
}

const AGE_BAND_OPTIONS: readonly AgeBandOption[] = [
  {
    band: '8-10',
    label: 'Ontdekker',
    description: 'Leuke vragen speciaal voor jou!',
    icon: 'ph-compass',
    tint: '#16a34a',
    tintLight: '#dcfce7',
  },
  {
    band: '11-13',
    label: 'Avonturier',
    description: 'Ga op avontuur met kennis!',
    icon: 'ph-rocket',
    tint: '#2563eb',
    tintLight: '#dbeafe',
  },
  {
    band: '14-16',
    label: 'Uitdager',
    description: 'Daag jezelf uit!',
    icon: 'ph-lightning',
    tint: '#7c3aed',
    tintLight: '#ede9fe',
  },
  {
    band: '17-20',
    label: 'Kampioen',
    description: 'Laat zien wat je weet!',
    icon: 'ph-crown',
    tint: '#dc2626',
    tintLight: '#fee2e2',
  },
] as const;

@Component({
  selector: 'bzm-age-band-selector',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="age-band" role="radiogroup" aria-label="Leeftijdscategorie selecteren">
      <!-- Mascot placeholder -->
      <div class="age-band__mascot" aria-hidden="true">
        <i class="ph-duotone ph-brain" style="font-size: 48px;"></i>
      </div>

      <!-- Header -->
      <h1 class="age-band__title">Hoe oud ben je?</h1>
      <p class="age-band__subtitle">Dit helpt ons de juiste vragen te kiezen</p>

      <!-- Selection grid -->
      <div class="age-band__grid">
        @for (option of options; track option.band) {
          <button
            class="age-band__card"
            [class.age-band__card--selected]="internalSelected() === option.band"
            [style.--card-tint]="option.tint"
            [style.--card-tint-light]="option.tintLight"
            type="button"
            role="radio"
            [attr.aria-checked]="internalSelected() === option.band"
            [attr.aria-label]="option.band + ' jaar, ' + option.label"
            (click)="selectBand(option.band)"
          >
            <span class="age-band__card-icon" aria-hidden="true">
              <i [class]="'ph-duotone ' + option.icon" style="font-size: 32px;"></i>
            </span>
            <span class="age-band__card-age">{{ option.band }}</span>
            <span class="age-band__card-label">{{ option.label }}</span>
            <span class="age-band__card-desc">{{ option.description }}</span>
          </button>
        }
      </div>

      <!-- Confirm button -->
      <button
        class="age-band__confirm"
        type="button"
        [disabled]="!internalSelected()"
        [attr.aria-disabled]="!internalSelected()"
        (click)="confirmSelection()"
        aria-label="Start"
      >
        <i class="ph-duotone ph-play" aria-hidden="true" style="font-size: 20px;"></i>
        Start!
      </button>
    </div>
  `,
  styles: `
    :host {
      display: block;
      font-family: var(--bzm-font-family);
    }

    .age-band {
      max-width: 520px;
      margin: 0 auto;
      text-align: center;
    }

    /* Mascot */
    .age-band__mascot {
      color: var(--bzm-color-primary);
      margin-bottom: var(--bzm-space-3);
      animation: bzm-age-float 3s ease-in-out infinite;
    }

    /* Header */
    .age-band__title {
      margin: 0 0 var(--bzm-space-2);
      font-family: var(--bzm-font-heading);
      font-size: clamp(2rem, 8vw, 3rem);
      color: var(--bzm-color-text);
      text-shadow: 2px 2px 0 var(--bzm-color-border);
      line-height: var(--bzm-line-height-tight);
    }

    .age-band__subtitle {
      margin: 0 0 var(--bzm-space-6);
      font-size: var(--bzm-font-size-base);
      color: var(--bzm-color-text-muted);
      font-weight: var(--bzm-font-weight-semibold);
    }

    /* Grid */
    .age-band__grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: var(--bzm-space-4);
      margin-bottom: var(--bzm-space-6);
    }

    /* Card */
    .age-band__card {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--bzm-space-2);
      padding: var(--bzm-space-5) var(--bzm-space-3);
      background: var(--card-tint-light);
      border: 4px solid var(--bzm-color-border);
      border-width: var(--bzm-border-width-comic);
      border-radius: var(--bzm-radius-lg);
      box-shadow: var(--bzm-shadow-card);
      cursor: pointer;
      font-family: var(--bzm-font-family);
      transition:
        transform var(--bzm-transition-playful),
        box-shadow var(--bzm-transition-base),
        border-color var(--bzm-transition-base);
    }

    .age-band__card:hover {
      transform: translateY(-4px);
      box-shadow: 6px 6px 0 var(--bzm-black);
    }

    .age-band__card:active {
      transform: scale(0.97);
      box-shadow: 2px 2px 0 var(--bzm-black);
    }

    .age-band__card--selected {
      border-color: var(--card-tint);
      box-shadow: 0 0 0 3px var(--card-tint), 5px 5px 0 var(--bzm-black);
      transform: translateY(-4px);
    }

    .age-band__card--selected:hover {
      box-shadow: 0 0 0 3px var(--card-tint), 7px 7px 0 var(--bzm-black);
    }

    /* Card content */
    .age-band__card-icon {
      color: var(--card-tint);
      filter: drop-shadow(1px 1px 0 var(--bzm-black));
    }

    .age-band__card-age {
      font-family: var(--bzm-font-heading);
      font-size: var(--bzm-font-size-3xl);
      font-weight: var(--bzm-font-weight-black);
      color: var(--card-tint);
      line-height: var(--bzm-line-height-tight);
      text-shadow: 1px 1px 0 var(--bzm-black);
      -webkit-text-stroke: 0.5px var(--bzm-black);
      paint-order: stroke fill;
    }

    .age-band__card-label {
      font-size: var(--bzm-font-size-base);
      font-weight: var(--bzm-font-weight-extrabold);
      color: var(--card-tint);
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }

    .age-band__card-desc {
      font-size: var(--bzm-font-size-xs);
      color: var(--bzm-color-text-muted);
      font-weight: var(--bzm-font-weight-semibold);
      line-height: var(--bzm-line-height-normal);
    }

    /* Confirm button */
    .age-band__confirm {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: var(--bzm-space-2);
      width: 100%;
      padding: var(--bzm-space-4) var(--bzm-space-6);
      background: var(--bzm-color-primary);
      color: var(--bzm-white);
      border: 4px solid var(--bzm-black);
      border-width: var(--bzm-border-width-comic);
      border-radius: var(--bzm-radius-md);
      font-family: var(--bzm-font-family);
      font-size: var(--bzm-font-size-xl);
      font-weight: var(--bzm-font-weight-extrabold);
      cursor: pointer;
      box-shadow: 4px 4px 0 var(--bzm-black);
      transition:
        transform var(--bzm-transition-playful),
        box-shadow var(--bzm-transition-base),
        opacity var(--bzm-transition-base);
    }

    .age-band__confirm:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 6px 6px 0 var(--bzm-black);
    }

    .age-band__confirm:active:not(:disabled) {
      transform: scale(0.98);
      box-shadow: 2px 2px 0 var(--bzm-black);
    }

    .age-band__confirm:disabled {
      opacity: 0.4;
      cursor: not-allowed;
      box-shadow: 2px 2px 0 var(--bzm-color-border);
    }

    /* Animations */
    @keyframes bzm-age-float {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-6px); }
    }

    @media (prefers-reduced-motion: reduce) {
      .age-band__mascot {
        animation: none;
      }

      .age-band__card,
      .age-band__confirm {
        transition: none;
      }
    }

    @media (max-width: 400px) {
      .age-band__grid {
        grid-template-columns: 1fr;
      }
    }
  `,
})
/**
 * Renders a first-launch age band selection screen with four colorful, playful
 * cards arranged in a 2x2 grid. Each card represents an age range (8-10, 11-13,
 * 14-16, 17-20) with a Dutch label, icon, and encouraging description.
 *
 * The component uses a radiogroup pattern for accessibility and a two-step
 * interaction: click a card to select, then confirm with the "Start!" button.
 * Selection is indicated by an accent border glow and lift effect.
 *
 * @selector bzm-age-band-selector
 *
 * @example
 * ```html
 * <bzm-age-band-selector
 *   [selectedBand]="null"
 *   (bandSelected)="onBandSelected($event)"
 *   (confirmed)="onConfirmed($event)"
 * />
 * ```
 */
export class BzmAgeBandSelectorComponent {
  /** Currently selected age band, or null if none. @default null */
  readonly selectedBand = input<AgeBand | null>(null);

  /** Emits the age band when a card is clicked. */
  readonly bandSelected = output<AgeBand>();

  /** Emits the age band when selection is confirmed via the "Start!" button. */
  readonly confirmed = output<AgeBand>();

  /** Constant reference to the age band options for the template. */
  protected readonly options = AGE_BAND_OPTIONS;

  /** Internal selection state that syncs with the input and allows user interaction. */
  protected readonly internalSelected = linkedSignal(() => this.selectedBand());

  protected selectBand(band: AgeBand): void {
    this.internalSelected.set(band);
    this.bandSelected.emit(band);
  }

  protected confirmSelection(): void {
    const band = this.internalSelected();
    if (band) {
      this.confirmed.emit(band);
    }
  }
}
