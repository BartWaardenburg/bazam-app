import { Component, ChangeDetectionStrategy, input, output, signal, viewChild, ElementRef, effect, HostListener, OnDestroy } from '@angular/core';

@Component({
  selector: 'bzm-image-question',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="bzm-image-question">
      <!-- Image frame -->
      <div
        class="bzm-image-question__frame"
        [class.bzm-image-question__frame--zoomable]="zoomable()"
        (click)="onImageClick()"
        (keydown.enter)="onImageClick()"
        [attr.role]="zoomable() ? 'button' : null"
        [attr.tabindex]="zoomable() ? 0 : null"
        [attr.aria-label]="zoomable() ? 'Afbeelding vergroten' : null"
      >
        @if (loading()) {
          <div class="bzm-image-question__skeleton" aria-label="Afbeelding laden...">
            <div class="bzm-image-question__skeleton-shimmer"></div>
            <i class="ph-duotone ph-image bzm-image-question__skeleton-icon" aria-hidden="true"></i>
          </div>
        } @else {
          <img
            class="bzm-image-question__image"
            [src]="imageUrl()"
            [alt]="imageAlt()"
            loading="lazy"
          />
          @if (zoomable()) {
            <span class="bzm-image-question__zoom-hint" aria-hidden="true">
              <i class="ph-duotone ph-magnifying-glass-plus"></i>
            </span>
          }
        }

        <!-- Decorative corners -->
        <span class="bzm-image-question__corner bzm-image-question__corner--tl" aria-hidden="true"></span>
        <span class="bzm-image-question__corner bzm-image-question__corner--tr" aria-hidden="true"></span>
        <span class="bzm-image-question__corner bzm-image-question__corner--bl" aria-hidden="true"></span>
        <span class="bzm-image-question__corner bzm-image-question__corner--br" aria-hidden="true"></span>
      </div>

      <!-- Question text -->
      <h3 class="bzm-image-question__text">{{ question() }}</h3>
    </div>

    <!-- Zoom overlay -->
    @if (zoomed()) {
      <div
        class="bzm-image-question__overlay"
        role="dialog"
        aria-modal="true"
        aria-label="Vergrote afbeelding"
        (click)="closeZoom()"
        (keydown)="onOverlayKeydown($event)"
      >
        <img
          class="bzm-image-question__overlay-image"
          [src]="imageUrl()"
          [alt]="imageAlt()"
          (click)="$event.stopPropagation()"
        />
        <button
          class="bzm-image-question__overlay-close"
          #closeButton
          aria-label="Sluiten"
          (click)="closeZoom()"
        >
          <i class="ph-bold ph-x" aria-hidden="true"></i>
        </button>
      </div>
    }
  `,
  styles: `
    :host {
      display: block;
      font-family: var(--bzm-font-family);
    }

    .bzm-image-question {
      display: flex;
      flex-direction: column;
      gap: var(--bzm-space-4);
    }

    /* ── Image frame ── */
    .bzm-image-question__frame {
      position: relative;
      border: 4px solid var(--bzm-color-border);
      border-width: var(--bzm-border-width-comic);
      border-radius: var(--bzm-radius-md);
      overflow: hidden;
      box-shadow: var(--bzm-shadow-card);
      background: var(--bzm-color-surface);
      transform: rotate(-1deg);
      transition: transform var(--bzm-transition-playful);
    }

    .bzm-image-question__frame--zoomable {
      cursor: zoom-in;
      outline: none;
    }

    .bzm-image-question__frame--zoomable:hover {
      transform: rotate(0deg) scale(1.02);
    }

    .bzm-image-question__frame--zoomable:focus-visible {
      box-shadow: 0 0 0 3px var(--bzm-color-focus), var(--bzm-shadow-card);
    }

    /* ── Image ── */
    .bzm-image-question__image {
      display: block;
      width: 100%;
      max-height: 300px;
      object-fit: cover;
    }

    /* ── Zoom hint ── */
    .bzm-image-question__zoom-hint {
      position: absolute;
      bottom: var(--bzm-space-3);
      right: var(--bzm-space-3);
      display: flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
      border-radius: var(--bzm-radius-md);
      background: var(--bzm-color-surface);
      color: var(--bzm-color-text);
      font-size: var(--bzm-font-size-lg);
      border: 3px solid var(--bzm-color-border);
      border-width: var(--bzm-border-width-comic-sm);
      box-shadow: var(--bzm-shadow-sm);
      opacity: 0;
      transition: opacity var(--bzm-transition-base);
    }

    .bzm-image-question__frame--zoomable:hover .bzm-image-question__zoom-hint {
      opacity: 1;
    }

    /* ── Skeleton loading ── */
    .bzm-image-question__skeleton {
      position: relative;
      width: 100%;
      height: 200px;
      background: var(--bzm-gray-200);
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
    }

    .bzm-image-question__skeleton-shimmer {
      position: absolute;
      inset: 0;
      background: linear-gradient(
        90deg,
        transparent 0%,
        rgba(255, 255, 255, 0.4) 50%,
        transparent 100%
      );
      animation: bzm-shimmer 1.5s ease-in-out infinite;
    }

    .bzm-image-question__skeleton-icon {
      font-size: var(--bzm-font-size-4xl);
      color: var(--bzm-gray-400);
      z-index: 1;
    }

    /* ── Decorative corners ── */
    .bzm-image-question__corner {
      position: absolute;
      width: 16px;
      height: 16px;
      border-color: var(--bzm-color-accent);
      border-style: solid;
      border-width: 0;
    }

    .bzm-image-question__corner--tl {
      top: 6px;
      left: 6px;
      border-top-width: 3px;
      border-left-width: 3px;
      border-top-left-radius: 4px;
    }

    .bzm-image-question__corner--tr {
      top: 6px;
      right: 6px;
      border-top-width: 3px;
      border-right-width: 3px;
      border-top-right-radius: 4px;
    }

    .bzm-image-question__corner--bl {
      bottom: 6px;
      left: 6px;
      border-bottom-width: 3px;
      border-left-width: 3px;
      border-bottom-left-radius: 4px;
    }

    .bzm-image-question__corner--br {
      bottom: 6px;
      right: 6px;
      border-bottom-width: 3px;
      border-right-width: 3px;
      border-bottom-right-radius: 4px;
    }

    /* ── Question text ── */
    .bzm-image-question__text {
      margin: 0;
      font-size: clamp(1.1rem, 3.5vw, 1.6rem);
      font-weight: var(--bzm-font-weight-extrabold);
      color: var(--bzm-color-text);
      line-height: 1.3;
    }

    /* ── Zoom overlay ── */
    .bzm-image-question__overlay {
      position: fixed;
      inset: 0;
      z-index: 1000;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(0, 0, 0, 0.85);
      backdrop-filter: blur(4px);
      padding: var(--bzm-space-6);
      cursor: zoom-out;
      animation: bzm-overlay-in 0.2s ease-out;
    }

    .bzm-image-question__overlay-image {
      max-width: 90vw;
      max-height: 90vh;
      object-fit: contain;
      border-radius: var(--bzm-radius-md);
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
      cursor: default;
      animation: bzm-zoom-in 0.25s ease-out;
    }

    .bzm-image-question__overlay-close {
      position: absolute;
      top: var(--bzm-space-4);
      right: var(--bzm-space-4);
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      border: 3px solid rgba(255, 255, 255, 0.3);
      border-width: var(--bzm-border-width-comic-sm);
      border-radius: var(--bzm-radius-md);
      background: var(--bzm-color-surface);
      color: var(--bzm-color-text);
      font-size: var(--bzm-font-size-lg);
      cursor: pointer;
      box-shadow: var(--bzm-shadow-sm);
      transition: transform var(--bzm-transition-base);
    }

    .bzm-image-question__overlay-close:hover {
      transform: scale(1.1);
    }

    .bzm-image-question__overlay-close:focus-visible {
      outline: 2px solid var(--bzm-color-focus);
      outline-offset: 2px;
    }

    /* ── Animations ── */
    @keyframes bzm-shimmer {
      from { transform: translateX(-100%); }
      to { transform: translateX(100%); }
    }

    @keyframes bzm-overlay-in {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    @keyframes bzm-zoom-in {
      from { transform: scale(0.9); opacity: 0; }
      to { transform: scale(1); opacity: 1; }
    }

    @media (max-width: 480px) {
      .bzm-image-question__image {
        max-height: 200px;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .bzm-image-question__skeleton-shimmer,
      .bzm-image-question__overlay,
      .bzm-image-question__overlay-image {
        animation: none;
      }

      .bzm-image-question__frame,
      .bzm-image-question__overlay-close {
        transition: none;
      }
    }
  `,
})
/**
 * Displays a quiz question with an image displayed in a comic-bordered frame
 * above the question text.
 *
 * The image frame has a slight rotation and decorative corner accents. Supports
 * a loading skeleton state and an optional zoom interaction (tap/click to zoom,
 * handled by the parent via the `imageZoomed` output). Responsive image scaling
 * adjusts for smaller screens.
 *
 * @selector bzm-image-question
 *
 * @example
 * ```html
 * <bzm-image-question
 *   imageUrl="/assets/flag.png"
 *   imageAlt="Een nationale vlag"
 *   question="Bij welk land hoort deze vlag?"
 *   [zoomable]="true"
 *   (imageZoomed)="openZoomModal()"
 * />
 * ```
 */
export class BzmImageQuestionComponent implements OnDestroy {
  /** URL of the question image. */
  readonly imageUrl = input.required<string>();

  /** Accessible alt text describing the image. */
  readonly imageAlt = input.required<string>();

  /** Question text displayed below the image. */
  readonly question = input.required<string>();

  /** Whether the image is still loading (shows skeleton placeholder). @default false */
  readonly loading = input<boolean>(false);

  /** Whether tapping the image triggers a zoom event. @default true */
  readonly zoomable = input<boolean>(true);

  /** Emitted when the image is tapped/clicked for zooming. */
  readonly imageZoomed = output<void>();

  /** Whether the zoom overlay is currently open. */
  protected readonly zoomed = signal(false);

  private readonly closeButton = viewChild<ElementRef<HTMLButtonElement>>('closeButton');
  private triggerElement: HTMLElement | null = null;

  constructor() {
    effect(() => {
      const buttonRef = this.closeButton();
      if (buttonRef) {
        buttonRef.nativeElement.focus();
        document.body.style.overflow = 'hidden';
      }
    });
  }

  ngOnDestroy(): void {
    document.body.style.overflow = '';
  }

  @HostListener('document:keydown.escape')
  protected onEscape(): void {
    if (this.zoomed()) {
      this.closeZoom();
    }
  }

  /** Handles click on the image frame, opening the zoom overlay. */
  protected onImageClick(): void {
    if (this.zoomable() && !this.loading()) {
      this.triggerElement = document.activeElement as HTMLElement;
      this.zoomed.set(true);
      this.imageZoomed.emit();
    }
  }

  /** Traps focus within the zoom dialog when Tab is pressed. */
  protected onOverlayKeydown(event: KeyboardEvent): void {
    if (event.key === 'Tab') {
      event.preventDefault();
      const button = this.closeButton();
      if (button) {
        button.nativeElement.focus();
      }
    }
  }

  /** Closes the zoom overlay. */
  protected closeZoom(): void {
    this.zoomed.set(false);
    document.body.style.overflow = '';
    this.triggerElement?.focus();
    this.triggerElement = null;
  }
}
