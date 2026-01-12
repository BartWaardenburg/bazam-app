import type { Meta, StoryObj } from '@storybook/angular';
import { BzmQuizListComponent, QuizEntry } from './quiz-list.component';

const sampleQuizzes: QuizEntry[] = [
  {
    title: 'Solar System Explorer',
    subtitle: 'Learn about planets and stars',
    questionCount: 15,
    progress: 60,
    color: 'var(--bzm-color-primary)',
  },
  {
    title: 'Math Challenge',
    subtitle: 'Test your arithmetic skills',
    questionCount: 20,
    color: 'var(--bzm-color-accent)',
  },
  {
    title: 'World Capitals',
    subtitle: 'Geography trivia',
    questionCount: 25,
    progress: 85,
    color: 'var(--bzm-green-500)',
  },
  {
    title: 'Animal Kingdom',
    subtitle: 'Discover amazing animals',
    questionCount: 10,
    color: 'var(--bzm-red-500)',
  },
];

const meta: Meta<BzmQuizListComponent> = {
  title: 'Organisms/QuizList',
  component: BzmQuizListComponent,
  decorators: [
    (story) => ({
      ...story(),
      template: `<div style="max-width: 400px;">${story().template ?? '<bzm-quiz-list [quizzes]="quizzes" (quizSelect)="quizSelect($event)" />'}</div>`,
    }),
  ],
  args: {
    quizzes: sampleQuizzes,
  },
};

export default meta;
type Story = StoryObj<BzmQuizListComponent>;

export const Default: Story = {};

export const SingleQuiz: Story = {
  args: {
    quizzes: [sampleQuizzes[0]],
  },
};

export const WithProgress: Story = {
  args: {
    quizzes: sampleQuizzes.map((q, i) => ({
      ...q,
      progress: (i + 1) * 20,
    })),
  },
};

export const NoProgress: Story = {
  args: {
    quizzes: sampleQuizzes.map(({ progress, ...q }) => q),
  },
};

export const ManyQuizzes: Story = {
  args: {
    quizzes: [
      ...sampleQuizzes,
      { title: 'Music Theory', subtitle: 'Notes and rhythms', questionCount: 12, color: 'var(--bzm-purple-300)' },
      { title: 'History Legends', subtitle: 'Famous historical figures', questionCount: 18, color: 'var(--bzm-yellow-400)' },
    ],
  },
};
