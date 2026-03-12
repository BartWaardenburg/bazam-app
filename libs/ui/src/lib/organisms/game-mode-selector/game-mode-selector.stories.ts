import type { Meta, StoryObj } from '@storybook/angular';
import { BzmGameModeSelectorComponent, GameModeOption } from './game-mode-selector.component';

const allModes: GameModeOption[] = [
  { mode: 'classic', title: 'Klassiek', description: 'Standaard quiz met optionele power-ups', icon: 'game-controller', playerRange: '2-30 spelers', recommended: true },
  { mode: 'team-battle', title: 'Team Battle', description: 'Werk samen in 2-4 teams', icon: 'users-three', playerRange: '4-40 spelers' },
  { mode: 'boss-battle', title: 'Boss Battle', description: 'Co-op tegen een baaskarakter', icon: 'skull', playerRange: '2-20 spelers' },
  { mode: 'blitz', title: 'Blitz', description: 'Snelvuur automatisch doorlopend', icon: 'lightning', playerRange: '2-30 spelers' },
  { mode: 'survival', title: 'Survival', description: 'Levens systeem, nooit helemaal uitgeschakeld', icon: 'heart-half', playerRange: '2-30 spelers' },
  { mode: 'survival-royale', title: 'Survival Royale', description: 'Grote groep battle royale met levens', icon: 'crown', playerRange: '10-100 spelers' },
];

const meta: Meta<BzmGameModeSelectorComponent> = {
  title: 'Organisms/GameModeSelector',
  component: BzmGameModeSelectorComponent,
  tags: ['autodocs'],
  argTypes: {
    selectedMode: {
      control: { type: 'select' },
      options: [null, 'classic', 'team-battle', 'boss-battle', 'blitz', 'survival', 'survival-royale'],
    },
  },
  decorators: [
    (story) => ({
      ...story(),
      styles: [`:host { display: block; max-width: 800px; padding: 24px; }`],
    }),
  ],
};

export default meta;
type Story = StoryObj<BzmGameModeSelectorComponent>;

export const AllModes: Story = {
  args: {
    modes: allModes,
    selectedMode: null,
  },
};

export const WithSelection: Story = {
  args: {
    modes: allModes,
    selectedMode: 'classic',
  },
};

export const SomeLocked: Story = {
  args: {
    modes: allModes.map((m) =>
      m.mode === 'boss-battle' || m.mode === 'survival-royale' ? { ...m, locked: true } : m
    ),
    selectedMode: null,
  },
};
