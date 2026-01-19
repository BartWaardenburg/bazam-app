import { Component, ChangeDetectionStrategy, input, computed } from '@angular/core';

@Component({
  selector: 'bzm-room-code',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="bzm-room-code" role="status" [attr.aria-label]="'Game PIN: ' + code()">
      <span class="bzm-room-code__label">{{ label() }}</span>
      <div class="bzm-room-code__digits" aria-hidden="true">
        @for (char of codeChars(); track $index) {
          <span
            class="bzm-room-code__digit"
            [style.animation-delay]="($index * 0.06) + 's'"
          >{{ char }}</span>
        }
      </div>
    </div>
  `,
  styles: `
    :host {
      display: block;
      font-family: var(--bzm-font-family);
    }

    .bzm-room-code {
      text-align: center;
    }

    .bzm-room-code__label {
      font-size: var(--bzm-font-size-base);
      color: var(--bzm-color-text-muted);
      text-transform: uppercase;
      letter-spacing: 0.2em;
      font-weight: var(--bzm-font-weight-bold);
    }

    .bzm-room-code__digits {
      display: flex;
      gap: var(--bzm-space-2);
      justify-content: center;
      margin-top: var(--bzm-space-3);
    }

    .bzm-room-code__digit {
      display: flex;
      align-items: center;
      justify-content: center;
      width: clamp(2.5rem, 12vw, 3.5rem);
      height: clamp(3rem, 14vw, 4.2rem);
      background: var(--bzm-color-primary);
      color: var(--bzm-white);
      font-family: var(--bzm-font-family);
      font-size: clamp(1.5rem, 5vw, 2.2rem);
      font-weight: var(--bzm-font-weight-extrabold);
      border-radius: var(--bzm-radius-sm);
      border: 4px solid var(--bzm-black);
      border-width: 3px 4px 5px 3px;
      box-shadow:
        0 6px 0 var(--bzm-color-primary-dark),
        5px 5px 0 var(--bzm-black);
      transition: transform var(--bzm-transition-playful);
      letter-spacing: 0.05em;
      animation: bzm-digit-pop 0.3s var(--bzm-transition-playful) backwards;
    }

    .bzm-room-code__digit:hover {
      transform: translateY(-6px) rotate(-5deg);
    }

    .bzm-room-code__digit:nth-child(even) {
      transform: rotate(2deg);
    }

    .bzm-room-code__digit:nth-child(even):hover {
      transform: translateY(-6px) rotate(5deg);
    }

    @keyframes bzm-digit-pop {
      from {
        transform: scale(0) rotate(-10deg);
        opacity: 0;
      }
      to {
        transform: scale(1) rotate(0deg);
        opacity: 1;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .bzm-room-code__digit {
        animation: none;
        transition: none;
      }

      .bzm-room-code__digit:hover {
        transform: none;
      }

      .bzm-room-code__digit:nth-child(even) {
        transform: none;
      }

      .bzm-room-code__digit:nth-child(even):hover {
        transform: none;
      }
    }
  `,
})
export class BzmRoomCodeComponent {
  readonly code = input.required<string>();
  readonly label = input<string>('Game PIN');

  protected readonly codeChars = computed(() => this.code().split(''));
}
