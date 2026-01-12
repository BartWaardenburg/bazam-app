import type { Meta, StoryObj } from '@storybook/angular';
import { BzmAvatarComponent } from './avatar.component';

const meta: Meta<BzmAvatarComponent> = {
  title: 'Atoms/Avatar',
  component: BzmAvatarComponent,
  argTypes: {
    nickname: { control: 'text' },
    imageUrl: { control: 'text' },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl'],
    },
    rankBadge: { control: 'number' },
    streakBadge: { control: 'number' },
  },
  args: {
    nickname: 'Alex Kim',
    size: 'md',
  },
};

export default meta;
type Story = StoryObj<BzmAvatarComponent>;

export const WithInitials: Story = {
  args: {
    nickname: 'Alex Kim',
    size: 'lg',
  },
};

export const WithImage: Story = {
  args: {
    nickname: 'Alex Kim',
    imageUrl: 'https://api.dicebear.com/9.x/adventurer/svg?seed=Alex',
    size: 'lg',
  },
};

export const WithRankBadge: Story = {
  args: {
    nickname: 'Alex Kim',
    imageUrl: 'https://api.dicebear.com/9.x/adventurer/svg?seed=Alex',
    size: 'lg',
    rankBadge: 1,
  },
};

export const WithStreakBadge: Story = {
  args: {
    nickname: 'Sam Lee',
    imageUrl: 'https://api.dicebear.com/9.x/adventurer/svg?seed=Sam',
    size: 'lg',
    streakBadge: 7,
  },
};

export const AllSizes: Story = {
  render: () => ({
    template: `
      <div style="display: flex; gap: 16px; align-items: center;">
        <bzm-avatar nickname="Alex Kim" size="sm" />
        <bzm-avatar nickname="Alex Kim" size="md" />
        <bzm-avatar nickname="Alex Kim" size="lg" />
        <bzm-avatar nickname="Alex Kim" size="xl" />
      </div>
    `,
  }),
};

export const InitialsVariety: Story = {
  render: () => ({
    template: `
      <div style="display: flex; gap: 12px; align-items: center;">
        <bzm-avatar nickname="Alex Kim" size="lg" />
        <bzm-avatar nickname="Sam Lee" size="lg" />
        <bzm-avatar nickname="Jamie Fox" size="lg" />
        <bzm-avatar nickname="Taylor Swift" size="lg" />
        <bzm-avatar nickname="Morgan" size="lg" />
        <bzm-avatar nickname="Quinn Zhang" size="lg" />
      </div>
    `,
  }),
};

export const SmallWithBadge: Story = {
  args: {
    nickname: 'Alex Kim',
    size: 'sm',
    rankBadge: 3,
  },
};

export const ExtraLargeWithBadge: Story = {
  args: {
    nickname: 'Alex Kim',
    imageUrl: 'https://api.dicebear.com/9.x/adventurer/svg?seed=Alex',
    size: 'xl',
    rankBadge: 1,
  },
};
