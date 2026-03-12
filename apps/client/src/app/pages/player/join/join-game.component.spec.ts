import { TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, signal, computed } from '@angular/core';
import { describe, it, expect, beforeEach } from 'vitest';
import { JoinGameComponent } from './join-game.component';
import { GameStateService } from '../../../services/game-state.service';
import { WebSocketService } from '../../../services/websocket.service';

describe('JoinGameComponent', () => {
  let component: JoinGameComponent;

  const mockGameState = {
    role: signal<'host' | 'player' | null>(null),
    playerNickname: signal(''),
    errorMessage: signal<string | null>(null),
  };

  const connectionStatus = signal<'disconnected' | 'connecting' | 'connected'>('disconnected');
  const mockWsService = {
    connect: vi.fn().mockResolvedValue(undefined),
    send: vi.fn(),
    disconnect: vi.fn(),
    connectionStatus,
    isConnecting: computed(() => connectionStatus() === 'connecting'),
  };

  beforeEach(async () => {
    mockGameState.role.set(null);
    mockGameState.playerNickname.set('');
    mockGameState.errorMessage.set(null);
    mockWsService.connect.mockReset().mockResolvedValue(undefined);
    mockWsService.send.mockReset();
    mockWsService.disconnect.mockReset();
    mockWsService.connectionStatus.set('disconnected');

    await TestBed.configureTestingModule({
      imports: [JoinGameComponent],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .overrideComponent(JoinGameComponent, {
        set: {
          imports: [],
          providers: [
            { provide: GameStateService, useValue: mockGameState },
            { provide: WebSocketService, useValue: mockWsService },
          ],
        },
      })
      .compileComponents();

    const fixture = TestBed.createComponent(JoinGameComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  // ---------------------------------------------------------------------------
  // isValid (computed signal)
  // ---------------------------------------------------------------------------

  describe('isValid', () => {
    it('should return false when roomCode is empty', () => {
      component.roomCode.set('');
      component.nickname.set('Alice');

      expect(component.isValid()).toBe(false);
    });

    it('should return false when roomCode is 5 digits', () => {
      component.roomCode.set('12345');
      component.nickname.set('Alice');

      expect(component.isValid()).toBe(false);
    });

    it('should return false when roomCode is 7 digits', () => {
      component.roomCode.set('1234567');
      component.nickname.set('Alice');

      expect(component.isValid()).toBe(false);
    });

    it('should return false when nickname is empty', () => {
      component.roomCode.set('ABC123');
      component.nickname.set('');

      expect(component.isValid()).toBe(false);
    });

    it('should return false when nickname is whitespace only', () => {
      component.roomCode.set('ABC123');
      component.nickname.set('   ');

      expect(component.isValid()).toBe(false);
    });

    it('should return true when roomCode is 6 chars and nickname is non-empty', () => {
      component.roomCode.set('ABC123');
      component.nickname.set('Alice');

      expect(component.isValid()).toBe(true);
    });
  });

  // ---------------------------------------------------------------------------
  // joinGame()
  // ---------------------------------------------------------------------------

  describe('joinGame()', () => {
    it('should set role to player, set playerNickname, and send JOIN_ROOM on success', async () => {
      component.roomCode.set('  ABC123  ');
      component.nickname.set('  Alice  ');

      await component.joinGame();

      expect(mockWsService.connect).toHaveBeenCalledOnce();
      expect(mockGameState.role()).toBe('player');
      expect(mockGameState.playerNickname()).toBe('Alice');
      expect(mockWsService.send).toHaveBeenCalledWith({
        type: 'JOIN_ROOM',
        payload: {
          roomCode: 'ABC123',
          nickname: 'Alice',
        },
      });
    });

    it('should clear errorMessage before attempting to connect', async () => {
      mockGameState.errorMessage.set('Previous error');

      component.roomCode.set('ABC123');
      component.nickname.set('Alice');

      await component.joinGame();

      expect(mockGameState.errorMessage()).toBeNull();
    });

    it('should reset role, clear nickname, and set error message on connection failure', async () => {
      mockWsService.connect.mockRejectedValue(new Error('Connection failed'));

      component.roomCode.set('ABC123');
      component.nickname.set('Alice');

      await component.joinGame();

      expect(mockGameState.role()).toBeNull();
      expect(mockGameState.playerNickname()).toBe('');
      expect(mockGameState.errorMessage()).toBe(
        'Kan geen verbinding maken met de server. Probeer het opnieuw.',
      );
    });
  });

  // ---------------------------------------------------------------------------
  // isConnecting
  // ---------------------------------------------------------------------------

  describe('isConnecting (via wsService)', () => {
    it('should return true when connectionStatus is connecting', () => {
      connectionStatus.set('connecting');

      expect(component.wsService.isConnecting()).toBe(true);
    });

    it('should return false when connectionStatus is disconnected', () => {
      connectionStatus.set('disconnected');

      expect(component.wsService.isConnecting()).toBe(false);
    });

    it('should return false when connectionStatus is connected', () => {
      connectionStatus.set('connected');

      expect(component.wsService.isConnecting()).toBe(false);
    });
  });
});
