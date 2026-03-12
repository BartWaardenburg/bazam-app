import { Component, ChangeDetectionStrategy, input, output, computed, signal, inject } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

/** Configuration for a customizable player avatar. */
export interface AvatarConfig {
  readonly faceShape: 'round' | 'square' | 'oval';
  readonly eyes: 'happy' | 'cool' | 'wink' | 'surprised' | 'sleepy';
  readonly mouth: 'smile' | 'grin' | 'tongue' | 'neutral' | 'excited';
  readonly hair: 'none' | 'short' | 'long' | 'curly' | 'spiky' | 'ponytail';
  readonly accessory: 'none' | 'glasses' | 'sunglasses' | 'hat' | 'crown' | 'headband';
  readonly color: string;
}

type AvatarTab = 'face' | 'eyes' | 'mouth' | 'hair' | 'accessory' | 'color';

const TABS: { key: AvatarTab; label: string; icon: string }[] = [
  { key: 'face', label: 'Gezicht', icon: 'smiley' },
  { key: 'eyes', label: 'Ogen', icon: 'eye' },
  { key: 'mouth', label: 'Mond', icon: 'chat-circle' },
  { key: 'hair', label: 'Haar', icon: 'scissors' },
  { key: 'accessory', label: 'Accessoire', icon: 'sunglasses' },
  { key: 'color', label: 'Kleur', icon: 'palette' },
];

const FACE_OPTIONS: AvatarConfig['faceShape'][] = ['round', 'square', 'oval'];
const EYES_OPTIONS: AvatarConfig['eyes'][] = ['happy', 'cool', 'wink', 'surprised', 'sleepy'];
const MOUTH_OPTIONS: AvatarConfig['mouth'][] = ['smile', 'grin', 'tongue', 'neutral', 'excited'];
const HAIR_OPTIONS: AvatarConfig['hair'][] = ['none', 'short', 'long', 'curly', 'spiky', 'ponytail'];
const ACCESSORY_OPTIONS: AvatarConfig['accessory'][] = ['none', 'glasses', 'sunglasses', 'hat', 'crown', 'headband'];
const COLOR_PRESETS = ['#EF4444', '#F97316', '#EAB308', '#22C55E', '#06B6D4', '#3B82F6', '#8B5CF6', '#EC4899', '#6B7280', '#92400E'];

const FACE_LABELS: Record<string, string> = { round: 'Rond', square: 'Vierkant', oval: 'Ovaal' };
const EYES_LABELS: Record<string, string> = { happy: 'Blij', cool: 'Cool', wink: 'Knipoog', surprised: 'Verrast', sleepy: 'Slaperig' };
const MOUTH_LABELS: Record<string, string> = { smile: 'Glimlach', grin: 'Grijns', tongue: 'Tong', neutral: 'Neutraal', excited: 'Enthousiast' };
const HAIR_LABELS: Record<string, string> = { none: 'Geen', short: 'Kort', long: 'Lang', curly: 'Krullend', spiky: 'Stekelig', ponytail: 'Staart' };
const ACCESSORY_LABELS: Record<string, string> = { none: 'Geen', glasses: 'Bril', sunglasses: 'Zonnebril', hat: 'Hoed', crown: 'Kroon', headband: 'Hoofdband' };

const EYES_SVG: Record<string, string> = {
  happy: '<circle cx="35" cy="45" r="4" fill="#333"/><circle cx="65" cy="45" r="4" fill="#333"/>',
  cool: '<rect x="26" y="41" width="18" height="8" rx="2" fill="#333"/><rect x="56" y="41" width="18" height="8" rx="2" fill="#333"/><line x1="44" y1="45" x2="56" y2="45" stroke="#333" stroke-width="2"/>',
  wink: '<circle cx="35" cy="45" r="4" fill="#333"/><path d="M59 45 Q65 39 71 45" stroke="#333" stroke-width="2.5" fill="none" stroke-linecap="round"/>',
  surprised: '<circle cx="35" cy="45" r="6" fill="none" stroke="#333" stroke-width="2.5"/><circle cx="65" cy="45" r="6" fill="none" stroke="#333" stroke-width="2.5"/>',
  sleepy: '<path d="M28 45 Q35 40 42 45" stroke="#333" stroke-width="2.5" fill="none" stroke-linecap="round"/><path d="M58 45 Q65 40 72 45" stroke="#333" stroke-width="2.5" fill="none" stroke-linecap="round"/>',
};

