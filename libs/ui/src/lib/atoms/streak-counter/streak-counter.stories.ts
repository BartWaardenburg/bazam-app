import type { Meta, StoryObj } from '@storybook/angular';
import { BzmStreakCounterComponent } from './streak-counter.component';

const meta: Meta<BzmStreakCounterComponent> = {
  title: 'Atoms/StreakCounter',
  component: BzmStreakCounterComponent,
  argTypes: {
    count: { control: 'number' },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    active: { control: 'boolean' },
  },
  args: {
    count: 3,
    size: 'md',
    active: true,
  },
};

export default meta;
type Story = StoryObj<BzmStreakCounterComponent>;

export const Default: Story = {
  args: {
    count: 3,
  },
};

export const Inactive: Story = {
  args: {
    count: 0,
    active: false,
  },
};

export const HighStreak: Story = {
  args: {
    count: 8,
    size: 'lg',
  },
};

export const SmallSize: Story = {
  args: {
    count: 2,
    size: 'sm',
  },
};

export const LargeSize: Story = {
  args: {
    count: 5,
    size: 'lg',
  },
};

export const ActiveZero: Story = {
  args: {
    count: 0,
    active: true,
  },
};

export const AllStates: Story = {
  render: () => ({
    template: `
      <div style="display: flex; align-items: center; gap: 24px;">
        <div style="text-align: center;">
          <bzm-streak-counter [count]="0" [active]="false" />
          <div style="font-size: 12px; color: #999; margin-top: 4px;">Inactive</div>
        </div>
        <div style="text-align: center;">
          <bzm-streak-counter [count]="1" />
          <div style="font-size: 12px; color: #999; margin-top: 4px;">Starting</div>
        </div>
        <div style="text-align: center;">
          <bzm-streak-counter [count]="3" />
          <div style="font-size: 12px; color: #999; margin-top: 4px;">Rolling</div>
        </div>
        <div style="text-align: center;">
          <bzm-streak-counter [count]="7" />
          <div style="font-size: 12px; color: #999; margin-top: 4px;">High</div>
        </div>
        <div style="text-align: center;">
          <bzm-streak-counter [count]="12" />
          <div style="font-size: 12px; color: #999; margin-top: 4px;">On Fire</div>
        </div>
      </div>
    `,
    moduleMetadata: {
      imports: [BzmStreakCounterComponent],
    },
  }),
};

export const AllSizes: Story = {
  render: () => ({
    template: `
      <div style="display: flex; align-items: center; gap: 24px;">
        <bzm-streak-counter [count]="5" size="sm" />
        <bzm-streak-counter [count]="5" size="md" />
        <bzm-streak-counter [count]="5" size="lg" />
      </div>
    `,
    moduleMetadata: {
      imports: [BzmStreakCounterComponent],
    },
  }),
};
