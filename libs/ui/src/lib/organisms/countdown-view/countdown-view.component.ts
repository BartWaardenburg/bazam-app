import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { BzmMascotComponent } from '../../atoms/mascot/mascot.component';

@Component({
  selector: 'bzm-countdown-view',
  standalone: true,
  imports: [BzmMascotComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="bzm-countdown" role="status" aria-live="assertive">
      <div class="bzm-countdown__mascot">
        <bzm-mascot
          expression="excited"
          animate="bounce"
          badgeText="!"
          size="lg"
        />
      </div>
      <h2 class="bzm-countdown__text">{{ text() }}</h2>
    </div>
  `,
  styles: `
    :host {
      display: block;
      font-family: var(--bzm-font-family);
    }

    .bzm-countdown {
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: var(--bzm-space-4);
      min-height: 200px;
      padding: var(--bzm-space-8);
      animation: bzm-countdown-pop 0.5s var(--bzm-transition-playful);
    }

    .bzm-countdown__mascot {
      animation: bzm-countdown-pop 0.5s var(--bzm-transition-playful);
    }

    .bzm-countdown__text {
      margin: 0;
      font-size: clamp(2rem, 8vw, 4rem);
      font-weight: var(--bzm-font-weight-black);
      color: var(--bzm-color-primary);
      text-shadow: 3px 3px 0 var(--bzm-black);
      -webkit-text-stroke: 2px var(--bzm-black);
      paint-order: stroke fill;
      text-transform: uppercase;
    }

    @keyframes bzm-countdown-pop {
      0% {
        transform: scale(0.3);
        opacity: 0;
      }
      60% {
        transform: scale(1.1);
      }
      100% {
        transform: scale(1);
        opacity: 1;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .bzm-countdown,
      .bzm-countdown__mascot {
        animation: none;
      }
    }
  `,
})
export class BzmCountdownViewComponent {
  readonly text = input<string>('Maak je klaar!');
}
