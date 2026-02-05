import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { BzmButtonComponent, BzmHeroComponent, BzmActionBarComponent } from '@bazam/ui';

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
export class HomeComponent {
  private readonly router = inject(Router);

  navigateTo(path: string): void {
    void this.router.navigate([path]);
  }
}
