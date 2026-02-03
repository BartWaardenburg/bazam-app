import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { BzmSplatComponent } from '../../atoms/splat/splat.component';

@Component({
  selector: 'bzm-hero',
  standalone: true,
  imports: [BzmSplatComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="bzm-hero">
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

    .bzm-hero__tagline {
      font-size: var(--bzm-font-size-xl);
      color: var(--bzm-color-text);
      margin: var(--bzm-space-3) 0 0;
      font-weight: var(--bzm-font-weight-semibold);
    }
  `,
})
export class BzmHeroComponent {
  readonly title = input<string>('Bazam');
  readonly subtitle = input<string | undefined>('Quiz Battle');
  readonly tagline = input<string | undefined>('Daag je vrienden uit!');
}
