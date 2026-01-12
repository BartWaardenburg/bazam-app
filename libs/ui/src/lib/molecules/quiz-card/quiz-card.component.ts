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
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <path d="M14 2L2 8l12 6 12-6-12-6z" fill="white" opacity="0.9"/>
            <path d="M2 8v10l12 6V14L2 8z" fill="white" opacity="0.7"/>
            <path d="M26 8v10l-12 6V14l12-6z" fill="white" opacity="0.5"/>
          </svg>
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
      <div class="bzm-quiz-card__chevron">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M7.5 5l5 5-5 5" stroke="var(--bzm-color-text-muted)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
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

    .bzm-quiz-card__chevron {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      width: 32px;
      height: 32px;
    }
  `,
})
export class BzmQuizCardComponent {
  readonly title = input.required<string>();
  readonly subtitle = input.required<string>();
  readonly questionCount = input.required<number>();
  readonly imageUrl = input<string | undefined>(undefined);
  readonly progress = input<number | undefined>(undefined);
  readonly color = input<string | undefined>(undefined);

  readonly cardClick = output<void>();

  readonly hasProgress = computed(() => this.progress() !== undefined);

  readonly imageAreaStyle = computed(() => {
    const c = this.color() ?? 'var(--bzm-color-primary)';
    return `background: ${c}`;
  });
}
