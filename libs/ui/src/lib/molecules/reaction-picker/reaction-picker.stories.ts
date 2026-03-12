import type { Meta, StoryObj } from '@storybook/angular';
import { BzmReactionPickerComponent } from './reaction-picker.component';
import type { ReactionOption } from './reaction-picker.component';

const meta: Meta<BzmReactionPickerComponent> = {
  title: 'Molecules/ReactionPicker',
  component: BzmReactionPickerComponent,
  argTypes: {
    disabled: { control: 'boolean' },
    cooldownSeconds: { control: 'number' },
  },
  args: {
    disabled: false,
    cooldownSeconds: 0,
  },
  decorators: [
    (story) => ({
      ...story(),
      styles: [`:host { display: block; max-width: 420px; }`],
    }),
  ],
};

export default meta;
type Story = StoryObj<BzmReactionPickerComponent>;

export const Default: Story = {};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

export const WithCooldown: Story = {
  args: {
    disabled: true,
    cooldownSeconds: 3,
  },
};

export const CustomReactions: Story = {
  args: {
    reactions: [
      { emoji: '❤️', label: 'Hart' },
      { emoji: '😎', label: 'Cool' },
      { emoji: '🤯', label: 'Mind-blown' },
      { emoji: '🥳', label: 'Feest' },
    ] satisfies ReactionOption[],
  },
};
