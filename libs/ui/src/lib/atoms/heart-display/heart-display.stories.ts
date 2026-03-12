import type { Meta, StoryObj } from '@storybook/angular';
import { BzmHeartDisplayComponent } from './heart-display.component';

const meta: Meta<BzmHeartDisplayComponent> = {
  title: 'Atoms/HeartDisplay',
  component: BzmHeartDisplayComponent,
  tags: ['autodocs'],
  argTypes: {
    hearts: { control: { type: 'number', min: 0, max: 10 } },
    maxHearts: { control: { type: 'number', min: 1, max: 10 } },
    animate: { control: 'boolean' },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
    },
  },
  decorators: [
    (story) => ({
      ...story(),
      styles: [`:host { display: block; padding: 24px; }`],
    }),
  ],
};

export default meta;
type Story = StoryObj<BzmHeartDisplayComponent>;

export const ThreeHearts: Story = {
  args: {
    hearts: 3,
    maxHearts: 3,
    animate: true,
    size: 'md',
  },
};

export const TwoHearts: Story = {
  args: {
    hearts: 2,
    maxHearts: 3,
    animate: true,
    size: 'md',
  },
};

export const OneHeart: Story = {
  args: {
    hearts: 1,
    maxHearts: 3,
    animate: true,
    size: 'md',
  },
};

export const NoHearts: Story = {
  args: {
    hearts: 0,
    maxHearts: 3,
    animate: true,
    size: 'md',
  },
};

export const FiveMaxHearts: Story = {
  args: {
    hearts: 3,
    maxHearts: 5,
    animate: true,
    size: 'md',
  },
};

export const SmallSize: Story = {
  args: {
    hearts: 2,
    maxHearts: 3,
    animate: true,
    size: 'sm',
  },
};

export const LargeSize: Story = {
  args: {
    hearts: 2,
    maxHearts: 3,
    animate: true,
    size: 'lg',
  },
};
