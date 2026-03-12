import type { Meta, StoryObj } from '@storybook/angular';
import { BzmBossRewardPickerComponent, BossReward } from './boss-reward-picker.component';

const defaultRewards: [BossReward, BossReward, BossReward] = [
  {
    id: 'r1',
    type: 'brain',
    name: 'Dubbelslag',
    description: 'Dubbele Sparks bij streak ≥ 3',
    icon: 'ph-copy',
    rarity: 'uncommon',
  },
  {
    id: 'r2',
    type: 'study-card',
    name: 'Hint Kaart',
    description: 'Verwijdert 1 fout antwoord bij de volgende vraag',
    icon: 'ph-lightbulb',
  },
  {
    id: 'r3',
    type: 'sparks',
    name: 'Spark Bonus',
    description: 'Ontvang 75 bonus Sparks',
    icon: 'ph-lightning',
    sparksAmount: 75,
  },
];

const allBrainRewards: [BossReward, BossReward, BossReward] = [
  {
    id: 'r1',
    type: 'brain',
    name: 'Snelle Denker',
    description: '+2s extra tijd per vraag',
    icon: 'ph-lightning',
    rarity: 'common',
  },
  {
    id: 'r2',
    type: 'brain',
    name: 'Dubbelslag',
    description: 'Dubbele Sparks bij streak ≥ 3',
    icon: 'ph-copy',
    rarity: 'uncommon',
  },
  {
    id: 'r3',
    type: 'brain',
    name: 'Geheugenpaleis',
    description: 'Hints worden getoond bij moeilijke vragen',
    icon: 'ph-buildings',
    rarity: 'uncommon',
  },
];

const meta: Meta<BzmBossRewardPickerComponent> = {
  title: 'Organisms/BossRewardPicker',
  component: BzmBossRewardPickerComponent,
  tags: ['autodocs'],
  argTypes: {
    selectedId: { control: 'text' },
  },
  args: {
    rewards: defaultRewards,
    selectedId: null,
  },
  decorators: [
    (story) => ({
      ...story(),
      styles: [`:host { display: block; max-width: 600px; padding: 24px; }`],
    }),
  ],
};

export default meta;
type Story = StoryObj<BzmBossRewardPickerComponent>;

export const Default: Story = {};

export const WithSelection: Story = {
  args: {
    selectedId: 'r1',
  },
};

export const SparksSelected: Story = {
  args: {
    selectedId: 'r3',
  },
};

export const AllBrains: Story = {
  args: {
    rewards: allBrainRewards,
    selectedId: null,
  },
};

export const AllBrainsWithSelection: Story = {
  args: {
    rewards: allBrainRewards,
    selectedId: 'r2',
  },
};

export const HighSparksReward: Story = {
  args: {
    rewards: [
      defaultRewards[0],
      defaultRewards[1],
      {
        id: 'r3',
        type: 'sparks',
        name: 'Mega Spark Bonus',
        description: 'Ontvang 200 bonus Sparks',
        icon: 'ph-lightning',
        sparksAmount: 200,
      },
    ] as [BossReward, BossReward, BossReward],
    selectedId: null,
  },
};
