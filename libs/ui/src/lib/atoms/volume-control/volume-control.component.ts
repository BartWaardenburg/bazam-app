import {
  Component,
  ChangeDetectionStrategy,
  model,
  computed,
  signal,
  ElementRef,
  viewChild,
  OnDestroy,
} from '@angular/core';

const CLOSE_DELAY_MS = 300;

const TRACK_HEIGHT = 100;
const THUMB_SIZE = 22;

@Component({
  selector: 'bzm-volume-control',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="bzm-volume-control"
      [class.bzm-volume-control--expanded]="expanded()"
      (mouseenter)="onMouseEnter()"
      (mouseleave)="onMouseLeave()"
      (focusin)="onFocusIn()"
      (focusout)="onFocusOut()"
    >
      @if (expanded()) {
        <div class="bzm-volume-control__popout">
          <div
            #track
            class="bzm-volume-control__track"
            [class.bzm-volume-control__track--dragging]="dragging()"
            role="slider"
            tabindex="0"
            [attr.aria-label]="'Volume'"
            [attr.aria-valuemin]="0"
            [attr.aria-valuemax]="100"
            [attr.aria-valuenow]="volume()"
            (pointerdown)="onTrackPointerDown($event)"
            (keydown)="onTrackKeyDown($event)"
          >
            <div class="bzm-volume-control__track-bg"></div>
            <div
              class="bzm-volume-control__track-fill"
              [style.height.%]="volume()"
            ></div>
            <div
              class="bzm-volume-control__thumb"
              [class.bzm-volume-control__thumb--dragging]="dragging()"
              [style.bottom.%]="volume()"
            ></div>
          </div>
        </div>
      }

      <button
        type="button"
        class="bzm-volume-control__button"
        [attr.aria-label]="muted() ? 'Geluid aan zetten' : 'Geluid uitzetten'"
        [attr.aria-pressed]="muted()"
        (click)="toggleMute()"
      >
        <i [class]="iconClass()" style="font-size: 20px;"></i>
      </button>
    </div>
  `,
  styles: `
    :host {
      display: block;
      font-family: var(--bzm-font-family);
    }

    .bzm-volume-control {
      position: relative;
      display: inline-flex;
      flex-direction: column;
      align-items: center;
    }

    .bzm-volume-control__button {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 44px;
      height: 44px;
      border-radius: 50%;
      background: var(--bzm-color-surface);
      border: 4px solid var(--bzm-color-border);
      border-width: 3px 4px 5px 3px;
      box-shadow: var(--bzm-shadow-sm);
      cursor: pointer;
      color: var(--bzm-color-text);
      transition: transform var(--bzm-transition-playful),
                  box-shadow var(--bzm-transition-base);
      outline: none;
      font-family: inherit;
      padding: 0;
    }

    .bzm-volume-control__button:hover {
      transform: scale(1.1);
      box-shadow: var(--bzm-shadow-md);
    }

    .bzm-volume-control__button:focus-visible {
      box-shadow: 0 0 0 3px var(--bzm-cyan-300);
    }

    .bzm-volume-control__button:active {
      transform: scale(0.95);
      box-shadow: none;
    }

    .bzm-volume-control__popout {
      position: absolute;
      bottom: 100%;
      left: 50%;
      transform: translateX(-50%);
      margin-bottom: 8px;
      background: var(--bzm-color-surface);
      border: 3px solid var(--bzm-color-border);
      border-radius: var(--bzm-radius-md);
      padding: 16px 14px;
      box-shadow: var(--bzm-shadow-md);
      display: flex;
      justify-content: center;
      animation: bzm-slider-pop 0.2s ease-out;
    }

    /* Invisible bridge between popout and button so mouse doesn't "leave" in the gap */
    .bzm-volume-control__popout::after {
      content: '';
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      height: 12px;
    }

    .bzm-volume-control__track {
      position: relative;
      width: 6px;
      height: ${TRACK_HEIGHT}px;
      cursor: pointer;
      outline: none;
      touch-action: none;
    }

    .bzm-volume-control__track:focus-visible {
      outline: 2px solid var(--bzm-cyan-300);
      outline-offset: 8px;
      border-radius: 4px;
    }

    .bzm-volume-control__track-bg {
      position: absolute;
      inset: 0;
      border-radius: 9999px;
      background: var(--bzm-gray-200);
      border: 2px solid var(--bzm-color-border);
    }

    .bzm-volume-control__track-fill {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      border-radius: 9999px;
      background: var(--bzm-color-primary);
      border: 2px solid var(--bzm-color-border);
      transition: height 0.35s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .bzm-volume-control__track--dragging .bzm-volume-control__track-fill {
      transition: none;
    }

    .bzm-volume-control__thumb {
      position: absolute;
      left: 50%;
      width: ${THUMB_SIZE}px;
      height: ${THUMB_SIZE}px;
      margin-left: -${THUMB_SIZE / 2}px;
      margin-bottom: -${THUMB_SIZE / 2}px;
      border-radius: 50%;
      background: var(--bzm-color-primary);
      border: 3px solid var(--bzm-color-border);
      box-shadow: var(--bzm-shadow-sm);
      cursor: grab;
      transition: bottom 0.4s cubic-bezier(0.34, 1.4, 0.64, 1),
                  transform 0.15s ease,
                  box-shadow 0.15s ease;
    }

    .bzm-volume-control__track--dragging .bzm-volume-control__thumb {
      transition: transform 0.15s ease, box-shadow 0.15s ease;
    }

    .bzm-volume-control__thumb:hover {
      transform: scale(1.15);
      box-shadow: var(--bzm-shadow-md);
    }

    .bzm-volume-control__thumb--dragging {
      cursor: grabbing;
      transform: scale(1.25);
      box-shadow: var(--bzm-shadow-md);
    }

    @keyframes bzm-slider-pop {
      from {
        opacity: 0;
        transform: translateX(-50%) scale(0.8) translateY(8px);
      }
      to {
        opacity: 1;
        transform: translateX(-50%) scale(1) translateY(0);
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .bzm-volume-control__button,
      .bzm-volume-control__thumb,
      .bzm-volume-control__track-fill {
        transition: none;
      }

      .bzm-volume-control__popout {
        animation: none;
      }
    }
  `,
})
/**
 * Displays a compact circular mute/volume control button with an expandable
 * vertical slider. Clicking the button toggles mute; hovering reveals a slider
 * to adjust volume level. The icon reflects the current volume state: muted,
 * low, or high.
 *
 * @selector bzm-volume-control
 *
 * @example
 * ```html
 * <bzm-volume-control
 *   [(volume)]="volume"
 *   [(muted)]="muted"
 * />
 * ```
 */
export class BzmVolumeControlComponent implements OnDestroy {
  private closeTimer: ReturnType<typeof setTimeout> | null = null;
  /**
   * Volume level as a 0-100 percentage. Supports two-way binding via [(volume)].
   * @default 80
   */
  readonly volume = model<number>(80);

  /**
   * Whether audio is currently muted. Supports two-way binding via [(muted)].
   * @default false
   */
  readonly muted = model<boolean>(false);

  /** Tracks whether the slider panel is currently visible. */
  protected readonly expanded = signal<boolean>(false);

  /** Tracks whether the thumb is being dragged. */
  protected readonly dragging = signal<boolean>(false);

  /** Stores volume before muting so unmute can restore it. */
  private volumeBeforeMute = 0;

  /** Reference to the track element for pointer calculations. */
  private readonly trackRef = viewChild<ElementRef<HTMLDivElement>>('track');

  /** Computes the correct Phosphor icon class based on volume and muted state. */
  protected readonly iconClass = computed(() => {
    if (this.muted()) {
      return 'ph-duotone ph-speaker-x';
    }
    if (this.volume() <= 60) {
      return 'ph-duotone ph-speaker-low';
    }
    return 'ph-duotone ph-speaker-high';
  });

  ngOnDestroy(): void {
    this.clearCloseTimer();
  }

  /** Toggles mute — muting sets slider to 0, unmuting restores previous volume. */
  toggleMute(): void {
    if (this.muted()) {
      this.muted.set(false);
      this.volume.set(this.volumeBeforeMute || 80);
    } else {
      this.volumeBeforeMute = this.volume();
      this.muted.set(true);
      this.volume.set(0);
    }
  }

  /** Shows the slider panel on mouse enter, cancelling any pending close. */
  onMouseEnter(): void {
    this.clearCloseTimer();
    this.expanded.set(true);
  }

  /** Schedules closing the slider panel after a short delay. */
  onMouseLeave(): void {
    if (!this.dragging()) {
      this.scheduleClose();
    }
  }

  onFocusIn(): void {
    this.clearCloseTimer();
    this.expanded.set(true);
  }

  onFocusOut(): void {
    if (!this.dragging()) {
      this.scheduleClose();
    }
  }

  private scheduleClose(): void {
    this.clearCloseTimer();
    this.closeTimer = setTimeout(() => {
      this.expanded.set(false);
      this.closeTimer = null;
    }, CLOSE_DELAY_MS);
  }

  private clearCloseTimer(): void {
    if (this.closeTimer !== null) {
      clearTimeout(this.closeTimer);
      this.closeTimer = null;
    }
  }

  /** Handles pointer down on the track — starts drag and sets initial volume. */
  onTrackPointerDown(event: PointerEvent): void {
    event.preventDefault();
    const trackEl = this.trackRef()?.nativeElement;
    if (!trackEl) return;

    trackEl.setPointerCapture(event.pointerId);
    this.dragging.set(true);
    this.setVolumeFromPointer(event, trackEl);

    const onMove = (e: PointerEvent): void => {
      this.setVolumeFromPointer(e, trackEl);
    };

    const onUp = (): void => {
      this.dragging.set(false);
      trackEl.removeEventListener('pointermove', onMove);
      trackEl.removeEventListener('pointerup', onUp);
      trackEl.removeEventListener('pointercancel', onUp);
    };

    trackEl.addEventListener('pointermove', onMove);
    trackEl.addEventListener('pointerup', onUp);
    trackEl.addEventListener('pointercancel', onUp);
  }

  /** Handles keyboard interaction on the slider track. */
  onTrackKeyDown(event: KeyboardEvent): void {
    const step = event.shiftKey ? 10 : 5;
    let newVolume: number | null = null;

    switch (event.key) {
      case 'ArrowUp':
      case 'ArrowRight':
        newVolume = Math.min(100, this.volume() + step);
        break;
      case 'ArrowDown':
      case 'ArrowLeft':
        newVolume = Math.max(0, this.volume() - step);
        break;
      case 'Home':
        newVolume = 0;
        break;
      case 'End':
        newVolume = 100;
        break;
      default:
        return;
    }

    event.preventDefault();
    this.setVolume(newVolume);
  }

  /** Calculates volume from pointer position relative to the track. */
  private setVolumeFromPointer(event: PointerEvent, trackEl: HTMLDivElement): void {
    const rect = trackEl.getBoundingClientRect();
    const offsetFromBottom = rect.bottom - event.clientY;
    const ratio = Math.max(0, Math.min(1, offsetFromBottom / rect.height));
    this.setVolume(Math.round(ratio * 100));
  }

  /** Sets volume and syncs muted state — 0 mutes, >0 unmutes. */
  private setVolume(value: number): void {
    this.volume.set(value);
    this.muted.set(value === 0);
  }
}
