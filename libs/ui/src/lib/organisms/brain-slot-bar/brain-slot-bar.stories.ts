import type { Meta, StoryObj } from '@storybook/angular';
import { BzmBrainSlotBarComponent, EquippedBrain } from './brain-slot-bar.component';

const commonBrain: EquippedBrain = {
  id: 'b1',
  name: 'Snelle Denker',
  icon: 'ph-lightning',
  rarity: 'common',
  description: '+2s extra tijd per vraag',
};

const uncommonBrain: EquippedBrain = {
  id: 'b2',
  name: 'Dubbelslag',
  icon: 'ph-copy',
  rarity: 'uncommon',
  description: 'Dubbele Sparks bij streak ≥ 3',
};

const thirdBrain: EquippedBrain = {
  id: 'b3',
  name: 'Foutenmarge',
  icon: 'ph-shield-check',
  rarity: 'common',
  description: '1 fout antwoord wordt gratis vergeven',
};

const meta: Meta<BzmBrainSlotBarComponent> = {
  title: 'Organisms/BrainSlotBar',
  component: BzmBrainSlotBarComponent,
  tags: ['autodocs'],
  argTypes: {
    maxSlots: { control: { type: 'select' }, options: [3, 5] },
    interactive: { control: 'boolean' },
  },
  args: {
    brains: [commonBrain, null, null],
    maxSlots: 3,
    interactive: false,
  },
  decorators: [
    (story) => ({
      ...story(),
      styles: [`:host { display: block; max-width: 400px; padding: 24px; }`],
    }),
  ],
};

export default meta;
type Story = StoryObj<BzmBrainSlotBarComponent>;

export const Default: Story = {};

export const AllEmpty: Story = {
  args: {
    brains: [null, null, null],
  },
};

export const AllFilled: Story = {
  args: {
    brains: [commonBrain, uncommonBrain, thirdBrain],
  },
};

export const WithUncommon: Story = {
  args: {
    brains: [commonBrain, uncommonBrain, null],
  },
};

export const Interactive: Story = {
  args: {
    brains: [commonBrain, uncommonBrain, thirdBrain],
    interactive: true,
  },
};

export const ChampionFiveSlots: Story = {
  args: {
    brains: [commonBrain, uncommonBrain, thirdBrain, null, null],
    maxSlots: 5,
    interactive: true,
  },
};

export const ChampionAllFilled: Story = {
  args: {
    brains: [
      commonBrain,
      uncommonBrain,
      thirdBrain,
      { id: 'b4', name: 'Geheugenpaleis', icon: 'ph-buildings', rarity: 'uncommon', description: 'Hints worden getoond bij moeilijke vragen' },
      { id: 'b5', name: 'Geluksbrein', icon: 'ph-clover', rarity: 'common', description: '10% kans op bonus Sparks' },
    ],
    maxSlots: 5,
    interactive: true,
  },
};
