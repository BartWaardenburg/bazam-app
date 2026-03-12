import type { Meta, StoryObj } from '@storybook/angular';
import { BzmImageQuestionComponent } from './image-question.component';

const meta: Meta<BzmImageQuestionComponent> = {
  title: 'Molecules/ImageQuestion',
  component: BzmImageQuestionComponent,
  tags: ['autodocs'],
  argTypes: {
    imageUrl: { control: 'text' },
    imageAlt: { control: 'text' },
    question: { control: 'text' },
    loading: { control: 'boolean' },
    zoomable: { control: 'boolean' },
  },
  args: {
    imageUrl: 'https://picsum.photos/seed/bazam/600/400',
    imageAlt: 'Een willekeurige afbeelding',
    question: 'Wat zie je op deze foto?',
    loading: false,
    zoomable: true,
  },
  decorators: [
    (story) => ({
      ...story(),
      styles: [`:host { display: block; max-width: 480px; padding: 24px; }`],
    }),
  ],
  render: (args) => ({
    props: args,
    template: `
      <bzm-image-question
        [imageUrl]="imageUrl"
        [imageAlt]="imageAlt"
        [question]="question"
        [loading]="loading"
        [zoomable]="zoomable"
      />
    `,
  }),
};

export default meta;
type Story = StoryObj<BzmImageQuestionComponent>;

export const Default: Story = {};

export const Loading: Story = {
  args: {
    loading: true,
  },
};

export const LandscapeImage: Story = {
  args: {
    imageUrl: 'https://picsum.photos/seed/landscape/800/400',
    imageAlt: 'Een breed landschap',
    question: 'In welk land is deze foto genomen?',
  },
};

export const PortraitImage: Story = {
  args: {
    imageUrl: 'https://picsum.photos/seed/portrait/400/600',
    imageAlt: 'Een staand portret',
    question: 'Wie is deze beroemde persoon?',
  },
};

export const LongQuestion: Story = {
  args: {
    question:
      'Bekijk de afbeelding hierboven heel goed. Welk historisch monument wordt hier afgebeeld en in welk land staat het?',
  },
};

export const NotZoomable: Story = {
  args: {
    zoomable: false,
    question: 'Wat is het antwoord op deze vraag? (niet in te zoomen)',
  },
};
