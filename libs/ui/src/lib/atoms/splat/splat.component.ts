import { Component, ChangeDetectionStrategy, input, computed } from '@angular/core';

export type SplatShape = 'burst' | 'star';

const CLIP_PATHS: Record<SplatShape, string> = {
  burst: `polygon(
    50% 0%, 58% 28%, 85% 10%, 66% 36%, 100% 40%, 68% 50%,
    90% 75%, 60% 60%, 65% 95%, 50% 66%, 35% 95%, 40% 60%,
    10% 75%, 32% 50%, 0% 40%, 34% 36%, 15% 10%, 42% 30%
  )`,
  star: `polygon(
    50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%,
    50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%
  )`,
};

@Component({
  selector: 'bzm-splat',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="bzm-splat"
      [style]="splatStyle()"
      aria-hidden="true"
    ></div>
  `,
  styles: `
    :host {
      display: block;
      pointer-events: none;
    }

    .bzm-splat {
      opacity: 0.15;
      animation: bzm-splat-pulse 8s ease-in-out infinite;
    }

    @keyframes bzm-splat-pulse {
      0%, 100% { transform: scale(1) rotate(0deg); }
      50% { transform: scale(1.1) rotate(8deg); }
    }

    @media (prefers-reduced-motion: reduce) {
      .bzm-splat {
        animation: none;
      }
    }
  `,
})
export class BzmSplatComponent {
  readonly shape = input<SplatShape>('burst');
  readonly color = input<string>('var(--bzm-color-primary)');
  readonly size = input<string>('120px');

  protected readonly splatStyle = computed(() => {
    const s = this.shape();
    return `
      width: ${this.size()};
      height: ${this.size()};
      background: ${this.color()};
      clip-path: ${CLIP_PATHS[s]};
    `;
  });
}
