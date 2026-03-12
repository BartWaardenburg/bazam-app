import type { Meta, StoryObj } from '@storybook/angular';
import { BzmRankTierBadgeComponent } from './rank-tier-badge.component';

const meta: Meta<BzmRankTierBadgeComponent> = {
  title: 'Atoms/RankTierBadge',
  component: BzmRankTierBadgeComponent,
  tags: ['autodocs'],
  argTypes: {
    tier: {
      control: 'select',
      options: ['bronze', 'silver', 'gold', 'diamond', 'champion'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    showLabel: { control: 'boolean' },
    animate: { control: 'boolean' },
  },
  args: {
    tier: 'gold',
    size: 'md',
    showLabel: true,
    animate: false,
  },
  decorators: [
    (story) => ({
      ...story(),
      styles: [`:host { display: block; padding: 24px; }`],
    }),
  ],
};

export default meta;
type Story = StoryObj<BzmRankTierBadgeComponent>;

export const Bronze: Story = {
  args: { tier: 'bronze' },
};

export const Silver: Story = {
  args: { tier: 'silver' },
};

export const Gold: Story = {
  args: { tier: 'gold' },
};

export const Diamond: Story = {
  args: { tier: 'diamond' },
};

export const Champion: Story = {
  args: { tier: 'champion' },
};

export const Small: Story = {
  args: { tier: 'gold', size: 'sm' },
};

export const Large: Story = {
  args: { tier: 'diamond', size: 'lg' },
};

export const NoLabel: Story = {
  args: { tier: 'gold', showLabel: false },
};

export const Animated: Story = {
  args: { tier: 'champion', animate: true, size: 'lg' },
};

export const AllTiers: Story = {
  render: () => ({
    template: `
      <div style="display: flex; gap: 24px; align-items: flex-end;">
        <bzm-rank-tier-badge tier="bronze" />
        <bzm-rank-tier-badge tier="silver" />
        <bzm-rank-tier-badge tier="gold" />
        <bzm-rank-tier-badge tier="diamond" />
        <bzm-rank-tier-badge tier="champion" />
      </div>
    `,
    moduleMetadata: {
      imports: [BzmRankTierBadgeComponent],
    },
  }),
};
