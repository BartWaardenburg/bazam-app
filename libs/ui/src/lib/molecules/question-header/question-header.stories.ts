import type { Meta, StoryObj } from '@storybook/angular';
import { BzmQuestionHeaderComponent } from './question-header.component';

const meta: Meta<BzmQuestionHeaderComponent> = {
  title: 'Molecules/QuestionHeader',
  component: BzmQuestionHeaderComponent,
  tags: ['autodocs'],
  argTypes: {
    questionText: { control: 'text' },
    showTimer: { control: 'boolean' },
    timerDuration: { control: 'number' },
    timerRunning: { control: 'boolean' },
  },
  args: {
    questionText: 'Wat is de hoofdstad van Frankrijk?',
    showTimer: true,
    timerDuration: 30,
    timerRunning: false,
  },
  decorators: [
    (story) => ({
      ...story(),
      styles: [`:host { display: block; max-width: 600px; }`],
    }),
  ],
};

export default meta;
type Story = StoryObj<BzmQuestionHeaderComponent>;

export const Default: Story = {};

export const Running: Story = {
  args: { timerRunning: true },
};

export const WithoutTimer: Story = {
  args: { showTimer: false },
};

export const LongQuestion: Story = {
  args: {
    questionText: 'Welk land heeft het grootste oppervlak ter wereld en strekt zich uit over twee continenten?',
    timerDuration: 45,
  },
};

export const ShortTimer: Story = {
  args: {
    questionText: 'Snelle vraag!',
    timerDuration: 10,
    timerRunning: true,
  },
};
