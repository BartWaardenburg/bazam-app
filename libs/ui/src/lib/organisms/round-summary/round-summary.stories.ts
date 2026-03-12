import type { Meta, StoryObj } from '@storybook/angular';
import { BzmRoundSummaryComponent, QuestionResult } from './round-summary.component';

const passedQuestions: QuestionResult[] = [
  { category: 'Aardrijkskunde', correct: true, score: 350, timeSeconds: 4, streak: 1 },
  { category: 'Geschiedenis', correct: true, score: 400, timeSeconds: 3, streak: 2 },
  { category: 'Wetenschap', correct: true, score: 450, timeSeconds: 2, streak: 3 },
  { category: 'Sport', correct: false, score: 0, timeSeconds: 8, streak: 0 },
  { category: 'Muziek', correct: true, score: 300, timeSeconds: 5, streak: 1 },
];

const failedQuestions: QuestionResult[] = [
  { category: 'Wiskunde', correct: true, score: 250, timeSeconds: 6, streak: 1 },
  { category: 'Natuur', correct: false, score: 0, timeSeconds: 10, streak: 0 },
  { category: 'Kunst', correct: false, score: 0, timeSeconds: 9, streak: 0 },
  { category: 'Taal', correct: true, score: 200, timeSeconds: 7, streak: 1 },
  { category: 'Technologie', correct: false, score: 0, timeSeconds: 10, streak: 0 },
];

const streakQuestions: QuestionResult[] = [
  { category: 'Aardrijkskunde', correct: true, score: 350, timeSeconds: 3, streak: 1 },
  { category: 'Geschiedenis', correct: true, score: 400, timeSeconds: 2, streak: 2 },
  { category: 'Wetenschap', correct: true, score: 500, timeSeconds: 2, streak: 3 },
  { category: 'Sport', correct: true, score: 550, timeSeconds: 1, streak: 4 },
  { category: 'Muziek', correct: true, score: 600, timeSeconds: 1, streak: 5 },
];

const meta: Meta<BzmRoundSummaryComponent> = {
  title: 'Organisms/RoundSummary',
  component: BzmRoundSummaryComponent,
  tags: ['autodocs'],
  argTypes: {
    roundType: {
      control: { type: 'select' },
      options: ['warmup', 'challenge', 'boss'],
    },
    passed: { control: 'boolean' },
  },
  decorators: [
    (story) => ({
      ...story(),
      styles: [`:host { display: block; max-width: 520px; padding: 24px; }`],
    }),
  ],
};

export default meta;
type Story = StoryObj<BzmRoundSummaryComponent>;

export const WarmupPassed: Story = {
  args: {
    roundType: 'warmup',
    currentScore: 1500,
    targetScore: 1200,
    passed: true,
    questions: passedQuestions,
    comboName: null,
    comboBonus: 0,
    bossModifier: null,
  },
};

export const ChallengeFailed: Story = {
  args: {
    roundType: 'challenge',
    currentScore: 450,
    targetScore: 1000,
    passed: false,
    questions: failedQuestions,
    comboName: null,
    comboBonus: 0,
    bossModifier: null,
  },
};

export const BossRoundPassed: Story = {
  args: {
    roundType: 'boss',
    currentScore: 2400,
    targetScore: 2000,
    passed: true,
    questions: streakQuestions,
    comboName: 'Speed Demon',
    comboBonus: 500,
    bossModifier: 'Halve Tijd',
  },
};

export const BossRoundFailed: Story = {
  args: {
    roundType: 'boss',
    currentScore: 800,
    targetScore: 2000,
    passed: false,
    questions: failedQuestions,
    comboName: null,
    comboBonus: 0,
    bossModifier: 'Omgekeerde Antwoorden',
  },
};

export const WithComboBonus: Story = {
  args: {
    roundType: 'challenge',
    currentScore: 1800,
    targetScore: 1500,
    passed: true,
    questions: passedQuestions,
    comboName: 'Perfect Round',
    comboBonus: 750,
    bossModifier: null,
  },
};

export const LongStreak: Story = {
  args: {
    roundType: 'warmup',
    currentScore: 2400,
    targetScore: 1000,
    passed: true,
    questions: streakQuestions,
    comboName: 'Knowledge Storm',
    comboBonus: 300,
    bossModifier: null,
  },
};

export const BarelyPassed: Story = {
  args: {
    roundType: 'challenge',
    currentScore: 1010,
    targetScore: 1000,
    passed: true,
    questions: [
      { category: 'Algemeen', correct: true, score: 510, timeSeconds: 9, streak: 1 },
      { category: 'Film', correct: false, score: 0, timeSeconds: 10, streak: 0 },
      { category: 'Koken', correct: true, score: 500, timeSeconds: 8, streak: 1 },
    ],
    comboName: null,
    comboBonus: 0,
    bossModifier: null,
  },
};
