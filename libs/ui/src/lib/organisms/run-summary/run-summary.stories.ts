import type { Meta, StoryObj } from '@storybook/angular';
import { BzmRunSummaryComponent, RunStats } from './run-summary.component';

const wonStats: RunStats = {
  finalScore: 4250,
  levelsCompleted: 8,
  totalLevels: 8,
  questionsCorrect: 28,
  questionsTotal: 30,
  longestStreak: 9,
  sparksEarned: 67,
  brainsUsed: ['Turbo Brain', 'Shield Brain'],
  combosTriggered: ['Speed Demon', 'Perfect Round'],
  seedCode: 'BZM-4F2A-X9',
  mode: 'explorer',
  won: true,
};

const lostStats: RunStats = {
  finalScore: 1850,
  levelsCompleted: 4,
  totalLevels: 8,
  questionsCorrect: 14,
  questionsTotal: 20,
  longestStreak: 3,
  sparksEarned: 22,
  brainsUsed: ['Turbo Brain'],
  combosTriggered: [],
  seedCode: 'BZM-7C1B-K3',
  mode: 'champion',
  won: false,
};

const meta: Meta<BzmRunSummaryComponent> = {
  title: 'Organisms/RunSummary',
  component: BzmRunSummaryComponent,
  tags: ['autodocs'],
  argTypes: {},
  decorators: [
    (story) => ({
      ...story(),
      styles: [`:host { display: block; max-width: 520px; padding: 24px; }`],
    }),
  ],
};

export default meta;
type Story = StoryObj<BzmRunSummaryComponent>;

export const Victory: Story = {
  args: {
    stats: wonStats,
    newUnlocks: ['Neon Brain', 'Speed Demon Combo'],
  },
};

export const Defeat: Story = {
  args: {
    stats: lostStats,
    newUnlocks: [],
  },
};

export const ChampionVictory: Story = {
  args: {
    stats: { ...wonStats, mode: 'champion', finalScore: 6100, sparksEarned: 95 },
    newUnlocks: ['Gold Crown'],
  },
};

export const MinimalRun: Story = {
  args: {
    stats: {
      ...lostStats,
      levelsCompleted: 1,
      questionsCorrect: 2,
      questionsTotal: 5,
      longestStreak: 1,
      sparksEarned: 5,
      brainsUsed: [],
      combosTriggered: [],
    },
    newUnlocks: [],
  },
};

export const FullCombos: Story = {
  args: {
    stats: {
      ...wonStats,
      combosTriggered: ['Speed Demon', 'Perfect Round', 'Triple Threat', 'Knowledge Storm', 'Brain Blast'],
    },
    newUnlocks: [],
  },
};

export const ManyUnlocks: Story = {
  args: {
    stats: wonStats,
    newUnlocks: ['Neon Brain', 'Speed Demon Combo', 'Golden Streak Badge', 'Champion Title'],
  },
};
