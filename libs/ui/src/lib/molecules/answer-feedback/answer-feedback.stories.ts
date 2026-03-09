import type { Meta, StoryObj } from '@storybook/angular';
import { BzmAnswerFeedbackComponent } from './answer-feedback.component';

const meta: Meta<BzmAnswerFeedbackComponent> = {
  title: 'Molecules/AnswerFeedback',
  component: BzmAnswerFeedbackComponent,
  tags: ['autodocs'],
  argTypes: {
    correct: { control: 'boolean' },
    score: { control: 'number' },
    correctTitle: { control: 'text' },
    incorrectTitle: { control: 'text' },
    incorrectMessage: { control: 'text' },
  },
  args: {
    correct: true,
    score: 850,
  },
  decorators: [
    (story) => ({
      ...story(),
      styles: [`:host { display: block; max-width: 400px; }`],
    }),
  ],
};

export default meta;
type Story = StoryObj<BzmAnswerFeedbackComponent>;

export const Correct: Story = {
  args: { correct: true, score: 850 },
};

export const Incorrect: Story = {
  args: { correct: false },
};

export const HighScore: Story = {
  args: { correct: true, score: 1000 },
};

export const CustomMessages: Story = {
  args: {
    correct: false,
    incorrectTitle: 'Fout!',
    incorrectMessage: 'Het juiste antwoord was Parijs.',
  },
};

export const CorrectWithMascot: Story = {
  name: 'Correct (Happy Mascot)',
  args: { correct: true, score: 750 },
};

export const IncorrectWithMascot: Story = {
  name: 'Incorrect (Sad Mascot)',
  args: { correct: false, incorrectMessage: 'Volgende keer beter!' },
};

export const BothStates: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px; max-width: 400px;">
        <bzm-answer-feedback [correct]="true" [score]="850" />
        <bzm-answer-feedback [correct]="false" />
      </div>
    `,
    moduleMetadata: {
      imports: [BzmAnswerFeedbackComponent],
    },
  }),
};
