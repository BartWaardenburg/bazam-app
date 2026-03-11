import { TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, signal } from '@angular/core';
import { describe, it, expect, beforeEach } from 'vitest';
import { PlayerLobbyComponent } from './player-lobby.component';
import { GameStateService } from '../../../services/game-state.service';

describe('PlayerLobbyComponent', () => {
  let component: PlayerLobbyComponent;

  const mockGameState = {
    playerNickname: signal('Alice'),
    players: signal<{ id: string; nickname: string; score: number; hasAnswered: boolean }[]>([]),
  };

  beforeEach(async () => {
    mockGameState.playerNickname.set('Alice');
    mockGameState.players.set([]);

    await TestBed.configureTestingModule({
      imports: [PlayerLobbyComponent],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .overrideComponent(PlayerLobbyComponent, {
        set: {
          imports: [],
          providers: [{ provide: GameStateService, useValue: mockGameState }],
        },
      })
      .compileComponents();

    const fixture = TestBed.createComponent(PlayerLobbyComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should inject GameStateService', () => {
    expect(component.gameState).toBe(mockGameState);
  });
});
