import type { Meta, StoryObj } from '@storybook/angular';
import { BzmPowerUpNotificationComponent } from './power-up-notification.component';

const meta: Meta<BzmPowerUpNotificationComponent> = {
  title: 'Atoms/PowerUpNotification',
  component: BzmPowerUpNotificationComponent,
  tags: ['autodocs'],
  argTypes: {
    message: { control: 'text' },
    type: {
      control: 'select',
      options: ['activated', 'earned', 'effect'],
    },
    icon: { control: 'text' },
    visible: { control: 'boolean' },
  },
  args: {
    message: 'Een power-up is geactiveerd!',
    type: 'activated',
    icon: 'lightning',
    visible: true,
  },
};

export default meta;
type Story = StoryObj<BzmPowerUpNotificationComponent>;

export const Activated: Story = {
  args: {
    message: 'Een power-up is geactiveerd!',
    type: 'activated',
    icon: 'lightning',
  },
};

export const Earned: Story = {
  args: {
    message: 'Je hebt Shield verdiend!',
    type: 'earned',
    icon: 'shield',
  },
};

export const Effect: Story = {
  args: {
    message: 'Scramble is gebruikt tegen jou!',
    type: 'effect',
    icon: 'shuffle',
  },
};

export const Hidden: Story = {
  args: {
    message: 'Dit zie je niet.',
    visible: false,
  },
};
