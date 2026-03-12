import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { BzmButtonComponent, BzmHeroComponent, BzmActionBarComponent } from '@bazam/ui';
import { GameStateService } from '../../services/game-state.service';
import { WebSocketService } from '../../services/websocket.service';

@Component({
  selector: 'app-home',
  imports: [BzmButtonComponent, BzmHeroComponent, BzmActionBarComponent],
  template: `
    <section class="home" aria-label="Bazam Quiz Battle">
      <bzm-hero title="Bazam" subtitle="Quiz Battle" tagline="Daag je vrienden uit!" />
      <bzm-action-bar>
        <bzm-button variant="accent" size="lg" (click)="navigateTo('/host/create')">
          Quiz aanmaken
        </bzm-button>
        <bzm-button variant="primary" size="lg" (click)="navigateTo('/play/join')">
          Meedoen
        </bzm-button>
      </bzm-action-bar>
    </section>
  `,
  styles: `
    .home {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 3rem;
      padding: 2rem;
    }
  `,
})
/**
 * Landing page that serves as the main entry point of the Bazam app.
 *
 * Presents the hero branding and two primary call-to-action buttons:
 * - "Quiz aanmaken" -- navigates the host to the quiz creation flow.
 * - "Meedoen" -- navigates a player to the join-game flow.
 */
export class HomeComponent {
  private readonly router = inject(Router);
  private readonly wsService = inject(WebSocketService);
  private readonly gameState = inject(GameStateService);

  /**
   * Resets stale state and navigates to the given route path.
   *
   * @param path - Absolute route path (e.g. `'/host/create'` or `'/play/join'`).
   */
  readonly navigateTo = (path: string): void => {
    if (this.gameState.roomCode() !== null) {
      this.wsService.endSession(path);
    } else {
      void this.router.navigate([path]);
    }
  };
}
