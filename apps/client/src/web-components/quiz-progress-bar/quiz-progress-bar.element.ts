/**
 * `<quiz-progress-bar>` — Segmented progress bar web component.
 *
 * Displays quiz progress as discrete segments, each representing one question.
 * Segments transition through three visual states:
 * pending (beige) → active (yellow, pulsing) → completed (red).
 *
 * @element quiz-progress-bar
 *
 * @attr {number} current - Zero-based index of the active segment.
 * @attr {number} total   - Total number of segments to display.
 *
 * @cssprop [--progress-height=10px] - Height of each segment bar.
 *
 * @example
 * ```html
 * <quiz-progress-bar current="2" total="10"></quiz-progress-bar>
 * ```
 */

const PROGRESS_BAR_STYLES = `
  :host {
    display: block;
    width: 100%;
    contain: layout style;
  }

  .progress-container {
    display: flex;
    gap: 6px;
    align-items: center;
  }

  .segment {
    flex: 1;
    height: var(--progress-height, 10px);
    border-radius: 5px;
    background: #F0EBE3;
    transition: background 0.4s ease, transform 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
    border: 2px solid #000000;
  }

  .segment[data-state="completed"] {
    background: #FF3B30;
  }

  .segment[data-state="active"] {
    background: #FFD60A;
    animation: pulse-segment 1.5s ease-in-out infinite;
  }

  .label {
    font-family: 'Bangers', 'Impact', system-ui, sans-serif;
    font-size: 0.95rem;
    color: #1A1A1A;
    margin-inline-start: 12px;
    white-space: nowrap;
    background: #FFFFFF;
    padding: 4px 12px;
    border-radius: 10px;
    border: 2px solid #000000;
    box-shadow: 2px 2px 0 #000;
    letter-spacing: 0.05em;
  }

  @keyframes pulse-segment {
    0%, 100% { opacity: 1; transform: scaleY(1); }
    50% { opacity: 0.7; transform: scaleY(1.3); }
  }

  @media (prefers-reduced-motion: reduce) {
    .segment {
      transition: none;
    }
    .segment[data-state="active"] {
      animation: none;
    }
  }
`;

export class QuizProgressBarElement extends HTMLElement {
  static readonly observedAttributes = ['current', 'total'] as const;

  private readonly containerEl: HTMLDivElement;
  private readonly labelEl: HTMLSpanElement;
  private segments: HTMLDivElement[] = [];
  private prevTotal = 0;

  constructor() {
    super();
    const shadow = this.attachShadow({ mode: 'open' });

    const style = document.createElement('style');
    style.textContent = PROGRESS_BAR_STYLES;
    shadow.appendChild(style);

    this.containerEl = document.createElement('div');
    this.containerEl.className = 'progress-container';

    this.labelEl = document.createElement('span');
    this.labelEl.className = 'label';
    this.containerEl.appendChild(this.labelEl);

    shadow.appendChild(this.containerEl);
  }

  connectedCallback(): void {
    this.setAttribute('role', 'progressbar');
    this.render();
  }

  attributeChangedCallback(): void {
    this.render();
  }

  private render(): void {
    const current = parseInt(this.getAttribute('current') ?? '0', 10);
    const total = parseInt(this.getAttribute('total') ?? '0', 10);

    // Update ARIA attributes
    this.setAttribute('aria-valuenow', String(current + 1));
    this.setAttribute('aria-valuemin', '1');
    this.setAttribute('aria-valuemax', String(total));
    this.setAttribute('aria-label', `Vraag ${current + 1} van ${total}`);

    // Rebuild segments only when total changes
    if (total !== this.prevTotal) {
      this.rebuildSegments(total);
      this.prevTotal = total;
    }

    // Update segment states (no DOM recreation)
    for (let i = 0; i < this.segments.length; i++) {
      const segment = this.segments[i];
      if (i < current) {
        segment.dataset['state'] = 'completed';
      } else if (i === current) {
        segment.dataset['state'] = 'active';
      } else {
        segment.dataset['state'] = 'pending';
      }
    }

    this.labelEl.textContent = `${current + 1} / ${total}`;
  }

  private rebuildSegments(total: number): void {
    for (const segment of this.segments) {
      segment.remove();
    }
    this.segments = [];

    for (let i = 0; i < total; i++) {
      const segment = document.createElement('div');
      segment.classList.add('segment');
      this.containerEl.insertBefore(segment, this.labelEl);
      this.segments.push(segment);
    }
  }
}

customElements.define('quiz-progress-bar', QuizProgressBarElement);
