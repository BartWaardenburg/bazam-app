import type { Meta, StoryObj } from '@storybook/angular';
import { BzmRescueBannerComponent } from './rescue-banner.component';

const meta: Meta<BzmRescueBannerComponent> = {
  title: 'Molecules/RescueBanner',
  component: BzmRescueBannerComponent,
  tags: ['autodocs'],
  argTypes: {
    rescuerName: { control: 'text' },
    canBeRescued: { control: 'boolean' },
    rescuesRemaining: { control: { type: 'number', min: 0, max: 5 } },
  },
  decorators: [
    (story) => ({
      ...story(),
      styles: [`:host { display: block; max-width: 400px; padding: 24px; }`],
    }),
  ],
};

export default meta;
type Story = StoryObj<BzmRescueBannerComponent>;

export const WaitingForRescue: Story = {
  args: {
    rescuerName: null,
    canBeRescued: true,
    rescuesRemaining: 1,
  },
};

export const Rescued: Story = {
  args: {
    rescuerName: 'Bart',
    canBeRescued: false,
    rescuesRemaining: 0,
  },
};

export const NotAvailable: Story = {
  args: {
    rescuerName: null,
    canBeRescued: false,
    rescuesRemaining: 0,
  },
};
