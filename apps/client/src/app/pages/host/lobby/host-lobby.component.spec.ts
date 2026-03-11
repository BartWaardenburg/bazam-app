import { TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, signal } from '@angular/core';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { GameStateService } from '../../../services/game-state.service';
import { WebSocketService } from '../../../services/websocket.service';
import { HostLobbyComponent } from './host-lobby.component';

const createMockGameState = () => ({
  roomCode: signal<string | null>('ABC123'),
  players: signal<{ id: string; nickname: string; score: number; hasAnswered: boolean }[]>([]),
  errorMessage: signal<string | null>(null),
});

const createMockWsService = () => ({
  send: vi.fn(),
  connectionStatus: signal<'disconnected' | 'connecting' | 'connected'>('connected'),
});

describe('HostLobbyComponent', () => {
  let component: HostLobbyComponent;
  let mockWsService: ReturnType<typeof createMockWsService>;

  beforeEach(async () => {
    const mockGameState = createMockGameState();
    mockWsService = createMockWsService();

    await TestBed.configureTestingModule({
      imports: [HostLobbyComponent],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .overrideComponent(HostLobbyComponent, {
        set: {
          imports: [],
          providers: [
            { provide: GameStateService, useValue: mockGameState },
            { provide: WebSocketService, useValue: mockWsService },
          ],
        },
      })
      .compileComponents();

    const fixture = TestBed.createComponent(HostLobbyComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should send START_GAME message when startGame is called', () => {
    component.startGame();

    expect(mockWsService.send).toHaveBeenCalledWith({ type: 'START_GAME' });
  });
});
