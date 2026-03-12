import type { Meta, StoryObj } from '@storybook/angular';
import { BzmPowerUpInventoryComponent, type PowerUpSlot } from './power-up-inventory.component';

const shieldSlot: PowerUpSlot = {
  id: 'pu-1',
  name: 'Shield',
  icon: 'shield',
  type: 'boost',
  rarity: 'common',
};

const scrambleSlot: PowerUpSlot = {
  id: 'pu-2',
  name: 'Scramble',
  icon: 'shuffle',
  type: 'chaos',
  rarity: 'rare',
};

const meta: Meta<BzmPowerUpInventoryComponent> = {
  title: 'Molecules/PowerUpInventory',
  component: BzmPowerUpInventoryComponent,
  tags: ['autodocs'],
  argTypes: {
    slots: { control: 'object' },
    maxSlots: { control: 'number' },
    canUse: { control: 'boolean' },
  },
  args: {
    slots: [],
    maxSlots: 2,
    canUse: true,
  },
  decorators: [
    (story) => ({
      ...story(),
      styles: [`:host { display: block; max-width: 400px; }`],
    }),
  ],
};

export default meta;
type Story = StoryObj<BzmPowerUpInventoryComponent>;

export const Empty: Story = {
  args: {
    slots: [],
  },
};

export const OneSlot: Story = {
  args: {
    slots: [shieldSlot],
  },
};

export const TwoSlots: Story = {
  args: {
    slots: [shieldSlot, scrambleSlot],
  },
};

export const CannotUse: Story = {
  args: {
    slots: [shieldSlot, scrambleSlot],
    canUse: false,
  },
};
