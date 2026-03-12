import type { Meta, StoryObj } from '@storybook/angular';
import { BzmStreakIndicatorComponent } from './streak-indicator.component';

const meta: Meta<BzmStreakIndicatorComponent> = {
  title: 'Atoms/StreakIndicator',
  component: BzmStreakIndicatorComponent,
  argTypes: {
    streak: { control: 'number' },
    isOnFire: { control: 'boolean' },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    showLabel: { control: 'boolean' },
  },
  args: {
    streak: 3,
    isOnFire: true,
    size: 'md',
    showLabel: true,
  },
};

export default meta;
type Story = StoryObj<BzmStreakIndicatorComponent>;

export const NoStreak: Story = {
  args: {
    streak: 0,
    isOnFire: false,
  },
};

export const Streak1: Story = {
  args: {
    streak: 1,
    isOnFire: false,
  },
};

export const Streak2: Story = {
  args: {
    streak: 2,
    isOnFire: false,
  },
};

export const Streak3OnFire: Story = {
  args: {
    streak: 3,
    isOnFire: true,
  },
};

export const Streak5Unstoppable: Story = {
  args: {
    streak: 5,
    isOnFire: true,
  },
};

export const Streak10: Story = {
  args: {
    streak: 10,
    isOnFire: true,
    size: 'lg',
  },
};

export const Small: Story = {
  args: {
    streak: 4,
    isOnFire: true,
    size: 'sm',
  },
};

export const Large: Story = {
  args: {
    streak: 6,
    isOnFire: true,
    size: 'lg',
  },
};

export const NoLabel: Story = {
  args: {
    streak: 5,
    isOnFire: true,
    showLabel: false,
  },
};

export const AllStates: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px; max-width: 400px;">
        <div style="text-align: left;">
          <div style="font-size: 12px; color: #999; margin-bottom: 4px;">Streak 0 (hidden)</div>
          <bzm-streak-indicator [streak]="0" />
        </div>
        <div style="text-align: left;">
          <div style="font-size: 12px; color: #999; margin-bottom: 4px;">Streak 1 (muted)</div>
          <bzm-streak-indicator [streak]="1" />
        </div>
        <div style="text-align: left;">
          <div style="font-size: 12px; color: #999; margin-bottom: 4px;">Streak 2 (muted)</div>
          <bzm-streak-indicator [streak]="2" />
        </div>
        <div style="text-align: left;">
          <div style="font-size: 12px; color: #999; margin-bottom: 4px;">Streak 3 (on fire)</div>
          <bzm-streak-indicator [streak]="3" [isOnFire]="true" />
        </div>
        <div style="text-align: left;">
          <div style="font-size: 12px; color: #999; margin-bottom: 4px;">Streak 5 (unstoppable)</div>
          <bzm-streak-indicator [streak]="5" [isOnFire]="true" />
        </div>
        <div style="text-align: left;">
          <div style="font-size: 12px; color: #999; margin-bottom: 4px;">Streak 10 (unstoppable, large)</div>
          <bzm-streak-indicator [streak]="10" [isOnFire]="true" size="lg" />
        </div>
      </div>
    `,
    moduleMetadata: {
      imports: [BzmStreakIndicatorComponent],
    },
  }),
};
