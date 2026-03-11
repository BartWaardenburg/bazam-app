import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BzmComicBackgroundComponent } from '@bazam/ui';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, BzmComicBackgroundComponent],
  template: `
    <main class="app-shell">
      <bzm-comic-background />
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

    :host {
      display: contents;
    }

    router-outlet + * {
      position: relative;
      z-index: 1;
    }
  `,
})
/**
 * Root application shell component.
 *
 * Provides the full-viewport layout wrapper (`min-height: 100dvh`) with
 * a decorative comic-style background rendered behind all routed views.
 * The `<router-outlet>` renders the active page component based on the
 * current route defined in {@link routes}.
 */
export class App {}
