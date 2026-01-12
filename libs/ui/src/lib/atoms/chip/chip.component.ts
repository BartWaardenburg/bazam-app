import { Component, ChangeDetectionStrategy, input, output, computed } from '@angular/core';

@Component({
  selector: 'bzm-chip',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      [class]="chipClasses()"
      [style]="chipStyle()"
      (click)="toggled.emit()"
    >
      {{ label() }}
    </button>
  `,
  styles: `
    :host {
      display: inline-block;
      font-family: var(--bzm-font-family);
    }

    button {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border: 4px solid var(--bzm-black);
      border-width: 2px 3px 4px 2px;
      border-radius: var(--bzm-radius-md);
      font-family: var(--bzm-font-family);
      font-weight: var(--bzm-font-weight-extrabold);
      font-size: var(--bzm-font-size-sm);
      text-transform: uppercase;
      letter-spacing: 0.02em;
      padding: var(--bzm-space-1) var(--bzm-space-4);
      cursor: pointer;
      white-space: nowrap;
      user-select: none;
      transition:
        transform var(--bzm-transition-playful),
        box-shadow var(--bzm-transition-base),
        background-color var(--bzm-transition-base);
      -webkit-tap-highlight-color: transparent;
    }

    button:hover {
      transform: translateY(-3px) rotate(-1deg);
    }

    button:active {
      transform: translateY(4px);
      box-shadow: none !important;
    }

    .chip-inactive {
      background-color: var(--bzm-color-surface);
      color: var(--bzm-color-text-secondary);
      box-shadow: var(--bzm-shadow-sm);
    }

    .chip-inactive:hover {
      background-color: var(--bzm-color-surface);
      color: var(--bzm-color-text);
      box-shadow: var(--bzm-shadow-md);
    }

    .chip-active {
      background-color: var(--bzm-color-accent);
      color: var(--bzm-color-text-on-accent);
      box-shadow: var(--bzm-shadow-accent);
    }

    .chip-active-custom {
      color: var(--bzm-color-text-on-primary);
      box-shadow: var(--bzm-shadow-sm);
    }
  `,
})
export class BzmChipComponent {
  readonly label = input.required<string>();
  readonly active = input<boolean>(false);
  readonly color = input<string | undefined>(undefined);

  readonly toggled = output<void>();

  protected readonly chipClasses = computed(() => {
    if (!this.active()) return 'chip-inactive';
    if (this.color()) return 'chip-active-custom';
    return 'chip-active';
  });

  protected readonly chipStyle = computed(() => {
    const c = this.color();
    if (this.active() && c) {
      return `background-color: ${c};`;
    }
    return '';
  });
}
