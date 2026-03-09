import type { Meta, StoryObj } from '@storybook/angular';
import { BzmMascotComponent } from './mascot.component';

const meta: Meta<BzmMascotComponent> = {
  title: 'Atoms/Mascot',
  component: BzmMascotComponent,
  tags: ['autodocs'],
  argTypes: {
    expression: {
      control: { type: 'select' },
      options: ['neutral', 'happy', 'sad', 'excited', 'surprised', 'sleeping'],
    },
    size: {
      control: { type: 'select' },
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
    },
    bodyColor: { control: 'color' },
    badgeText: { control: 'text' },
    badgeColor: { control: 'color' },
    animate: {
      control: { type: 'select' },
      options: ['none', 'bounce', 'float', 'shake', 'pulse'],
    },
    showBadge: { control: 'boolean' },
    showShadow: { control: 'boolean' },
  },
  args: {
    expression: 'neutral',
    size: 'md',
    bodyColor: 'var(--bzm-color-primary)',
    badgeText: '?',
    badgeColor: 'var(--bzm-color-accent)',
    animate: 'none',
    showBadge: true,
    showShadow: true,
  },
};

export default meta;
type Story = StoryObj<BzmMascotComponent>;

/* ─── 1. Default ─── */
export const Default: Story = {};

/* ─── 2. All Expressions ─── */
export const AllExpressions: Story = {
  render: () => ({
    template: `
      <div style="display: flex; gap: 32px; flex-wrap: wrap; padding: 32px; background: var(--bzm-color-bg); font-family: var(--bzm-font-family);">
        <div style="text-align: center;">
          <bzm-mascot expression="neutral" size="lg" />
          <p style="margin: 12px 0 0; font-size: 0.75rem; color: var(--bzm-color-text-muted); font-weight: 600;">Neutral</p>
        </div>
        <div style="text-align: center;">
          <bzm-mascot expression="happy" size="lg" />
          <p style="margin: 12px 0 0; font-size: 0.75rem; color: var(--bzm-color-text-muted); font-weight: 600;">Happy</p>
        </div>
        <div style="text-align: center;">
          <bzm-mascot expression="sad" size="lg" />
          <p style="margin: 12px 0 0; font-size: 0.75rem; color: var(--bzm-color-text-muted); font-weight: 600;">Sad</p>
        </div>
        <div style="text-align: center;">
          <bzm-mascot expression="excited" size="lg" />
          <p style="margin: 12px 0 0; font-size: 0.75rem; color: var(--bzm-color-text-muted); font-weight: 600;">Excited</p>
        </div>
        <div style="text-align: center;">
          <bzm-mascot expression="surprised" size="lg" />
          <p style="margin: 12px 0 0; font-size: 0.75rem; color: var(--bzm-color-text-muted); font-weight: 600;">Surprised</p>
        </div>
        <div style="text-align: center;">
          <bzm-mascot expression="sleeping" size="lg" />
          <p style="margin: 12px 0 0; font-size: 0.75rem; color: var(--bzm-color-text-muted); font-weight: 600;">Sleeping</p>
        </div>
      </div>
    `,
    moduleMetadata: {
      imports: [BzmMascotComponent],
    },
  }),
};

/* ─── 3. All Sizes ─── */
export const AllSizes: Story = {
  render: () => ({
    template: `
      <div style="display: flex; gap: 48px; align-items: end; padding: 32px; background: var(--bzm-color-bg); font-family: var(--bzm-font-family);">
        <div style="text-align: center;">
          <bzm-mascot size="xs" />
          <p style="margin: 12px 0 0; font-size: 0.75rem; color: var(--bzm-color-text-muted); font-weight: 600;">XS (32px)</p>
        </div>
        <div style="text-align: center;">
          <bzm-mascot size="sm" />
          <p style="margin: 12px 0 0; font-size: 0.75rem; color: var(--bzm-color-text-muted); font-weight: 600;">SM (48px)</p>
        </div>
        <div style="text-align: center;">
          <bzm-mascot size="md" />
          <p style="margin: 12px 0 0; font-size: 0.75rem; color: var(--bzm-color-text-muted); font-weight: 600;">MD (80px)</p>
        </div>
        <div style="text-align: center;">
          <bzm-mascot size="lg" />
          <p style="margin: 12px 0 0; font-size: 0.75rem; color: var(--bzm-color-text-muted); font-weight: 600;">LG (120px)</p>
        </div>
        <div style="text-align: center;">
          <bzm-mascot size="xl" />
          <p style="margin: 12px 0 0; font-size: 0.75rem; color: var(--bzm-color-text-muted); font-weight: 600;">XL (200px)</p>
        </div>
      </div>
    `,
    moduleMetadata: {
      imports: [BzmMascotComponent],
    },
  }),
};

