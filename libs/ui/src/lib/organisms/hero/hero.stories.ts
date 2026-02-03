import type { Meta, StoryObj } from '@storybook/angular';
import { BzmHeroComponent } from './hero.component';

const meta: Meta<BzmHeroComponent> = {
  title: 'Organisms/Hero',
  component: BzmHeroComponent,
  tags: ['autodocs'],
  argTypes: {
    title: { control: 'text' },
    subtitle: { control: 'text' },
    tagline: { control: 'text' },
  },
  args: {
    title: 'Bazam',
    subtitle: 'Quiz Battle',
    tagline: 'Daag je vrienden uit!',
  },
  decorators: [
    (story) => ({
      ...story(),
      styles: [`:host { display: block; padding: 48px 24px; }`],
    }),
  ],
};

export default meta;
type Story = StoryObj<BzmHeroComponent>;

export const Default: Story = {};

export const TitleOnly: Story = {
  args: {
    subtitle: undefined,
    tagline: undefined,
  },
};

export const WithoutTagline: Story = {
  args: { tagline: undefined },
};

export const CustomText: Story = {
  args: {
    title: 'Quizzy',
    subtitle: 'Time!',
    tagline: 'Hoeveel weet jij?',
  },
};
