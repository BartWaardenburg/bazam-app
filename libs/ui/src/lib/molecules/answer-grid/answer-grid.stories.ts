import type { Meta, StoryObj } from '@storybook/angular';
import { BzmAnswerGridComponent, AnswerGridItem } from './answer-grid.component';

const defaultAnswers: AnswerGridItem[] = [
  { text: 'De Eiffeltoren' },
  { text: 'Het Colosseum' },
  { text: 'Big Ben' },
  { text: 'Sagrada Familia' },
];

const meta: Meta<BzmAnswerGridComponent> = {
  title: 'Molecules/AnswerGrid',
  component: BzmAnswerGridComponent,
  tags: ['autodocs'],
  argTypes: {
    disabled: { control: 'boolean' },
  },
  args: {
    answers: defaultAnswers,
    disabled: false,
  },
  decorators: [
    (story) => ({
      ...story(),
      styles: [`:host { display: block; max-width: 600px; }`],
    }),
  ],
};

export default meta;
type Story = StoryObj<BzmAnswerGridComponent>;

export const Default: Story = {};

export const WithSelection: Story = {
  args: {
    answers: [
      { text: 'De Eiffeltoren', selected: true },
      { text: 'Het Colosseum' },
      { text: 'Big Ben' },
      { text: 'Sagrada Familia' },
    ],
  },
};

export const ShowingResults: Story = {
  args: {
    answers: [
      { text: 'De Eiffeltoren', selected: true, correct: true },
      { text: 'Het Colosseum', correct: false },
      { text: 'Big Ben', correct: false },
      { text: 'Sagrada Familia', correct: false },
    ],
  },
};

export const WrongAnswer: Story = {
  args: {
    answers: [
      { text: 'De Eiffeltoren', correct: true },
      { text: 'Het Colosseum' },
      { text: 'Big Ben', selected: true, correct: false },
      { text: 'Sagrada Familia' },
    ],
  },
};

export const Disabled: Story = {
  args: { disabled: true },
};

export const AllStates: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 32px; max-width: 600px;">
        <div>
          <p style="font-family: var(--bzm-font-family); font-weight: 700; margin: 0 0 8px;">Onbeantwoord</p>
          <bzm-answer-grid [answers]="defaultAnswers" />
        </div>
        <div>
          <p style="font-family: var(--bzm-font-family); font-weight: 700; margin: 0 0 8px;">Geselecteerd</p>
          <bzm-answer-grid [answers]="selectedAnswers" />
        </div>
        <div>
          <p style="font-family: var(--bzm-font-family); font-weight: 700; margin: 0 0 8px;">Goed antwoord</p>
          <bzm-answer-grid [answers]="correctAnswers" />
        </div>
        <div>
          <p style="font-family: var(--bzm-font-family); font-weight: 700; margin: 0 0 8px;">Fout antwoord</p>
          <bzm-answer-grid [answers]="wrongAnswers" />
        </div>
      </div>
    `,
    props: {
      defaultAnswers,
      selectedAnswers: [
        { text: 'De Eiffeltoren', selected: true },
        { text: 'Het Colosseum' },
        { text: 'Big Ben' },
        { text: 'Sagrada Familia' },
      ],
      correctAnswers: [
        { text: 'De Eiffeltoren', selected: true, correct: true },
        { text: 'Het Colosseum' },
        { text: 'Big Ben' },
        { text: 'Sagrada Familia' },
      ],
      wrongAnswers: [
        { text: 'De Eiffeltoren', correct: true },
        { text: 'Het Colosseum' },
        { text: 'Big Ben', selected: true, correct: false },
        { text: 'Sagrada Familia' },
      ],
    },
    moduleMetadata: {
      imports: [BzmAnswerGridComponent],
    },
  }),
};
