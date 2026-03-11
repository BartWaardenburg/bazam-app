import { TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, signal } from '@angular/core';
import { Router } from '@angular/router';
import { describe, it, expect, beforeEach } from 'vitest';
import { PlayerResultsComponent } from './player-results.component';
import { GameStateService } from '../../../services/game-state.service';
import { WebSocketService } from '../../../services/websocket.service';

interface LeaderboardEntry {
  id: string;
  nickname: string;
  score: number;
  rank: number;
  previousRank: number | null;
  streak: number;
}

describe('PlayerResultsComponent', () => {
  let component: PlayerResultsComponent;

  const playerNickname = signal('');
  const sortedLeaderboard = signal<LeaderboardEntry[]>([]);

  const mockGameState = {
    playerNickname,
    playerScore: signal(0),
    sortedLeaderboard,
    reset: vi.fn(),
  };

  const mockWsService = {
    disconnect: vi.fn(),
  };

  const mockRouter = {
    navigate: vi.fn().mockResolvedValue(true),
  };

  beforeEach(async () => {
    playerNickname.set('');
    sortedLeaderboard.set([]);
    mockGameState.playerScore.set(0);
    mockGameState.reset.mockReset();
    mockWsService.disconnect.mockReset();
    mockRouter.navigate.mockReset().mockResolvedValue(true);

    await TestBed.configureTestingModule({
      imports: [PlayerResultsComponent],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .overrideComponent(PlayerResultsComponent, {
        set: {
          imports: [],
          providers: [
            { provide: GameStateService, useValue: mockGameState },
            { provide: WebSocketService, useValue: mockWsService },
            { provide: Router, useValue: mockRouter },
          ],
        },
      })
      .compileComponents();

    const fixture = TestBed.createComponent(PlayerResultsComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  // ---------------------------------------------------------------------------
  // playerRank
  // ---------------------------------------------------------------------------

  describe('playerRank', () => {
    it('should return the rank when the player is found in the leaderboard', () => {
      playerNickname.set('Alice');
      sortedLeaderboard.set([
        { id: 'p1', nickname: 'Bob', score: 200, rank: 1, previousRank: null, streak: 3 },
        { id: 'p2', nickname: 'Alice', score: 150, rank: 2, previousRank: null, streak: 1 },
        { id: 'p3', nickname: 'Charlie', score: 100, rank: 3, previousRank: null, streak: 0 },
      ]);

      expect(component.playerRank()).toBe(2);
    });

    it('should return "-" when the player is not found in the leaderboard', () => {
      playerNickname.set('Unknown');
      sortedLeaderboard.set([
        { id: 'p1', nickname: 'Bob', score: 200, rank: 1, previousRank: null, streak: 3 },
        { id: 'p2', nickname: 'Alice', score: 150, rank: 2, previousRank: null, streak: 1 },
      ]);

      expect(component.playerRank()).toBe('-');
    });

    it('should return "-" when the leaderboard is empty', () => {
      playerNickname.set('Alice');
      sortedLeaderboard.set([]);

      expect(component.playerRank()).toBe('-');
    });

    it('should return rank 1 when the player is first', () => {
      playerNickname.set('Alice');
      sortedLeaderboard.set([
        { id: 'p1', nickname: 'Alice', score: 300, rank: 1, previousRank: null, streak: 5 },
        { id: 'p2', nickname: 'Bob', score: 200, rank: 2, previousRank: null, streak: 2 },
      ]);

      expect(component.playerRank()).toBe(1);
    });

    it('should update when playerNickname changes', () => {
      sortedLeaderboard.set([
        { id: 'p1', nickname: 'Alice', score: 200, rank: 1, previousRank: null, streak: 0 },
        { id: 'p2', nickname: 'Bob', score: 100, rank: 2, previousRank: null, streak: 0 },
      ]);

      playerNickname.set('Alice');
      expect(component.playerRank()).toBe(1);

      playerNickname.set('Bob');
      expect(component.playerRank()).toBe(2);
    });
  });

  // ---------------------------------------------------------------------------
  // goHome()
  // ---------------------------------------------------------------------------

  describe('goHome()', () => {
    it('should disconnect, reset game state, and navigate to home', () => {
      component.goHome();

      expect(mockWsService.disconnect).toHaveBeenCalledOnce();
      expect(mockGameState.reset).toHaveBeenCalledOnce();
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/']);
    });

    it('should call disconnect before reset', () => {
      const callOrder: string[] = [];
      mockWsService.disconnect.mockImplementation(() => callOrder.push('disconnect'));
      mockGameState.reset.mockImplementation(() => callOrder.push('reset'));

      component.goHome();

      expect(callOrder).toEqual(['disconnect', 'reset']);
    });
  });
});
