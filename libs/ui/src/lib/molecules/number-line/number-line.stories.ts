import type { Meta, StoryObj } from '@storybook/angular';
import { BzmNumberLineComponent, NumberLineGuess } from './number-line.component';

const sampleGuesses: NumberLineGuess[] = [
  { id: '1', nickname: 'Bart', guess: 35 },
  { id: '2', nickname: 'Lisa', guess: 48 },
  { id: '3', nickname: 'Max', guess: 62 },
  { id: '4', nickname: 'Sophie', guess: 20 },
];

const meta: Meta<BzmNumberLineComponent> = {
  title: 'Molecules/NumberLine',
  component: BzmNumberLineComponent,
  tags: ['autodocs'],
  argTypes: {
    correctAnswer: { control: 'number' },
    min: { control: 'number' },
    max: { control: 'number' },
    showAnswer: { control: 'boolean' },
    highlightWinnerId: { control: 'text' },
  },
  args: {
    guesses: sampleGuesses,
    correctAnswer: 42,
    min: 0,
    max: 100,
    showAnswer: false,
    highlightWinnerId: null,
  },
  decorators: [
    (story) => ({
      ...story(),
      styles: [`:host { display: block; max-width: 600px; padding: 24px; }`],
    }),
  ],
  render: (args) => ({
    props: args,
    template: `
      <bzm-number-line
        [guesses]="guesses"
        [correctAnswer]="correctAnswer"
        [min]="min"
        [max]="max"
        [showAnswer]="showAnswer"
        [highlightWinnerId]="highlightWinnerId"
      />
    `,
  }),
};

export default meta;
type Story = StoryObj<BzmNumberLineComponent>;

export const BeforeReveal: Story = {};

export const AfterReveal: Story = {
  args: {
    showAnswer: true,
    highlightWinnerId: '1',
  },
};

export const CloseGuesses: Story = {
  args: {
    guesses: [
      { id: '1', nickname: 'Bart', guess: 40 },
      { id: '2', nickname: 'Lisa', guess: 43 },
      { id: '3', nickname: 'Max', guess: 41 },
    ],
    correctAnswer: 42,
    showAnswer: true,
    highlightWinnerId: '3',
  },
};

export const WideSpread: Story = {
  args: {
    guesses: [
      { id: '1', nickname: 'Bart', guess: 5 },
      { id: '2', nickname: 'Lisa', guess: 95 },
      { id: '3', nickname: 'Max', guess: 50 },
    ],
    correctAnswer: 73,
    min: 0,
    max: 100,
    showAnswer: true,
    highlightWinnerId: '2',
  },
};

export const SinglePlayer: Story = {
  args: {
    guesses: [{ id: '1', nickname: 'Bart', guess: 55 }],
    correctAnswer: 42,
    showAnswer: true,
    highlightWinnerId: '1',
  },
};

export const ManyPlayers: Story = {
  args: {
    guesses: [
      { id: '1', nickname: 'Bart', guess: 12 },
      { id: '2', nickname: 'Lisa', guess: 28 },
      { id: '3', nickname: 'Max', guess: 45 },
      { id: '4', nickname: 'Sophie', guess: 51 },
      { id: '5', nickname: 'Daan', guess: 67 },
      { id: '6', nickname: 'Emma', guess: 82 },
      { id: '7', nickname: 'Noah', guess: 91 },
    ],
    correctAnswer: 50,
    min: 0,
    max: 100,
    showAnswer: true,
    highlightWinnerId: '4',
  },
};
