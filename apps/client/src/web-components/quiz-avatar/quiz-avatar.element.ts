/**
 * `<quiz-avatar>` — Player avatar web component with deterministic colors.
 *
 * Displays a player's initials on a colored background, with the color
 * deterministically derived from the nickname via a hash function.
 * Supports an optional rank badge positioned at the top-right corner.
 *
 * @element quiz-avatar
 *
 * @attr {string} nickname - Player display name. Initials are extracted from the first
 *                           letter of each word (max 2 characters).
 * @attr {string} [rank]   - Optional rank number displayed as a badge overlay.
 *
 * @cssprop [--avatar-size=52px] - Width and height of the avatar.
 *
 * @example
 * ```html
 * <quiz-avatar nickname="Jan de Vries" rank="1"></quiz-avatar>
 * ```
 */

const AVATAR_COLORS = [
  '#FF3B30', '#00BCD4', '#34C759', '#FFD60A',
  '#FF9500', '#007AFF', '#FF6B63', '#0097A7',
  '#E6C009', '#2AA348', '#CC2D25', '#4DD0E1',
] as const;

/** djb2-based hash — stable and fast for short strings. */
const hashString = (str: string): number => {
  let hash = 0;
  for (const char of str) {
    hash = ((hash << 5) - hash + char.charCodeAt(0)) | 0;
  }
  return Math.abs(hash);
};

const extractInitials = (name: string): string => {
  const words = name.trim().split(/\s+/);
  if (words.length === 0 || words[0] === '') return '?';
  return words
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

const AVATAR_STYLES = `
  :host {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    contain: content;
  }

  .avatar {
    position: relative;
    width: var(--avatar-size, 52px);
    height: var(--avatar-size, 52px);
    border-radius: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Bangers', 'Impact', system-ui, sans-serif;
    font-weight: 400;
    font-size: calc(var(--avatar-size, 52px) * 0.42);
    color: white;
    text-transform: uppercase;
    user-select: none;
    border: 3px solid #000;
    box-shadow: 3px 3px 0 #000;
    transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
    letter-spacing: 0.05em;
    text-shadow: 1px 1px 0 rgba(0, 0, 0, 0.3);
  }

  .avatar:hover {
    transform: scale(1.15) rotate(5deg);
  }

  .rank-badge {
    position: absolute;
    top: -8px;
    right: -8px;
    min-width: 26px;
    height: 26px;
    border-radius: 8px;
    background: #FFD60A;
    color: #1A1A1A;
    font-size: 0.75rem;
    font-weight: 400;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 3px solid #000;
    box-shadow: 2px 2px 0 #000;
    padding-inline: 4px;
  }

  .rank-badge[hidden] { display: none; }

  @media (prefers-reduced-motion: reduce) {
    .avatar {
      transition: none;
    }
    .avatar:hover {
      transform: none;
    }
  }
`;

export class QuizAvatarElement extends HTMLElement {
  static readonly observedAttributes = ['nickname', 'rank'] as const;

  private readonly avatarEl: HTMLDivElement;
  private readonly initialsEl: HTMLSpanElement;
  private readonly rankBadgeEl: HTMLSpanElement;

  constructor() {
    super();
    const shadow = this.attachShadow({ mode: 'open' });

    const style = document.createElement('style');
    style.textContent = AVATAR_STYLES;
    shadow.appendChild(style);

    this.avatarEl = document.createElement('div');
    this.avatarEl.className = 'avatar';

    this.initialsEl = document.createElement('span');
    this.initialsEl.className = 'initials';

    this.rankBadgeEl = document.createElement('span');
    this.rankBadgeEl.className = 'rank-badge';
    this.rankBadgeEl.hidden = true;

    this.avatarEl.appendChild(this.initialsEl);
    this.avatarEl.appendChild(this.rankBadgeEl);
    shadow.appendChild(this.avatarEl);
  }

  connectedCallback(): void {
    this.setAttribute('role', 'img');
    this.render();
  }

  attributeChangedCallback(): void {
    this.render();
  }

  private render(): void {
    const nickname = this.getAttribute('nickname') ?? '';
    const rank = this.getAttribute('rank');

    const initials = extractInitials(nickname);
    this.initialsEl.textContent = initials;
    this.avatarEl.style.backgroundColor =
      AVATAR_COLORS[hashString(nickname) % AVATAR_COLORS.length];

    this.setAttribute('aria-label', nickname || 'Onbekende speler');

    if (rank !== null) {
      this.rankBadgeEl.textContent = rank;
      this.rankBadgeEl.hidden = false;
    } else {
      this.rankBadgeEl.hidden = true;
    }
  }
}

customElements.define('quiz-avatar', QuizAvatarElement);
