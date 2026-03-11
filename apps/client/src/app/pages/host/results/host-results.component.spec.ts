import { TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, signal } from '@angular/core';
import { Router } from '@angular/router';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { GameStateService } from '../../../services/game-state.service';
import { WebSocketService } from '../../../services/websocket.service';
import { HostResultsComponent } from './host-results.component';

const createMockGameState = () => ({
  leaderboard: signal<{ id: string; nickname: string; score: number; rank: number; previousRank: number | null; streak: number }[]>([]),
  sortedLeaderboard: signal<{ id: string; nickname: string; score: number; rank: number; previousRank: number | null; streak: number }[]>([]),
  reset: vi.fn(),
});

const createMockWsService = () => ({
  disconnect: vi.fn(),
  send: vi.fn(),
  connectionStatus: signal<'disconnected' | 'connecting' | 'connected'>('connected'),
});

describe('HostResultsComponent', () => {
  let component: HostResultsComponent;
  let mockGameState: ReturnType<typeof createMockGameState>;
  let mockWsService: ReturnType<typeof createMockWsService>;
  let mockRouter: { navigate: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    mockGameState = createMockGameState();
    mockWsService = createMockWsService();
    mockRouter = { navigate: vi.fn().mockResolvedValue(true) };

    await TestBed.configureTestingModule({
      imports: [HostResultsComponent],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .overrideComponent(HostResultsComponent, {
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

    const fixture = TestBed.createComponent(HostResultsComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  describe('playAgain', () => {
    it('should disconnect WebSocket, reset game state, and navigate to /host/create', () => {
      component.playAgain();

      expect(mockWsService.disconnect).toHaveBeenCalled();
      expect(mockGameState.reset).toHaveBeenCalled();
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/host/create']);
    });
  });

  describe('goHome', () => {
    it('should disconnect WebSocket, reset game state, and navigate to /', () => {
      component.goHome();

      expect(mockWsService.disconnect).toHaveBeenCalled();
      expect(mockGameState.reset).toHaveBeenCalled();
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/']);
    });
  });
});
