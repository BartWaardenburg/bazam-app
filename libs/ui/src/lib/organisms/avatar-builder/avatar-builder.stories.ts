import type { Meta, StoryObj } from '@storybook/angular';
import { BzmAvatarBuilderComponent, type AvatarConfig } from './avatar-builder.component';

const defaultConfig: AvatarConfig = {
  faceShape: 'round',
  eyes: 'happy',
  mouth: 'smile',
  hair: 'none',
  accessory: 'none',
  color: '#22C55E',
};

const meta: Meta<BzmAvatarBuilderComponent> = {
  title: 'Organisms/AvatarBuilder',
  component: BzmAvatarBuilderComponent,
  tags: ['autodocs'],
  argTypes: {
    config: { control: 'object' },
    unlockedAccessories: { control: 'object' },
  },
  args: {
    config: defaultConfig,
    unlockedAccessories: ['none', 'glasses'],
  },
  decorators: [
    (story) => ({
      ...story(),
      styles: [`:host { display: block; max-width: 420px; padding: 24px; }`],
    }),
  ],
};

export default meta;
type Story = StoryObj<BzmAvatarBuilderComponent>;

export const Default: Story = {};

export const CustomConfig: Story = {
  args: {
    config: {
      faceShape: 'square',
      eyes: 'cool',
      mouth: 'grin',
      hair: 'spiky',
      accessory: 'sunglasses',
      color: '#3B82F6',
    },
    unlockedAccessories: ['none', 'glasses', 'sunglasses', 'hat', 'crown', 'headband'],
  },
};

export const LockedAccessories: Story = {
  args: {
    config: {
      ...defaultConfig,
      accessory: 'glasses',
    },
    unlockedAccessories: ['none', 'glasses'],
  },
};

export const AllOptions: Story = {
  args: {
    config: {
      faceShape: 'oval',
      eyes: 'wink',
      mouth: 'tongue',
      hair: 'curly',
      accessory: 'crown',
      color: '#8B5CF6',
    },
    unlockedAccessories: ['none', 'glasses', 'sunglasses', 'hat', 'crown', 'headband'],
  },
};
