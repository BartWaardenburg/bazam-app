import type { Meta, StoryObj } from '@storybook/angular';
import { BzmTimerComponent } from './timer.component';

const meta: Meta<BzmTimerComponent> = {
  title: 'Molecules/Timer',
  component: BzmTimerComponent,
  tags: ['autodocs'],
  argTypes: {
    duration: { control: { type: 'number', min: 1, max: 120 } },
    running: { control: 'boolean' },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
    },
  },
};

export default meta;
type Story = StoryObj<BzmTimerComponent>;

export const Default: Story = {
  args: {
    duration: 30,
    running: false,
    size: 'md',
  },
};

export const Small: Story = {
  args: {
    duration: 15,
    running: false,
    size: 'sm',
  },
};

export const Large: Story = {
  args: {
    duration: 60,
    running: false,
    size: 'lg',
  },
};

export const Running: Story = {
  args: {
    duration: 30,
    running: true,
    size: 'md',
  },
};

export const LongDuration: Story = {
  args: {
    duration: 120,
    running: false,
    size: 'lg',
  },
};

export const AllSizes: Story = {
  render: () => ({
    template: `
      <div style="display: flex; align-items: center; gap: 24px;">
        <bzm-timer [duration]="30" [running]="false" size="sm" />
        <bzm-timer [duration]="30" [running]="false" size="md" />
        <bzm-timer [duration]="30" [running]="false" size="lg" />
      </div>
    `,
    moduleMetadata: {
      imports: [BzmTimerComponent],
    },
  }),
};

export const AllStates: Story = {
  render: () => ({
    template: `
      <div style="display: flex; align-items: center; gap: 24px;">
        <div style="text-align: center; font-family: var(--bzm-font-family);">
          <bzm-timer [duration]="30" [running]="false" size="md" />
          <p style="margin-top: 8px; font-size: 12px; color: var(--bzm-color-text-muted);">Normal</p>
        </div>
        <div style="text-align: center; font-family: var(--bzm-font-family);">
          <bzm-timer [duration]="40" [initialRemaining]="10" [running]="false" size="md" />
          <p style="margin-top: 8px; font-size: 12px; color: var(--bzm-color-text-muted);">Warning (&lt;30%)</p>
        </div>
        <div style="text-align: center; font-family: var(--bzm-font-family);">
          <bzm-timer [duration]="30" [initialRemaining]="3" [running]="false" size="md" />
          <p style="margin-top: 8px; font-size: 12px; color: var(--bzm-color-text-muted);">Danger (&le;3s)</p>
        </div>
      </div>
    `,
    moduleMetadata: {
      imports: [BzmTimerComponent],
    },
  }),
};
