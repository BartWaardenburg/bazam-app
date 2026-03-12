import type { Meta, StoryObj } from '@storybook/angular';
import { BzmVolumeControlComponent } from './volume-control.component';

const meta: Meta<BzmVolumeControlComponent> = {
  title: 'Atoms/VolumeControl',
  component: BzmVolumeControlComponent,
  tags: ['autodocs'],
  argTypes: {
    volume: { control: { type: 'range', min: 0, max: 100, step: 1 } },
    muted: { control: 'boolean' },
  },
  args: {
    volume: 80,
    muted: false,
  },
  decorators: [
    (story) => ({
      ...story(),
      styles: [`:host { display: block; padding: 120px 40px 24px; }`],
    }),
  ],
};

export default meta;
type Story = StoryObj<BzmVolumeControlComponent>;

export const Default: Story = {};

export const Muted: Story = {
  args: {
    volume: 80,
    muted: true,
  },
};

export const LowVolume: Story = {
  args: {
    volume: 15,
    muted: false,
  },
};

export const FullVolume: Story = {
  args: {
    volume: 100,
    muted: false,
  },
};

export const Expanded: Story = {
  args: {
    volume: 60,
    muted: false,
  },
};
