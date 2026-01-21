import type { Meta, StoryObj } from '@storybook/angular';
import { BzmPlayerListComponent, PlayerListItem } from './player-list.component';

const samplePlayers: PlayerListItem[] = [
  { id: '1', nickname: 'Bart', score: 1200 },
  { id: '2', nickname: 'Lisa', score: 980 },
  { id: '3', nickname: 'Max', score: 750 },
  { id: '4', nickname: 'Sophie', score: 600 },
  { id: '5', nickname: 'Daan', score: 450 },
];

const meta: Meta<BzmPlayerListComponent> = {
  title: 'Molecules/PlayerList',
  component: BzmPlayerListComponent,
  tags: ['autodocs'],
  argTypes: {
    showScores: { control: 'boolean' },
    emptyText: { control: 'text' },
  },
  args: {
    players: samplePlayers,
    showScores: false,
    emptyText: 'Wachten op spelers...',
  },
  decorators: [
    (story) => ({
      ...story(),
      styles: [`:host { display: block; max-width: 500px; padding: 24px; }`],
    }),
  ],
};

export default meta;
type Story = StoryObj<BzmPlayerListComponent>;

export const Default: Story = {};

export const WithScores: Story = {
  args: { showScores: true },
};

export const Empty: Story = {
  args: { players: [] },
};

export const SinglePlayer: Story = {
  args: { players: [samplePlayers[0]] },
};

export const ManyPlayers: Story = {
  args: {
    players: [
      ...samplePlayers,
      { id: '6', nickname: 'Emma', score: 300 },
      { id: '7', nickname: 'Liam', score: 250 },
      { id: '8', nickname: 'Mila', score: 200 },
      { id: '9', nickname: 'Noah', score: 150 },
      { id: '10', nickname: 'Julia', score: 100 },
    ],
  },
};
