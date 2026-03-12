import type { Meta, StoryObj } from '@storybook/angular';
import { BzmRoundTargetComponent } from './round-target.component';

const meta: Meta<BzmRoundTargetComponent> = {
  title: 'Molecules/RoundTarget',
  component: BzmRoundTargetComponent,
  tags: ['autodocs'],
  argTypes: {
    currentScore: { control: 'number' },
    targetScore: { control: 'number' },
    roundType: {
      control: { type: 'select' },
      options: ['warmup', 'challenge', 'boss'],
    },
    passed: {
      control: { type: 'select' },
      options: [null, true, false],
    },
  },
  decorators: [
    (story) => ({
      ...story(),
      styles: [`:host { display: block; max-width: 400px; }`],
    }),
  ],
};

export default meta;
type Story = StoryObj<BzmRoundTargetComponent>;

export const WarmupInProgress: Story = {
  args: {
    currentScore: 200,
    targetScore: 400,
    roundType: 'warmup',
    passed: null,
  },
};

export const ChallengeInProgress: Story = {
  args: {
    currentScore: 450,
    targetScore: 600,
    roundType: 'challenge',
    passed: null,
  },
};

export const BossInProgress: Story = {
  args: {
    currentScore: 300,
    targetScore: 800,
    roundType: 'boss',
    passed: null,
  },
};

export const WarmupPassed: Story = {
  args: {
    currentScore: 500,
    targetScore: 400,
    roundType: 'warmup',
    passed: true,
  },
};

export const ChallengePassed: Story = {
  args: {
    currentScore: 650,
    targetScore: 600,
    roundType: 'challenge',
    passed: true,
  },
};

export const BossPassed: Story = {
  args: {
    currentScore: 850,
    targetScore: 800,
    roundType: 'boss',
    passed: true,
  },
};

export const WarmupFailed: Story = {
  args: {
    currentScore: 250,
    targetScore: 400,
    roundType: 'warmup',
    passed: false,
  },
};

export const ChallengeFailed: Story = {
  args: {
    currentScore: 320,
    targetScore: 600,
    roundType: 'challenge',
    passed: false,
  },
};

export const BossFailed: Story = {
  args: {
    currentScore: 400,
    targetScore: 800,
    roundType: 'boss',
    passed: false,
  },
};

export const ZeroProgress: Story = {
  args: {
    currentScore: 0,
    targetScore: 600,
    roundType: 'challenge',
    passed: null,
  },
};

export const AllRoundTypes: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px; max-width: 400px;">
        <bzm-round-target [currentScore]="200" [targetScore]="400" roundType="warmup" />
        <bzm-round-target [currentScore]="450" [targetScore]="600" roundType="challenge" />
        <bzm-round-target [currentScore]="300" [targetScore]="800" roundType="boss" />
      </div>
    `,
    moduleMetadata: {
      imports: [BzmRoundTargetComponent],
    },
  }),
};

export const AllStates: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px; max-width: 400px;">
        <bzm-round-target [currentScore]="300" [targetScore]="600" roundType="challenge" />
        <bzm-round-target [currentScore]="650" [targetScore]="600" roundType="challenge" [passed]="true" />
        <bzm-round-target [currentScore]="200" [targetScore]="600" roundType="challenge" [passed]="false" />
      </div>
    `,
    moduleMetadata: {
      imports: [BzmRoundTargetComponent],
    },
  }),
};
