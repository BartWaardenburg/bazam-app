import type { Meta, StoryObj } from '@storybook/angular';
import { BzmLeaderboardComponent, LeaderboardPlayer } from './leaderboard.component';

const sampleEntries: LeaderboardPlayer[] = [
  { id: '1', nickname: 'Bart', score: 2400, rank: 1, streak: 5 },
  { id: '2', nickname: 'Lisa', score: 2100, rank: 2, streak: 3 },
  { id: '3', nickname: 'Max', score: 1800, rank: 3, streak: 2 },
  { id: '4', nickname: 'Sophie', score: 1500, rank: 4, streak: 1 },
  { id: '5', nickname: 'Daan', score: 1200, rank: 5, streak: 0 },
  { id: '6', nickname: 'Emma', score: 900, rank: 6, streak: 0 },
];

const meta: Meta<BzmLeaderboardComponent> = {
  title: 'Organisms/Leaderboard',
  component: BzmLeaderboardComponent,
  tags: ['autodocs'],
  argTypes: {
    showPodium: { control: 'boolean' },
  },
  args: {
    entries: sampleEntries,
    showPodium: false,
  },
  decorators: [
    (story) => ({
      ...story(),
      styles: [`:host { display: block; max-width: 500px; padding: 24px; }`],
    }),
  ],
};

export default meta;
type Story = StoryObj<BzmLeaderboardComponent>;

export const Default: Story = {};

export const WithPodium: Story = {
  args: { showPodium: true },
};

export const TopThreeOnly: Story = {
  args: {
    entries: sampleEntries.slice(0, 3),
    showPodium: true,
  },
};

export const SinglePlayer: Story = {
  args: {
    entries: [sampleEntries[0]],
    showPodium: true,
  },
};

export const ManyPlayers: Story = {
  args: {
    entries: [
      ...sampleEntries,
      { id: '7', nickname: 'Liam', score: 750, rank: 7, streak: 0 },
      { id: '8', nickname: 'Mila', score: 600, rank: 8, streak: 1 },
      { id: '9', nickname: 'Noah', score: 450, rank: 9, streak: 0 },
      { id: '10', nickname: 'Julia', score: 300, rank: 10, streak: 0 },
    ],
    showPodium: true,
  },
};
