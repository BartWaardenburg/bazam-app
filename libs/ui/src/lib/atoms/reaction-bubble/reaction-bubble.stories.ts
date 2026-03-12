import type { Meta, StoryObj } from '@storybook/angular';
import { BzmReactionBubbleComponent } from './reaction-bubble.component';

const meta: Meta<BzmReactionBubbleComponent> = {
  title: 'Atoms/ReactionBubble',
  component: BzmReactionBubbleComponent,
  argTypes: {
    emoji: { control: 'text' },
    playerName: { control: 'text' },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
  },
  args: {
    emoji: '🎉',
    playerName: '',
    size: 'md',
  },
  decorators: [
    (story) => ({
      ...story(),
      styles: [`:host { display: block; padding: 60px 20px 20px; }`],
    }),
  ],
};

export default meta;
type Story = StoryObj<BzmReactionBubbleComponent>;

export const Default: Story = {
  args: {
    emoji: '🎉',
  },
};

export const WithPlayerName: Story = {
  args: {
    emoji: '🔥',
    playerName: 'Bart',
  },
};

export const Small: Story = {
  args: {
    emoji: '👏',
    size: 'sm',
  },
};

export const Large: Story = {
  args: {
    emoji: '🏆',
    playerName: 'Lisa',
    size: 'lg',
  },
};

export const MultipleReactions: Story = {
  render: () => ({
    template: `
      <div style="display: flex; gap: 24px; align-items: flex-end; padding: 80px 20px 40px; position: relative; height: 250px;">
        <bzm-reaction-bubble emoji="🎉" playerName="Bart" />
        <bzm-reaction-bubble emoji="🔥" playerName="Lisa" size="lg" />
        <bzm-reaction-bubble emoji="😮" size="sm" />
        <bzm-reaction-bubble emoji="👏" playerName="Max" />
        <bzm-reaction-bubble emoji="💪" size="lg" />
      </div>
    `,
    moduleMetadata: {
      imports: [BzmReactionBubbleComponent],
    },
  }),
};
