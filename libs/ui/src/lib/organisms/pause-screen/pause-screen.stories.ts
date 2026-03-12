import type { Meta, StoryObj } from '@storybook/angular';
import { BzmPauseScreenComponent } from './pause-screen.component';

const meta: Meta<BzmPauseScreenComponent> = {
  title: 'Organisms/PauseScreen',
  component: BzmPauseScreenComponent,
  tags: ['autodocs'],
  argTypes: {
    message: { control: 'text' },
    hostName: { control: 'text' },
    active: { control: 'boolean' },
    showTimer: { control: 'boolean' },
    resumeAt: { control: 'text' },
  },
  args: {
    message: 'Even pauze!',
    hostName: '',
    active: true,
    showTimer: false,
    resumeAt: '',
  },
};

export default meta;
type Story = StoryObj<BzmPauseScreenComponent>;

export const Default: Story = {};

export const WithMessage: Story = {
  args: {
    message: 'Even drankjes halen!',
  },
};

export const WithTimer: Story = {
  args: {
    message: 'Even pauze!',
    showTimer: true,
    resumeAt: 'Over 5 minuten',
  },
};

export const WithHostName: Story = {
  args: {
    message: 'Even naar het toilet!',
    hostName: 'Bart',
  },
};

export const CustomMessage: Story = {
  args: {
    message: 'Pizza is onderweg! We gaan zo verder.',
    hostName: 'Lisa',
    showTimer: true,
    resumeAt: 'Over 10 minuten',
  },
};
