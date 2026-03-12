import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { signal } from '@angular/core';
import { describe, it, expect, beforeEach } from 'vitest';
import { hostGuard, playerGuard } from './game-session.guard';
import { GameStateService } from '../services/game-state.service';

describe('Route Guards', () => {
  let gameState: GameStateService;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideRouter([])],
    });

    gameState = TestBed.inject(GameStateService);
    router = TestBed.inject(Router);
    gameState.reset();
  });

  describe('hostGuard', () => {
    it('should return true when roomCode is set and role is host', () => {
      gameState.roomCode.set('ABC123');
      gameState.role.set('host');

      const result = TestBed.runInInjectionContext(hostGuard);

      expect(result).toBe(true);
    });

    it('should redirect to / when roomCode is null', () => {
      gameState.role.set('host');

      const result = TestBed.runInInjectionContext(hostGuard);

      expect(result).not.toBe(true);
      expect(result.toString()).toContain('/');
    });

    it('should redirect to / when role is player (wrong role)', () => {
      gameState.roomCode.set('ABC123');
      gameState.role.set('player');

      const result = TestBed.runInInjectionContext(hostGuard);

      expect(result).not.toBe(true);
    });

    it('should redirect to / when role is null', () => {
      gameState.roomCode.set('ABC123');

      const result = TestBed.runInInjectionContext(hostGuard);

      expect(result).not.toBe(true);
    });
  });

  describe('playerGuard', () => {
    it('should return true when roomCode is set and role is player', () => {
      gameState.roomCode.set('ABC123');
      gameState.role.set('player');

      const result = TestBed.runInInjectionContext(playerGuard);

      expect(result).toBe(true);
    });

    it('should redirect to / when roomCode is null', () => {
      gameState.role.set('player');

      const result = TestBed.runInInjectionContext(playerGuard);

      expect(result).not.toBe(true);
    });

    it('should redirect to / when role is host (wrong role)', () => {
      gameState.roomCode.set('ABC123');
      gameState.role.set('host');

      const result = TestBed.runInInjectionContext(playerGuard);

      expect(result).not.toBe(true);
    });

    it('should redirect to / when no session exists', () => {
      const result = TestBed.runInInjectionContext(playerGuard);

      expect(result).not.toBe(true);
    });
  });
});
