import { Routes } from '@angular/router';

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
    loadComponent: () => import('./pages/host/lobby/host-lobby.component').then((m) => m.HostLobbyComponent),
  },
  {
    path: 'host/game',
    loadComponent: () => import('./pages/host/game/host-game.component').then((m) => m.HostGameComponent),
  },
  {
    path: 'host/results',
    loadComponent: () => import('./pages/host/results/host-results.component').then((m) => m.HostResultsComponent),
  },
  {
    path: 'play/join',
    loadComponent: () => import('./pages/player/join/join-game.component').then((m) => m.JoinGameComponent),
  },
  {
    path: 'play/lobby',
    loadComponent: () => import('./pages/player/lobby/player-lobby.component').then((m) => m.PlayerLobbyComponent),
  },
  {
    path: 'play/game',
    loadComponent: () => import('./pages/player/game/player-game.component').then((m) => m.PlayerGameComponent),
  },
  {
    path: 'play/results',
    loadComponent: () => import('./pages/player/results/player-results.component').then((m) => m.PlayerResultsComponent),
  },
  { path: '**', redirectTo: '' },
];
