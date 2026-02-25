import { Component, ChangeDetectionStrategy, computed, input, output } from '@angular/core';

export type AnswerLetter = 'A' | 'B' | 'C' | 'D';

@Component({
  selector: 'bzm-answer-option',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      type="button"
      [class]="containerClass()"
      [style]="containerStyle()"
      [disabled]="disabled()"
      (click)="handleClick()"
    >
      <span class="bzm-answer-option__letter" [style]="letterStyle()">
        {{ letter() }}
      </span>
      <span class="bzm-answer-option__text">{{ text() }}</span>
      @if (correct() === true) {
        <span class="bzm-answer-option__icon bzm-answer-option__icon--correct">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M4 10l4 4 8-8" stroke="var(--bzm-color-text-on-primary)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </span>
      }
      @if (correct() === false) {
        <span class="bzm-answer-option__icon bzm-answer-option__icon--incorrect">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M5 5l10 10M15 5l-10 10" stroke="var(--bzm-color-text-on-primary)" stroke-width="2.5" stroke-linecap="round"/>
          </svg>
        </span>
      }
    </button>
  `,
  styles: `
    :host {
      display: block;
      width: 100%;
    }

    .bzm-answer-option {
      display: flex;
      align-items: center;
      gap: var(--bzm-space-4);
      width: 100%;
      padding: var(--bzm-space-4) var(--bzm-space-5);
      background: var(--bzm-color-surface);
      border: 4px solid var(--bzm-color-border);
      border-width: 3px 4px 5px 3px;
      border-radius: var(--bzm-radius-md);
      box-shadow: var(--bzm-shadow-md);
      cursor: pointer;
      transition: transform var(--bzm-transition-playful),
                  box-shadow var(--bzm-transition-base),
                  border-color var(--bzm-transition-base);
      font-family: var(--bzm-font-family);
      outline: none;
      text-align: left;

    }

    .bzm-answer-option:hover:not(:disabled) {
      transform: translateY(-3px) rotate(-0.5deg);
      box-shadow: var(--bzm-shadow-lg);
    }

    .bzm-answer-option:focus-visible {
      box-shadow: 0 0 0 3px var(--bzm-cyan-300);
    }

    .bzm-answer-option--selected {
      border-width: 4px 5px 6px 4px;
    }

    .bzm-answer-option--correct {
      border-color: var(--bzm-color-success) !important;
      border-width: 4px 5px 6px 4px;
      background: var(--bzm-green-100);
    }

    .bzm-answer-option--incorrect {
      border-color: var(--bzm-color-error) !important;
      border-width: 4px 5px 6px 4px;
      background: var(--bzm-red-100);
    }

    .bzm-answer-option:disabled {
      cursor: not-allowed;
      filter: grayscale(0.5);
    }

    .bzm-answer-option__letter {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
      border-radius: var(--bzm-radius-md);
      font-size: var(--bzm-font-size-lg);
      font-weight: var(--bzm-font-weight-extrabold);
      flex-shrink: 0;
    }

    .bzm-answer-option__text {
      flex: 1;
      font-size: var(--bzm-font-size-base);
      font-weight: var(--bzm-font-weight-bold);
      color: var(--bzm-color-text);
      line-height: var(--bzm-line-height-snug);
    }

    .bzm-answer-option__icon {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      width: 28px;
      height: 28px;
      border-radius: 3px;
      border: 2px solid var(--bzm-black);
      border-width: 1.5px 2px 2px 1.5px;
    }

    .bzm-answer-option__icon--correct {
      background: var(--bzm-color-success);
    }

    .bzm-answer-option__icon--incorrect {
      background: var(--bzm-color-error);
    }
  `,
})
export class BzmAnswerOptionComponent {
  readonly letter = input.required<AnswerLetter>();
  readonly text = input.required<string>();
  readonly selected = input<boolean>(false);
  readonly correct = input<boolean | null>(null);
  readonly disabled = input<boolean>(false);

  readonly selectedEvent = output<void>({ alias: 'selected' });

  readonly letterColorMap: Record<AnswerLetter, string> = {
    A: 'var(--bzm-cyan-700)',
    B: 'var(--bzm-yellow-700)',
    C: 'var(--bzm-red-700)',
    D: 'var(--bzm-green-700)',
  };

  readonly letterBgMap: Record<AnswerLetter, string> = {
    A: 'var(--bzm-cyan-100)',
    B: 'var(--bzm-yellow-100)',
    C: 'var(--bzm-red-100)',
    D: 'var(--bzm-green-100)',
  };

  readonly containerClass = computed(() => {
    const classes = ['bzm-answer-option'];
    if (this.selected()) classes.push('bzm-answer-option--selected');
    if (this.correct() === true) classes.push('bzm-answer-option--correct');
    if (this.correct() === false) classes.push('bzm-answer-option--incorrect');
    return classes.join(' ');
  });

  readonly borderColorMap: Record<AnswerLetter, string> = {
    A: 'var(--bzm-color-answer-a)',
    B: 'var(--bzm-color-answer-b)',
    C: 'var(--bzm-color-answer-c)',
    D: 'var(--bzm-color-answer-d)',
  };

  readonly containerStyle = computed(() => {
    const l = this.letter();
    if (this.selected() && this.correct() === null) {
      return `border-color: ${this.borderColorMap[l]}`;
    }
    return '';
  });

  readonly letterStyle = computed(() => {
    const l = this.letter();
    return `color: ${this.letterColorMap[l]}; background: ${this.letterBgMap[l]}`;
  });

  handleClick(): void {
    if (!this.disabled()) {
      this.selectedEvent.emit();
    }
  }
}
