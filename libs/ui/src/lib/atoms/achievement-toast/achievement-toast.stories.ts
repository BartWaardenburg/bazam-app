import type { Meta, StoryObj } from '@storybook/angular';
import { BzmAchievementToastComponent } from './achievement-toast.component';

const meta: Meta<BzmAchievementToastComponent> = {
  title: 'Atoms/AchievementToast',
  component: BzmAchievementToastComponent,
  tags: ['autodocs'],
  argTypes: {
    name: { control: 'text' },
    icon: { control: 'text' },
    visible: { control: 'boolean' },
  },
  args: {
    name: 'Brainiac',
    icon: 'brain',
    visible: true,
  },
  decorators: [
    (story) => ({
      ...story(),
      styles: [`:host { display: block; max-width: 400px; padding: 24px; padding-top: 80px; }`],
    }),
  ],
};

export default meta;
type Story = StoryObj<BzmAchievementToastComponent>;

export const Default: Story = {};

export const LongName: Story = {
  args: {
    name: 'Onverslaanbare Quizmaster van het Jaar',
    icon: 'crown',
  },
};

export const Hidden: Story = {
  args: {
    visible: false,
  },
};
