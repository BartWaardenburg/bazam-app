import { inject } from '@angular/core';
import type { UrlTree } from '@angular/router';
import { Router } from '@angular/router';
import { GameStateService } from '../services/game-state.service';

/** Prevents navigation to host routes when no active host session exists. */
export const hostGuard = (): boolean | UrlTree => {
  const gameState = inject(GameStateService);
  const router = inject(Router);
  return (gameState.roomCode() !== null && gameState.role() === 'host') || router.createUrlTree(['/']);
};

/** Prevents navigation to player routes when no active player session exists. */
export const playerGuard = (): boolean | UrlTree => {
  const gameState = inject(GameStateService);
  const router = inject(Router);
  return (gameState.roomCode() !== null && gameState.role() === 'player') || router.createUrlTree(['/']);
};
