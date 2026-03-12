import type { Meta, StoryObj } from '@storybook/angular';
import { BzmCheerMessageComponent } from './cheer-message.component';

const meta: Meta<BzmCheerMessageComponent> = {
  title: 'Atoms/CheerMessage',
  component: BzmCheerMessageComponent,
  argTypes: {
    message: { control: 'text' },
    playerName: { control: 'text' },
    variant: { control: 'select', options: ['default', 'excited', 'encouraging'] },
  },
  args: {
    message: 'Goed bezig!',
    playerName: 'Bart',
    variant: 'default',
  },
  decorators: [
    (story) => ({
      ...story(),
      styles: [`:host { display: block; padding: 20px 40px 20px 20px; }`],
    }),
  ],
};

export default meta;
type Story = StoryObj<BzmCheerMessageComponent>;

export const Default: Story = {
  args: {
    message: 'Goed bezig!',
    playerName: 'Bart',
    variant: 'default',
  },
};

export const Excited: Story = {
  args: {
    message: 'Wat een topper!',
    playerName: 'Lisa',
    variant: 'excited',
  },
};

export const Encouraging: Story = {
  args: {
    message: 'Komt goed, volgende keer beter!',
    playerName: 'Max',
    variant: 'encouraging',
  },
};

export const LongMessage: Story = {
  args: {
    message: 'Waanzinnig! Drie op een rij goed, blijf zo doorgaan, jij wordt de kampioen!',
    playerName: 'Sophie',
    variant: 'excited',
  },
};
