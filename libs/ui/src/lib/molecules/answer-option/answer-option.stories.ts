import type { Meta, StoryObj } from '@storybook/angular';
import { BzmAnswerOptionComponent } from './answer-option.component';

const meta: Meta<BzmAnswerOptionComponent> = {
  title: 'Molecules/AnswerOption',
  component: BzmAnswerOptionComponent,
  tags: ['autodocs'],
  argTypes: {
    letter: {
      control: { type: 'select' },
      options: ['A', 'B', 'C', 'D'],
    },
    text: { control: 'text' },
    selected: { control: 'boolean' },
    correct: { control: { type: 'select' }, options: [null, true, false] },
    disabled: { control: 'boolean' },
  },
  decorators: [
    (story) => ({
      ...story(),
      styles: [`
        :host { display: block; max-width: 480px; width: 100%; }
      `],
    }),
  ],
};

export default meta;
type Story = StoryObj<BzmAnswerOptionComponent>;

export const Default: Story = {
  args: {
    letter: 'A',
    text: 'The Eiffel Tower',
    selected: false,
    correct: null,
    disabled: false,
  },
};

export const LetterB: Story = {
  args: {
    letter: 'B',
    text: 'The Colosseum',
    selected: false,
    correct: null,
    disabled: false,
  },
};

export const LetterC: Story = {
  args: {
    letter: 'C',
    text: 'Big Ben',
    selected: false,
    correct: null,
    disabled: false,
  },
};

export const LetterD: Story = {
  args: {
    letter: 'D',
    text: 'Sagrada Familia',
    selected: false,
    correct: null,
    disabled: false,
  },
};

export const Selected: Story = {
  args: {
    letter: 'A',
    text: 'The Eiffel Tower',
    selected: true,
    correct: null,
    disabled: false,
  },
};

export const SelectedB: Story = {
  args: {
    letter: 'B',
    text: 'The Colosseum',
    selected: true,
    correct: null,
    disabled: false,
  },
};

export const Correct: Story = {
  args: {
    letter: 'A',
    text: 'The Eiffel Tower',
    selected: true,
    correct: true,
    disabled: false,
  },
};

export const Incorrect: Story = {
  args: {
    letter: 'C',
    text: 'Big Ben',
    selected: true,
    correct: false,
    disabled: false,
  },
};

export const Disabled: Story = {
  args: {
    letter: 'A',
    text: 'The Eiffel Tower',
    selected: false,
    correct: null,
    disabled: true,
  },
};

export const AllLetters: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 12px; max-width: 480px;">
        <bzm-answer-option letter="A" text="The Eiffel Tower" />
        <bzm-answer-option letter="B" text="The Colosseum" />
        <bzm-answer-option letter="C" text="Big Ben" />
        <bzm-answer-option letter="D" text="Sagrada Familia" />
      </div>
    `,
    moduleMetadata: {
      imports: [BzmAnswerOptionComponent],
    },
  }),
};

export const AllStates: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 12px; max-width: 480px;">
        <bzm-answer-option letter="A" text="Default state" />
        <bzm-answer-option letter="B" text="Selected state" [selected]="true" />
        <bzm-answer-option letter="C" text="Correct answer" [selected]="true" [correct]="true" />
        <bzm-answer-option letter="D" text="Incorrect answer" [selected]="true" [correct]="false" />
        <bzm-answer-option letter="A" text="Disabled state" [disabled]="true" />
      </div>
    `,
    moduleMetadata: {
      imports: [BzmAnswerOptionComponent],
    },
  }),
};
