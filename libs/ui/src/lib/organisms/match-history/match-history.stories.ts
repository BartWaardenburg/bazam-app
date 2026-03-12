import type { Meta, StoryObj } from '@storybook/angular';
import { BzmMatchHistoryComponent, type MatchHistoryEntry } from './match-history.component';

const sampleMatches: MatchHistoryEntry[] = [
  { id: '1', mode: 'Klassiek', modeIcon: 'game-controller', date: '10 mrt 2026', score: 3200, rank: 1, totalPlayers: 8, isWin: true },
  { id: '2', mode: 'Team Battle', modeIcon: 'users-three', date: '9 mrt 2026', score: 2100, rank: 2, totalPlayers: 6, isWin: false },
  { id: '3', mode: 'Snelronde', modeIcon: 'lightning', date: '8 mrt 2026', score: 1850, rank: 1, totalPlayers: 4, isWin: true },
  { id: '4', mode: 'Klassiek', modeIcon: 'game-controller', date: '7 mrt 2026', score: 1400, rank: 4, totalPlayers: 10, isWin: false },
  { id: '5', mode: 'Team Battle', modeIcon: 'users-three', date: '6 mrt 2026', score: 2800, rank: 1, totalPlayers: 6, isWin: true },
];

const manyMatches: MatchHistoryEntry[] = Array.from({ length: 15 }, (_, i) => ({
  id: String(i + 1),
  mode: i % 3 === 0 ? 'Klassiek' : i % 3 === 1 ? 'Team Battle' : 'Snelronde',
  modeIcon: i % 3 === 0 ? 'game-controller' : i % 3 === 1 ? 'users-three' : 'lightning',
  date: `${15 - i} mrt 2026`,
  score: 1000 + Math.floor(Math.random() * 3000),
  rank: (i % 5) + 1,
  totalPlayers: 8,
  isWin: i % 3 === 0,
}));

const meta: Meta<BzmMatchHistoryComponent> = {
  title: 'Organisms/MatchHistory',
  component: BzmMatchHistoryComponent,
  tags: ['autodocs'],
  argTypes: {
    matches: { control: 'object' },
    maxVisible: { control: 'number' },
    emptyText: { control: 'text' },
  },
  args: {
    matches: sampleMatches,
    maxVisible: 10,
    emptyText: 'Nog geen wedstrijden gespeeld',
  },
  decorators: [
    (story) => ({
      ...story(),
      styles: [`:host { display: block; max-width: 520px; padding: 24px; }`],
    }),
  ],
};

export default meta;
type Story = StoryObj<BzmMatchHistoryComponent>;

export const WithMatches: Story = {};

export const Empty: Story = {
  args: {
    matches: [],
  },
};

export const ManyMatches: Story = {
  args: {
    matches: manyMatches,
    maxVisible: 5,
  },
};

export const FewMatches: Story = {
  args: {
    matches: sampleMatches.slice(0, 2),
  },
};
