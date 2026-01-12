import { Component, computed, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BzmButtonComponent } from '@bazam/ui';
import { GameStateService } from '../../../services/game-state.service';
import { WebSocketService } from '../../../services/websocket.service';

@Component({
  selector: 'app-join-game',
  imports: [FormsModule, BzmButtonComponent],
  template: `
    <div class="join-game">
      <div class="hero animate-in">
        <h2>Meedoen!</h2>
      </div>

      <div class="card animate-in" style="animation-delay: 0.05s">
        <label>
          Game PIN
          <input
            type="text"
            [(ngModel)]="roomCode"
            placeholder="123456"
            maxlength="6"
            inputmode="numeric"
            pattern="[0-9]*"
            class="code-input"
            autocomplete="off"
          />
        </label>

        <label>
          Nickname
          <input
            type="text"
            [(ngModel)]="nickname"
            placeholder="Jouw naam..."
            maxlength="20"
            autocomplete="off"
            class="name-input"
          />
        </label>

        @if (gameState.errorMessage(); as error) {
          <p class="error">{{ error }}</p>
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

    .hero {
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;
    }

    .join-icon {
      font-size: 4rem;
      animation: float 3s ease-in-out infinite;
      filter: drop-shadow(2px 2px 0 #000);
    }

    h2 {
      color: var(--color-primary);
      font-size: 2.5rem;
      text-shadow: 3px 3px 0 #000;
    }

    .card {
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    label {
      display: flex;
      flex-direction: column;
      gap: 0.4rem;
      font-size: 0.9rem;
      font-weight: 600;
      color: var(--color-text-muted);
      text-transform: uppercase;
      letter-spacing: 0.08em;
    }

    .code-input {
      font-family: var(--font-heading);
      font-size: clamp(1.8rem, 7vw, 2.5rem);
      text-align: center;
      letter-spacing: clamp(0.3rem, 2vw, 0.75rem);
      padding: 1.25rem;
      border-radius: 2px;
      border: 4px solid var(--color-border);
      border-width: 3px 4px 5px 3px;
      background: var(--color-surface);
      color: var(--color-text);
      box-shadow: 5px 5px 0 var(--color-outline);


      &::placeholder {
        color: var(--color-text-muted);
        letter-spacing: 0.75rem;
      }

      &:focus {
        border-color: var(--color-outline);
        box-shadow: 4px 4px 0 var(--color-outline);
        background: var(--color-surface);
      }
    }

    .name-input {
      font-size: 1.15rem;
      padding: 1rem 1.25rem;
      border-radius: 4px;
    }

    .error {
      color: #fff;
      font-weight: 600;
      text-align: center;
      font-size: 0.9rem;
      background: var(--color-primary);
      padding: 0.75rem;
      border-radius: 2px;
      border: 4px solid var(--color-outline);
      border-width: 3px 4px 4px 3px;
      box-shadow: 4px 4px 0 var(--color-outline);

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
