import type { Meta, StoryObj } from '@storybook/angular';
import { BzmTeamScoreboardComponent, TeamScore } from './team-scoreboard.component';

const twoTeamScores: TeamScore[] = [
  {
    id: 'red', name: 'Rood', color: '#ef4444', icon: 'fire', score: 4200, rank: 1,
    players: [
      { nickname: 'Bart', score: 1800 },
      { nickname: 'Lisa', score: 1400 },
      { nickname: 'Daan', score: 1000 },
    ],
    mvp: 'Bart',
  },
  {
    id: 'blue', name: 'Blauw', color: '#3b82f6', icon: 'drop', score: 3800, rank: 2,
    players: [
      { nickname: 'Sophie', score: 1600 },
      { nickname: 'Max', score: 1200 },
      { nickname: 'Emma', score: 1000 },
    ],
    mvp: 'Sophie',
  },
];

const fourTeamScores: TeamScore[] = [
  ...twoTeamScores,
  {
    id: 'green', name: 'Groen', color: '#22c55e', icon: 'tree', score: 3200, rank: 3,
    players: [
      { nickname: 'Noah', score: 1400 },
      { nickname: 'Mila', score: 1000 },
      { nickname: 'Liam', score: 800 },
    ],
    mvp: 'Noah',
  },
  {
    id: 'yellow', name: 'Geel', color: '#eab308', icon: 'sun', score: 2800, rank: 4,
    players: [
      { nickname: 'Julia', score: 1200 },
      { nickname: 'Finn', score: 900 },
      { nickname: 'Eva', score: 700 },
    ],
    mvp: 'Julia',
  },
];

const closeMatchScores: TeamScore[] = [
  {
    id: 'red', name: 'Rood', color: '#ef4444', icon: 'fire', score: 3810, rank: 1,
    players: [
      { nickname: 'Bart', score: 1310 },
      { nickname: 'Lisa', score: 1300 },
      { nickname: 'Daan', score: 1200 },
    ],
    mvp: 'Bart',
  },
  {
    id: 'blue', name: 'Blauw', color: '#3b82f6', icon: 'drop', score: 3800, rank: 2,
    players: [
      { nickname: 'Sophie', score: 1300 },
      { nickname: 'Max', score: 1250 },
      { nickname: 'Emma', score: 1250 },
    ],
    mvp: 'Sophie',
  },
];

const meta: Meta<BzmTeamScoreboardComponent> = {
  title: 'Organisms/TeamScoreboard',
  component: BzmTeamScoreboardComponent,
  tags: ['autodocs'],
  argTypes: {
    showMvp: { control: 'boolean' },
  },
  decorators: [
    (story) => ({
      ...story(),
      styles: [`:host { display: block; max-width: 800px; padding: 24px; }`],
    }),
  ],
};

export default meta;
type Story = StoryObj<BzmTeamScoreboardComponent>;

export const TwoTeams: Story = {
  args: {
    teams: twoTeamScores,
    showMvp: true,
  },
};

export const FourTeams: Story = {
  args: {
    teams: fourTeamScores,
    showMvp: true,
  },
};

export const WithMvp: Story = {
  args: {
    teams: twoTeamScores,
    showMvp: true,
  },
};

export const CloseMatch: Story = {
  args: {
    teams: closeMatchScores,
    showMvp: true,
  },
};
