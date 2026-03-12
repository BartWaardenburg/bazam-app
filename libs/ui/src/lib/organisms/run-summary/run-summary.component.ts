import { Component, ChangeDetectionStrategy, input, output, computed } from '@angular/core';

/** Final statistics for a completed singleplayer roguelike run. */
export interface RunStats {
  readonly finalScore: number;
  readonly levelsCompleted: number;
  readonly totalLevels: number;
  readonly questionsCorrect: number;
  readonly questionsTotal: number;
  readonly longestStreak: number;
  readonly sparksEarned: number;
  readonly brainsUsed: string[];
  readonly combosTriggered: string[];
  readonly seedCode: string;
  readonly mode: 'explorer' | 'champion';
  readonly won: boolean;
}

@Component({
  selector: 'bzm-run-summary',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="run-summary" role="region" [attr.aria-label]="won() ? 'Gewonnen overzicht' : 'Verloren overzicht'">
      <!-- Victory / Defeat header -->
      <div class="run-summary__header" [class.run-summary__header--won]="won()" [class.run-summary__header--lost]="!won()">
        <div class="run-summary__mascot" aria-hidden="true">
          <i [class]="won() ? 'ph-duotone ph-brain' : 'ph-duotone ph-smiley-sad'" style="font-size: 64px;"></i>
        </div>
        @if (won()) {
          <h1 class="run-summary__title run-summary__title--won">GEWONNEN!</h1>
        } @else {
          <h1 class="run-summary__title run-summary__title--lost">Volgende keer beter!</h1>
        }
      </div>

      <!-- Score display -->
      <div class="run-summary__score" aria-label="Eindscore">
        <span class="run-summary__score-value">{{ stats().finalScore }}</span>
        <span class="run-summary__score-label">punten</span>
      </div>

      <!-- Stats grid -->
      <div class="run-summary__grid" role="list" aria-label="Statistieken">
        <div class="run-summary__stat" role="listitem">
          <i class="ph-duotone ph-stack" aria-hidden="true" style="font-size: 24px;"></i>
          <span class="run-summary__stat-value">{{ stats().levelsCompleted }}/{{ stats().totalLevels }}</span>
          <span class="run-summary__stat-label">Levels</span>
        </div>
        <div class="run-summary__stat" role="listitem">
          <i class="ph-duotone ph-check-circle" aria-hidden="true" style="font-size: 24px;"></i>
          <span class="run-summary__stat-value">{{ stats().questionsCorrect }}/{{ stats().questionsTotal }}</span>
          <span class="run-summary__stat-label">Correct</span>
        </div>
        <div class="run-summary__stat" role="listitem">
          <i class="ph-duotone ph-fire" aria-hidden="true" style="font-size: 24px;"></i>
          <span class="run-summary__stat-value">{{ stats().longestStreak }}</span>
          <span class="run-summary__stat-label">Beste streak</span>
        </div>
        <div class="run-summary__stat" role="listitem">
          <i class="ph-duotone ph-lightning" aria-hidden="true" style="font-size: 24px;"></i>
          <span class="run-summary__stat-value">{{ stats().sparksEarned }}</span>
          <span class="run-summary__stat-label">Sparks</span>
        </div>
      </div>

      <!-- Mode badge -->
      <div class="run-summary__mode">
        @if (stats().mode === 'explorer') {
          <span class="run-summary__mode-badge run-summary__mode-badge--explorer">
            <i class="ph-duotone ph-compass" aria-hidden="true" style="font-size: 16px;"></i>
            Explorer
          </span>
        } @else {
          <span class="run-summary__mode-badge run-summary__mode-badge--champion">
            <i class="ph-duotone ph-crown" aria-hidden="true" style="font-size: 16px;"></i>
            Champion
          </span>
        }
      </div>

      <!-- Brains used -->
      @if (stats().brainsUsed.length > 0) {
        <div class="run-summary__section">
          <h3 class="run-summary__section-title">Brains gebruikt</h3>
          <div class="run-summary__brains" role="list" aria-label="Gebruikte brains">
            @for (brain of stats().brainsUsed; track $index) {
              <span class="run-summary__brain-icon" role="listitem">
                <i class="ph-duotone ph-brain" aria-hidden="true" style="font-size: 20px;"></i>
                {{ brain }}
              </span>
            }
          </div>
        </div>
      }

      <!-- Combos triggered -->
      @if (stats().combosTriggered.length > 0) {
        <div class="run-summary__section">
          <h3 class="run-summary__section-title">Combo's</h3>
          <div class="run-summary__combos" role="list" aria-label="Getriggerde combo's">
            @for (combo of stats().combosTriggered; track $index) {
              <span class="run-summary__combo-pill" role="listitem">{{ combo }}</span>
            }
          </div>
        </div>
      }

      <!-- Seed code -->
      <div class="run-summary__seed">
        <span class="run-summary__seed-label">Seed</span>
        <code class="run-summary__seed-code">{{ stats().seedCode }}</code>
      </div>

      <!-- New unlocks -->
      @if (newUnlocks().length > 0) {
        <div class="run-summary__unlocks" role="list" aria-label="Nieuwe ontgrendelingen">
          <h3 class="run-summary__section-title">
            <i class="ph-duotone ph-lock-key-open" aria-hidden="true" style="font-size: 20px;"></i>
            Nieuw ontgrendeld!
          </h3>
          @for (unlock of newUnlocks(); track $index) {
            <div class="run-summary__unlock-card" role="listitem">
              <i class="ph-duotone ph-star" aria-hidden="true" style="font-size: 24px;"></i>
              <span>{{ unlock }}</span>
            </div>
          }
        </div>
      }

      <!-- Action buttons -->
      <div class="run-summary__actions">
        <button
          class="run-summary__btn run-summary__btn--primary"
          type="button"
          (click)="playAgain.emit()"
          aria-label="Opnieuw spelen"
        >
          <i class="ph-duotone ph-arrows-clockwise" aria-hidden="true" style="font-size: 20px;"></i>
          Opnieuw spelen
        </button>
        <button
          class="run-summary__btn run-summary__btn--accent"
          type="button"
          (click)="shareScore.emit()"
          aria-label="Deel score"
        >
          <i class="ph-duotone ph-share-network" aria-hidden="true" style="font-size: 20px;"></i>
          Deel Score
        </button>
        <button
          class="run-summary__btn run-summary__btn--ghost"
          type="button"
          (click)="backToMenu.emit()"
          aria-label="Terug naar menu"
        >
          Menu
        </button>
      </div>
    </div>
  `,
  styles: `
    :host {
      display: block;
      font-family: var(--bzm-font-family);
    }

    .run-summary {
      max-width: 480px;
      margin: 0 auto;
      text-align: center;
    }

    /* Header */
    .run-summary__header {
      padding: var(--bzm-space-6) var(--bzm-space-4);
      border-radius: var(--bzm-radius-lg);
      border: 4px solid var(--bzm-black);
      border-width: var(--bzm-border-width-comic);
      margin-bottom: var(--bzm-space-6);
      animation: bzm-run-header-pop 0.6s var(--bzm-transition-playful) backwards;
    }

    .run-summary__header--won {
      background: linear-gradient(135deg, #fbbf24, #f59e0b, #d97706);
      box-shadow: 4px 4px 0 var(--bzm-black);
    }

    .run-summary__header--lost {
      background: linear-gradient(135deg, var(--bzm-color-surface), var(--bzm-gray-200));
      box-shadow: 4px 4px 0 var(--bzm-black);
    }

    .run-summary__mascot {
      margin-bottom: var(--bzm-space-2);
    }

    .run-summary__header--won .run-summary__mascot {
      color: var(--bzm-white);
      filter: drop-shadow(2px 2px 0 var(--bzm-black));
      animation: bzm-run-mascot-bounce 1s ease-in-out infinite;
    }

    .run-summary__header--lost .run-summary__mascot {
      color: var(--bzm-color-text-muted);
    }

    .run-summary__title {
      margin: 0;
      font-family: var(--bzm-font-heading);
      line-height: var(--bzm-line-height-tight);
    }

    .run-summary__title--won {
      font-size: clamp(2.5rem, 10vw, 4rem);
      color: var(--bzm-white);
      text-shadow: 3px 3px 0 var(--bzm-black);
      -webkit-text-stroke: 2px var(--bzm-black);
      paint-order: stroke fill;
    }

    .run-summary__title--lost {
      font-size: clamp(1.5rem, 6vw, 2.5rem);
      color: var(--bzm-color-text);
      text-shadow: 2px 2px 0 var(--bzm-gray-300);
    }

    /* Score */
    .run-summary__score {
      margin-bottom: var(--bzm-space-6);
    }

    .run-summary__score-value {
      display: block;
      font-family: var(--bzm-font-heading);
      font-size: clamp(3rem, 12vw, 5rem);
      font-weight: var(--bzm-font-weight-black);
      color: var(--bzm-color-primary);
      text-shadow: 3px 3px 0 var(--bzm-black);
      -webkit-text-stroke: 1.5px var(--bzm-black);
      paint-order: stroke fill;
      line-height: var(--bzm-line-height-tight);
    }

    .run-summary__score-label {
      font-size: var(--bzm-font-size-lg);
      font-weight: var(--bzm-font-weight-bold);
      color: var(--bzm-color-text-muted);
      text-transform: uppercase;
      letter-spacing: 0.1em;
    }

    /* Stats grid */
    .run-summary__grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: var(--bzm-space-3);
      margin-bottom: var(--bzm-space-6);
    }

    .run-summary__stat {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--bzm-space-1);
      background: var(--bzm-color-surface);
      border: 4px solid var(--bzm-color-border);
      border-width: var(--bzm-border-width-comic);
      border-radius: var(--bzm-radius-md);
      padding: var(--bzm-space-4) var(--bzm-space-3);
      box-shadow: var(--bzm-shadow-card);
      color: var(--bzm-color-primary);
    }

    .run-summary__stat-value {
      font-size: var(--bzm-font-size-xl);
      font-weight: var(--bzm-font-weight-black);
      color: var(--bzm-color-text);
    }

    .run-summary__stat-label {
      font-size: var(--bzm-font-size-xs);
      font-weight: var(--bzm-font-weight-semibold);
      color: var(--bzm-color-text-muted);
      text-transform: uppercase;
      letter-spacing: 0.08em;
    }

    /* Mode badge */
    .run-summary__mode {
      margin-bottom: var(--bzm-space-5);
    }

    .run-summary__mode-badge {
      display: inline-flex;
      align-items: center;
      gap: var(--bzm-space-1);
      padding: var(--bzm-space-1) var(--bzm-space-3);
      border-radius: var(--bzm-radius-full);
      font-size: var(--bzm-font-size-sm);
      font-weight: var(--bzm-font-weight-bold);
      border: 2px solid var(--bzm-black);
    }

    .run-summary__mode-badge--explorer {
      background: var(--bzm-color-success);
      color: var(--bzm-white);
    }

    .run-summary__mode-badge--champion {
      background: var(--bzm-color-error);
      color: var(--bzm-white);
    }

    /* Sections */
    .run-summary__section {
      margin-bottom: var(--bzm-space-5);
    }

    .run-summary__section-title {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: var(--bzm-space-2);
      margin: 0 0 var(--bzm-space-3);
      font-size: var(--bzm-font-size-sm);
      font-weight: var(--bzm-font-weight-bold);
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: var(--bzm-color-text-muted);
    }

    /* Brains */
    .run-summary__brains {
      display: flex;
      flex-wrap: wrap;
      gap: var(--bzm-space-2);
      justify-content: center;
    }

    .run-summary__brain-icon {
      display: inline-flex;
      align-items: center;
      gap: var(--bzm-space-1);
      padding: var(--bzm-space-1) var(--bzm-space-2);
      background: var(--bzm-color-surface);
      border: 2px solid var(--bzm-color-border);
      border-radius: var(--bzm-radius-sm);
      font-size: var(--bzm-font-size-xs);
      font-weight: var(--bzm-font-weight-semibold);
      color: var(--bzm-color-text);
    }

    /* Combos */
    .run-summary__combos {
      display: flex;
      flex-wrap: wrap;
      gap: var(--bzm-space-2);
      justify-content: center;
    }

    .run-summary__combo-pill {
      display: inline-block;
      padding: var(--bzm-space-1) var(--bzm-space-3);
      background: var(--bzm-color-primary);
      color: var(--bzm-white);
      border-radius: var(--bzm-radius-full);
      font-size: var(--bzm-font-size-xs);
      font-weight: var(--bzm-font-weight-bold);
      border: 2px solid var(--bzm-black);
    }

    /* Seed code */
    .run-summary__seed {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: var(--bzm-space-2);
      margin-bottom: var(--bzm-space-5);
    }

    .run-summary__seed-label {
      font-size: var(--bzm-font-size-xs);
      font-weight: var(--bzm-font-weight-bold);
      text-transform: uppercase;
      color: var(--bzm-color-text-muted);
    }

    .run-summary__seed-code {
      font-family: monospace;
      font-size: var(--bzm-font-size-sm);
      font-weight: var(--bzm-font-weight-bold);
      background: var(--bzm-color-surface);
      border: 2px solid var(--bzm-color-border);
      border-radius: var(--bzm-radius-sm);
      padding: var(--bzm-space-1) var(--bzm-space-3);
      color: var(--bzm-color-text);
      letter-spacing: 0.1em;
    }

    /* Unlocks */
    .run-summary__unlocks {
      margin-bottom: var(--bzm-space-6);
      padding: var(--bzm-space-4);
      background: linear-gradient(135deg, #fbbf2420, #f59e0b20);
      border: 4px solid var(--bzm-color-accent);
      border-width: var(--bzm-border-width-comic);
      border-radius: var(--bzm-radius-md);
    }

    .run-summary__unlock-card {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: var(--bzm-space-2);
      padding: var(--bzm-space-2) var(--bzm-space-3);
      color: var(--bzm-color-accent-dark);
      font-weight: var(--bzm-font-weight-bold);
      font-size: var(--bzm-font-size-base);
      animation: bzm-unlock-shine 0.8s ease-out backwards;
    }

    /* Action buttons */
    .run-summary__actions {
      display: flex;
      flex-direction: column;
      gap: var(--bzm-space-3);
    }

    .run-summary__btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: var(--bzm-space-2);
      width: 100%;
      padding: var(--bzm-space-4) var(--bzm-space-6);
      border-radius: var(--bzm-radius-md);
      font-family: var(--bzm-font-family);
      font-size: var(--bzm-font-size-lg);
      font-weight: var(--bzm-font-weight-extrabold);
      cursor: pointer;
      border: 4px solid var(--bzm-black);
      border-width: var(--bzm-border-width-comic);
      transition:
        transform var(--bzm-transition-playful),
        box-shadow var(--bzm-transition-base);
    }

    .run-summary__btn:hover {
      transform: translateY(-2px);
    }

    .run-summary__btn:active {
      transform: scale(0.98);
    }

    .run-summary__btn--primary {
      background: var(--bzm-color-primary);
      color: var(--bzm-white);
      box-shadow: 4px 4px 0 var(--bzm-black);
    }

    .run-summary__btn--primary:hover {
      box-shadow: 6px 6px 0 var(--bzm-black);
    }

    .run-summary__btn--accent {
      background: var(--bzm-color-accent);
      color: var(--bzm-color-text-on-accent);
      box-shadow: 4px 4px 0 var(--bzm-black);
    }

    .run-summary__btn--accent:hover {
      box-shadow: 6px 6px 0 var(--bzm-black);
    }

    .run-summary__btn--ghost {
      background: transparent;
      color: var(--bzm-color-text-muted);
      border-color: var(--bzm-color-border);
      box-shadow: 2px 2px 0 var(--bzm-color-border);
    }

    .run-summary__btn--ghost:hover {
      color: var(--bzm-color-text);
      box-shadow: 4px 4px 0 var(--bzm-color-border);
    }

    /* Animations */
    @keyframes bzm-run-header-pop {
      from {
        transform: scale(0.8);
        opacity: 0;
      }
      to {
        transform: scale(1);
        opacity: 1;
      }
    }

    @keyframes bzm-run-mascot-bounce {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-8px); }
    }

    @keyframes bzm-unlock-shine {
      from {
        opacity: 0;
        transform: scale(0.8);
      }
      to {
        opacity: 1;
        transform: scale(1);
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .run-summary__header,
      .run-summary__unlock-card {
        animation: none;
      }

      .run-summary__header--won .run-summary__mascot {
        animation: none;
      }

      .run-summary__btn {
        transition: none;
      }
    }
  `,
})
/**
 * Displays the end-of-run summary screen for singleplayer roguelike mode,
 * showing final score, level progress, accuracy, streak, sparks, brains used,
 * combos triggered, seed code, and any newly unlocked items.
 *
 * Shows a victory or defeat header with appropriate styling and mascot
 * expression. Provides action buttons for playing again, sharing the score,
 * or returning to the main menu.
 *
 * @selector bzm-run-summary
 *
 * @example
 * ```html
 * <bzm-run-summary
 *   [stats]="runStats"
 *   [newUnlocks]="['Neon Brain', 'Speed Demon Combo']"
 *   (playAgain)="onPlayAgain()"
 *   (shareScore)="onShare()"
 *   (backToMenu)="onMenu()"
 * />
 * ```
 */
export class BzmRunSummaryComponent {
  /** Complete run statistics to display. */
  readonly stats = input.required<RunStats>();

  /** Names of items newly unlocked by this run. @default [] */
  readonly newUnlocks = input<string[]>([]);

  /** Emits when the player clicks "Opnieuw spelen". */
  readonly playAgain = output<void>();

  /** Emits when the player clicks "Deel Score". */
  readonly shareScore = output<void>();

  /** Emits when the player clicks "Menu". */
  readonly backToMenu = output<void>();

  protected readonly won = computed(() => this.stats().won);
}
