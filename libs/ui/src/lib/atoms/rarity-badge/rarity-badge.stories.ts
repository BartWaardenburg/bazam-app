import type { Meta, StoryObj } from '@storybook/angular';
import { BzmRarityBadgeComponent } from './rarity-badge.component';

const meta: Meta<BzmRarityBadgeComponent> = {
  title: 'Atoms/RarityBadge',
  component: BzmRarityBadgeComponent,
  argTypes: {
    rarity: {
      control: 'select',
      options: ['common', 'uncommon', 'rare', 'epic', 'legendary'],
    },
  },
  args: {
    rarity: 'common',
  },
};

export default meta;
type Story = StoryObj<BzmRarityBadgeComponent>;

export const Common: Story = {
  args: {
    rarity: 'common',
  },
};

export const Uncommon: Story = {
  args: {
    rarity: 'uncommon',
  },
};

export const Rare: Story = {
  args: {
    rarity: 'rare',
  },
};

export const Epic: Story = {
  args: {
    rarity: 'epic',
  },
};

export const Legendary: Story = {
  args: {
    rarity: 'legendary',
  },
};

export const AllTiers: Story = {
  render: () => ({
    template: `
      <div style="display: flex; align-items: center; gap: 12px;">
        <bzm-rarity-badge rarity="common" />
        <bzm-rarity-badge rarity="uncommon" />
        <bzm-rarity-badge rarity="rare" />
        <bzm-rarity-badge rarity="epic" />
        <bzm-rarity-badge rarity="legendary" />
      </div>
    `,
    moduleMetadata: {
      imports: [BzmRarityBadgeComponent],
    },
  }),
};

export const OnDarkBackground: Story = {
  render: () => ({
    template: `
      <div style="display: flex; align-items: center; gap: 12px; background: #1a1a2e; padding: 16px; border-radius: 8px;">
        <bzm-rarity-badge rarity="common" />
        <bzm-rarity-badge rarity="uncommon" />
        <bzm-rarity-badge rarity="rare" />
        <bzm-rarity-badge rarity="epic" />
        <bzm-rarity-badge rarity="legendary" />
      </div>
    `,
    moduleMetadata: {
      imports: [BzmRarityBadgeComponent],
    },
  }),
};
