import { Component, ChangeDetectionStrategy, input, computed } from '@angular/core';

/** Mascot facial expression controlling eyes, mouth, and default badge text. */
export type MascotExpression = 'neutral' | 'happy' | 'sad' | 'excited' | 'surprised' | 'sleeping';

/** Predefined mascot sizes in pixels. */
export type MascotSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

/** Available mascot animations. */
export type MascotAnimation = 'none' | 'bounce' | 'float' | 'shake' | 'pulse';

@Component({
  selector: 'bzm-mascot',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <svg
      [class]="svgClasses()"
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
    >
      <!-- Body shadow -->
      @if (showShadow()) {
        <ellipse
          class="bzm-mascot__shadow"
          cx="53" cy="55" rx="36" ry="30"
          fill="var(--bzm-black)" opacity="0.18"
        />
      }

      <!-- Body -->
      <ellipse
        class="bzm-mascot__body"
        cx="50" cy="52" rx="34" ry="28"
        [attr.fill]="bodyColor()"
        stroke="var(--bzm-black)" stroke-width="4"
      />

      <!-- Cheeks (always present) -->
      <circle class="bzm-mascot__cheek bzm-mascot__cheek--left"
        cx="22" cy="56" r="6" fill="var(--bzm-red-200)" opacity="0.55"/>
      <circle class="bzm-mascot__cheek bzm-mascot__cheek--right"
        cx="78" cy="56" r="6" fill="var(--bzm-red-200)" opacity="0.55"/>

      <!-- Eyes & Mouth (expression-dependent) -->
      @switch (expression()) {
        @case ('neutral') {
          <!-- Left eye -->
          <ellipse cx="38" cy="44" rx="11" ry="12"
            fill="var(--bzm-white)" stroke="var(--bzm-black)" stroke-width="2.5"/>
          <circle class="bzm-mascot__pupil" cx="40" cy="46" r="5" fill="var(--bzm-black)"/>
          <circle cx="36" cy="41" r="2.5" fill="var(--bzm-white)"/>
          <circle cx="42" cy="40" r="1.2" fill="var(--bzm-white)" opacity="0.6"/>
          <!-- Right eye -->
          <ellipse cx="62" cy="44" rx="11" ry="12"
            fill="var(--bzm-white)" stroke="var(--bzm-black)" stroke-width="2.5"/>
          <circle class="bzm-mascot__pupil" cx="64" cy="46" r="5" fill="var(--bzm-black)"/>
          <circle cx="60" cy="41" r="2.5" fill="var(--bzm-white)"/>
          <circle cx="66" cy="40" r="1.2" fill="var(--bzm-white)" opacity="0.6"/>
          <!-- Gentle smile -->
          <path d="M38 62 Q50 72 62 62"
            fill="none" stroke="var(--bzm-black)" stroke-width="2.5" stroke-linecap="round"/>
        }

        @case ('happy') {
          <!-- Squeezed-shut eyes (happy arcs) -->
          <path d="M28 44 Q38 36 48 44"
            fill="none" stroke="var(--bzm-black)" stroke-width="3" stroke-linecap="round"/>
          <path d="M52 44 Q62 36 72 44"
            fill="none" stroke="var(--bzm-black)" stroke-width="3" stroke-linecap="round"/>
          <!-- Eye highlights still visible above arcs -->
          <circle cx="36" cy="39" r="2.5" fill="var(--bzm-white)"/>
          <circle cx="60" cy="39" r="2.5" fill="var(--bzm-white)"/>
          <!-- Wide open smile -->
          <path d="M34 60 Q50 76 66 60"
            fill="var(--bzm-white)" stroke="var(--bzm-black)" stroke-width="2.5" stroke-linecap="round"/>
        }

        @case ('sad') {
          <!-- Left eye (pupils shifted down) -->
          <ellipse cx="38" cy="44" rx="11" ry="12"
            fill="var(--bzm-white)" stroke="var(--bzm-black)" stroke-width="2.5"/>
          <circle class="bzm-mascot__pupil" cx="40" cy="49" r="5" fill="var(--bzm-black)"/>
          <circle cx="36" cy="41" r="2.5" fill="var(--bzm-white)"/>
          <circle cx="42" cy="40" r="1.2" fill="var(--bzm-white)" opacity="0.6"/>
          <!-- Right eye (pupils shifted down) -->
          <ellipse cx="62" cy="44" rx="11" ry="12"
            fill="var(--bzm-white)" stroke="var(--bzm-black)" stroke-width="2.5"/>
          <circle class="bzm-mascot__pupil" cx="64" cy="49" r="5" fill="var(--bzm-black)"/>
          <circle cx="60" cy="41" r="2.5" fill="var(--bzm-white)"/>
          <circle cx="66" cy="40" r="1.2" fill="var(--bzm-white)" opacity="0.6"/>
          <!-- Frown -->
          <path d="M38 66 Q50 58 62 66"
            fill="none" stroke="var(--bzm-black)" stroke-width="2.5" stroke-linecap="round"/>
        }

        @case ('excited') {
          <!-- Left eye (big pupils) -->
          <ellipse cx="38" cy="44" rx="11" ry="12"
            fill="var(--bzm-white)" stroke="var(--bzm-black)" stroke-width="2.5"/>
          <circle class="bzm-mascot__pupil" cx="40" cy="46" r="6.5" fill="var(--bzm-black)"/>
          <!-- Star highlight (left) -->
          <polygon points="36,39 37,41 39,41 37.5,42.5 38,44.5 36,43 34,44.5 34.5,42.5 33,41 35,41"
            fill="var(--bzm-white)"/>
          <!-- Right eye (big pupils) -->
          <ellipse cx="62" cy="44" rx="11" ry="12"
            fill="var(--bzm-white)" stroke="var(--bzm-black)" stroke-width="2.5"/>
          <circle class="bzm-mascot__pupil" cx="64" cy="46" r="6.5" fill="var(--bzm-black)"/>
          <!-- Star highlight (right) -->
          <polygon points="60,39 61,41 63,41 61.5,42.5 62,44.5 60,43 58,44.5 58.5,42.5 57,41 59,41"
            fill="var(--bzm-white)"/>
          <!-- Open smile -->
          <path d="M34 60 Q50 74 66 60"
            fill="var(--bzm-white)" stroke="var(--bzm-black)" stroke-width="2.5"/>
        }

        @case ('surprised') {
          <!-- Left eye (tiny pupils, taller eye whites) -->
          <ellipse cx="38" cy="44" rx="11" ry="14"
            fill="var(--bzm-white)" stroke="var(--bzm-black)" stroke-width="2.5"/>
          <circle class="bzm-mascot__pupil" cx="40" cy="46" r="2.5" fill="var(--bzm-black)"/>
          <circle cx="36" cy="39" r="2.5" fill="var(--bzm-white)"/>
          <circle cx="42" cy="38" r="1.2" fill="var(--bzm-white)" opacity="0.6"/>
          <!-- Right eye (tiny pupils, taller eye whites) -->
          <ellipse cx="62" cy="44" rx="11" ry="14"
            fill="var(--bzm-white)" stroke="var(--bzm-black)" stroke-width="2.5"/>
          <circle class="bzm-mascot__pupil" cx="64" cy="46" r="2.5" fill="var(--bzm-black)"/>
          <circle cx="60" cy="39" r="2.5" fill="var(--bzm-white)"/>
          <circle cx="66" cy="38" r="1.2" fill="var(--bzm-white)" opacity="0.6"/>
          <!-- Small "O" mouth -->
          <circle cx="50" cy="64" r="5"
            fill="var(--bzm-white)" stroke="var(--bzm-black)" stroke-width="2.5"/>
        }

        @case ('sleeping') {
          <!-- Closed eyes (horizontal lines) -->
          <line x1="28" y1="44" x2="48" y2="44"
            stroke="var(--bzm-black)" stroke-width="3" stroke-linecap="round"/>
          <line x1="52" y1="44" x2="72" y2="44"
            stroke="var(--bzm-black)" stroke-width="3" stroke-linecap="round"/>
          <!-- Tiny flat line mouth -->
          <line x1="44" y1="62" x2="56" y2="62"
            stroke="var(--bzm-black)" stroke-width="2.5" stroke-linecap="round"/>
          <!-- Z z z -->
          <text class="bzm-mascot__zzz bzm-mascot__zzz--1"
            x="68" y="30" fill="var(--bzm-black)" opacity="0.5"
            style="font-family: var(--bzm-font-heading); font-size: 10px;">z</text>
          <text class="bzm-mascot__zzz bzm-mascot__zzz--2"
            x="76" y="22" fill="var(--bzm-black)" opacity="0.35"
            style="font-family: var(--bzm-font-heading); font-size: 8px;">z</text>
          <text class="bzm-mascot__zzz bzm-mascot__zzz--3"
            x="82" y="15" fill="var(--bzm-black)" opacity="0.2"
            style="font-family: var(--bzm-font-heading); font-size: 6px;">z</text>
        }
      }

      <!-- Badge -->
      @if (showBadge()) {
        <g class="bzm-mascot__badge">
          <!-- Badge shadow -->
          <circle cx="77" cy="28" r="13" fill="var(--bzm-black)" opacity="0.18"/>
          <!-- Badge circle -->
          <circle cx="75" cy="26" r="12"
            [attr.fill]="badgeColor()"
            stroke="var(--bzm-black)" stroke-width="2.5"/>
          <!-- Badge text -->
          <text x="75" y="31" text-anchor="middle"
            style="font-family: var(--bzm-font-heading); font-size: 16px;"
            fill="var(--bzm-black)">{{ badgeText() }}</text>
        </g>
      }
    </svg>
  `,
  styles: `
    :host {
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }

    /* ── Sizes ── */
    .bzm-mascot--xs { width: 32px; height: 32px; }
    .bzm-mascot--sm { width: 48px; height: 48px; }
    .bzm-mascot--md { width: 80px; height: 80px; }
    .bzm-mascot--lg { width: 120px; height: 120px; }
    .bzm-mascot--xl { width: 200px; height: 200px; }

    /* ── GPU compositing for animated groups ── */
    .bzm-mascot--animate .bzm-mascot__body,
    .bzm-mascot--animate .bzm-mascot__shadow,
    .bzm-mascot--animate .bzm-mascot__badge {
      will-change: transform;
    }

    /* ════════════════════════════════════════════════
       BOUNCE — gravity physics (1.8s cycle)
       Per-keyframe easing: ease-out launch, ease-in-out hang, ease-in fall
    ════════════════════════════════════════════════ */
    .bzm-mascot--bounce {
      transform-box: view-box;
      transform-origin: 50% 78%;
      animation: bzm-mascot-bounce 1.8s infinite;
    }

    @keyframes bzm-mascot-bounce {
      0%, 100% {
        transform: translateY(0) scaleX(1.08) scaleY(0.92);
        animation-timing-function: cubic-bezier(0.22, 1, 0.36, 1);
      }
      40% {
        transform: translateY(-12px) scaleX(0.93) scaleY(1.08);
        animation-timing-function: ease-in-out;
      }
      55% {
        transform: translateY(-10px) scaleX(0.96) scaleY(1.04);
        animation-timing-function: cubic-bezier(0.55, 0, 1, 0.45);
      }
    }

    /* ════════════════════════════════════════════════
       FLOAT — gentle up/down (3s ease-in-out)
    ════════════════════════════════════════════════ */
    .bzm-mascot--float {
      transform-box: view-box;
      transform-origin: 50% 50%;
      animation: bzm-mascot-float 3s ease-in-out infinite;
    }

    @keyframes bzm-mascot-float {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-6px); }
    }

    /* ════════════════════════════════════════════════
       SHAKE — subtle horizontal (0.5s)
    ════════════════════════════════════════════════ */
    .bzm-mascot--shake {
      transform-box: view-box;
      transform-origin: 50% 50%;
      animation: bzm-mascot-shake 0.5s ease-in-out infinite;
    }

    @keyframes bzm-mascot-shake {
      0%, 100% { transform: translateX(0); }
      25% { transform: translateX(-3px); }
      75% { transform: translateX(3px); }
    }

    /* ════════════════════════════════════════════════
       PULSE — scale breathing (2s ease-in-out)
    ════════════════════════════════════════════════ */
    .bzm-mascot--pulse {
      transform-box: view-box;
      transform-origin: 50% 50%;
      animation: bzm-mascot-pulse 2s ease-in-out infinite;
    }

    @keyframes bzm-mascot-pulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.06); }
    }

    /* ════════════════════════════════════════════════
       BADGE follow-through (synced with bounce)
    ════════════════════════════════════════════════ */
    .bzm-mascot--bounce .bzm-mascot__badge {
      transform-box: view-box;
      transform-origin: 75% 26%;
      animation: bzm-mascot-badge-bounce 1.8s infinite;
    }

    @keyframes bzm-mascot-badge-bounce {
      0%, 100% {
        transform: translateY(0) rotate(-5deg);
        animation-timing-function: cubic-bezier(0.22, 1, 0.36, 1);
      }
      38% {
        transform: translateY(-14px) rotate(8deg);
        animation-timing-function: ease-in-out;
      }
      55% {
        transform: translateY(-12px) rotate(2deg);
        animation-timing-function: cubic-bezier(0.55, 0, 1, 0.45);
      }
    }

    /* ════════════════════════════════════════════════
       PUPIL look-around (figure-eight, 3.5s)
    ════════════════════════════════════════════════ */
    .bzm-mascot__pupil {
      animation: bzm-mascot-look 3.5s ease-in-out infinite;
    }

    @keyframes bzm-mascot-look {
      0%, 100% { transform: translate(0, 0); }
      25% { transform: translate(2px, -1px); }
      50% { transform: translate(0, 1.5px); }
      75% { transform: translate(-2px, -1px); }
    }

    /* ════════════════════════════════════════════════
       SLEEPING Zzz float-up
    ════════════════════════════════════════════════ */
    .bzm-mascot__zzz {
      transform-box: fill-box;
      transform-origin: 50% 50%;
    }

    .bzm-mascot__zzz--1 {
      animation: bzm-mascot-zzz 3s ease-in-out infinite;
    }
    .bzm-mascot__zzz--2 {
      animation: bzm-mascot-zzz 3s -1s ease-in-out infinite;
    }
    .bzm-mascot__zzz--3 {
      animation: bzm-mascot-zzz 3s -2s ease-in-out infinite;
    }

    @keyframes bzm-mascot-zzz {
      0%, 100% { opacity: 0; transform: translateY(0); }
      50% { opacity: 0.6; transform: translateY(-4px); }
    }

    /* ════════════════════════════════════════════════
       REDUCED MOTION
       All animations collapse to gentle opacity pulse
    ════════════════════════════════════════════════ */
    @media (prefers-reduced-motion: reduce) {
      .bzm-mascot--bounce,
      .bzm-mascot--float,
      .bzm-mascot--shake,
      .bzm-mascot--pulse,
      .bzm-mascot--bounce .bzm-mascot__badge {
        animation: none;
        will-change: auto;
        transform: none;
      }

      .bzm-mascot__pupil {
        animation: none;
      }

      .bzm-mascot__zzz--1,
      .bzm-mascot__zzz--2,
      .bzm-mascot__zzz--3 {
        animation: none;
        opacity: 0.4;
        transform: none;
      }

      .bzm-mascot--animate {
        animation: bzm-mascot-reduced-pulse 2s ease-in-out infinite;
      }
    }

    @keyframes bzm-mascot-reduced-pulse {
      0%, 100% { opacity: 0.5; }
      50% { opacity: 1; }
    }
  `,
})
export class BzmMascotComponent {
  /** Facial expression controlling eyes and mouth. */
  readonly expression = input<MascotExpression>('neutral');

  /** Predefined size. */
  readonly size = input<MascotSize>('md');

  /** Body fill color (CSS value or design token variable). */
  readonly bodyColor = input<string>('var(--bzm-color-primary)');

  /** Single character displayed in the badge circle. */
  readonly badgeText = input<string>('?');

  /** Badge circle fill color. */
  readonly badgeColor = input<string>('var(--bzm-color-accent)');

  /** Animation variant applied to the SVG. */
  readonly animate = input<MascotAnimation>('none');

  /** Whether to show the badge circle with text. */
  readonly showBadge = input<boolean>(true);

  /** Whether to show the hard offset shadow beneath the body. */
  readonly showShadow = input<boolean>(true);

  /** Computed CSS class string for the SVG element. */
  protected readonly svgClasses = computed(() => {
    const anim = this.animate();
    const classes = [`bzm-mascot`, `bzm-mascot--${this.size()}`];

    if (anim !== 'none') {
      classes.push('bzm-mascot--animate', `bzm-mascot--${anim}`);
    }

    return classes.join(' ');
  });
}
