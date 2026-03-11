import { ApplicationConfig, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';

/**
 * Top-level Angular application configuration.
 *
 * Enables zoneless change detection (Angular 21+) for signal-driven
 * rendering without Zone.js overhead, and registers the lazy-loaded
 * route definitions from {@link routes}.
 */
export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),
    provideRouter(routes),
  ],
};
