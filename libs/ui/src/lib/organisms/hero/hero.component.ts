import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { BzmSplatComponent } from '../../atoms/splat/splat.component';
import { BzmMascotComponent } from '../../atoms/mascot/mascot.component';

@Component({
  selector: 'bzm-hero',
  standalone: true,
  imports: [BzmSplatComponent, BzmMascotComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="bzm-hero">
      <div class="bzm-hero__content">
        <div class="bzm-hero__title-wrapper">
          <div class="bzm-hero__splat bzm-hero__splat--1">
            <bzm-splat shape="burst" color="var(--bzm-color-primary)" size="120px" />
          </div>
          <div class="bzm-hero__splat bzm-hero__splat--2">
            <bzm-splat shape="star" color="var(--bzm-color-accent)" size="90px" />
          </div>
          <h1 class="bzm-hero__title">
            <span class="bzm-hero__title-main">{{ title() }}</span>
            @if (subtitle()) {
              <span class="bzm-hero__title-sub">{{ subtitle() }}</span>
            }
          </h1>
        </div>
        @if (showMascot()) {
          <div class="bzm-hero__mascot">
            <bzm-mascot
              expression="neutral"
              animate="float"
              size="xl"
            />
          </div>
        }
      </div>
      @if (tagline()) {
        <p class="bzm-hero__tagline">{{ tagline() }}</p>
      }
    </header>
  `,
  styles: `
    :host {
      display: block;
      font-family: var(--bzm-font-family);
      text-align: center;
    }

    .bzm-hero {
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .bzm-hero__content {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: var(--bzm-space-6);
    }

    .bzm-hero__title-wrapper {
      position: relative;
      display: inline-block;
    }

    .bzm-hero__splat {
      position: absolute;
      z-index: 0;
    }

    .bzm-hero__splat--1 {
      top: -20px;
      left: -30px;
    }

    .bzm-hero__splat--2 {
      bottom: -10px;
      right: -25px;
    }

    .bzm-hero__title {
      display: flex;
      flex-direction: column;
      line-height: var(--bzm-line-height-tight);
      position: relative;
      z-index: 1;
      margin: 0;
    }

    .bzm-hero__title-main {
      font-size: clamp(4rem, 14vw, 7rem);
      font-weight: var(--bzm-font-weight-black);
      color: var(--bzm-color-text);
      text-shadow:
        4px 4px 0 var(--bzm-color-primary),
        8px 8px 0 var(--bzm-black);
      letter-spacing: 0.06em;
      transform: rotate(-2deg);
      display: inline-block;
    }

    .bzm-hero__title-sub {
      font-size: clamp(1.5rem, 5vw, 2.5rem);
      font-weight: var(--bzm-font-weight-extrabold);
      color: var(--bzm-color-answer-a);
      text-shadow: 2px 2px 0 var(--bzm-black);
      letter-spacing: 0.1em;
      margin-top: var(--bzm-space-1);
    }

    .bzm-hero__mascot {
      transform: rotate(5deg);
      flex-shrink: 0;
    }

    .bzm-hero__tagline {
      font-size: var(--bzm-font-size-xl);
      color: var(--bzm-color-text);
      margin: var(--bzm-space-3) 0 0;
      font-weight: var(--bzm-font-weight-semibold);
    }

    @media (max-width: 640px) {
      .bzm-hero__content {
        flex-direction: column;
        gap: var(--bzm-space-4);
      }

      .bzm-hero__mascot {
        transform: rotate(0deg);
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .bzm-hero__mascot {
        transform: rotate(5deg);
      }
    }
  `,
})
/**
 * Renders the landing page hero section with a bold title, optional subtitle,
 * tagline, and decorative splat shapes alongside the Bazam mascot.
 *
 * Designed as the primary visual anchor for the home page. The title uses
 * comic-style text shadows and a slight rotation. On mobile the layout
 * stacks vertically.
 *
 * @selector bzm-hero
 *
 * @example
 * ```html
 * <bzm-hero
 *   title="Bazam"
 *   subtitle="Quiz Battle"
 *   tagline="Daag je vrienden uit!"
 *   [showMascot]="true"
 * />
 * ```
 */
export class BzmHeroComponent {
  /**
   * Primary hero title rendered in large comic-style text.
   * @default 'Bazam'
   */
  readonly title = input<string>('Bazam');

  /**
   * Secondary line displayed below the main title.
   * Pass `undefined` to hide it.
   * @default 'Quiz Battle'
   */
  readonly subtitle = input<string | undefined>('Quiz Battle');

  /**
   * Tagline paragraph shown beneath the title block.
   * Pass `undefined` to hide it.
   * @default 'Daag je vrienden uit!'
   */
  readonly tagline = input<string | undefined>('Daag je vrienden uit!');

  /**
   * Whether to display the floating mascot beside the title.
   * @default true
   */
  readonly showMascot = input<boolean>(true);
}
