import type { Meta, StoryObj } from '@storybook/angular';
import { BzmSpectatorVoteComponent } from './spectator-vote.component';
import type { VoteOption } from './spectator-vote.component';

const categoryOptions: VoteOption[] = [
  { id: 'science', label: 'Wetenschap', icon: 'atom', votes: 12 },
  { id: 'history', label: 'Geschiedenis', icon: 'clock-clockwise', votes: 8 },
  { id: 'music', label: 'Muziek', icon: 'music-note', votes: 15 },
  { id: 'sports', label: 'Sport', icon: 'soccer-ball', votes: 6 },
];

const powerUpOptions: VoteOption[] = [
  { id: 'double', label: 'Dubbele punten', icon: 'lightning', votes: 20 },
  { id: 'freeze', label: 'Extra tijd', icon: 'snowflake', votes: 14 },
  { id: 'shield', label: 'Bescherming', icon: 'shield', votes: 9 },
];

const meta: Meta<BzmSpectatorVoteComponent> = {
  title: 'Molecules/SpectatorVote',
  component: BzmSpectatorVoteComponent,
  argTypes: {
    question: { control: 'text' },
    hasVoted: { control: 'boolean' },
    timeRemaining: { control: { type: 'range', min: 0, max: 10, step: 1 } },
    showResults: { control: 'boolean' },
  },
  args: {
    question: 'Welke categorie komt hierna?',
    options: categoryOptions,
    hasVoted: false,
    timeRemaining: 10,
    showResults: false,
  },
  decorators: [
    (story) => ({
      ...story(),
      styles: [`:host { display: block; max-width: 400px; }`],
    }),
  ],
};

export default meta;
type Story = StoryObj<BzmSpectatorVoteComponent>;

export const VotingOpen: Story = {
  args: {
    question: 'Welke categorie komt hierna?',
    options: categoryOptions.map((o) => ({ ...o, votes: 0 })),
    hasVoted: false,
    timeRemaining: 10,
    showResults: false,
  },
};

export const AfterVoting: Story = {
  args: {
    question: 'Welke categorie komt hierna?',
    options: categoryOptions,
    hasVoted: true,
    timeRemaining: 6,
    showResults: false,
  },
};

export const ShowResults: Story = {
  args: {
    question: 'Welke categorie komt hierna?',
    options: categoryOptions,
    hasVoted: true,
    timeRemaining: 0,
    showResults: true,
  },
};

export const CategoryVote: Story = {
  args: {
    question: 'Kies de volgende categorie!',
    options: [
      { id: 'nature', label: 'Natuur', icon: 'tree', votes: 7 },
      { id: 'movies', label: 'Films', icon: 'film-strip', votes: 11 },
      { id: 'food', label: 'Eten & Drinken', icon: 'fork-knife', votes: 5 },
    ],
    hasVoted: true,
    timeRemaining: 3,
    showResults: true,
  },
};

export const PowerUpVote: Story = {
  args: {
    question: 'Welke power-up voor de volgende ronde?',
    options: powerUpOptions,
    hasVoted: false,
    timeRemaining: 8,
    showResults: false,
  },
};
