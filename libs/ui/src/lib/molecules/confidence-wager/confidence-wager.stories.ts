import type { Meta, StoryObj } from '@storybook/angular';
import { BzmConfidenceWagerComponent } from './confidence-wager.component';

const meta: Meta<BzmConfidenceWagerComponent> = {
  title: 'Molecules/ConfidenceWager',
  component: BzmConfidenceWagerComponent,
  argTypes: {
    currentScore: { control: 'number' },
    maxPercentage: { control: 'number' },
    timeRemaining: { control: 'number' },
    disabled: { control: 'boolean' },
  },
  args: {
    currentScore: 1500,
    maxPercentage: 30,
    timeRemaining: 5,
    disabled: false,
  },
  decorators: [
    (story) => ({
      ...story(),
      styles: [`:host { display: block; max-width: 400px; }`],
    }),
  ],
};

export default meta;
type Story = StoryObj<BzmConfidenceWagerComponent>;

export const Default: Story = {
  args: {
    currentScore: 1500,
    timeRemaining: 5,
  },
};

export const LowScore: Story = {
  args: {
    currentScore: 250,
    maxPercentage: 30,
    timeRemaining: 4,
  },
};

export const HighScore: Story = {
  args: {
    currentScore: 5000,
    maxPercentage: 30,
    timeRemaining: 5,
  },
};

export const TimeRunningOut: Story = {
  args: {
    currentScore: 1500,
    timeRemaining: 1,
  },
};

export const Disabled: Story = {
  args: {
    currentScore: 1500,
    disabled: true,
  },
};