/* ─── 4. All Animations ─── */
export const AllAnimations: Story = {
  render: () => ({
    template: `
      <div style="display: flex; gap: 48px; flex-wrap: wrap; padding: 48px 32px; background: var(--bzm-color-bg); font-family: var(--bzm-font-family);">
        <div style="text-align: center;">
          <bzm-mascot animate="bounce" size="lg" />
          <p style="margin: 12px 0 0; font-size: 0.75rem; color: var(--bzm-color-text-muted); font-weight: 600;">Bounce</p>
        </div>
        <div style="text-align: center;">
          <bzm-mascot animate="float" size="lg" />
          <p style="margin: 12px 0 0; font-size: 0.75rem; color: var(--bzm-color-text-muted); font-weight: 600;">Float</p>
        </div>
        <div style="text-align: center;">
          <bzm-mascot animate="shake" size="lg" />
          <p style="margin: 12px 0 0; font-size: 0.75rem; color: var(--bzm-color-text-muted); font-weight: 600;">Shake</p>
        </div>
        <div style="text-align: center;">
          <bzm-mascot animate="pulse" size="lg" />
          <p style="margin: 12px 0 0; font-size: 0.75rem; color: var(--bzm-color-text-muted); font-weight: 600;">Pulse</p>
        </div>
      </div>
    `,
    moduleMetadata: {
      imports: [BzmMascotComponent],
    },
  }),
};

/* ─── 5. Answer Colors ─── */
export const AnswerColors: Story = {
  render: () => ({
    template: `
      <div style="display: flex; gap: 32px; flex-wrap: wrap; padding: 32px; background: var(--bzm-color-bg); font-family: var(--bzm-font-family);">
        <div style="text-align: center;">
          <bzm-mascot size="lg" bodyColor="var(--bzm-color-answer-a)" badgeText="A" />
          <p style="margin: 12px 0 0; font-size: 0.75rem; color: var(--bzm-color-text-muted); font-weight: 600;">Answer A (Cyan)</p>
        </div>
        <div style="text-align: center;">
          <bzm-mascot size="lg" bodyColor="var(--bzm-color-answer-b)" badgeText="B" badgeColor="var(--bzm-color-primary)" />
          <p style="margin: 12px 0 0; font-size: 0.75rem; color: var(--bzm-color-text-muted); font-weight: 600;">Answer B (Yellow)</p>
        </div>
        <div style="text-align: center;">
          <bzm-mascot size="lg" bodyColor="var(--bzm-color-answer-c)" badgeText="C" />
          <p style="margin: 12px 0 0; font-size: 0.75rem; color: var(--bzm-color-text-muted); font-weight: 600;">Answer C (Red)</p>
        </div>
        <div style="text-align: center;">
          <bzm-mascot size="lg" bodyColor="var(--bzm-color-answer-d)" badgeText="D" />
          <p style="margin: 12px 0 0; font-size: 0.75rem; color: var(--bzm-color-text-muted); font-weight: 600;">Answer D (Green)</p>
        </div>
      </div>
    `,
    moduleMetadata: {
      imports: [BzmMascotComponent],
    },
  }),
};

/* ─── 6. Happy Correct ─── */
export const HappyCorrect: Story = {
  args: {
    expression: 'happy',
    bodyColor: 'var(--bzm-color-success)',
    badgeText: '!',
    animate: 'bounce',
    size: 'lg',
  },
};

/* ─── 7. Sad Incorrect ─── */
export const SadIncorrect: Story = {
  args: {
    expression: 'sad',
    bodyColor: 'var(--bzm-color-error)',
    badgeText: 'X',
    badgeColor: 'var(--bzm-white)',
    animate: 'shake',
    size: 'lg',
  },
};

/* ─── 8. Excited Winner ─── */
export const ExcitedWinner: Story = {
  args: {
    expression: 'excited',
    badgeText: '!',
    animate: 'bounce',
    size: 'xl',
  },
};

/* ─── 9. Sleeping Idle ─── */
export const SleepingIdle: Story = {
  args: {
    expression: 'sleeping',
    badgeText: 'z',
    animate: 'pulse',
    bodyColor: 'var(--bzm-gray-400)',
    size: 'lg',
  },
};

/* ─── 10. No Badge ─── */
export const NoBadge: Story = {
  args: {
    showBadge: false,
    size: 'lg',
  },
};

/* ─── 11. On Dark Background ─── */
export const OnDarkBackground: Story = {
  render: () => ({
    template: `
      <div style="background: var(--bzm-gray-800); border-radius: 12px; padding: 48px; display: flex; align-items: center; justify-content: center;">
        <bzm-mascot size="lg" animate="float" />
      </div>
    `,
    moduleMetadata: {
      imports: [BzmMascotComponent],
    },
  }),
};

/* ─── 12. In Context ─── */
export const InContext: Story = {
  render: () => ({
    template: `
      <div style="
        max-width: 360px;
        background: var(--bzm-color-surface);
        border: 3px solid var(--bzm-color-border);
        border-width: 3px 4px 5px 3px;
        border-radius: 16px;
        padding: 32px;
        text-align: center;
        font-family: var(--bzm-font-family);
        box-shadow: var(--bzm-shadow-md);
      ">
        <bzm-mascot expression="neutral" size="lg" animate="float" />
        <h3 style="
          margin: 16px 0 8px;
          font-family: var(--bzm-font-heading);
          font-size: 1.25rem;
          color: var(--bzm-color-text);
        ">Even geduld...</h3>
        <p style="
          margin: 0;
          font-size: 0.875rem;
          color: var(--bzm-color-text-muted);
          line-height: 1.5;
        ">De quiz wordt geladen. Bazam Buddy zoekt de beste vragen voor je!</p>
      </div>
    `,
    moduleMetadata: {
      imports: [BzmMascotComponent],
    },
  }),
};
