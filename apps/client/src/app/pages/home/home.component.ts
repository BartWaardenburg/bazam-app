import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { BzmButtonComponent } from '@bazam/ui';

@Component({
  selector: 'app-home',
  imports: [BzmButtonComponent],
  template: `
    <section class="home" aria-label="Bazam Quiz Battle">
      <header class="hero animate-in">
        <div class="title-wrapper">
          <div class="splat splat-1" aria-hidden="true"></div>
          <div class="splat splat-2" aria-hidden="true"></div>
          <h1 class="title">
            <span class="title-main">Bazam</span>
            <span class="title-sub">Quiz Battle</span>
          </h1>
        </div>
        <p class="subtitle">Daag je vrienden uit!</p>
      </header>
      <nav class="actions animate-in" style="animation-delay: 0.15s" aria-label="Hoofdmenu">
        <bzm-button variant="accent" size="lg" (click)="navigateTo('/host/create')">
          Quiz aanmaken
        </bzm-button>
        <bzm-button variant="primary" size="lg" (click)="navigateTo('/play/join')">
          Meedoen
        </bzm-button>
      </nav>
    </section>
  `,
  styles: `
    .home {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 3rem;
      padding: 2rem;
      text-align: center;
    }

    .title-wrapper {
      position: relative;
      display: inline-block;
    }

    .splat {
      position: absolute;
      z-index: 0;
      opacity: 0.15;
    }

    .splat-1 {
      width: 120px;
      height: 120px;
      background: #FF3B30;
      top: -20px;
      left: -30px;
      clip-path: polygon(
        50% 0%, 58% 28%, 85% 10%, 66% 36%, 100% 40%, 68% 50%,
        90% 75%, 60% 60%, 65% 95%, 50% 66%, 35% 95%, 40% 60%,
        10% 75%, 32% 50%, 0% 40%, 34% 36%, 15% 10%, 42% 30%
      );
      animation: splatPulse 8s ease-in-out infinite;
    }

    .splat-2 {
      width: 90px;
      height: 90px;
      background: #FFD60A;
      bottom: -10px;
      right: -25px;
      clip-path: polygon(
        50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%,
        50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%
      );
      animation: splatPulse 8s ease-in-out infinite reverse;
    }

    @keyframes splatPulse {
      0%, 100% { transform: scale(1) rotate(0deg); }
      50% { transform: scale(1.1) rotate(8deg); }
    }

    .title {
      display: flex;
      flex-direction: column;
      line-height: 1;
      position: relative;
      z-index: 1;
    }

    .title-main {
      font-family: var(--font-heading);
      font-size: clamp(4rem, 14vw, 7rem);
      color: var(--color-text);
      text-shadow:
        4px 4px 0 #FF3B30,
        8px 8px 0 #000000;
      letter-spacing: 0.06em;
      transform: rotate(-2deg);
      display: inline-block;
    }

    .title-sub {
      font-family: var(--font-heading);
      font-size: clamp(1.5rem, 5vw, 2.5rem);
      color: #00BCD4;
      text-shadow: 2px 2px 0 #000000;
      letter-spacing: 0.1em;
      margin-top: 0.25rem;
    }

    .subtitle {
      font-size: 1.3rem;
      color: #1A1A1A;
      margin-top: 0.75rem;
      font-weight: 600;
    }

    .actions {
      display: flex;
      gap: 1.25rem;
      flex-wrap: wrap;
      justify-content: center;
    }

  `,
})
export class HomeComponent {
  private readonly router = inject(Router);

  navigateTo(path: string): void {
    void this.router.navigate([path]);
  }
}
