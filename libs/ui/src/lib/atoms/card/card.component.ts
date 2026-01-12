import { Component, ChangeDetectionStrategy, input, computed } from '@angular/core';

export type CardVariant = 'default' | 'outlined' | 'elevated';

@Component({
  selector: 'bzm-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div [class]="cardClasses()" [style]="cardStyle()" role="region" [attr.aria-label]="ariaLabel()">
      <ng-content />
    </div>
  `,
  styles: `
    :host {
      display: block;
      font-family: var(--bzm-font-family);
    }

    .bzm-card {
      background: var(--bzm-color-surface);
      border: 4px solid var(--bzm-color-border);
      border-width: 3px 4px 5px 3px;
      border-radius: var(--bzm-radius-md);
      padding: var(--bzm-space-8);
      box-shadow: var(--bzm-shadow-card);
      transition:
        transform var(--bzm-transition-playful),
        box-shadow var(--bzm-transition-base);
    }

    .bzm-card--outlined {
      box-shadow: none;
    }

    .bzm-card--elevated {
      box-shadow: var(--bzm-shadow-lg);
    }

    .bzm-card--interactive {
      cursor: pointer;
    }

    .bzm-card--interactive:hover {
      transform: translateY(-3px) rotate(-0.5deg);
      box-shadow: var(--bzm-shadow-lg);
    }

    .bzm-card--interactive:active {
      transform: translateY(2px);
      box-shadow: var(--bzm-shadow-sm);
    }

    @media (prefers-reduced-motion: reduce) {
      .bzm-card {
        transition: none;
      }

      .bzm-card--interactive:hover {
        transform: none;
      }

      .bzm-card--interactive:active {
        transform: none;
      }
    }
  `,
})
export class BzmCardComponent {
  readonly variant = input<CardVariant>('default');
  readonly borderColor = input<string | undefined>(undefined);
  readonly interactive = input<boolean>(false);
  readonly ariaLabel = input<string | undefined>(undefined);

  protected readonly cardClasses = computed(() => {
    const classes = ['bzm-card'];
    const v = this.variant();
    if (v !== 'default') {
      classes.push(`bzm-card--${v}`);
    }
    if (this.interactive()) {
      classes.push('bzm-card--interactive');
    }
    return classes.join(' ');
  });

  protected readonly cardStyle = computed(() => {
    const color = this.borderColor();
    return color ? `border-color: ${color}` : '';
  });
}
