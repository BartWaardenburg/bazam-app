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
      <bzm-page-title>Meedoen!</bzm-page-title>

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
export class JoinGameComponent {
  readonly gameState = inject(GameStateService);
  private readonly wsService = inject(WebSocketService);
  readonly isConnecting = computed(() => this.wsService.connectionStatus() === 'connecting');

  roomCode = '';
  nickname = '';

  isValid(): boolean {
    return this.roomCode.trim().length === 6 && this.nickname.trim().length > 0;
  }

  async joinGame(): Promise<void> {
    this.gameState.role.set('player');
    this.gameState.playerNickname.set(this.nickname.trim());
    this.gameState.errorMessage.set(null);

    try {
      await this.wsService.connect();
      this.wsService.send({
        type: 'JOIN_ROOM',
        payload: {
          roomCode: this.roomCode.trim(),
          nickname: this.nickname.trim(),
        },
      });
    } catch {
      this.gameState.errorMessage.set('Kan geen verbinding maken met de server. Probeer het opnieuw.');
    }
  }
}