const MOUTH_SVG: Record<string, string> = {
  smile: '<path d="M38 62 Q50 72 62 62" stroke="#333" stroke-width="2.5" fill="none" stroke-linecap="round"/>',
  grin: '<path d="M35 60 Q50 75 65 60" stroke="#333" stroke-width="2.5" fill="#fff" stroke-linecap="round"/>',
  tongue: '<path d="M38 62 Q50 72 62 62" stroke="#333" stroke-width="2.5" fill="none" stroke-linecap="round"/><ellipse cx="50" cy="70" rx="5" ry="4" fill="#EF4444"/>',
  neutral: '<line x1="40" y1="64" x2="60" y2="64" stroke="#333" stroke-width="2.5" stroke-linecap="round"/>',
  excited: '<ellipse cx="50" cy="65" rx="8" ry="6" fill="#333"/><ellipse cx="50" cy="63" rx="6" ry="3" fill="#fff"/>',
};

const HAIR_SVG: Record<string, string> = {
  none: '',
  short: '<path d="M25 38 Q25 15 50 12 Q75 15 75 38" fill="#5C3D2E" stroke="#333" stroke-width="2"/>',
  long: '<path d="M22 38 Q22 12 50 8 Q78 12 78 38 L78 70 Q78 75 73 72 L73 42 Q73 20 50 16 Q27 20 27 42 L27 72 Q22 75 22 70 Z" fill="#5C3D2E" stroke="#333" stroke-width="2"/>',
  curly: '<path d="M25 40 Q20 25 30 15 Q40 5 50 10 Q60 5 70 15 Q80 25 75 40" fill="#5C3D2E" stroke="#333" stroke-width="2"/><circle cx="23" cy="35" r="5" fill="#5C3D2E" stroke="#333" stroke-width="1.5"/><circle cx="77" cy="35" r="5" fill="#5C3D2E" stroke="#333" stroke-width="1.5"/>',
  spiky: '<polygon points="50,2 55,20 65,5 62,22 78,12 70,28 80,30 72,36 50,30 28,36 20,30 22,28 12,12 38,22 35,5 45,20" fill="#5C3D2E" stroke="#333" stroke-width="2"/>',
  ponytail: '<path d="M25 38 Q25 15 50 12 Q75 15 75 38" fill="#5C3D2E" stroke="#333" stroke-width="2"/><path d="M72 30 Q85 28 82 50 Q80 65 75 70" stroke="#5C3D2E" stroke-width="6" fill="none" stroke-linecap="round"/><path d="M72 30 Q85 28 82 50 Q80 65 75 70" stroke="#333" stroke-width="2" fill="none" stroke-linecap="round"/>',
};

const ACCESSORY_SVG: Record<string, string> = {
  none: '',
  glasses: '<circle cx="35" cy="45" r="10" fill="none" stroke="#333" stroke-width="2.5"/><circle cx="65" cy="45" r="10" fill="none" stroke="#333" stroke-width="2.5"/><line x1="45" y1="45" x2="55" y2="45" stroke="#333" stroke-width="2.5"/>',
  sunglasses: '<rect x="24" y="38" width="22" height="14" rx="3" fill="#333" stroke="#111" stroke-width="2"/><rect x="54" y="38" width="22" height="14" rx="3" fill="#333" stroke="#111" stroke-width="2"/><line x1="46" y1="44" x2="54" y2="44" stroke="#333" stroke-width="2.5"/>',
  hat: '<rect x="20" y="25" width="60" height="6" rx="2" fill="#3B82F6" stroke="#333" stroke-width="2"/><path d="M30 25 Q30 10 50 8 Q70 10 70 25" fill="#3B82F6" stroke="#333" stroke-width="2"/>',
  crown: '<polygon points="30,28 35,15 42,24 50,8 58,24 65,15 70,28" fill="#FFD700" stroke="#333" stroke-width="2"/>',
  headband: '<rect x="20" y="30" width="60" height="6" rx="2" fill="#EF4444" stroke="#333" stroke-width="1.5"/>',
};

