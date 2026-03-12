import type { Meta, StoryObj } from '@storybook/angular';
import { BzmPowerUpActivationComponent, type PowerUpActivationData } from './power-up-activation.component';

const boostPowerUp: PowerUpActivationData = {
  name: 'Shield',
  icon: 'shield',
  type: 'boost',
  description: 'Beschermt je tegen de volgende chaos power-up die tegen je wordt gebruikt.',
};

const chaosPowerUp: PowerUpActivationData = {
  name: 'Scramble',
  icon: 'shuffle',
  type: 'chaos',
  description: 'Gooit de antwoordopties door elkaar voor alle andere spelers.',
};

const meta: Meta<BzmPowerUpActivationComponent> = {
  title: 'Molecules/PowerUpActivation',
  component: BzmPowerUpActivationComponent,
  tags: ['autodocs'],
  argTypes: {
    powerUp: { control: 'object' },
    timeRemaining: { control: 'number' },
  },
  args: {
    powerUp: boostPowerUp,
    timeRemaining: 3,
  },
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<BzmPowerUpActivationComponent>;

export const BoostPowerUp: Story = {
  args: {
    powerUp: boostPowerUp,
    timeRemaining: 3,
  },
};

export const ChaosPowerUp: Story = {
  args: {
    powerUp: chaosPowerUp,
    timeRemaining: 3,
  },
};

export const LowTime: Story = {
  args: {
    powerUp: boostPowerUp,
    timeRemaining: 1,
  },
};
