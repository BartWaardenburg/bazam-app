import type { Meta, StoryObj } from '@storybook/angular';
import { BzmScoreBreakdownComponent } from './score-breakdown.component';

const meta: Meta<BzmScoreBreakdownComponent> = {
  title: 'Molecules/ScoreBreakdown',
  component: BzmScoreBreakdownComponent,
  tags: ['autodocs'],
  argTypes: {
    basePoints: { control: { type: 'select' }, options: [100, 250, 500] },
    categoryMult: { control: { type: 'select' }, options: [1.0, 1.5, 2.5] },
    brainMults: { control: 'object' },
    comboBonus: { control: { type: 'number', min: 1, max: 5, step: 0.5 } },
    totalScore: { control: 'number' },
    animated: { control: 'boolean' },
  },
  args: {
    basePoints: 100,
    categoryMult: 1.5,
    brainMults: [{ name: 'Science Brain', value: 2.0 }],
    comboBonus: 1.0,
    totalScore: 300,
    animated: false,
  },
  decorators: [
    (story) => ({
      ...story(),
      styles: [`:host { display: block; max-width: 400px; }`],
    }),
  ],
};

export default meta;
type Story = StoryObj<BzmScoreBreakdownComponent>;

export const Simple: Story = {
  args: {
    basePoints: 100,
    categoryMult: 1.0,
    brainMults: [],
    comboBonus: 1.0,
    totalScore: 100,
    animated: false,
  },
};

export const WithCategoryMultiplier: Story = {
  args: {
    basePoints: 100,
    categoryMult: 1.5,
    brainMults: [],
    comboBonus: 1.0,
    totalScore: 150,
    animated: false,
  },
};

export const WithBrain: Story = {
  args: {
    basePoints: 100,
    categoryMult: 1.5,
    brainMults: [{ name: 'Science Brain', value: 2.0 }],
    comboBonus: 1.0,
    totalScore: 300,
    animated: false,
  },
};

export const WithMultipleBrains: Story = {
  args: {
    basePoints: 250,
    categoryMult: 2.5,
    brainMults: [
      { name: 'Science Brain', value: 1.5 },
      { name: 'Galaxy Brain', value: 2.0 },
    ],
    comboBonus: 1.0,
    totalScore: 1875,
    animated: false,
  },
};

export const WithCombo: Story = {
  args: {
    basePoints: 100,
    categoryMult: 1.5,
    brainMults: [{ name: 'Nature Brain', value: 2.0 }],
    comboBonus: 3.0,
    totalScore: 900,
    animated: false,
  },
};

export const FullStack: Story = {
  args: {
    basePoints: 500,
    categoryMult: 2.5,
    brainMults: [
      { name: 'History Brain', value: 1.5 },
      { name: 'Galaxy Brain', value: 2.0 },
    ],
    comboBonus: 3.0,
    totalScore: 11250,
    animated: false,
  },
};

export const Animated: Story = {
  args: {
    basePoints: 100,
    categoryMult: 1.5,
    brainMults: [{ name: 'Science Brain', value: 2.0 }],
    comboBonus: 3.0,
    totalScore: 900,
    animated: true,
  },
};

export const HighDifficulty: Story = {
  args: {
    basePoints: 500,
    categoryMult: 1.0,
    brainMults: [],
    comboBonus: 1.0,
    totalScore: 500,
    animated: false,
  },
};

export const AllVariants: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 24px; max-width: 400px;">
        <h4 style="margin: 0; font-family: sans-serif; color: #666;">Simple (no multipliers)</h4>
        <bzm-score-breakdown
          [basePoints]="100"
          [categoryMult]="1.0"
          [brainMults]="[]"
          [totalScore]="100"
        />

        <h4 style="margin: 0; font-family: sans-serif; color: #666;">Category + Brain</h4>
        <bzm-score-breakdown
          [basePoints]="100"
          [categoryMult]="1.5"
          [brainMults]="[{ name: 'Science Brain', value: 2.0 }]"
          [totalScore]="300"
        />

        <h4 style="margin: 0; font-family: sans-serif; color: #666;">Full stack (animated)</h4>
        <bzm-score-breakdown
          [basePoints]="250"
          [categoryMult]="2.5"
          [brainMults]="[{ name: 'History Brain', value: 1.5 }, { name: 'Galaxy Brain', value: 2.0 }]"
          [comboBonus]="3.0"
          [totalScore]="5625"
          [animated]="true"
        />
      </div>
    `,
    moduleMetadata: {
      imports: [BzmScoreBreakdownComponent],
    },
  }),
};