@Component({
  selector: 'bzm-avatar-builder',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="builder" role="region" aria-label="Avatar samenstellen">
      <div class="builder__preview">
        <svg
          viewBox="0 0 100 100"
          class="builder__svg"
          [attr.aria-label]="'Avatar preview'"
          role="img"
        >
          <!-- Face -->
          @switch (config().faceShape) {
            @case ('round') {
              <circle cx="50" cy="50" r="38" [attr.fill]="config().color" stroke="#333" stroke-width="3"/>
            }
            @case ('square') {
              <rect x="12" y="12" width="76" height="76" rx="8" [attr.fill]="config().color" stroke="#333" stroke-width="3"/>
            }
            @case ('oval') {
              <ellipse cx="50" cy="52" rx="34" ry="40" [attr.fill]="config().color" stroke="#333" stroke-width="3"/>
            }
          }
          <!-- Hair (behind face layer for some styles) -->
          <g [innerHTML]="trustedHairSvg()"></g>
          <!-- Eyes -->
          <g [innerHTML]="trustedEyesSvg()"></g>
          <!-- Mouth -->
          <g [innerHTML]="trustedMouthSvg()"></g>
          <!-- Accessory -->
          <g [innerHTML]="trustedAccessorySvg()"></g>
        </svg>
      </div>

      <div class="builder__tabs" role="tablist" aria-label="Avatar opties">
        @for (tab of tabs; track tab.key) {
          <button
            class="builder__tab"
            [class.builder__tab--active]="activeTab() === tab.key"
            (click)="activeTab.set(tab.key)"
            role="tab"
            [attr.id]="'tab-' + tab.key"
            [attr.aria-selected]="activeTab() === tab.key"
            [attr.aria-controls]="'panel-' + tab.key"
          >
            <i [class]="'ph-duotone ph-' + tab.icon" class="builder__tab-icon"></i>
            <span class="builder__tab-label">{{ tab.label }}</span>
          </button>
        }
      </div>

      <div class="builder__options" [attr.id]="'panel-' + activeTab()" role="tabpanel" [attr.aria-labelledby]="'tab-' + activeTab()">
        @switch (activeTab()) {
          @case ('face') {
            <div class="builder__option-row">
              @for (option of faceOptions; track option) {
                <button
                  class="builder__option-btn"
                  [class.builder__option-btn--selected]="config().faceShape === option"
                  (click)="updateConfig('faceShape', option)"
                  [attr.aria-label]="faceLabels[option]"
                >
                  <span class="builder__option-label">{{ faceLabels[option] }}</span>
                  @if (config().faceShape === option) {
                    <i class="ph-duotone ph-check-circle builder__check"></i>
                  }
                </button>
              }
            </div>
          }
          @case ('eyes') {
            <div class="builder__option-row">
              @for (option of eyesOptions; track option) {
                <button
                  class="builder__option-btn"
                  [class.builder__option-btn--selected]="config().eyes === option"
                  (click)="updateConfig('eyes', option)"
                  [attr.aria-label]="eyesLabels[option]"
                >
                  <span class="builder__option-label">{{ eyesLabels[option] }}</span>
                  @if (config().eyes === option) {
                    <i class="ph-duotone ph-check-circle builder__check"></i>
                  }
                </button>
              }
            </div>
          }
          @case ('mouth') {
            <div class="builder__option-row">
              @for (option of mouthOptions; track option) {
                <button
                  class="builder__option-btn"
                  [class.builder__option-btn--selected]="config().mouth === option"
                  (click)="updateConfig('mouth', option)"
                  [attr.aria-label]="mouthLabels[option]"
                >
                  <span class="builder__option-label">{{ mouthLabels[option] }}</span>
                  @if (config().mouth === option) {
                    <i class="ph-duotone ph-check-circle builder__check"></i>
                  }
                </button>
              }
            </div>
          }
          @case ('hair') {
            <div class="builder__option-row">
              @for (option of hairOptions; track option) {
                <button
                  class="builder__option-btn"
                  [class.builder__option-btn--selected]="config().hair === option"
                  (click)="updateConfig('hair', option)"
                  [attr.aria-label]="hairLabels[option]"
                >
                  <span class="builder__option-label">{{ hairLabels[option] }}</span>
                  @if (config().hair === option) {
                    <i class="ph-duotone ph-check-circle builder__check"></i>
                  }
                </button>
              }
            </div>
          }
          @case ('accessory') {
            <div class="builder__option-row">
              @for (option of accessoryOptions; track option) {
                <button
                  class="builder__option-btn"
                  [class.builder__option-btn--selected]="config().accessory === option"
                  [class.builder__option-btn--locked]="!isAccessoryUnlocked(option)"
                  [disabled]="!isAccessoryUnlocked(option)"
                  (click)="updateConfig('accessory', option)"
                  [attr.aria-label]="accessoryLabels[option] + (!isAccessoryUnlocked(option) ? ' (vergrendeld)' : '')"
                >
                  @if (!isAccessoryUnlocked(option)) {
                    <i class="ph-duotone ph-lock-simple builder__lock"></i>
                  }
                  <span class="builder__option-label">{{ accessoryLabels[option] }}</span>
                  @if (config().accessory === option) {
                    <i class="ph-duotone ph-check-circle builder__check"></i>
                  }
                </button>
              }
            </div>
          }
          @case ('color') {
            <div class="builder__color-row">
              @for (c of colorPresets; track c) {
                <button
                  class="builder__color-btn"
                  [class.builder__color-btn--selected]="config().color === c"
                  [style.background-color]="c"
                  (click)="updateConfig('color', c)"
                  [attr.aria-label]="'Kleur ' + c"
                >
                  @if (config().color === c) {
                    <i class="ph-duotone ph-check builder__color-check"></i>
                  }
                </button>
              }
            </div>
          }
        }
      </div>
    </div>
  `,
  styles: `
    :host {
      display: block;
      font-family: var(--bzm-font-family);
    }

    .builder {
      background: var(--bzm-color-surface);
      border: 4px solid var(--bzm-color-border);
      border-width: 3px 4px 5px 3px;
      border-radius: var(--bzm-radius-md);
      box-shadow: var(--bzm-shadow-card);
      padding: var(--bzm-space-6);
    }

    .builder__preview {
      display: flex;
      justify-content: center;
      margin-bottom: var(--bzm-space-6);
    }

    .builder__svg {
      width: 120px;
      height: 120px;
      border: 4px solid var(--bzm-color-border);
      border-width: 3px 4px 5px 3px;
      border-radius: var(--bzm-radius-md);
      background: var(--bzm-white);
      box-shadow: var(--bzm-shadow-md);
    }

    .builder__tabs {
      display: flex;
      gap: var(--bzm-space-1);
      margin-bottom: var(--bzm-space-4);
      overflow-x: auto;
      -webkit-overflow-scrolling: touch;
      scrollbar-width: none;
    }

    .builder__tabs::-webkit-scrollbar {
      display: none;
    }

    .builder__tab {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 2px;
      padding: var(--bzm-space-2) var(--bzm-space-3);
      border: 2px solid var(--bzm-color-border);
      border-width: 2px 3px 3px 2px;
      border-radius: var(--bzm-radius-sm);
      background: var(--bzm-color-surface);
      cursor: pointer;
      font-family: var(--bzm-font-family);
      transition: background var(--bzm-transition-base);
      flex-shrink: 0;
    }

    .builder__tab:hover {
      background: var(--bzm-color-primary);
      color: var(--bzm-white);
    }

    .builder__tab--active {
      background: var(--bzm-color-primary);
      color: var(--bzm-white);
      box-shadow: var(--bzm-shadow-sm);
    }

    .builder__tab-icon {
      font-size: var(--bzm-font-size-lg);
    }

    .builder__tab-label {
      font-size: 10px;
      font-weight: var(--bzm-font-weight-bold);
      white-space: nowrap;
    }

    .builder__options {
      min-height: 60px;
    }

    .builder__option-row {
      display: flex;
      gap: var(--bzm-space-2);
      flex-wrap: wrap;
    }

    .builder__option-btn {
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 2px;
      padding: var(--bzm-space-2) var(--bzm-space-3);
      border: 2px solid var(--bzm-color-border);
      border-width: 2px 3px 3px 2px;
      border-radius: var(--bzm-radius-sm);
      background: var(--bzm-color-surface);
      cursor: pointer;
      font-family: var(--bzm-font-family);
      transition:
        transform var(--bzm-transition-playful),
        box-shadow var(--bzm-transition-base);
      min-width: 64px;
    }

    .builder__option-btn:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: var(--bzm-shadow-sm);
    }

    .builder__option-btn--selected {
      border-color: var(--bzm-color-primary);
      background: var(--bzm-color-primary);
      color: var(--bzm-white);
    }

    .builder__option-btn--locked {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .builder__option-label {
      font-size: var(--bzm-font-size-sm);
      font-weight: var(--bzm-font-weight-bold);
    }

    .builder__check {
      font-size: 14px;
    }

    .builder__lock {
      font-size: 14px;
      color: var(--bzm-color-text-muted);
    }

    .builder__color-row {
      display: flex;
      gap: var(--bzm-space-2);
      flex-wrap: wrap;
    }

    .builder__color-btn {
      width: 40px;
      height: 40px;
      border: 3px solid var(--bzm-color-border);
      border-width: 2px 3px 3px 2px;
      border-radius: var(--bzm-radius-sm);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition:
        transform var(--bzm-transition-playful),
        box-shadow var(--bzm-transition-base);
    }

    .builder__color-btn:hover {
      transform: scale(1.1);
      box-shadow: var(--bzm-shadow-sm);
    }

    .builder__color-btn--selected {
      border-color: var(--bzm-color-text);
      box-shadow: var(--bzm-shadow-md);
      transform: scale(1.1);
    }

    .builder__color-check {
      font-size: 18px;
      color: var(--bzm-white);
      filter: drop-shadow(1px 1px 0 rgba(0, 0, 0, 0.5));
    }

    @media (prefers-reduced-motion: reduce) {
      .builder__option-btn,
      .builder__color-btn {
        transition: none;
      }

      .builder__option-btn:hover:not(:disabled),
      .builder__color-btn:hover {
        transform: none;
      }
    }
  `,
})
/**
 * Avatar customization builder with a live SVG preview and tabbed option picker.
 * Allows players to configure face shape, eyes, mouth, hair, accessories, and color.
 * Locked accessories are visually disabled.
 *
 * @selector bzm-avatar-builder
 *
 * @example
 * ```html
 * <bzm-avatar-builder
 *   [config]="avatarConfig"
 *   [unlockedAccessories]="['none', 'glasses', 'hat']"
 *   (configChange)="onConfigChange($event)"
 * />
 * ```
 */
export class BzmAvatarBuilderComponent {
  private readonly sanitizer = inject(DomSanitizer);

  /** Current avatar configuration. */
  readonly config = input.required<AvatarConfig>();

  /**
   * List of unlocked accessory keys available for selection.
   * @default ['none', 'glasses']
   */
  readonly unlockedAccessories = input<string[]>(['none', 'glasses']);

  /** Emitted whenever a configuration option is changed. */
  readonly configChange = output<AvatarConfig>();

  protected readonly activeTab = signal<AvatarTab>('face');

  protected readonly tabs = TABS;
  protected readonly faceOptions = FACE_OPTIONS;
  protected readonly eyesOptions = EYES_OPTIONS;
  protected readonly mouthOptions = MOUTH_OPTIONS;
  protected readonly hairOptions = HAIR_OPTIONS;
  protected readonly accessoryOptions = ACCESSORY_OPTIONS;
  protected readonly colorPresets = COLOR_PRESETS;

  protected readonly faceLabels = FACE_LABELS;
  protected readonly eyesLabels = EYES_LABELS;
  protected readonly mouthLabels = MOUTH_LABELS;
  protected readonly hairLabels = HAIR_LABELS;
  protected readonly accessoryLabels = ACCESSORY_LABELS;

  protected readonly eyesSvg = computed(() => EYES_SVG[this.config().eyes] ?? '');
  protected readonly mouthSvg = computed(() => MOUTH_SVG[this.config().mouth] ?? '');
  protected readonly hairSvg = computed(() => HAIR_SVG[this.config().hair] ?? '');
  protected readonly accessorySvg = computed(() => ACCESSORY_SVG[this.config().accessory] ?? '');

  protected readonly trustedEyesSvg = computed((): SafeHtml =>
    this.sanitizer.bypassSecurityTrustHtml(this.eyesSvg())
  );
  protected readonly trustedMouthSvg = computed((): SafeHtml =>
    this.sanitizer.bypassSecurityTrustHtml(this.mouthSvg())
  );
  protected readonly trustedHairSvg = computed((): SafeHtml =>
    this.sanitizer.bypassSecurityTrustHtml(this.hairSvg())
  );
  protected readonly trustedAccessorySvg = computed((): SafeHtml =>
    this.sanitizer.bypassSecurityTrustHtml(this.accessorySvg())
  );

  protected isAccessoryUnlocked(accessory: string): boolean {
    return this.unlockedAccessories().includes(accessory);
  }

  protected updateConfig<K extends keyof AvatarConfig>(key: K, value: AvatarConfig[K]): void {
    this.configChange.emit({ ...this.config(), [key]: value });
  }
}
