import type { Meta, StoryObj } from '@storybook/angular';
import { BzmGameModeCardComponent } from './game-mode-card.component';

const meta: Meta<BzmGameModeCardComponent> = {
  title: 'Molecules/GameModeCard',
  component: BzmGameModeCardComponent,
  tags: ['autodocs'],
  argTypes: {
    mode: {
      control: { type: 'select' },
      options: ['classic', 'team-battle', 'boss-battle', 'blitz', 'survival', 'survival-royale'],
    },
    title: { control: 'text' },
    description: { control: 'text' },
    icon: { control: 'text' },
    playerRange: { control: 'text' },
    selected: { control: 'boolean' },
    locked: { control: 'boolean' },
    recommended: { control: 'boolean' },
  },
  decorators: [
    (story) => ({
      ...story(),
      styles: [`:host { display: block; max-width: 240px; }`],
    }),
  ],
};

export default meta;
type Story = StoryObj<BzmGameModeCardComponent>;

export const Classic: Story = {
  args: {
    mode: 'classic',
    title: 'Klassiek',
    description: 'Standaard quiz met optionele power-ups',
    icon: 'game-controller',
    playerRange: '2-30 spelers',
    selected: false,
    locked: false,
    recommended: false,
  },
};

export const TeamBattle: Story = {
  args: {
    mode: 'team-battle',
    title: 'Team Battle',
    description: 'Werk samen in 2-4 teams',
    icon: 'users-three',
    playerRange: '4-40 spelers',
    selected: false,
    locked: false,
    recommended: false,
  },
};

export const BossBattle: Story = {
  args: {
    mode: 'boss-battle',
    title: 'Boss Battle',
    description: 'Co-op tegen een baaskarakter',
    icon: 'skull',
    playerRange: '2-20 spelers',
    selected: false,
    locked: false,
    recommended: false,
  },
};

export const Blitz: Story = {
  args: {
    mode: 'blitz',
    title: 'Blitz',
    description: 'Snelvuur automatisch doorlopend',
    icon: 'lightning',
    playerRange: '2-30 spelers',
    selected: false,
    locked: false,
    recommended: false,
  },
};

export const Survival: Story = {
  args: {
    mode: 'survival',
    title: 'Survival',
    description: 'Levens systeem, nooit helemaal uitgeschakeld',
    icon: 'heart-half',
    playerRange: '2-30 spelers',
    selected: false,
    locked: false,
    recommended: false,
  },
};

export const SurvivalRoyale: Story = {
  args: {
    mode: 'survival-royale',
    title: 'Survival Royale',
    description: 'Grote groep battle royale met levens',
    icon: 'crown',
    playerRange: '10-100 spelers',
    selected: false,
    locked: false,
    recommended: false,
  },
};

export const Selected: Story = {
  args: {
    mode: 'classic',
    title: 'Klassiek',
    description: 'Standaard quiz met optionele power-ups',
    icon: 'game-controller',
    playerRange: '2-30 spelers',
    selected: true,
    locked: false,
    recommended: false,
  },
};

export const Locked: Story = {
  args: {
    mode: 'boss-battle',
    title: 'Boss Battle',
    description: 'Co-op tegen een baaskarakter',
    icon: 'skull',
    playerRange: '2-20 spelers',
    selected: false,
    locked: true,
    recommended: false,
  },
};

export const Recommended: Story = {
  args: {
    mode: 'classic',
    title: 'Klassiek',
    description: 'Standaard quiz met optionele power-ups',
    icon: 'game-controller',
    playerRange: '2-30 spelers',
    selected: false,
    locked: false,
    recommended: true,
  },
};
