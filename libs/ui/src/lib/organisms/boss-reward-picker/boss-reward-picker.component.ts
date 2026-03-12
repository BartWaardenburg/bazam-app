import { Component, ChangeDetectionStrategy, input, output, computed } from '@angular/core';
import { BzmButtonComponent } from '../../atoms/button/button.component';
import { BzmRarityBadgeComponent, type Rarity } from '../../atoms/rarity-badge/rarity-badge.component';

/** Data shape for a single boss reward option. */
export interface BossReward {
  readonly id: string;
  readonly type: 'brain' | 'study-card' | 'sparks';
  readonly name: string;
  readonly description: string;
  readonly icon: string;
  readonly rarity?: Rarity;
  readonly sparksAmount?: number;
}

/** Display label mapping for reward types. */
const REWARD_TYPE_LABELS: Record<BossReward['type'], string> = {
  brain: 'Brain',
  'study-card': 'Study Card',
  sparks: 'Sparks',
};

/** Phosphor icon mapping for reward type badges. */
const REWARD_TYPE_ICONS: Record<BossReward['type'], string> = {
  brain: 'ph-brain',
  'study-card': 'ph-book-open-text',
  sparks: 'ph-lightning',
};

@Component({
  selector: 'bzm-boss-reward-picker',
  standalone: true,
  imports: [BzmButtonComponent, BzmRarityBadgeComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="picker" role="region" aria-label="Kies je beloning">
      <!-- Title -->
      <div class="picker__header">
        <i class="ph-duotone ph-trophy picker__trophy" aria-hidden="true"></i>
        <h2 class="picker__title">BOSS DEFEATED!</h2>
        <p class="picker__subtitle">Kies je beloning</p>
      </div>

      <!-- Reward cards -->
      <div class="picker__rewards" aria-label="Beloningen">
        @for (reward of rewards(); track reward.id; let i = $index) {
          <button
            class="picker__card"
            [class.picker__card--selected]="selectedId() === reward.id"
            [class.picker__card--dimmed]="selectedId() !== null && selectedId() !== reward.id"
            [style.animation-delay]="(i * 0.15) + 's'"
            [attr.aria-pressed]="selectedId() === reward.id"
            [attr.aria-label]="reward.name + ': ' + reward.description"
            (click)="onSelect(reward.id)"
          >
            <div class="picker__card-icon" aria-hidden="true">
              <i [class]="'ph-duotone ' + reward.icon"></i>
            </div>
            <span class="picker__card-name">{{ reward.name }}</span>
            <span class="picker__card-type">
              <i [class]="'ph-duotone ' + rewardTypeIcon(reward.type)" aria-hidden="true"></i>
              {{ rewardTypeLabel(reward.type) }}
            </span>
            @if (reward.rarity) {
              <bzm-rarity-badge [rarity]="reward.rarity" />
            }
            @if (reward.type === 'sparks' && reward.sparksAmount !== undefined) {
              <span class="picker__sparks-amount">
                <i class="ph-duotone ph-lightning" aria-hidden="true"></i>
                +{{ reward.sparksAmount }}
              </span>
            } @else {
              <p class="picker__card-desc">{{ reward.description }}</p>
            }
          </button>
        }
      </div>

      <!-- Confirm -->
      <div class="picker__actions">
        <bzm-button
          variant="accent"
          size="lg"
          [fullWidth]="true"
          [disabled]="!hasSelection()"
          (click)="onConfirm()"
        >
          <i class="ph-duotone ph-gift" aria-hidden="true"></i>
          Beloning claimen
        </bzm-button>
      </div>
    </div>
  `,
  styles: `
    :host {
      display: block;
      font-family: var(--bzm-font-family);
    }

    .picker {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--bzm-space-6);
      padding: var(--bzm-space-8) var(--bzm-space-6);
      background: var(--bzm-color-surface);
      border: 4px solid var(--bzm-black);
      border-width: 3px 4px 5px 3px;
      border-radius: var(--bzm-radius-lg);
      box-shadow: 6px 6px 0 var(--bzm-black);
      max-width: 560px;
    }

    /* ─── Header ─── */
    .picker__header {
      text-align: center;
    }

    .picker__trophy {
      font-size: 48px;
      color: #FFD700;
      filter: drop-shadow(2px 2px 0 var(--bzm-black));
      animation: bzm-trophy-bounce 0.6s var(--bzm-transition-playful);
    }

    .picker__title {
      margin: var(--bzm-space-2) 0 0;
      font-family: var(--bzm-font-heading);
      font-size: clamp(1.8rem, 5vw, 2.6rem);
      color: #FFD700;
      -webkit-text-stroke: 1.5px var(--bzm-black);
      paint-order: stroke fill;
      text-shadow: 3px 3px 0 var(--bzm-black);
      letter-spacing: 0.04em;
    }

    .picker__subtitle {
      margin: var(--bzm-space-1) 0 0;
      font-size: var(--bzm-font-size-lg);
      font-weight: var(--bzm-font-weight-bold);
      color: var(--bzm-color-text-secondary);
    }

    /* ─── Rewards grid ─── */
    .picker__rewards {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: var(--bzm-space-3);
      width: 100%;
    }

    /* ─── Reward card ─── */
    .picker__card {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--bzm-space-2);
      padding: var(--bzm-space-5) var(--bzm-space-3);
      background: var(--bzm-color-bg);
      border: 3px solid var(--bzm-black);
      border-width: 2px 3px 4px 2px;
      border-radius: var(--bzm-radius-md);
      box-shadow: 3px 3px 0 var(--bzm-black);
      cursor: pointer;
      text-align: center;
      font-family: var(--bzm-font-family);
      animation: bzm-card-flip 0.5s var(--bzm-transition-playful) backwards;
      transition:
        transform var(--bzm-transition-playful),
        box-shadow var(--bzm-transition-base),
        border-color var(--bzm-transition-base),
        opacity var(--bzm-transition-base);
      -webkit-tap-highlight-color: transparent;
    }

    .picker__card:hover:not(.picker__card--dimmed) {
      transform: translateY(-4px);
      box-shadow: 4px 5px 0 var(--bzm-black);
    }

    .picker__card:active {
      transform: translateY(2px);
      box-shadow: none;
    }

    .picker__card--selected {
      transform: translateY(-8px);
      border-color: #FFD700;
      box-shadow:
        3px 3px 0 var(--bzm-black),
        0 0 20px 4px rgba(255, 215, 0, 0.4);
    }

    .picker__card--selected:hover {
      transform: translateY(-10px);
      box-shadow:
        4px 5px 0 var(--bzm-black),
        0 0 24px 6px rgba(255, 215, 0, 0.5);
    }

    .picker__card--dimmed {
      opacity: 0.5;
      filter: grayscale(0.2);
    }

    /* ─── Card parts ─── */
    .picker__card-icon {
      font-size: 40px;
      color: var(--bzm-color-primary);
      filter: drop-shadow(1px 1px 0 rgba(0, 0, 0, 0.15));
    }

    .picker__card--selected .picker__card-icon {
      color: #FFD700;
    }

    .picker__card-name {
      font-weight: var(--bzm-font-weight-extrabold);
      font-size: var(--bzm-font-size-sm);
      color: var(--bzm-color-text);
      line-height: 1.2;
    }

    .picker__card-type {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      font-size: var(--bzm-font-size-xs);
      font-weight: var(--bzm-font-weight-bold);
      text-transform: uppercase;
      letter-spacing: 0.04em;
      color: var(--bzm-color-text-muted);
    }

    .picker__card-type i {
      font-size: 12px;
    }

    .picker__card-desc {
      margin: 0;
      font-size: var(--bzm-font-size-xs);
      color: var(--bzm-color-text-secondary);
      line-height: 1.4;
    }

    .picker__sparks-amount {
      display: flex;
      align-items: center;
      gap: 4px;
      font-family: var(--bzm-font-heading);
      font-size: var(--bzm-font-size-xl);
      color: var(--bzm-yellow-500);
      -webkit-text-stroke: 0.5px var(--bzm-black);
    }

    .picker__sparks-amount i {
      font-size: 1em;
    }

    /* ─── Actions ─── */
    .picker__actions {
      width: 100%;
      max-width: 300px;
    }

    /* ─── Animations ─── */
    @keyframes bzm-trophy-bounce {
      0% { transform: scale(0) rotate(-20deg); }
      60% { transform: scale(1.2) rotate(5deg); }
      100% { transform: scale(1) rotate(0deg); }
    }

    @keyframes bzm-card-flip {
      0% {
        transform: rotateY(90deg) scale(0.8);
        opacity: 0;
      }
      100% {
        transform: rotateY(0deg) scale(1);
        opacity: 1;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .picker__trophy {
        animation: none;
      }

      .picker__card {
        animation: none;
        transition: none;
      }
    }
  `,
})
/**
 * Displays a boss reward selection screen after defeating a boss round in
 * the singleplayer roguelike mode.
 *
 * Shows a celebratory "BOSS DEFEATED!" header with a trophy animation,
 * followed by exactly three reward cards that flip in. The player selects
 * one reward (highlighted with a golden glow) and confirms their choice.
 * Reward types include Brains, Study Cards, and Sparks bonuses.
 *
 * @selector bzm-boss-reward-picker
 *
 * @example
 * ```html
 * <bzm-boss-reward-picker
 *   [rewards]="bossRewards()"
 *   [selectedId]="selectedReward()"
 *   (rewardSelected)="select($event)"
 *   (rewardConfirmed)="confirm($event)"
 * />
 * ```
 */
export class BzmBossRewardPickerComponent {
  /** Exactly three reward options to choose from. */
  readonly rewards = input.required<[BossReward, BossReward, BossReward]>();

  /**
   * ID of the currently selected reward, or null if none selected.
   * @default null
   */
  readonly selectedId = input<string | null>(null);

  /** Emits the reward ID when a card is clicked. */
  readonly rewardSelected = output<string>();

  /** Emits the reward ID when the player confirms their choice. */
  readonly rewardConfirmed = output<string>();

  protected readonly hasSelection = computed(() => this.selectedId() !== null);

  /** Returns the display label for a reward type. */
  protected rewardTypeLabel(type: BossReward['type']): string {
    return REWARD_TYPE_LABELS[type];
  }

  /** Returns the Phosphor icon class for a reward type. */
  protected rewardTypeIcon(type: BossReward['type']): string {
    return REWARD_TYPE_ICONS[type];
  }

  /** Handles reward card selection. */
  protected onSelect(id: string): void {
    this.rewardSelected.emit(id);
  }

  /** Handles confirmation of the selected reward. */
  protected onConfirm(): void {
    const id = this.selectedId();
    if (id !== null) {
      this.rewardConfirmed.emit(id);
    }
  }
}
