import { Component, ChangeDetectionStrategy, input, computed } from '@angular/core';

/** Size preset for the spinner component. */
export type SpinnerSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'bzm-spinner',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      [class]="spinnerClasses()"
      role="status"
      [attr.aria-label]="ariaLabel()"
    >
      <svg
        class="bzm-spinner__svg"
        viewBox="0 0 120 140"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        focusable="false"
      >
        <!-- ── Layer 1: Starburst backdrop ── -->
        <polygon
          class="bzm-spinner__starburst"
          points="60,30 67,57 88,35 72,60 108,52 76,70 100,90 74,78 88,110 66,85 60,126 54,85 32,110 46,78 20,90 44,70 12,52 48,60 32,35 53,57"
          fill="var(--bzm-color-accent)"
          opacity="0.18"
        />

        <!-- ── Layer 2: Ground shadow ── -->
        <ellipse
          class="bzm-spinner__ground-shadow"
          cx="60" cy="128" rx="24" ry="5"
          fill="var(--bzm-black)"
          opacity="0.15"
        />

        <!-- ── Layer 3: Orbit dots (answer colors) ── -->
        <g class="bzm-spinner__orbit-a">
          <circle cx="60" cy="36" r="5.5"
            fill="var(--bzm-color-answer-a)" stroke="var(--bzm-black)" stroke-width="1.5"/>
        </g>
        <g class="bzm-spinner__orbit-b">
          <circle cx="60" cy="36" r="5.5"
            fill="var(--bzm-color-answer-b)" stroke="var(--bzm-black)" stroke-width="1.5"/>
        </g>
        <g class="bzm-spinner__orbit-c">
          <circle cx="60" cy="36" r="5.5"
            fill="var(--bzm-color-answer-c)" stroke="var(--bzm-black)" stroke-width="1.5"/>
        </g>
        <g class="bzm-spinner__orbit-d">
          <circle cx="60" cy="36" r="5.5"
            fill="var(--bzm-color-answer-d)" stroke="var(--bzm-black)" stroke-width="1.5"/>
        </g>

        <!-- ── Layer 4: Mascot character (bounces) ── -->
        <g class="bzm-spinner__mascot">
          <!-- Hard shadow (comic-style offset) -->
          <ellipse cx="63" cy="85" rx="36" ry="30" fill="var(--bzm-black)" opacity="0.18"/>

          <!-- Body -->
          <ellipse cx="60" cy="82" rx="34" ry="28"
            fill="var(--bzm-color-primary)" stroke="var(--bzm-black)" stroke-width="4"/>

          <!-- Rosy cheeks -->
          <circle cx="32" cy="86" r="6" fill="var(--bzm-red-200)" opacity="0.55"/>
          <circle cx="88" cy="86" r="6" fill="var(--bzm-red-200)" opacity="0.55"/>

          <!-- Left eye -->
          <ellipse cx="46" cy="74" rx="11" ry="12"
            fill="var(--bzm-white)" stroke="var(--bzm-black)" stroke-width="2.5"/>
          <circle class="bzm-spinner__pupil" cx="48" cy="76" r="5" fill="var(--bzm-black)"/>
          <circle cx="44" cy="71" r="2.5" fill="var(--bzm-white)"/>
          <circle cx="50" cy="70" r="1.2" fill="var(--bzm-white)" opacity="0.6"/>

          <!-- Right eye -->
          <ellipse cx="74" cy="74" rx="11" ry="12"
            fill="var(--bzm-white)" stroke="var(--bzm-black)" stroke-width="2.5"/>
          <circle class="bzm-spinner__pupil" cx="76" cy="76" r="5" fill="var(--bzm-black)"/>
          <circle cx="72" cy="71" r="2.5" fill="var(--bzm-white)"/>
          <circle cx="78" cy="70" r="1.2" fill="var(--bzm-white)" opacity="0.6"/>

          <!-- Smile -->
          <path d="M48 92 Q60 102 72 92"
            fill="none" stroke="var(--bzm-black)" stroke-width="2.5" stroke-linecap="round"/>
        </g>

        <!-- ── Layer 5: Question badge ── -->
        <g class="bzm-spinner__badge">
          <!-- Badge shadow -->
          <circle cx="92" cy="58" r="13" fill="var(--bzm-black)" opacity="0.18"/>
          <!-- Badge -->
          <circle cx="90" cy="56" r="12"
            fill="var(--bzm-color-accent)" stroke="var(--bzm-black)" stroke-width="2.5"/>
          <text x="90" y="61.5" text-anchor="middle"
            style="font-family: var(--bzm-font-heading); font-size: 16px; font-weight: 400;"
            fill="var(--bzm-black)">?</text>
        </g>

        <!-- ── Layer 6: Sparkle stars ── -->
        <polygon class="bzm-spinner__spark-1"
          points="17,17 19.5,22 25,24.5 19.5,27 17,32 14.5,27 9,24.5 14.5,22"
          fill="var(--bzm-color-accent)" stroke="var(--bzm-black)" stroke-width="1.2"/>
        <polygon class="bzm-spinner__spark-2"
          points="102,12 104,17 109,19 104,21 102,26 100,21 95,19 100,17"
          fill="var(--bzm-color-answer-a)" stroke="var(--bzm-black)" stroke-width="1.2"/>
        <polygon class="bzm-spinner__spark-3"
          points="107,94 109,99 114,101 109,103 107,108 105,103 100,101 105,99"
          fill="var(--bzm-color-answer-d)" stroke="var(--bzm-black)" stroke-width="1.2"/>
      </svg>
    </div>
  `,
  styles: `
    :host {
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }

    .bzm-spinner {
      display: inline-flex;
    }

    /* ── Sizes ── */
    .size-sm .bzm-spinner__svg { width: 48px; height: 56px; }
    .size-md .bzm-spinner__svg { width: 80px; height: 93px; }
    .size-lg .bzm-spinner__svg { width: 120px; height: 140px; }

    /* ── GPU compositing ── */
    .bzm-spinner__mascot,
    .bzm-spinner__badge,
    .bzm-spinner__ground-shadow,
    .bzm-spinner__orbit-a,
    .bzm-spinner__orbit-b,
    .bzm-spinner__orbit-c,
    .bzm-spinner__orbit-d {
      will-change: transform;
    }

    /* ════════════════════════════════════════════════
       STARBURST — slow clockwise drift
    ════════════════════════════════════════════════ */
    .bzm-spinner__starburst {
      transform-box: view-box;
      transform-origin: 50% 55.7%;
      animation: bzm-spinner-burst 12s linear infinite;
    }

    @keyframes bzm-spinner-burst {
      to { transform: rotate(360deg); }
    }

    /* ════════════════════════════════════════════════
       GROUND SHADOW — synced with bounce physics
       Wide + dark at ground, small + faint at peak
    ════════════════════════════════════════════════ */
    .bzm-spinner__ground-shadow {
      transform-box: view-box;
      transform-origin: 50% 91.4%;
      animation: bzm-spinner-shadow 1.8s infinite;
    }

    @keyframes bzm-spinner-shadow {
      0%, 100% {
        transform: scaleX(1.3);
        opacity: 0.22;
        animation-timing-function: cubic-bezier(0.22, 1, 0.36, 1);
      }
      40% {
        transform: scaleX(0.45);
        opacity: 0.06;
        animation-timing-function: ease-in-out;
      }
      55% {
        transform: scaleX(0.5);
        opacity: 0.07;
        animation-timing-function: cubic-bezier(0.55, 0, 1, 0.45);
      }
    }

    /* ════════════════════════════════════════════════
       ORBIT DOTS — 4 answer colors, 90° apart
    ════════════════════════════════════════════════ */
    .bzm-spinner__orbit-a,
    .bzm-spinner__orbit-b,
    .bzm-spinner__orbit-c,
    .bzm-spinner__orbit-d {
      transform-box: view-box;
      transform-origin: 50% 55.7%;
      animation: bzm-spinner-orbit 2.8s linear infinite;
    }

    .bzm-spinner__orbit-a { animation-delay: 0s; }
    .bzm-spinner__orbit-b { animation-delay: -0.7s; }
    .bzm-spinner__orbit-c { animation-delay: -1.4s; }
    .bzm-spinner__orbit-d { animation-delay: -2.1s; }

    @keyframes bzm-spinner-orbit {
      to { transform: rotate(360deg); }
    }

    /* ════════════════════════════════════════════════
       MASCOT BOUNCE — per-segment easing for gravity
       0→40%  ease-out  (fast launch, decelerate to peak)
       40→55% ease      (gentle hang time at top)
       55→100% ease-in  (slow departure, accelerate to ground)
    ════════════════════════════════════════════════ */
    .bzm-spinner__mascot {
      transform-box: view-box;
      transform-origin: 50% 78.6%;
      animation: bzm-spinner-bounce 1.8s infinite;
    }

    @keyframes bzm-spinner-bounce {
      0%, 100% {
        transform: translateY(0) scaleX(1.08) scaleY(0.92);
        animation-timing-function: cubic-bezier(0.22, 1, 0.36, 1);
      }
      40% {
        transform: translateY(-30px) scaleX(0.93) scaleY(1.08);
        animation-timing-function: ease-in-out;
      }
      55% {
        transform: translateY(-28px) scaleX(0.96) scaleY(1.04);
        animation-timing-function: cubic-bezier(0.55, 0, 1, 0.45);
      }
    }

    /* ════════════════════════════════════════════════
       BADGE — follow-through: peaks earlier, overshoots
    ════════════════════════════════════════════════ */
    .bzm-spinner__badge {
      transform-box: view-box;
      transform-origin: 75% 40%;
      animation: bzm-spinner-badge 1.8s infinite;
    }

    @keyframes bzm-spinner-badge {
      0%, 100% {
        transform: translateY(0) rotate(-5deg);
        animation-timing-function: cubic-bezier(0.22, 1, 0.36, 1);
      }
      38% {
        transform: translateY(-34px) rotate(8deg);
        animation-timing-function: ease-in-out;
      }
      55% {
        transform: translateY(-30px) rotate(2deg);
        animation-timing-function: cubic-bezier(0.55, 0, 1, 0.45);
      }
    }

    /* ════════════════════════════════════════════════
       PUPILS — gentle figure-eight look
    ════════════════════════════════════════════════ */
    .bzm-spinner__pupil {
      animation: bzm-spinner-look 3.5s ease-in-out infinite;
    }

    @keyframes bzm-spinner-look {
      0%, 100% { transform: translate(0, 0); }
      25%  { transform: translate(2px, -1px); }
      50%  { transform: translate(0, 1.5px); }
      75%  { transform: translate(-2px, -1px); }
    }

    /* ════════════════════════════════════════════════
       SPARKLES — snappy pop-in, gentle fade-out
    ════════════════════════════════════════════════ */
    .bzm-spinner__spark-1,
    .bzm-spinner__spark-2,
    .bzm-spinner__spark-3 {
      transform-box: fill-box;
      transform-origin: 50% 50%;
      will-change: transform, opacity;
    }

    .bzm-spinner__spark-1 {
      animation: bzm-spinner-sparkle 2.6s infinite;
    }

    .bzm-spinner__spark-2 {
      animation: bzm-spinner-sparkle 2.6s -0.87s infinite;
    }

    .bzm-spinner__spark-3 {
      animation: bzm-spinner-sparkle 2.6s -1.73s infinite;
    }

    @keyframes bzm-spinner-sparkle {
      0%, 100% {
        transform: scale(0) rotate(0deg);
        opacity: 0;
        animation-timing-function: cubic-bezier(0.34, 1.56, 0.64, 1);
      }
      40% {
        transform: scale(1.15) rotate(40deg);
        opacity: 1;
        animation-timing-function: ease-in;
      }
      70% {
        transform: scale(0) rotate(70deg);
        opacity: 0;
        animation-timing-function: linear;
      }
    }

    /* ════════════════════════════════════════════════
       REDUCED MOTION
    ════════════════════════════════════════════════ */
    @media (prefers-reduced-motion: reduce) {
      .bzm-spinner__mascot,
      .bzm-spinner__badge,
      .bzm-spinner__ground-shadow,
      .bzm-spinner__starburst,
      .bzm-spinner__orbit-a,
      .bzm-spinner__orbit-b,
      .bzm-spinner__orbit-c,
      .bzm-spinner__orbit-d,
      .bzm-spinner__pupil,
      .bzm-spinner__spark-1,
      .bzm-spinner__spark-2,
      .bzm-spinner__spark-3 {
        animation: none;
        will-change: auto;
      }

      .bzm-spinner__spark-1,
      .bzm-spinner__spark-2,
      .bzm-spinner__spark-3 {
        opacity: 1;
        transform: scale(1);
      }

      .bzm-spinner__mascot {
        transform: none;
      }

      .bzm-spinner__svg {
        animation: bzm-spinner-pulse 2s ease-in-out infinite;
      }
    }

    @keyframes bzm-spinner-pulse {
      0%, 100% { opacity: 0.5; }
      50% { opacity: 1; }
    }
  `,
})
/**
 * Displays an animated loading spinner featuring a bouncing mascot character, orbiting
 * answer-color dots, rotating starburst backdrop, and sparkle effects.
 *
 * The animation includes physically-motivated bounce timing with squash-and-stretch, a synced
 * ground shadow, and a follow-through question-mark badge. Gracefully degrades to a simple
 * pulse animation when `prefers-reduced-motion` is active.
 *
 * @selector bzm-spinner
 *
 * @example
 * ```html
 * <bzm-spinner size="lg" ariaLabel="Quiz wordt geladen..." />
 * <bzm-spinner size="sm" />
 * ```
 */
export class BzmSpinnerComponent {
  /**
   * Size preset controlling the SVG dimensions (48px, 80px, or 120px width).
   * @default 'md'
   */
  readonly size = input<SpinnerSize>('md');

  /**
   * Accessible label announced by screen readers for the loading state.
   * @default 'Laden...'
   */
  readonly ariaLabel = input<string>('Laden...');

  protected readonly spinnerClasses = computed(
    () => `bzm-spinner size-${this.size()}`
  );
}
