import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  template: `
    <main class="app-shell">
      <div class="bg-comic" aria-hidden="true">
        <div class="comic comic-halftone-1"></div>
        <div class="comic comic-halftone-2"></div>
        <div class="comic comic-starburst"></div>
        <div class="comic comic-speed-lines"></div>
        <div class="comic comic-zigzag"></div>
        <div class="comic comic-explosion"></div>
        <div class="comic comic-triangle"></div>
      </div>
      <router-outlet />
    </main>
  `,
  styles: `
    .app-shell {
      min-height: 100dvh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      position: relative;
      overflow-x: hidden;
      width: 100%;
      padding: 0 1rem;
    }

    .bg-comic {
      position: fixed;
      inset: 0;
      pointer-events: none;
      z-index: 0;
      overflow: hidden;
    }


    .comic {
      position: absolute;
    }

    /* Halftone dot cluster - top right */
    .comic-halftone-1 {
      width: 280px;
      height: 280px;
      top: 3%;
      right: 4%;
      background:
        radial-gradient(circle 4px, #FF3B30 99%, transparent 100%) 0 0 / 16px 16px,
        radial-gradient(circle 3px, #FF3B30 99%, transparent 100%) 8px 8px / 16px 16px;
      opacity: 0.07;
      clip-path: circle(50% at 50% 50%);
      animation: comicDrift 20s ease-in-out infinite;
    }

    /* Halftone dot cluster - bottom left */
    .comic-halftone-2 {
      width: 220px;
      height: 220px;
      bottom: 6%;
      left: 3%;
      background:
        radial-gradient(circle 3px, #00BCD4 99%, transparent 100%) 0 0 / 14px 14px,
        radial-gradient(circle 2px, #00BCD4 99%, transparent 100%) 7px 7px / 14px 14px;
      opacity: 0.08;
      clip-path: circle(50% at 50% 50%);
      animation: comicDrift 24s ease-in-out infinite reverse;
      animation-delay: -6s;
    }

    /* Starburst/explosion - center right */
    .comic-starburst {
      width: 260px;
      height: 260px;
      top: 35%;
      right: -2%;
      background: #FFD60A;
      clip-path: polygon(
        50% 0%, 56% 28%, 79% 5%, 65% 32%, 98% 27%, 72% 42%,
        100% 60%, 70% 56%, 85% 85%, 58% 65%, 55% 100%, 48% 68%,
        20% 92%, 38% 60%, 0% 68%, 32% 48%, 2% 30%, 35% 38%,
        18% 5%, 42% 30%
      );
      opacity: 0.06;
      animation: comicDrift 25s ease-in-out infinite;
      animation-delay: -4s;
    }

    /* Speed lines - left side */
    .comic-speed-lines {
      width: 200px;
      height: 300px;
      top: 15%;
      left: -1%;
      opacity: 0.06;
      background: repeating-linear-gradient(
        -15deg,
        #1A1A1A 0px,
        #1A1A1A 3px,
        transparent 3px,
        transparent 18px
      );
      clip-path: polygon(0% 10%, 100% 0%, 80% 50%, 100% 100%, 0% 90%, 20% 50%);
      animation: comicDrift 18s ease-in-out infinite reverse;
      animation-delay: -8s;
    }

    /* Zigzag - bottom right */
    .comic-zigzag {
      width: 180px;
      height: 140px;
      bottom: 15%;
      right: 12%;
      background: #FF3B30;
      clip-path: polygon(
        0% 50%, 10% 20%, 20% 50%, 30% 15%, 40% 50%, 50% 10%,
        60% 50%, 70% 15%, 80% 50%, 90% 20%, 100% 50%,
        90% 80%, 80% 50%, 70% 85%, 60% 50%, 50% 90%,
        40% 50%, 30% 85%, 20% 50%, 10% 80%
      );
      opacity: 0.06;
      animation: comicDrift 22s ease-in-out infinite;
      animation-delay: -10s;
    }

    /* Explosion/pow shape - top left area */
    .comic-explosion {
      width: 200px;
      height: 200px;
      top: 55%;
      left: 8%;
      background: #FFD60A;
      clip-path: polygon(
        50% 0%, 58% 30%, 85% 10%, 66% 36%, 100% 40%, 68% 50%,
        90% 75%, 60% 60%, 65% 95%, 50% 66%, 35% 95%, 40% 60%,
        10% 75%, 32% 50%, 0% 40%, 34% 36%, 15% 10%, 42% 30%
      );
      opacity: 0.05;
      animation: comicDrift 26s ease-in-out infinite reverse;
      animation-delay: -3s;
    }

    /* Bold triangle - top center-left */
    .comic-triangle {
      width: 160px;
      height: 160px;
      top: 8%;
      left: 20%;
      background: #00BCD4;
      clip-path: polygon(50% 0%, 100% 100%, 0% 100%);
      border: 4px solid #000000;
      opacity: 0.06;
      animation: comicDrift 19s ease-in-out infinite;
      animation-delay: -12s;
    }

    @keyframes comicDrift {
      0%, 100% {
        transform: translate(0, 0) rotate(0deg);
      }
      33% {
        transform: translate(10px, -14px) rotate(3deg);
      }
      66% {
        transform: translate(-6px, 8px) rotate(-2deg);
      }
    }

    :host {
      display: contents;
    }

    router-outlet + * {
      position: relative;
      z-index: 1;
    }
  `,
})
export class App {}
