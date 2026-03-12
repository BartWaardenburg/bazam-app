import { Component, ChangeDetectionStrategy, computed, input } from '@angular/core';

/** Boss character expression state. */
export type BossExpression = 'idle' | 'angry' | 'hurt' | 'defeated';

/** Boss character size variants. */
export type BossSize = 'sm' | 'md' | 'lg';

const SIZE_MAP: Record<BossSize, number> = {
  sm: 100,
  md: 160,
  lg: 240,
};

@Component({
  selector: 'bzm-boss-character',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      [class]="containerClasses()"
      [style]="containerStyle()"
      role="img"
      [attr.aria-label]="name() + ' - ' + expression()"
    >
      <svg
        viewBox="0 0 120 120"
        xmlns="http://www.w3.org/2000/svg"
        class="bzm-boss-character__svg"
      >
        <!-- Background effects -->
        <defs>
          <radialGradient [attr.id]="gradientId" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#1e1b4b" />
            <stop offset="100%" stop-color="#0f0a1e" />
          </radialGradient>
        </defs>

        <!-- Dark background circle -->
        <circle cx="60" cy="60" r="56" [attr.fill]="'url(#' + gradientId + ')'"
          stroke="var(--bzm-black)" stroke-width="4" />

        <!-- Lightning bolts (background decoration) -->
        <path d="M25 20 L30 35 L22 32 L28 48" fill="none" stroke="#eab308" stroke-width="1.5" opacity="0.4" />
        <path d="M95 25 L90 40 L98 37 L92 52" fill="none" stroke="#eab308" stroke-width="1.5" opacity="0.4" />

        @switch (expression()) {
          @case ('idle') {
            <!-- Body shadow -->
            <ellipse cx="62" cy="90" rx="28" ry="8" fill="rgba(0,0,0,0.3)" />
            <!-- Body -->
            <ellipse cx="60" cy="65" rx="30" ry="25" fill="#6d28d9"
              stroke="var(--bzm-black)" stroke-width="3" />
            <!-- Confident smirk eyes -->
            <ellipse cx="47" cy="58" rx="8" ry="9" fill="var(--bzm-white)"
              stroke="var(--bzm-black)" stroke-width="2" />
            <circle cx="49" cy="59" r="4" fill="var(--bzm-black)" />
            <circle cx="46" cy="55" r="2" fill="var(--bzm-white)" />
            <ellipse cx="73" cy="58" rx="8" ry="9" fill="var(--bzm-white)"
              stroke="var(--bzm-black)" stroke-width="2" />
            <circle cx="75" cy="59" r="4" fill="var(--bzm-black)" />
            <circle cx="72" cy="55" r="2" fill="var(--bzm-white)" />
            <!-- Eyebrows (lowered, confident) -->
            <path d="M38 48 Q47 44 56 49" fill="none" stroke="var(--bzm-black)" stroke-width="2.5" stroke-linecap="round" />
            <path d="M64 49 Q73 44 82 48" fill="none" stroke="var(--bzm-black)" stroke-width="2.5" stroke-linecap="round" />
            <!-- Smirk -->
            <path d="M45 74 Q60 82 72 72" fill="none" stroke="var(--bzm-black)" stroke-width="2.5" stroke-linecap="round" />
          }

          @case ('angry') {
            <!-- Body (red tint) -->
            <ellipse cx="62" cy="90" rx="28" ry="8" fill="rgba(0,0,0,0.3)" />
            <ellipse cx="60" cy="65" rx="30" ry="25" fill="#dc2626"
              stroke="var(--bzm-black)" stroke-width="3" class="bzm-boss-character__shake" />
            <!-- Angry eyes -->
            <ellipse cx="47" cy="58" rx="8" ry="7" fill="var(--bzm-white)"
              stroke="var(--bzm-black)" stroke-width="2" />
            <circle cx="49" cy="59" r="3.5" fill="var(--bzm-black)" />
            <ellipse cx="73" cy="58" rx="8" ry="7" fill="var(--bzm-white)"
              stroke="var(--bzm-black)" stroke-width="2" />
            <circle cx="75" cy="59" r="3.5" fill="var(--bzm-black)" />
            <!-- Angry eyebrows (V shape) -->
            <path d="M38 50 Q47 42 56 48" fill="none" stroke="var(--bzm-black)" stroke-width="3" stroke-linecap="round" />
            <path d="M64 48 Q73 42 82 50" fill="none" stroke="var(--bzm-black)" stroke-width="3" stroke-linecap="round" />
            <!-- Gritting teeth -->
            <path d="M44 74 L76 74" fill="none" stroke="var(--bzm-black)" stroke-width="2.5" stroke-linecap="round" />
            <path d="M48 74 L48 78" stroke="var(--bzm-black)" stroke-width="1.5" />
            <path d="M56 74 L56 78" stroke="var(--bzm-black)" stroke-width="1.5" />
            <path d="M64 74 L64 78" stroke="var(--bzm-black)" stroke-width="1.5" />
            <path d="M72 74 L72 78" stroke="var(--bzm-black)" stroke-width="1.5" />
            <!-- Steam lines -->
            <path d="M20 40 Q16 35 20 30" fill="none" stroke="var(--bzm-white)" stroke-width="1.5" opacity="0.6" class="bzm-boss-character__steam" />
            <path d="M100 40 Q104 35 100 30" fill="none" stroke="var(--bzm-white)" stroke-width="1.5" opacity="0.6" class="bzm-boss-character__steam" />
          }

          @case ('hurt') {
            <!-- Body -->
            <ellipse cx="62" cy="90" rx="28" ry="8" fill="rgba(0,0,0,0.3)" />
            <ellipse cx="60" cy="65" rx="30" ry="25" fill="#6d28d9"
              stroke="var(--bzm-black)" stroke-width="3" />
            <!-- Surprised eyes (wide) -->
            <ellipse cx="47" cy="58" rx="9" ry="11" fill="var(--bzm-white)"
              stroke="var(--bzm-black)" stroke-width="2" />
            <circle cx="48" cy="60" r="3" fill="var(--bzm-black)" />
            <ellipse cx="73" cy="58" rx="9" ry="11" fill="var(--bzm-white)"
              stroke="var(--bzm-black)" stroke-width="2" />
            <circle cx="74" cy="60" r="3" fill="var(--bzm-black)" />
            <!-- Raised eyebrows -->
            <path d="M38 44 Q47 40 56 44" fill="none" stroke="var(--bzm-black)" stroke-width="2.5" stroke-linecap="round" />
            <path d="M64 44 Q73 40 82 44" fill="none" stroke="var(--bzm-black)" stroke-width="2.5" stroke-linecap="round" />
            <!-- O mouth -->
            <circle cx="60" cy="76" r="5" fill="var(--bzm-white)" stroke="var(--bzm-black)" stroke-width="2" />
            <!-- Impact stars -->
            <polygon points="22,30 24,26 26,30 24,28" fill="#eab308" class="bzm-boss-character__star" />
            <polygon points="92,28 94,24 96,28 94,26" fill="#eab308" class="bzm-boss-character__star" />
            <polygon points="40,22 42,18 44,22 42,20" fill="#eab308" class="bzm-boss-character__star" />
          }

          @case ('defeated') {
            <!-- Body (faded) -->
            <ellipse cx="62" cy="90" rx="28" ry="8" fill="rgba(0,0,0,0.3)" />
            <ellipse cx="60" cy="65" rx="30" ry="25" fill="#6d28d9" opacity="0.7"
              stroke="var(--bzm-black)" stroke-width="3" />
            <!-- X eyes -->
            <line x1="42" y1="53" x2="52" y2="63" stroke="var(--bzm-black)" stroke-width="3" stroke-linecap="round" />
            <line x1="52" y1="53" x2="42" y2="63" stroke="var(--bzm-black)" stroke-width="3" stroke-linecap="round" />
            <line x1="68" y1="53" x2="78" y2="63" stroke="var(--bzm-black)" stroke-width="3" stroke-linecap="round" />
            <line x1="78" y1="53" x2="68" y2="63" stroke="var(--bzm-black)" stroke-width="3" stroke-linecap="round" />
            <!-- Wavy mouth -->
            <path d="M45 76 Q52 72 60 76 Q68 80 75 76" fill="none" stroke="var(--bzm-black)" stroke-width="2.5" stroke-linecap="round" />
            <!-- Dizzy circles -->
            <circle cx="35" cy="42" r="4" fill="none" stroke="#eab308" stroke-width="1.5" opacity="0.5" class="bzm-boss-character__dizzy" />
            <circle cx="85" cy="42" r="4" fill="none" stroke="#eab308" stroke-width="1.5" opacity="0.5" class="bzm-boss-character__dizzy" />
          }
        }

        <!-- Name label -->
        <text x="60" y="110" text-anchor="middle"
          style="font-family: var(--bzm-font-family); font-size: 10px; font-weight: bold;"
          fill="var(--bzm-white)" opacity="0.8">{{ name() }}</text>
      </svg>
    </div>
  `,
  styles: `
    :host {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-family: var(--bzm-font-family);
    }

    .bzm-boss-character {
      border-radius: 50%;
      border: 4px solid var(--bzm-color-border);
      border-width: var(--bzm-border-width-comic);
      box-shadow: var(--bzm-shadow-lg);
      overflow: hidden;
    }

    .bzm-boss-character__svg {
      display: block;
      width: 100%;
      height: 100%;
    }

    /* Size variants */
    .bzm-boss-character--sm { width: 100px; height: 100px; }
    .bzm-boss-character--md { width: 160px; height: 160px; }
    .bzm-boss-character--lg { width: 240px; height: 240px; }

    /* Angry shake */
    .bzm-boss-character__shake {
      animation: bzm-boss-shake 0.3s ease-in-out infinite;
      transform-origin: center;
    }

    @keyframes bzm-boss-shake {
      0%, 100% { transform: translateX(0); }
      25% { transform: translateX(-2px); }
      75% { transform: translateX(2px); }
    }

    /* Steam animation */
    .bzm-boss-character__steam {
      animation: bzm-boss-steam 1.2s ease-in-out infinite;
    }

    @keyframes bzm-boss-steam {
      0%, 100% { opacity: 0; transform: translateY(0); }
      50% { opacity: 0.6; transform: translateY(-6px); }
    }

    /* Impact stars */
    .bzm-boss-character__star {
      animation: bzm-boss-star 0.8s ease-in-out infinite;
    }

    @keyframes bzm-boss-star {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.5; transform: scale(1.3); }
    }

    /* Dizzy circles */
    .bzm-boss-character__dizzy {
      animation: bzm-boss-dizzy 1.5s linear infinite;
      transform-origin: center;
    }

    @keyframes bzm-boss-dizzy {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    @media (prefers-reduced-motion: reduce) {
      .bzm-boss-character__shake,
      .bzm-boss-character__steam,
      .bzm-boss-character__star,
      .bzm-boss-character__dizzy {
        animation: none;
      }
    }
  `,
})
export class BzmBossCharacterComponent {
  private static nextId = 0;
  protected readonly gradientId = `bzm-boss-bg-${BzmBossCharacterComponent.nextId++}`;

  /** Boss display name. */
  readonly name = input.required<string>();

  /** Current boss expression state. @default 'idle' */
  readonly expression = input<BossExpression>('idle');

  /** Size variant of the character display. @default 'md' */
  readonly size = input<BossSize>('md');

  protected readonly containerClasses = computed(() =>
    `bzm-boss-character bzm-boss-character--${this.size()}`
  );

  protected readonly containerStyle = computed(() => {
    const s = SIZE_MAP[this.size()];
    return `width: ${s}px; height: ${s}px;`;
  });
}
