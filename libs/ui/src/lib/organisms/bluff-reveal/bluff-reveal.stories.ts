import type { Meta, StoryObj } from '@storybook/angular';
import { BzmBluffRevealComponent, BluffOption } from './bluff-reveal.component';

const sampleOptions: BluffOption[] = [
  {
    id: 'a',
    text: 'Zweden',
    isReal: true,
    voterNames: ['Daan', 'Emma'],
    voterCount: 2,
  },
  {
    id: 'b',
    text: 'Indonesie',
    isReal: false,
    authorName: 'Bart',
    voterNames: ['Sophie', 'Max'],
    voterCount: 2,
  },
  {
    id: 'c',
    text: 'Filipijnen',
    isReal: false,
    authorName: 'Lisa',
    voterNames: ['Noah'],
    voterCount: 1,
  },
  {
    id: 'd',
    text: 'Canada',
    isReal: false,
    authorName: 'Max',
    voterNames: [],
    voterCount: 0,
  },
];

const meta: Meta<BzmBluffRevealComponent> = {
  title: 'Organisms/BluffReveal',
  component: BzmBluffRevealComponent,
  tags: ['autodocs'],
  argTypes: {
    question: { control: 'text' },
    phase: { control: 'select', options: ['voting', 'revealing', 'revealed'] },
    selectedOptionId: { control: 'text' },
  },
  args: {
    question: 'Welk land heeft de meeste eilanden ter wereld?',
    options: sampleOptions,
    phase: 'voting',
    selectedOptionId: null,
  },
  decorators: [
    (story) => ({
      ...story(),
      styles: [`:host { display: block; max-width: 520px; padding: 24px; }`],
    }),
  ],
  render: (args) => ({
    props: args,
    template: `
      <bzm-bluff-reveal
        [question]="question"
        [options]="options"
        [phase]="phase"
        [selectedOptionId]="selectedOptionId"
      />
    `,
  }),
};

export default meta;
type Story = StoryObj<BzmBluffRevealComponent>;

export const VotingPhase: Story = {};

export const RevealingPhase: Story = {
  args: {
    phase: 'revealing',
    selectedOptionId: 'b',
  },
};

export const RevealedPhase: Story = {
  args: {
    phase: 'revealed',
    selectedOptionId: 'a',
  },
};

export const ManyOptions: Story = {
  args: {
    options: [
      ...sampleOptions,
      {
        id: 'e',
        text: 'Japan',
        isReal: false,
        authorName: 'Mila',
        voterNames: ['Liam'],
        voterCount: 1,
      },
      {
        id: 'f',
        text: 'Griekenland',
        isReal: false,
        authorName: 'Noah',
        voterNames: [],
        voterCount: 0,
      },
    ],
    phase: 'revealed',
  },
};

export const FewVoters: Story = {
  args: {
    options: [
      {
        id: 'a',
        text: 'Zweden',
        isReal: true,
        voterNames: ['Bart'],
        voterCount: 1,
      },
      {
        id: 'b',
        text: 'Noorwegen',
        isReal: false,
        authorName: 'Lisa',
        voterNames: [],
        voterCount: 0,
      },
    ],
    phase: 'revealed',
  },
};
