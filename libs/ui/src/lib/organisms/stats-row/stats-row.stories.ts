import type { Meta, StoryObj } from '@storybook/angular';
import { BzmStatsRowComponent } from './stats-row.component';

const meta: Meta<BzmStatsRowComponent> = {
  title: 'Organisms/StatsRow',
  component: BzmStatsRowComponent,
  decorators: [
    (story) => ({
      ...story(),
      template: `<div style="max-width: 400px;">${story().template ?? '<bzm-stats-row [level]="level" [points]="points" />'}</div>`,
    }),
  ],
  argTypes: {
    level: { control: 'text' },
    points: { control: 'number' },
  },
  args: {
    level: 'Gold',
    points: 323,
  },
};

export default meta;
type Story = StoryObj<BzmStatsRowComponent>;

export const Default: Story = {};

export const HighLevel: Story = {
  args: {
    level: 'Diamond',
    points: 12450,
  },
};

export const Beginner: Story = {
  args: {
    level: 'Bronze',
    points: 15,
  },
};

export const MaxedOut: Story = {
  args: {
    level: 'Legendary',
    points: 99999,
  },
};
