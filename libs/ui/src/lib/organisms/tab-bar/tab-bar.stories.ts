import type { Meta, StoryObj } from '@storybook/angular';
import { BzmTabBarComponent } from './tab-bar.component';

const meta: Meta<BzmTabBarComponent> = {
  title: 'Organisms/TabBar',
  component: BzmTabBarComponent,
  decorators: [
    (story) => ({
      ...story(),
      template: `<div style="max-width: 400px;">${story().template ?? '<bzm-tab-bar [tabs]="tabs" [activeIndex]="activeIndex" (tabChange)="tabChange($event)" />'}</div>`,
    }),
  ],
  argTypes: {
    activeIndex: { control: 'number' },
  },
  args: {
    tabs: ['World', 'Weekly', 'Friends'],
    activeIndex: 0,
  },
};

export default meta;
type Story = StoryObj<BzmTabBarComponent>;

export const Default: Story = {};

export const WeeklySelected: Story = {
  args: { activeIndex: 1 },
};

export const FriendsSelected: Story = {
  args: { activeIndex: 2 },
};

export const TwoTabs: Story = {
  args: {
    tabs: ['Active', 'Completed'],
    activeIndex: 0,
  },
};

export const FourTabs: Story = {
  args: {
    tabs: ['All', 'Science', 'Math', 'History'],
    activeIndex: 0,
  },
};
