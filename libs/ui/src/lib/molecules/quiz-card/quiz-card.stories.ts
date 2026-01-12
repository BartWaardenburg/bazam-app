import type { Meta, StoryObj } from '@storybook/angular';
import { BzmQuizCardComponent } from './quiz-card.component';

const meta: Meta<BzmQuizCardComponent> = {
  title: 'Molecules/QuizCard',
  component: BzmQuizCardComponent,
  tags: ['autodocs'],
  argTypes: {
    title: { control: 'text' },
    subtitle: { control: 'text' },
    questionCount: { control: 'number' },
    imageUrl: { control: 'text' },
    progress: { control: { type: 'range', min: 0, max: 100, step: 1 } },
    color: { control: 'color' },
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
type Story = StoryObj<BzmQuizCardComponent>;

export const Default: Story = {
  args: {
    title: 'World Geography',
    subtitle: 'Countries & Capitals',
    questionCount: 15,
  },
};

export const WithProgress: Story = {
  args: {
    title: 'World Geography',
    subtitle: 'Countries & Capitals',
    questionCount: 15,
    progress: 65,
  },
};

export const WithCustomColor: Story = {
  args: {
    title: 'Science Quiz',
    subtitle: 'Physics & Chemistry',
    questionCount: 20,
    color: '#E74C3C',
  },
};

export const WithImage: Story = {
  args: {
    title: 'Animal Kingdom',
    subtitle: 'Mammals & Reptiles',
    questionCount: 10,
    imageUrl: 'https://placehold.co/128x128/6C5CE7/white?text=AK',
  },
};

export const CompletedProgress: Story = {
  args: {
    title: 'Math Basics',
    subtitle: 'Addition & Subtraction',
    questionCount: 12,
    progress: 100,
    color: '#2ECC71',
  },
};

export const JustStarted: Story = {
  args: {
    title: 'History Quiz',
    subtitle: 'Ancient Civilizations',
    questionCount: 25,
    progress: 8,
    color: '#F9C74F',
  },
};

export const CardList: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 12px; max-width: 400px;">
        <bzm-quiz-card title="World Geography" subtitle="Countries & Capitals" [questionCount]="15" [progress]="65" />
        <bzm-quiz-card title="Science Quiz" subtitle="Physics & Chemistry" [questionCount]="20" color="#E74C3C" />
        <bzm-quiz-card title="Math Basics" subtitle="Addition & Subtraction" [questionCount]="12" [progress]="100" color="#2ECC71" />
        <bzm-quiz-card title="History" subtitle="Ancient Civilizations" [questionCount]="25" [progress]="8" color="#F9C74F" />
      </div>
    `,
    moduleMetadata: {
      imports: [BzmQuizCardComponent],
    },
  }),
};
