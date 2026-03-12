import type { Meta, StoryObj } from '@storybook/angular';
import { BzmDifficultyBadgeComponent } from './difficulty-badge.component';

const meta: Meta<BzmDifficultyBadgeComponent> = {
  title: 'Atoms/DifficultyBadge',
  component: BzmDifficultyBadgeComponent,
  argTypes: {
    tier: {
      control: 'select',
      options: ['bronze', 'silver', 'gold'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md'],
    },
  },
  args: {
    tier: 'bronze',
    size: 'md',
  },
};

export default meta;
type Story = StoryObj<BzmDifficultyBadgeComponent>;

export const Bronze: Story = {
  args: {
    tier: 'bronze',
  },
};

export const Silver: Story = {
  args: {
    tier: 'silver',
  },
};

export const Gold: Story = {
  args: {
    tier: 'gold',
  },
};

export const SmallBronze: Story = {
  args: {
    tier: 'bronze',
    size: 'sm',
  },
};

export const SmallGold: Story = {
  args: {
    tier: 'gold',
    size: 'sm',
  },
};

export const AllTiers: Story = {
  render: () => ({
    template: `
      <div style="display: flex; align-items: center; gap: 12px;">
        <bzm-difficulty-badge tier="bronze" />
        <bzm-difficulty-badge tier="silver" />
        <bzm-difficulty-badge tier="gold" />
      </div>
    `,
    moduleMetadata: {
      imports: [BzmDifficultyBadgeComponent],
    },
  }),
};

export const AllTiersSmall: Story = {
  render: () => ({
    template: `
      <div style="display: flex; align-items: center; gap: 8px;">
        <bzm-difficulty-badge tier="bronze" size="sm" />
        <bzm-difficulty-badge tier="silver" size="sm" />
        <bzm-difficulty-badge tier="gold" size="sm" />
      </div>
    `,
    moduleMetadata: {
      imports: [BzmDifficultyBadgeComponent],
    },
  }),
};
