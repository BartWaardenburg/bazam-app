import { TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, signal } from '@angular/core';
import { describe, it, expect, beforeEach } from 'vitest';
import type { LeaderboardEntry } from '@bazam/shared-types';
import { PlayerResultsComponent } from './player-results.component';
import { GameStateService } from '../../../services/game-state.service';
import { WebSocketService } from '../../../services/websocket.service';

describe('PlayerResultsComponent', () => {
  let component: PlayerResultsComponent;

  const playerNickname = signal('');
  const playerId = signal<string | null>(null);
  const sortedLeaderboard = signal<LeaderboardEntry[]>([]);

  const mockGameState = {
    playerNickname,
    playerId,
    playerScore: signal(0),
    sortedLeaderboard,
    roomCode: signal<string | null>(null),
    reset: vi.fn(),
  };

  const mockWsService = {
    disconnect: vi.fn(),
    endSession: vi.fn(),
  };

  beforeEach(async () => {
    playerNickname.set('');
    playerId.set(null);
    sortedLeaderboard.set([]);
    mockGameState.playerScore.set(0);
    mockGameState.roomCode.set(null);
    mockGameState.reset.mockReset();
    mockWsService.disconnect.mockReset();
    mockWsService.endSession.mockReset();

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
    it('should return the rank when the player is found by id', () => {
      playerId.set('p2');
      playerNickname.set('Alice');
      sortedLeaderboard.set([
        { id: 'p1', nickname: 'Bob', score: 200, rank: 1, previousRank: null, streak: 3 },
        { id: 'p2', nickname: 'Alice', score: 150, rank: 2, previousRank: null, streak: 1 },
        { id: 'p3', nickname: 'Charlie', score: 100, rank: 3, previousRank: null, streak: 0 },
      ]);

      expect(component.playerRank()).toBe(2);
    });

    it('should fall back to nickname lookup when id is null', () => {
      playerId.set(null);
      playerNickname.set('Alice');
      sortedLeaderboard.set([
        { id: 'p1', nickname: 'Bob', score: 200, rank: 1, previousRank: null, streak: 3 },
        { id: 'p2', nickname: 'Alice', score: 150, rank: 2, previousRank: null, streak: 1 },
      ]);

      expect(component.playerRank()).toBe(2);
    });

    it('should return "-" when the player is not found in the leaderboard', () => {
      playerId.set('unknown');
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
      playerId.set('p1');
      playerNickname.set('Alice');
      sortedLeaderboard.set([
        { id: 'p1', nickname: 'Alice', score: 300, rank: 1, previousRank: null, streak: 5 },
        { id: 'p2', nickname: 'Bob', score: 200, rank: 2, previousRank: null, streak: 2 },
      ]);

      expect(component.playerRank()).toBe(1);
    });

    it('should update when playerId changes', () => {
      sortedLeaderboard.set([
        { id: 'p1', nickname: 'Alice', score: 200, rank: 1, previousRank: null, streak: 0 },
        { id: 'p2', nickname: 'Bob', score: 100, rank: 2, previousRank: null, streak: 0 },
      ]);

      playerId.set('p1');
      playerNickname.set('Alice');
      expect(component.playerRank()).toBe(1);

      playerId.set('p2');
      playerNickname.set('Bob');
      expect(component.playerRank()).toBe(2);
    });
  });

  // ---------------------------------------------------------------------------
  // goHome()
  // ---------------------------------------------------------------------------

  describe('goHome()', () => {
    it('should call endSession with home route', () => {
      component.goHome();

      expect(mockWsService.endSession).toHaveBeenCalledWith('/');
    });
  });
});
