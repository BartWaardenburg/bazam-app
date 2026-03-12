import type { Meta, StoryObj } from '@storybook/angular';
import { BzmPartyProgressComponent, PartyRound } from './party-progress.component';

const makeRounds = (count: number, activeIndex: number): PartyRound[] =>
  Array.from({ length: count }, (_, i) => ({
    id: `round-${i + 1}`,
    roundNumber: i + 1,
    mode: ['Klassiek', 'Blitz', 'Survival', 'Team Battle', 'Boss Battle'][i % 5],
    modeIcon: ['game-controller', 'lightning', 'heart-half', 'users-three', 'skull'][i % 5],
    status: i < activeIndex ? 'completed' as const : i === activeIndex ? 'active' as const : 'upcoming' as const,
    winnerName: i < activeIndex ? ['Bart', 'Lisa', 'Max', 'Sophie', 'Daan'][i % 5] : undefined,
  }));

const meta: Meta<BzmPartyProgressComponent> = {
  title: 'Molecules/PartyProgress',
  component: BzmPartyProgressComponent,
  tags: ['autodocs'],
  argTypes: {
    currentRound: { control: 'number' },
    totalRounds: { control: 'number' },
  },
  decorators: [
    (story) => ({
      ...story(),
      styles: [`:host { display: block; max-width: 600px; padding: 24px; }`],
    }),
  ],
};

export default meta;
type Story = StoryObj<BzmPartyProgressComponent>;

export const ThreeRounds: Story = {
  args: {
    rounds: makeRounds(3, 1),
    currentRound: 2,
    totalRounds: 3,
  },
};

export const FiveRounds: Story = {
  args: {
    rounds: makeRounds(5, 2),
    currentRound: 3,
    totalRounds: 5,
  },
};

export const FirstRound: Story = {
  args: {
    rounds: makeRounds(5, 0),
    currentRound: 1,
    totalRounds: 5,
  },
};

export const MiddleRound: Story = {
  args: {
    rounds: makeRounds(5, 2),
    currentRound: 3,
    totalRounds: 5,
  },
};

export const LastRound: Story = {
  args: {
    rounds: makeRounds(5, 4),
    currentRound: 5,
    totalRounds: 5,
  },
};

export const AllComplete: Story = {
  args: {
    rounds: makeRounds(5, 5).map((r) => ({ ...r, status: 'completed' as const, winnerName: 'Bart' })),
    currentRound: 5,
    totalRounds: 5,
  },
};
