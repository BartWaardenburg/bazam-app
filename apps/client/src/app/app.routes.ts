import { Routes } from '@angular/router';
import { hostGuard, playerGuard } from './guards/game-session.guard';

/**
 * Application route definitions with lazy-loaded page components.
 *
 * Organized into two parallel flows:
 * - **Host flow** (`/host/*`) -- Create a quiz, manage the lobby, run the
 *   game, and view final results. Protected by {@link hostGuard}.
 * - **Player flow** (`/play/*`) -- Join a game, wait in the lobby, answer
 *   questions, and see personal results. Protected by {@link playerGuard}.
 *
 * All page components are lazy-loaded via dynamic `import()` to keep the
 * initial bundle size minimal. The wildcard route redirects unknown paths
 * back to the home page.
 */
export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'host/create',
    loadComponent: () => import('./pages/host/create-quiz/create-quiz.component').then((m) => m.CreateQuizComponent),
  },
  {
    path: 'host/lobby',
    canActivate: [hostGuard],
    loadComponent: () => import('./pages/host/lobby/host-lobby.component').then((m) => m.HostLobbyComponent),
  },
  {
    path: 'host/game',
    canActivate: [hostGuard],
    loadComponent: () => import('./pages/host/game/host-game.component').then((m) => m.HostGameComponent),
  },
  {
    path: 'host/results',
    canActivate: [hostGuard],
    loadComponent: () => import('./pages/host/results/host-results.component').then((m) => m.HostResultsComponent),
  },
  {
    path: 'play/join',
    loadComponent: () => import('./pages/player/join/join-game.component').then((m) => m.JoinGameComponent),
  },
  {
    path: 'play/lobby',
    canActivate: [playerGuard],
    loadComponent: () => import('./pages/player/lobby/player-lobby.component').then((m) => m.PlayerLobbyComponent),
  },
  {
    path: 'play/game',
    canActivate: [playerGuard],
    loadComponent: () => import('./pages/player/game/player-game.component').then((m) => m.PlayerGameComponent),
  },
  {
    path: 'play/results',
    canActivate: [playerGuard],
    loadComponent: () => import('./pages/player/results/player-results.component').then((m) => m.PlayerResultsComponent),
  },
  { path: '**', redirectTo: '' },
];
