import { describe, it, expect } from 'vitest';
import { routes } from './app.routes';
import { HomeComponent } from './pages/home/home.component';
import { CreateQuizComponent } from './pages/host/create-quiz/create-quiz.component';
import { HostLobbyComponent } from './pages/host/lobby/host-lobby.component';
import { HostGameComponent } from './pages/host/game/host-game.component';
import { HostResultsComponent } from './pages/host/results/host-results.component';
import { JoinGameComponent } from './pages/player/join/join-game.component';
import { PlayerLobbyComponent } from './pages/player/lobby/player-lobby.component';
import { PlayerGameComponent } from './pages/player/game/player-game.component';
import { PlayerResultsComponent } from './pages/player/results/player-results.component';

describe('App Routes', () => {
  it('should define 10 routes (9 pages + wildcard)', () => {
    expect(routes).toHaveLength(10);
  });

  it('should define all expected paths', () => {
    const expectedPaths = [
      '',
      'host/create',
      'host/lobby',
      'host/game',
      'host/results',
      'play/join',
      'play/lobby',
      'play/game',
      'play/results',
    ];

    const definedPaths = routes.map((r) => r.path).filter((p) => p !== '**');
    expect(definedPaths).toEqual(expectedPaths);
  });

  it('should redirect the wildcard route to the root path', () => {
    const wildcard = routes.find((r) => r.path === '**');

    expect(wildcard).toBeDefined();
    expect(wildcard!.redirectTo).toBe('');
  });

  // ---------------------------------------------------------------------------
  // Lazy-loaded component resolution
  // ---------------------------------------------------------------------------

  const lazyRouteExpectations: Array<{ path: string; expectedComponent: unknown }> = [
    { path: '', expectedComponent: HomeComponent },
    { path: 'host/create', expectedComponent: CreateQuizComponent },
    { path: 'host/lobby', expectedComponent: HostLobbyComponent },
    { path: 'host/game', expectedComponent: HostGameComponent },
    { path: 'host/results', expectedComponent: HostResultsComponent },
    { path: 'play/join', expectedComponent: JoinGameComponent },
    { path: 'play/lobby', expectedComponent: PlayerLobbyComponent },
    { path: 'play/game', expectedComponent: PlayerGameComponent },
    { path: 'play/results', expectedComponent: PlayerResultsComponent },
  ];

  describe.each(lazyRouteExpectations)(
    'route "$path"',
    ({ path, expectedComponent }) => {
      it(`should lazy-load the correct component`, async () => {
        const route = routes.find((r) => r.path === path);

        expect(route).toBeDefined();
        expect(route!.loadComponent).toBeDefined();

        const resolved = await route!.loadComponent!();
        expect(resolved).toBe(expectedComponent);
      });
    },
  );
});
