import type { Meta, StoryObj } from '@storybook/angular';
import { BzmRoundIntermissionComponent, IntermissionPlayer } from './round-intermission.component';

const sampleStandings: IntermissionPlayer[] = [
  { id: '1', nickname: 'Bart', totalScore: 4800, rank: 1, rankChange: 1 },
  { id: '2', nickname: 'Lisa', totalScore: 4500, rank: 2, rankChange: -1 },
  { id: '3', nickname: 'Max', totalScore: 3900, rank: 3, rankChange: 0 },
  { id: '4', nickname: 'Sophie', totalScore: 3200, rank: 4, rankChange: 2 },
  { id: '5', nickname: 'Daan', totalScore: 2800, rank: 5, rankChange: -1 },
  { id: '6', nickname: 'Emma', totalScore: 2400, rank: 6, rankChange: -1 },
  { id: '7', nickname: 'Liam', totalScore: 1900, rank: 7, rankChange: 0 },
];

const meta: Meta<BzmRoundIntermissionComponent> = {
  title: 'Organisms/RoundIntermission',
  component: BzmRoundIntermissionComponent,
  tags: ['autodocs'],
  argTypes: {
    roundNumber: { control: 'number' },
    totalRounds: { control: 'number' },
    nextMode: { control: 'text' },
    nextModeIcon: { control: 'text' },
    countdownSeconds: { control: 'number' },
    maxStandings: { control: 'number' },
  },
  args: {
    roundNumber: 2,
    totalRounds: 5,
    nextMode: 'Blitz',
    nextModeIcon: 'lightning',
    standings: sampleStandings.slice(0, 5),
    countdownSeconds: 15,
    maxStandings: 5,
  },
};

export default meta;
type Story = StoryObj<BzmRoundIntermissionComponent>;

export const Default: Story = {};

export const LastRound: Story = {
  args: {
    roundNumber: 5,
    totalRounds: 5,
    nextMode: 'Eindstand',
    nextModeIcon: 'trophy',
  },
};

export const LargeStandings: Story = {
  args: {
    standings: sampleStandings,
    maxStandings: 7,
  },
};

export const ShortCountdown: Story = {
  args: {
    countdownSeconds: 5,
  },
};

export const ManyRankChanges: Story = {
  args: {
    standings: [
      { id: '1', nickname: 'Bart', totalScore: 5200, rank: 1, rankChange: 3 },
      { id: '2', nickname: 'Lisa', totalScore: 4800, rank: 2, rankChange: -1 },
      { id: '3', nickname: 'Max', totalScore: 4100, rank: 3, rankChange: -2 },
      { id: '4', nickname: 'Sophie', totalScore: 3600, rank: 4, rankChange: 2 },
      { id: '5', nickname: 'Daan', totalScore: 3000, rank: 5, rankChange: -2 },
    ],
  },
};
