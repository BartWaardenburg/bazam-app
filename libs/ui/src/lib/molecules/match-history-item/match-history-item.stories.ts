import type { Meta, StoryObj } from '@storybook/angular';
import { BzmMatchHistoryItemComponent } from './match-history-item.component';

const meta: Meta<BzmMatchHistoryItemComponent> = {
  title: 'Molecules/MatchHistoryItem',
  component: BzmMatchHistoryItemComponent,
  tags: ['autodocs'],
  argTypes: {
    mode: { control: 'text' },
    modeIcon: { control: 'text' },
    date: { control: 'text' },
    score: { control: 'number' },
    rank: { control: 'number' },
    totalPlayers: { control: 'number' },
    isWin: { control: 'boolean' },
  },
  args: {
    mode: 'Klassiek',
    modeIcon: 'game-controller',
    date: '10 mrt 2026',
    score: 1850,
    rank: 3,
    totalPlayers: 8,
    isWin: false,
  },
  decorators: [
    (story) => ({
      ...story(),
      styles: [`:host { display: block; max-width: 500px; padding: 24px; }`],
    }),
  ],
};

export default meta;
type Story = StoryObj<BzmMatchHistoryItemComponent>;

export const Win: Story = {
  args: {
    rank: 1,
    score: 3200,
    isWin: true,
  },
};

export const Loss: Story = {
  args: {
    rank: 5,
    score: 1200,
    isWin: false,
  },
};

export const TeamBattle: Story = {
  args: {
    mode: 'Team Battle',
    modeIcon: 'users-three',
    rank: 1,
    totalPlayers: 4,
    score: 4500,
    isWin: true,
  },
};

export const HighRank: Story = {
  args: {
    rank: 2,
    totalPlayers: 12,
    score: 2800,
    isWin: false,
  },
};

export const LowRank: Story = {
  args: {
    rank: 10,
    totalPlayers: 12,
    score: 450,
    isWin: false,
  },
};

export const RecentMatch: Story = {
  args: {
    mode: 'Snelronde',
    modeIcon: 'lightning',
    date: 'Vandaag',
    rank: 1,
    totalPlayers: 6,
    score: 2100,
    isWin: true,
  },
};
