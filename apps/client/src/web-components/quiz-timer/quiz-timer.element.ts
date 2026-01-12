/**
 * `<quiz-timer>` — Circular countdown timer web component.
 *
 * Renders a circular SVG progress ring with a numeric display.
 * Transitions through visual states as time runs out:
 * normal (cyan) → warning (orange, ≤30%) → danger (red, ≤3s).
 *
 * @element quiz-timer
 *
 * @attr {number} duration - Total countdown duration in seconds.
 * @attr {boolean} running - Boolean attribute. When present, starts the timer.
 *
 * @fires timerComplete - Dispatched when the countdown reaches zero.
 *
 * @cssprop [--timer-size=100px] - Width and height of the timer container.
 * @cssprop [--timer-font-size=1.75rem] - Font size of the numeric display.
 *
 * @example
 * ```html
 * <quiz-timer duration="20" running></quiz-timer>
 * ```
 */

const CIRCUMFERENCE = 2 * Math.PI * 44;
const SVG_NS = 'http://www.w3.org/2000/svg';

const TIMER_STYLES = `
  :host {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    contain: content;
  }

  .timer-container {
    position: relative;
    width: var(--timer-size, 100px);
    height: var(--timer-size, 100px);
    background: #FFFFFF;
    border-radius: 16px;
    padding: 8px;
    border: 3px solid #000000;
    box-shadow: 4px 4px 0 #000;
  }

  svg {
    transform: rotate(-90deg);
    width: 100%;
    height: 100%;
  }

  .track {
    fill: none;
    stroke: #F0EBE3;
    stroke-width: 7;
  }

  .progress {
    fill: none;
    stroke: var(--_progress-color, #00BCD4);
    stroke-width: 7;
    stroke-linecap: round;
    transition: stroke-dashoffset 1s linear, stroke 0.3s ease;
  }

  .time-display {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Bangers', 'Impact', system-ui, sans-serif;
    font-size: var(--timer-font-size, 1.75rem);
    font-weight: 400;
    color: #1A1A1A;
    letter-spacing: 0.05em;
    text-shadow: 2px 2px 0 rgba(0, 0, 0, 0.15);
  }

  :host([running]) .time-display {
    animation: pulse 1s ease-in-out infinite;
  }

  @keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.08); }
  }

  @media (prefers-reduced-motion: reduce) {
    .progress {
      transition: stroke-dashoffset 0.1s linear, stroke 0.1s ease;
    }
    :host([running]) .time-display {
      animation: none;
    }
  }
`;

const createSvgCircle = (className: string): SVGCircleElement => {
  const circle = document.createElementNS(SVG_NS, 'circle');
  circle.setAttribute('class', className);
  circle.setAttribute('cx', '50');
  circle.setAttribute('cy', '50');
  circle.setAttribute('r', '44');
  return circle;
};

export class QuizTimerElement extends HTMLElement {
  static readonly observedAttributes = ['duration', 'running'] as const;

  private readonly progressEl: SVGCircleElement;
  private readonly secondsEl: HTMLSpanElement;
  private readonly containerEl: HTMLDivElement;
  private intervalId: ReturnType<typeof setInterval> | null = null;
  private remaining = 0;
  private duration = 20;

  constructor() {
    super();
    const shadow = this.attachShadow({ mode: 'open' });

    const style = document.createElement('style');
    style.textContent = TIMER_STYLES;
    shadow.appendChild(style);

    this.containerEl = document.createElement('div');
    this.containerEl.className = 'timer-container';

    const svg = document.createElementNS(SVG_NS, 'svg');
    svg.setAttribute('viewBox', '0 0 100 100');
    svg.setAttribute('aria-hidden', 'true');
    svg.appendChild(createSvgCircle('track'));

    this.progressEl = createSvgCircle('progress');
    this.progressEl.style.strokeDasharray = `${CIRCUMFERENCE}`;
    this.progressEl.style.strokeDashoffset = '0';
    svg.appendChild(this.progressEl);

    const display = document.createElement('div');
    display.className = 'time-display';
    this.secondsEl = document.createElement('span');
    this.secondsEl.className = 'seconds';
    this.secondsEl.textContent = '0';
    display.appendChild(this.secondsEl);

    this.containerEl.appendChild(svg);
    this.containerEl.appendChild(display);
    shadow.appendChild(this.containerEl);
  }

  connectedCallback(): void {
    this.setAttribute('role', 'timer');
    this.setAttribute('aria-live', 'polite');
    this.updateAriaLabel();
  }

  attributeChangedCallback(name: string, _old: string | null, value: string | null): void {
    if (name === 'duration' && value !== null) {
      this.duration = parseInt(value, 10) || 0;
      this.remaining = this.duration;
      this.updateDisplay();
    }
    if (name === 'running') {
      value !== null ? this.startTimer() : this.stopTimer();
    }
  }

  disconnectedCallback(): void {
    this.stopTimer();
  }

  private startTimer(): void {
    this.stopTimer();
    this.remaining = this.duration;
    this.updateDisplay();

    this.intervalId = setInterval(() => {
      this.remaining--;
      this.updateDisplay();
      if (this.remaining <= 0) {
        this.stopTimer();
        this.dispatchEvent(new CustomEvent('timerComplete', {
          bubbles: true,
          composed: true,
        }));
      }
    }, 1000);
  }

  private stopTimer(): void {
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  private updateDisplay(): void {
    const displayValue = Math.max(0, this.remaining);
    this.secondsEl.textContent = String(displayValue);
    this.updateAriaLabel();

    const fraction = this.duration > 0 ? this.remaining / this.duration : 0;
    const offset = CIRCUMFERENCE * (1 - fraction);
    this.progressEl.style.strokeDashoffset = `${offset}`;

    // Visual urgency states
    let color = '#00BCD4';
    if (this.remaining <= 3) {
      color = '#FF3B30';
    } else if (this.remaining <= this.duration * 0.3) {
      color = '#ff9f43';
    }
    this.containerEl.style.setProperty('--_progress-color', color);
  }

  private updateAriaLabel(): void {
    const displayValue = Math.max(0, this.remaining);
    this.setAttribute('aria-label', `${displayValue} seconden resterend`);
  }
}

customElements.define('quiz-timer', QuizTimerElement);
