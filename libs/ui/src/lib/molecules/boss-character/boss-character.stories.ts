import type { Meta, StoryObj } from '@storybook/angular';
import { BzmBossCharacterComponent } from './boss-character.component';

const meta: Meta<BzmBossCharacterComponent> = {
  title: 'Molecules/BossCharacter',
  component: BzmBossCharacterComponent,
  tags: ['autodocs'],
  argTypes: {
    name: { control: 'text' },
    expression: {
      control: { type: 'select' },
      options: ['idle', 'angry', 'hurt', 'defeated'],
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
    },
  },
  decorators: [
    (story) => ({
      ...story(),
      styles: [`:host { display: flex; justify-content: center; padding: 24px; }`],
    }),
  ],
};

export default meta;
type Story = StoryObj<BzmBossCharacterComponent>;

export const Idle: Story = {
  args: {
    name: 'De Baas',
    expression: 'idle',
    size: 'md',
  },
};

export const Angry: Story = {
  args: {
    name: 'De Baas',
    expression: 'angry',
    size: 'md',
  },
};

export const Hurt: Story = {
  args: {
    name: 'De Baas',
    expression: 'hurt',
    size: 'md',
  },
};

export const Defeated: Story = {
  args: {
    name: 'De Baas',
    expression: 'defeated',
    size: 'md',
  },
};

export const Small: Story = {
  args: {
    name: 'De Baas',
    expression: 'idle',
    size: 'sm',
  },
};

export const Large: Story = {
  args: {
    name: 'Professor Puzzel',
    expression: 'angry',
    size: 'lg',
  },
};
