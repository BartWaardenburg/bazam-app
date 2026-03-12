import type { Meta, StoryObj } from '@storybook/angular';
import { BzmComebackBannerComponent } from './comeback-banner.component';

const meta: Meta<BzmComebackBannerComponent> = {
  title: 'Molecules/ComebackBanner',
  component: BzmComebackBannerComponent,
  tags: ['autodocs'],
  argTypes: {
    active: { control: 'boolean' },
    correctNeeded: { control: { type: 'number', min: 1, max: 5 } },
    correctSoFar: { control: { type: 'number', min: 0, max: 5 } },
  },
  decorators: [
    (story) => ({
      ...story(),
      styles: [`:host { display: block; max-width: 400px; padding: 24px; }`],
    }),
  ],
};

export default meta;
type Story = StoryObj<BzmComebackBannerComponent>;

export const Active: Story = {
  args: {
    active: true,
    correctNeeded: 2,
    correctSoFar: 0,
  },
};

export const OneCorrect: Story = {
  args: {
    active: true,
    correctNeeded: 2,
    correctSoFar: 1,
  },
};

export const ComebackComplete: Story = {
  args: {
    active: true,
    correctNeeded: 2,
    correctSoFar: 2,
  },
};

export const Inactive: Story = {
  args: {
    active: false,
    correctNeeded: 2,
    correctSoFar: 0,
  },
};
