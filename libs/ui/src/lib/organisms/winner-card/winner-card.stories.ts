import type { Meta, StoryObj } from '@storybook/angular';
import { BzmWinnerCardComponent } from './winner-card.component';

const meta: Meta<BzmWinnerCardComponent> = {
  title: 'Organisms/WinnerCard',
  component: BzmWinnerCardComponent,
  tags: ['autodocs'],
  argTypes: {
    name: { control: 'text' },
    score: { control: 'number' },
    label: { control: 'text' },
    scoreLabel: { control: 'text' },
  },
  args: {
    name: 'Bart',
    score: 2400,
    label: 'Winnaar',
    scoreLabel: 'punten',
  },
  decorators: [
    (story) => ({
      ...story(),
      styles: [`:host { display: block; max-width: 450px; padding: 24px; }`],
    }),
  ],
};

export default meta;
type Story = StoryObj<BzmWinnerCardComponent>;

export const Default: Story = {};

export const HighScore: Story = {
  args: { name: 'Lisa', score: 5000 },
};

export const LongName: Story = {
  args: { name: 'Maximiliaan', score: 1800 },
};

export const CustomLabels: Story = {
  args: {
    name: 'Sophie',
    score: 3200,
    label: 'Champion',
    scoreLabel: 'points',
  },
};
