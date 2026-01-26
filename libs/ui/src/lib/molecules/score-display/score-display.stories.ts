import type { Meta, StoryObj } from '@storybook/angular';
import { BzmScoreDisplayComponent } from './score-display.component';

const meta: Meta<BzmScoreDisplayComponent> = {
  title: 'Molecules/ScoreDisplay',
  component: BzmScoreDisplayComponent,
  tags: ['autodocs'],
  argTypes: {
    value: { control: 'text' },
    label: { control: 'text' },
    suffix: { control: 'text' },
    size: { control: 'select', options: ['md', 'lg'] },
    color: { control: 'color' },
  },
  args: {
    value: '1250',
    label: 'Score',
    size: 'md',
    color: 'var(--bzm-color-accent)',
  },
};

export default meta;
type Story = StoryObj<BzmScoreDisplayComponent>;

export const Default: Story = {};

export const WithSuffix: Story = {
  args: { value: 1250, label: 'Totaal', suffix: 'punten' },
};

export const Rank: Story = {
  args: {
    value: '#1',
    label: 'Positie',
    color: 'var(--bzm-color-primary)',
    size: 'lg',
  },
};

export const Large: Story = {
  args: { size: 'lg', value: 5000 },
};

export const AllExamples: Story = {
  render: () => ({
    template: `
      <div style="display: flex; gap: 32px; justify-content: center; flex-wrap: wrap;">
        <bzm-score-display value="1250" label="Score" suffix="punten" />
        <bzm-score-display value="#1" label="Positie" color="var(--bzm-color-primary)" size="lg" />
        <bzm-score-display value="8/10" label="Goed" color="var(--bzm-color-success)" />
        <bzm-score-display value="42s" label="Snelste" color="var(--bzm-color-answer-a)" />
      </div>
    `,
    moduleMetadata: {
      imports: [BzmScoreDisplayComponent],
    },
  }),
};
