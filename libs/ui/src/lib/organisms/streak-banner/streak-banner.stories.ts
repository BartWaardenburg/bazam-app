import type { Meta, StoryObj } from '@storybook/angular';
import { BzmStreakBannerComponent } from './streak-banner.component';

const meta: Meta<BzmStreakBannerComponent> = {
  title: 'Organisms/StreakBanner',
  component: BzmStreakBannerComponent,
  decorators: [
    (story) => ({
      ...story(),
      template: `<div style="max-width: 400px;">${story().template ?? '<bzm-streak-banner [streakCount]="streakCount" />'}</div>`,
    }),
  ],
  argTypes: {
    streakCount: { control: 'number' },
  },
  args: {
    streakCount: 6,
  },
};

export default meta;
type Story = StoryObj<BzmStreakBannerComponent>;

export const Default: Story = {};

export const HighStreak: Story = {
  args: { streakCount: 42 },
};

export const SingleStreak: Story = {
  args: { streakCount: 1 },
};

export const HundredStreak: Story = {
  args: { streakCount: 100 },
};
