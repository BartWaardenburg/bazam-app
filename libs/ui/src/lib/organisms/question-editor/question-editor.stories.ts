import type { Meta, StoryObj } from '@storybook/angular';
import { BzmQuestionEditorComponent, QuestionEditorData } from './question-editor.component';

const emptyQuestion: QuestionEditorData = {
  text: '',
  answers: ['', '', '', ''],
  correctIndex: 0,
  timeLimitSeconds: 20,
};

const filledQuestion: QuestionEditorData = {
  text: 'Wat is de hoofdstad van Nederland?',
  answers: ['Berlijn', 'Amsterdam', 'Brussel', 'Parijs'],
  correctIndex: 1,
  timeLimitSeconds: 15,
};

const meta: Meta<BzmQuestionEditorComponent> = {
  title: 'Organisms/QuestionEditor',
  component: BzmQuestionEditorComponent,
  tags: ['autodocs'],
  argTypes: {
    questionNumber: { control: 'number' },
    removable: { control: 'boolean' },
  },
  args: {
    question: filledQuestion,
    questionNumber: 1,
    removable: true,
  },
  decorators: [
    (story) => ({
      ...story(),
      styles: [`:host { display: block; max-width: 600px; padding: 24px; }`],
    }),
  ],
};

export default meta;
type Story = StoryObj<BzmQuestionEditorComponent>;

export const Default: Story = {};

export const Empty: Story = {
  args: { question: emptyQuestion },
};

export const NotRemovable: Story = {
  args: { removable: false },
};

export const SecondQuestion: Story = {
  args: {
    questionNumber: 2,
    question: {
      text: 'Welke taal wordt gebruikt voor web development?',
      answers: ['Python', 'JavaScript', 'C++', 'Java'],
      correctIndex: 1,
      timeLimitSeconds: 20,
    },
  },
};

export const MultipleQuestions: Story = {
  render: () => ({
    props: {
      q1: filledQuestion,
      q2: {
        text: 'Wat doet CSS?',
        answers: ['Database queries', 'Server logica', 'Styling & layout', 'Routing'],
        correctIndex: 2,
        timeLimitSeconds: 15,
      },
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 24px; max-width: 600px;">
        <div style="background: var(--bzm-color-surface); padding: 1.5rem; border: 4px solid var(--bzm-color-border); border-width: 3px 4px 5px 3px; border-radius: 4px; box-shadow: 6px 6px 0 #000;">
          <bzm-question-editor [question]="q1" [questionNumber]="1" />
        </div>
        <div style="background: var(--bzm-color-surface); padding: 1.5rem; border: 4px solid var(--bzm-color-border); border-width: 3px 4px 5px 3px; border-radius: 4px; box-shadow: 6px 6px 0 #000;">
          <bzm-question-editor [question]="q2" [questionNumber]="2" />
        </div>
      </div>
    `,
    moduleMetadata: {
      imports: [BzmQuestionEditorComponent],
    },
  }),
};
