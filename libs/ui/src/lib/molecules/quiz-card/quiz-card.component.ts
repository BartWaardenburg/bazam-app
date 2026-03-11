import { Component, ChangeDetectionStrategy, computed, input, output } from '@angular/core';

@Component({
  selector: 'bzm-quiz-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      type="button"
      class="bzm-quiz-card"
      (click)="cardClick.emit()"
      [attr.aria-label]="'Open quiz: ' + title()"
    >
      <div class="bzm-quiz-card__image" [style]="imageAreaStyle()">
        @if (imageUrl()) {
          <img [src]="imageUrl()" [alt]="title()" class="bzm-quiz-card__img" />
        } @else {
<i class="ph-duotone ph-brain" style="font-size: 40px; color: white;"></i>
        }
      </div>
      <div class="bzm-quiz-card__content">
        <span class="bzm-quiz-card__title">{{ title() }}</span>
        <span class="bzm-quiz-card__subtitle">{{ subtitle() }}</span>
        @if (hasProgress()) {
          <div class="bzm-quiz-card__progress-track">
            <div
              class="bzm-quiz-card__progress-fill"
              [style.width.%]="progress()"
            ></div>
          </div>
        }
        <span class="bzm-quiz-card__count">{{ questionCount() }} questions</span>
      </div>
      <div class="bzm-quiz-card__play" [style]="playStyle()">
        <i class="ph-duotone ph-play" style="font-size: 22px; color: white;"></i>
      </div>
    </button>
  `,
  styles: `
    :host {
      display: block;
      width: 100%;
    }

    .bzm-quiz-card {
      display: flex;
      align-items: center;
      gap: var(--bzm-space-4);
      width: 100%;
      padding: var(--bzm-space-4);
      background: var(--bzm-color-surface);
      border: 4px solid var(--bzm-black);
      border-width: 3px 4px 5px 3px;
      border-radius: var(--bzm-radius-md);
      box-shadow: var(--bzm-shadow-card);

      cursor: pointer;
      transition: transform var(--bzm-transition-playful),
                  box-shadow var(--bzm-transition-base);
      font-family: var(--bzm-font-family);
      text-align: left;
      outline: none;
    }

    .bzm-quiz-card:hover {
      transform: scale(1.02);
      box-shadow: var(--bzm-shadow-lg);
    }

    .bzm-quiz-card:focus-visible {
      box-shadow: 0 0 0 3px var(--bzm-cyan-300), var(--bzm-shadow-card);
    }

    .bzm-quiz-card__image {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 64px;
      height: 64px;
      border-radius: var(--bzm-radius-lg);
      flex-shrink: 0;
      overflow: hidden;
    }

    .bzm-quiz-card__img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .bzm-quiz-card__content {
      flex: 1;
      min-width: 0;
      display: flex;
      flex-direction: column;
      gap: var(--bzm-space-1);
    }

    .bzm-quiz-card__title {
      font-size: var(--bzm-font-size-base);
      font-weight: var(--bzm-font-weight-bold);
      color: var(--bzm-color-text);
      line-height: var(--bzm-line-height-snug);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .bzm-quiz-card__subtitle {
      font-size: var(--bzm-font-size-sm);
      font-weight: var(--bzm-font-weight-medium);
      color: var(--bzm-color-text-secondary);
      line-height: var(--bzm-line-height-normal);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .bzm-quiz-card__count {
      font-size: var(--bzm-font-size-xs);
      font-weight: var(--bzm-font-weight-semibold);
      color: var(--bzm-color-text-muted);
    }

    .bzm-quiz-card__progress-track {
      width: 100%;
      height: 6px;
      background: var(--bzm-gray-200);
      border-radius: var(--bzm-radius-full);
      overflow: hidden;
      margin-top: var(--bzm-space-1);
    }

    .bzm-quiz-card__progress-fill {
      height: 100%;
      background: var(--bzm-color-primary);
      border-radius: var(--bzm-radius-full);
      transition: width var(--bzm-transition-smooth);
    }

    .bzm-quiz-card__play {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      width: 44px;
      height: 44px;
      border-radius: var(--bzm-radius-full);
      transition: transform var(--bzm-transition-playful),
                  filter var(--bzm-transition-base);
    }

    .bzm-quiz-card:hover .bzm-quiz-card__play {
      transform: scale(1.1);
      filter: brightness(1.1);
    }
  `,
})
/**
 * Renders a clickable quiz card showing title, subtitle, question count, and optional progress indicator.
 *
 * Displays a compact card with a colored image area, quiz metadata, an optional
 * progress track, and a play button. Scales up on hover with a playful transition.
 * Used in quiz selection lists.
 *
 * @selector bzm-quiz-card
 *
 * @example
 * ```html
 * <bzm-quiz-card
 *   title="Aardrijkskunde"
 *   subtitle="Hoofdsteden van Europa"
 *   [questionCount]="15"
 *   [progress]="40"
 *   color="var(--bzm-cyan-500)"
 *   (cardClick)="openQuiz()"
 * />
 * ```
 */
export class BzmQuizCardComponent {
  /** Quiz title displayed as the primary label. */
  readonly title = input.required<string>();

  /** Secondary descriptive text displayed below the title. */
  readonly subtitle = input.required<string>();

  /** Number of questions in the quiz, shown as a count label. */
  readonly questionCount = input.required<number>();

  /** URL for the quiz thumbnail image. Falls back to a brain icon placeholder when not provided. @default undefined */
  readonly imageUrl = input<string | undefined>(undefined);

  /** Completion percentage (0-100). When provided, renders a thin progress track below the subtitle. @default undefined */
  readonly progress = input<number | undefined>(undefined);

  /** Background color for the image area and play button. @default undefined (falls back to primary) */
  readonly color = input<string | undefined>(undefined);

  /** Emits when the player clicks anywhere on the quiz card. */
  readonly cardClick = output<void>();

  readonly hasProgress = computed(() => this.progress() !== undefined);

  readonly imageAreaStyle = computed(() => {
    const c = this.color() ?? 'var(--bzm-color-primary)';
    return `background: ${c}`;
  });

  readonly playStyle = computed(() => {
    const c = this.color() ?? 'var(--bzm-color-primary)';
    return `background: ${c}`;
  });
}
