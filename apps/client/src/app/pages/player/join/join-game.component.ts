import { Component, computed, inject } from '@angular/core';
import {
  BzmButtonComponent,
  BzmPageTitleComponent,
  BzmCardComponent,
  BzmPinInputComponent,
  BzmInputComponent,
  BzmErrorMessageComponent,
} from '@bazam/ui';
import { GameStateService } from '../../../services/game-state.service';
import { WebSocketService } from '../../../services/websocket.service';

@Component({
  selector: 'app-join-game',
  imports: [BzmButtonComponent, BzmPageTitleComponent, BzmCardComponent, BzmPinInputComponent, BzmInputComponent, BzmErrorMessageComponent],
  template: `
    <div class="join-game">
      <bzm-page-title size="lg">Meedoen!</bzm-page-title>

      <bzm-card>
        <div class="form">
          <bzm-pin-input
            [autoFocus]="true"
            ariaLabel="Game PIN"
            (valueChange)="roomCode = $event"
          />

          <bzm-input
            label="Nickname"
            placeholder="Jouw naam..."
            [maxLength]="20"
            inputId="nickname"
            [value]="nickname"
            (valueChange)="nickname = $event"
            (enterPressed)="joinGame()"
          />

          @if (gameState.errorMessage(); as error) {
            <bzm-error-message>{{ error }}</bzm-error-message>
          }

          <bzm-button
            variant="primary"
            size="lg"
            [disabled]="!isValid() || isConnecting()"
            [fullWidth]="true"
            (click)="joinGame()"
          >
            {{ isConnecting() ? 'Verbinden...' : 'Join!' }}
          </bzm-button>
        </div>
      </bzm-card>
    </div>
  `,
  styles: `
    .join-game {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1.5rem;
      padding: 1rem;
      width: 100%;
      max-width: 420px;
    }

    .form {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }
  `,
})
/**
 * Player join form where users enter a room code and nickname to join an
 * existing game session.
 *
 * Presents a PIN input for the 6-digit room code, a text input for the
 * player's nickname, and a join button. On submission, connects to the
 * WebSocket server and sends a `JOIN_ROOM` message.
 */
export class JoinGameComponent {
  /** Injected game state for reading/writing error messages and player info. */
  readonly gameState = inject(GameStateService);

  private readonly wsService = inject(WebSocketService);

  /**
   * Derived signal that is `true` while the WebSocket handshake is in progress.
   * Used to disable the join button and show a connecting label.
   */
  readonly isConnecting = computed(() => this.wsService.connectionStatus() === 'connecting');

  /** The 6-digit room code entered by the player. */
  roomCode = '';

  /** The display nickname chosen by the player (max 20 characters). */
  nickname = '';

  /**
   * Validates the join form fields.
   *
   * @returns `true` if the room code is exactly 6 characters and the
   *          nickname is non-empty; `false` otherwise.
   */
  isValid(): boolean {
    return this.roomCode.trim().length === 6 && this.nickname.trim().length > 0;
  }

  /**
   * Connects to the WebSocket server and joins the specified room.
   *
   * Sets the user role to `'player'`, stores the trimmed nickname in
   * game state, and sends a `JOIN_ROOM` message. On failure, rolls back
   * the role and nickname and sets a user-visible error message.
   */
  async joinGame(): Promise<void> {
    this.gameState.errorMessage.set(null);

    try {
      await this.wsService.connect();
      this.gameState.role.set('player');
      this.gameState.playerNickname.set(this.nickname.trim());
      this.wsService.send({
        type: 'JOIN_ROOM',
        payload: {
          roomCode: this.roomCode.trim(),
          nickname: this.nickname.trim(),
        },
      });
    } catch {
      this.gameState.role.set(null);
      this.gameState.playerNickname.set('');
      this.gameState.errorMessage.set('Kan geen verbinding maken met de server. Probeer het opnieuw.');
    }
  }
}
