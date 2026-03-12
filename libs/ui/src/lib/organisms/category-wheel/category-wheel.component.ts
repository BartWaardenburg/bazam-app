import { Component, ChangeDetectionStrategy, input, output, computed } from '@angular/core';

/** A single category option rendered as a wheel segment. */
export interface CategoryWheelOption {
  readonly id: string;
  readonly name: string;
  readonly color: string;
  readonly icon: string;
}

@Component({
  selector: 'bzm-category-wheel',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (mode() === 'spin') {
      <div class="wheel-container" role="group" aria-label="Categorie wiel">
        <!-- Pointer -->
        <div class="wheel-pointer" aria-hidden="true">
          <svg width="28" height="32" viewBox="0 0 28 32">
            <polygon points="14,32 0,0 28,0" fill="var(--bzm-color-text)" />
          </svg>
        </div>

        <!-- Wheel -->
        <div
          class="wheel"
          [class.wheel--spinning]="spinning()"
          [class.wheel--selected]="!!selectedCategoryId()"
          [style]="wheelStyle()"
          role="img"
          [attr.aria-label]="wheelAriaLabel()"
        >
          <!-- Conic gradient background -->
          <div class="wheel__bg" [style.background]="conicGradient()"></div>

          <!-- Segment labels -->
          @for (seg of segmentData(); track seg.option.id) {
            <div
              class="wheel__segment-label"
              [style.transform]="seg.labelTransform"
              aria-hidden="true"
            >
              <i [class]="'ph-duotone ph-' + seg.option.icon" style="font-size: 22px;"></i>
              <span class="wheel__segment-name">{{ seg.option.name }}</span>
            </div>
          }

          <!-- Center hub -->
          <div class="wheel__hub" aria-hidden="true">
            <i class="ph-duotone ph-question" style="font-size: 28px; color: var(--bzm-white);"></i>
          </div>
        </div>

        <!-- Selected result -->
        @if (selectedCategory()) {
          <div
            class="wheel-result"
            role="status"
            aria-live="polite"
          >
            <i
              [class]="'ph-duotone ph-' + selectedCategory()!.icon"
              [style.color]="selectedCategory()!.color"
              style="font-size: 32px;"
            ></i>
            <span class="wheel-result__name">{{ selectedCategory()!.name }}</span>
          </div>
        }

        <!-- Spin button -->
        @if (!spinning() && !selectedCategoryId()) {
          <button
            type="button"
            class="wheel-spin-btn"
            (click)="spinRequested.emit()"
            aria-label="Draai het wiel"
          >
            <i class="ph-duotone ph-arrows-clockwise" style="font-size: 20px;"></i>
            DRAAIEN!
          </button>
        }

        @if (showVoteButton() && !spinning() && !selectedCategoryId()) {
          <button
            type="button"
            class="wheel-vote-btn"
            (click)="onVoteClick()"
            aria-label="Stem op categorie"
          >
            Stem!
          </button>
        }
      </div>
    }

    @if (mode() === 'vote') {
      <div class="vote-container" role="group" aria-label="Categorie stemming">
        <div class="vote-grid">
          @for (option of categories(); track option.id) {
            <button
              type="button"
              [class]="voteCardClasses(option)"
              [style]="voteCardStyle(option)"
              [attr.aria-label]="option.name"
              [attr.aria-pressed]="selectedCategoryId() === option.id"
              (click)="categoryVoted.emit(option.id)"
            >
              <div class="vote-card__icon" [style.background]="option.color">
                <i [class]="'ph-duotone ph-' + option.icon" style="font-size: 28px;"></i>
              </div>
              <span class="vote-card__name">{{ option.name }}</span>
            </button>
          }
        </div>
      </div>
    }
  `,
  styles: `
    :host {
      display: block;
      font-family: var(--bzm-font-family);
    }

    /* ─── Spin Mode ─── */
    .wheel-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--bzm-space-4);
      padding: var(--bzm-space-4);
      background: var(--bzm-color-surface);
      border: 4px solid var(--bzm-color-border);
      border-width: 3px 4px 5px 3px;
      border-radius: var(--bzm-radius-md);
      box-shadow: var(--bzm-shadow-card);
      position: relative;
    }

    .wheel-pointer {
      position: relative;
      z-index: 3;
      filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
      margin-bottom: calc(var(--bzm-space-2) * -1);
    }

    .wheel {
      position: relative;
      width: 280px;
      height: 280px;
      border-radius: 50%;
      overflow: hidden;
      border: 5px solid var(--bzm-color-border);
      box-shadow: var(--bzm-shadow-lg);
      transition: transform 0.1s ease-out;
    }

    .wheel--spinning {
      animation: bzm-wheel-spin 3.5s cubic-bezier(0.17, 0.67, 0.12, 0.99) forwards;
    }

    .wheel--selected {
      box-shadow: 0 0 24px rgba(255, 215, 0, 0.6), var(--bzm-shadow-lg);
    }

    .wheel__bg {
      position: absolute;
      inset: 0;
      border-radius: 50%;
    }

    .wheel__segment-label {
      position: absolute;
      top: 50%;
      left: 50%;
      width: 100px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 2px;
      color: var(--bzm-white);
      text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
      pointer-events: none;
      z-index: 1;
    }

    .wheel__segment-name {
      font-size: 10px;
      font-weight: var(--bzm-font-weight-bold);
      text-align: center;
      max-width: 80px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .wheel__hub {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 48px;
      height: 48px;
      border-radius: 50%;
      background: var(--bzm-color-border);
      border: 3px solid var(--bzm-white);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 2;
      box-shadow: var(--bzm-shadow-sm);
    }

    .wheel-result {
      display: flex;
      align-items: center;
      gap: var(--bzm-space-3);
      padding: var(--bzm-space-3) var(--bzm-space-5);
      background: linear-gradient(135deg, #FFF8E1, #FFD54F);
      border: 4px solid #FFC107;
      border-width: 3px 4px 5px 3px;
      border-radius: var(--bzm-radius-md);
      animation: bzm-result-pop 0.4s var(--bzm-transition-playful) backwards;
    }

    .wheel-result__name {
      font-family: var(--bzm-font-heading);
      font-size: var(--bzm-font-size-2xl);
      font-weight: var(--bzm-font-weight-extrabold);
      color: var(--bzm-color-text);
      text-shadow: 2px 2px 0 rgba(0, 0, 0, 0.1);
    }

    .wheel-spin-btn {
      display: flex;
      align-items: center;
      gap: var(--bzm-space-2);
      padding: var(--bzm-space-3) var(--bzm-space-6);
      background: var(--bzm-color-accent);
      color: var(--bzm-white);
      border: 4px solid var(--bzm-color-accent-dark);
      border-width: 3px 4px 5px 3px;
      border-radius: var(--bzm-radius-md);
      font-family: var(--bzm-font-heading);
      font-size: var(--bzm-font-size-xl);
      font-weight: var(--bzm-font-weight-extrabold);
      cursor: pointer;
      transition: transform var(--bzm-transition-playful),
                  box-shadow var(--bzm-transition-base);
      box-shadow: var(--bzm-shadow-md);
      outline: none;
    }

    .wheel-spin-btn:hover {
      transform: translateY(-2px) rotate(-1deg);
      box-shadow: var(--bzm-shadow-lg);
    }

    .wheel-spin-btn:focus-visible {
      box-shadow: 0 0 0 3px var(--bzm-color-primary);
    }

    .wheel-spin-btn:active {
      transform: translateY(1px);
    }

    .wheel-vote-btn {
      padding: var(--bzm-space-2) var(--bzm-space-5);
      background: var(--bzm-color-primary);
      color: var(--bzm-white);
      border: 3px solid var(--bzm-color-border);
      border-radius: var(--bzm-radius-md);
      font-family: var(--bzm-font-heading);
      font-size: var(--bzm-font-size-lg);
      font-weight: var(--bzm-font-weight-bold);
      cursor: pointer;
      transition: transform var(--bzm-transition-playful);
      outline: none;
    }

    .wheel-vote-btn:hover {
      transform: translateY(-2px);
    }

    .wheel-vote-btn:focus-visible {
      box-shadow: 0 0 0 3px var(--bzm-color-accent);
    }

    /* ─── Vote Mode ─── */
    .vote-container {
      padding: var(--bzm-space-4);
    }

    .vote-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
      gap: var(--bzm-space-3);
    }

    .vote-card {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--bzm-space-2);
      padding: var(--bzm-space-4) var(--bzm-space-3);
      background: var(--bzm-color-surface);
      border: 4px solid var(--bzm-color-border);
      border-width: 3px 4px 5px 3px;
      border-radius: var(--bzm-radius-md);
      box-shadow: var(--bzm-shadow-card);
      cursor: pointer;
      transition: transform var(--bzm-transition-playful),
                  box-shadow var(--bzm-transition-base),
                  border-color var(--bzm-transition-base);
      outline: none;
      font-family: inherit;
    }

    .vote-card:hover {
      transform: translateY(-3px) rotate(-0.5deg);
      box-shadow: var(--bzm-shadow-lg);
    }

    .vote-card:focus-visible {
      box-shadow: 0 0 0 3px var(--bzm-color-primary);
    }

    .vote-card--selected {
      border-width: 4px 5px 6px 4px;
      transform: translateY(-2px);
    }

    .vote-card__icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 52px;
      height: 52px;
      border-radius: var(--bzm-radius-md);
      color: var(--bzm-white);
    }

    .vote-card__name {
      font-size: var(--bzm-font-size-sm);
      font-weight: var(--bzm-font-weight-bold);
      color: var(--bzm-color-text);
    }

    @keyframes bzm-wheel-spin {
      from {
        transform: rotate(0deg);
      }
      to {
        transform: rotate(calc(1440deg + var(--bzm-wheel-offset, 0deg)));
      }
    }

    @keyframes bzm-result-pop {
      from {
        transform: scale(0);
        opacity: 0;
      }
      to {
        transform: scale(1);
        opacity: 1;
      }
    }

    /* ─── Responsive ─── */
    @media (max-width: 360px) {
      .wheel {
        width: 220px;
        height: 220px;
      }

      .wheel__segment-name {
        font-size: 8px;
        max-width: 60px;
      }

      .wheel__segment-label i {
        font-size: 16px !important;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .wheel--spinning {
        animation: none;
      }

      .wheel-result {
        animation: none;
      }

      .wheel-spin-btn,
      .wheel-vote-btn,
      .vote-card {
        transition: none;
      }

      .wheel-spin-btn:hover,
      .vote-card:hover {
        transform: none;
      }
    }
  `,
})
/**
 * Spin-the-wheel category selector with dramatic deceleration animation.
 *
 * Renders a colorful segmented wheel built with `conic-gradient` where each
 * category occupies an equal slice. In "spin" mode, a "DRAAIEN!" button
 * triggers a multi-rotation animation with deceleration easing. After
 * landing, the selected category is highlighted with a golden glow result
 * card. In "vote" mode, the categories are displayed as a grid of clickable
 * cards instead. Supports 4-8 categories with Phosphor icons in each segment.
 *
 * @selector bzm-category-wheel
 *
 * @example
 * ```html
 * <bzm-category-wheel
 *   [categories]="categories"
 *   [spinning]="isSpinning"
 *   [selectedCategoryId]="selectedId"
 *   (spinRequested)="onSpin()"
 * />
 * ```
 */
export class BzmCategoryWheelComponent {
  /** Wheel segments (4-8 categories). Each defines a color, icon, and name. */
  readonly categories = input.required<CategoryWheelOption[]>();

  /**
   * Whether the wheel is currently in its spin animation.
   * @default false
   */
  readonly spinning = input<boolean>(false);

  /**
   * The id of the selected category after the spin completes.
   * @default null
   */
  readonly selectedCategoryId = input<string | null>(null);

  /**
   * Whether to show a secondary "Stem!" voting button.
   * @default false
   */
  readonly showVoteButton = input<boolean>(false);

  /**
   * Display mode: 'spin' for the wheel animation, 'vote' for a card grid.
   * @default 'spin'
   */
  readonly mode = input<'spin' | 'vote'>('spin');

  /** Emits when the player/host clicks the spin button. */
  readonly spinRequested = output<void>();

  /** Emits the category id when a player votes (in vote mode). */
  readonly categoryVoted = output<string>();

  protected readonly segmentAngle = computed(
    (): number => 360 / this.categories().length
  );

  protected readonly conicGradient = computed((): string => {
    const cats = this.categories();
    const angle = this.segmentAngle();
    const stops = cats.map((c, i) => {
      const start = i * angle;
      const end = (i + 1) * angle;
      return `${c.color} ${start}deg ${end}deg`;
    });
    return `conic-gradient(from 0deg, ${stops.join(', ')})`;
  });

  protected readonly segmentData = computed(() => {
    const cats = this.categories();
    const angle = this.segmentAngle();

    return cats.map((option, i) => {
      const midAngle = (i * angle) + (angle / 2);
      const radians = (midAngle - 90) * (Math.PI / 180);
      const radius = 90;
      const x = Math.cos(radians) * radius;
      const y = Math.sin(radians) * radius;

      return {
        option,
        labelTransform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
      };
    });
  });

  protected readonly selectedCategory = computed(
    (): CategoryWheelOption | null => {
      const id = this.selectedCategoryId();
      if (!id) return null;
      return this.categories().find(c => c.id === id) ?? null;
    }
  );

  protected readonly wheelStyle = computed((): string => {
    const id = this.selectedCategoryId();
    if (!id) return '';

    const cats = this.categories();
    const angle = this.segmentAngle();
    const index = cats.findIndex(c => c.id === id);
    if (index === -1) return '';

    const targetAngle = -(index * angle + angle / 2);
    return `--bzm-wheel-offset: ${targetAngle}deg;`;
  });

  protected readonly wheelAriaLabel = computed((): string => {
    const selected = this.selectedCategory();
    if (selected) return `Categorie wiel, geselecteerd: ${selected.name}`;
    if (this.spinning()) return 'Categorie wiel draait...';
    return 'Categorie wiel';
  });

  protected onVoteClick(): void {
    const id = this.selectedCategoryId();
    if (id !== null) {
      this.categoryVoted.emit(id);
    }
  }

  protected voteCardClasses(option: CategoryWheelOption): string {
    const classes = ['vote-card'];
    if (this.selectedCategoryId() === option.id) {
      classes.push('vote-card--selected');
    }
    return classes.join(' ');
  }

  protected voteCardStyle(option: CategoryWheelOption): string {
    if (this.selectedCategoryId() === option.id) {
      return `border-color: ${option.color};`;
    }
    return '';
  }
}
