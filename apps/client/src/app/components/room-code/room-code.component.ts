import { Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-room-code',
  template: `
    <div class="room-code-display" role="status" [attr.aria-label]="'Game PIN: ' + code()">
      <span class="label">Game PIN</span>
      <div class="code" aria-hidden="true">
        @for (char of codeChars(); track $index) {
          <span class="digit animate-scale" [style.animation-delay]="($index * 0.06) + 's'">{{ char }}</span>
        }
      </div>
    </div>
  `,
  styles: `
    .room-code-display {
      text-align: center;
    }

    .label {
      font-family: var(--font-heading);
      font-size: 1.1rem;
      color: var(--color-text-muted);
      text-transform: uppercase;
      letter-spacing: 0.2em;
    }

    .code {
      display: flex;
      gap: 0.5rem;
      justify-content: center;
      margin-top: 0.75rem;
    }

    .digit {
      display: flex;
      align-items: center;
      justify-content: center;
      width: clamp(2.5rem, 12vw, 3.5rem);
      height: clamp(3rem, 14vw, 4.2rem);
      background: var(--color-primary);
      color: white;
      font-family: var(--font-heading);
      font-size: clamp(1.5rem, 5vw, 2.2rem);
      border-radius: 2px;
      border: 4px solid var(--color-outline);
      border-width: 3px 4px 5px 3px;
      box-shadow:
        0 6px 0 var(--color-primary-dark),
        5px 5px 0 #000;

      transition: transform 0.3s var(--timing-playful);
      letter-spacing: 0.05em;

      &:hover {
        transform: translateY(-6px) rotate(-5deg);
      }

      &:nth-child(even) {
        transform: rotate(2deg);

        &:hover {
          transform: translateY(-6px) rotate(5deg);
        }
      }
    }
  `,
})
export class RoomCodeComponent {
  readonly code = input.required<string>();
  readonly codeChars = computed(() => this.code().split(''));
}
