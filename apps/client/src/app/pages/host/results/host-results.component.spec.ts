import { TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, signal, computed } from '@angular/core';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { GameStateService } from '../../../services/game-state.service';
import { WebSocketService } from '../../../services/websocket.service';
import { HostResultsComponent } from './host-results.component';

const createMockGameState = () => ({
  leaderboard: signal<{ id: string; nickname: string; score: number; rank: number; previousRank: number | null; streak: number }[]>([]),
  sortedLeaderboard: signal<{ id: string; nickname: string; score: number; rank: number; previousRank: number | null; streak: number }[]>([]),
  reset: vi.fn(),
});

const createMockWsService = () => {
  const connectionStatus = signal<'disconnected' | 'connecting' | 'connected'>('connected');
  return {
    endSession: vi.fn(),
    send: vi.fn(),
    connectionStatus,
    isConnecting: computed(() => connectionStatus() === 'connecting'),
  };
};

describe('HostResultsComponent', () => {
  let component: HostResultsComponent;
  let mockGameState: ReturnType<typeof createMockGameState>;
  let mockWsService: ReturnType<typeof createMockWsService>;
  beforeEach(async () => {
    mockGameState = createMockGameState();
    mockWsService = createMockWsService();

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
    it('should end the session and navigate to /host/create', () => {
      component.playAgain();

      expect(mockWsService.endSession).toHaveBeenCalledWith('/host/create');
    });
  });

  describe('goHome', () => {
    it('should end the session and navigate to /', () => {
      component.goHome();

      expect(mockWsService.endSession).toHaveBeenCalledWith('/');
    });
  });
});
