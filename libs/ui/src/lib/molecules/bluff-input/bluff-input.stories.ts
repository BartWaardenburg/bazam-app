import type { Meta, StoryObj } from '@storybook/angular';
import { BzmBluffInputComponent } from './bluff-input.component';

const meta: Meta<BzmBluffInputComponent> = {
  title: 'Molecules/BluffInput',
  component: BzmBluffInputComponent,
  tags: ['autodocs'],
  argTypes: {
    question: { control: 'text' },
    maxLength: { control: 'number' },
    placeholder: { control: 'text' },
    disabled: { control: 'boolean' },
    timeRemaining: { control: { type: 'range', min: 0, max: 30, step: 1 } },
    submitted: { control: 'boolean' },
  },
  args: {
    question: 'Welk land heeft de meeste eilanden ter wereld?',
    maxLength: 80,
    placeholder: 'Verzin een antwoord...',
    disabled: false,
    timeRemaining: 30,
    submitted: false,
  },
  decorators: [
    (story) => ({
      ...story(),
      styles: [`:host { display: block; max-width: 440px; padding: 24px; }`],
    }),
  ],
  render: (args) => ({
    props: args,
    template: `
      <bzm-bluff-input
        [question]="question"
        [maxLength]="maxLength"
        [placeholder]="placeholder"
        [disabled]="disabled"
        [timeRemaining]="timeRemaining"
        [submitted]="submitted"
      />
    `,
  }),
};

export default meta;
type Story = StoryObj<BzmBluffInputComponent>;

export const Default: Story = {};

export const WithQuestion: Story = {
  args: {
    question: 'Wat is de op twee na grootste stad van Luxemburg?',
  },
};

export const Typing: Story = {
  args: {
    question: 'Hoeveel botten heeft een haai?',
    timeRemaining: 22,
  },
};

export const Submitted: Story = {
  args: {
    submitted: true,
  },
};

export const TimeRunningOut: Story = {
  args: {
    timeRemaining: 5,
  },
};

export const MaxLength: Story = {
  args: {
    maxLength: 30,
    question: 'Wat is het langste woord in het Nederlands?',
  },
};
