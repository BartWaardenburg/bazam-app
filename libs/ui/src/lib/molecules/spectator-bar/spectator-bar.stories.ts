import type { Meta, StoryObj } from '@storybook/angular';
import { BzmSpectatorBarComponent } from './spectator-bar.component';

const meta: Meta<BzmSpectatorBarComponent> = {
  title: 'Molecules/SpectatorBar',
  component: BzmSpectatorBarComponent,
  argTypes: {
    spectatorCount: { control: 'number' },
    hypeLevel: { control: { type: 'range', min: 0, max: 100, step: 1 } },
    showHype: { control: 'boolean' },
  },
  args: {
    spectatorCount: 24,
    hypeLevel: 50,
    showHype: true,
  },
  decorators: [
    (story) => ({
      ...story(),
      styles: [`:host { display: block; max-width: 400px; }`],
    }),
  ],
};

export default meta;
type Story = StoryObj<BzmSpectatorBarComponent>;

export const LowHype: Story = {
  args: {
    spectatorCount: 8,
    hypeLevel: 15,
  },
};

export const MediumHype: Story = {
  args: {
    spectatorCount: 24,
    hypeLevel: 50,
  },
};

export const HighHype: Story = {
  args: {
    spectatorCount: 87,
    hypeLevel: 85,
  },
};

export const NoSpectators: Story = {
  args: {
    spectatorCount: 0,
    hypeLevel: 0,
  },
};

export const LargeCount: Story = {
  args: {
    spectatorCount: 1234,
    hypeLevel: 92,
  },
};

export const HypeHidden: Story = {
  args: {
    spectatorCount: 42,
    hypeLevel: 60,
    showHype: false,
  },
};
