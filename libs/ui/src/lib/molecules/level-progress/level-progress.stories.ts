import type { Meta, StoryObj } from '@storybook/angular';
import { BzmLevelProgressComponent } from './level-progress.component';

const meta: Meta<BzmLevelProgressComponent> = {
  title: 'Molecules/LevelProgress',
  component: BzmLevelProgressComponent,
  tags: ['autodocs'],
  argTypes: {
    progress: { control: { type: 'range', min: 0, max: 100, step: 1 } },
    xp: { control: 'number' },
    label: { control: 'text' },
  },
  decorators: [
    (story) => ({
      ...story(),
      styles: [`
        :host { display: block; max-width: 400px; width: 100%; }
      `],
    }),
  ],
};

export default meta;
type Story = StoryObj<BzmLevelProgressComponent>;

export const Default: Story = {
  args: {
    progress: 65,
    xp: 323,
    label: 'My Level Progress',
  },
};

export const Empty: Story = {
  args: {
    progress: 0,
    xp: 0,
    label: 'My Level Progress',
  },
};

export const HalfWay: Story = {
  args: {
    progress: 50,
    xp: 500,
    label: 'Level 3',
  },
};

export const AlmostComplete: Story = {
  args: {
    progress: 92,
    xp: 920,
    label: 'Level 5 Progress',
  },
};

export const Complete: Story = {
  args: {
    progress: 100,
    xp: 1000,
    label: 'Level Complete!',
  },
};

export const CustomLabel: Story = {
  args: {
    progress: 40,
    xp: 245,
    label: 'Weekly Challenge',
  },
};

export const HighXP: Story = {
  args: {
    progress: 78,
    xp: 12450,
    label: 'Season Progress',
  },
};

export const AllVariants: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 24px; max-width: 400px;">
        <bzm-level-progress [progress]="0" [xp]="0" label="Just Started" />
        <bzm-level-progress [progress]="25" [xp]="125" label="Getting There" />
        <bzm-level-progress [progress]="50" [xp]="250" label="Halfway" />
        <bzm-level-progress [progress]="75" [xp]="375" label="Almost There" />
        <bzm-level-progress [progress]="100" [xp]="500" label="Complete!" />
      </div>
    `,
    moduleMetadata: {
      imports: [BzmLevelProgressComponent],
    },
  }),
};
