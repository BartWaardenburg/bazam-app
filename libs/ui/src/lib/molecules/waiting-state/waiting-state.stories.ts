import type { Meta, StoryObj } from '@storybook/angular';
import { BzmWaitingStateComponent } from './waiting-state.component';

const meta: Meta<BzmWaitingStateComponent> = {
  title: 'Molecules/WaitingState',
  component: BzmWaitingStateComponent,
  tags: ['autodocs'],
  argTypes: {
    message: { control: 'text' },
    spinnerSize: { control: 'select', options: ['sm', 'md', 'lg'] },
  },
  args: {
    message: 'Even geduld...',
    spinnerSize: 'lg',
  },
  decorators: [
    (story) => ({
      ...story(),
      styles: [`:host { display: block; max-width: 400px; }`],
    }),
  ],
};

export default meta;
type Story = StoryObj<BzmWaitingStateComponent>;

export const Default: Story = {};

export const WaitingForPlayers: Story = {
  args: { message: 'Wachten op spelers...' },
};

export const WaitingForHost: Story = {
  args: { message: 'Wachten tot de host begint...' },
};

export const NextQuestion: Story = {
  args: { message: 'Volgende vraag wordt geladen...' },
};

export const SmallMascot: Story = {
  args: { message: 'Verbinden...', spinnerSize: 'sm' },
};

export const MediumMascot: Story = {
  args: { message: 'Laden...', spinnerSize: 'md' },
};

export const AllExamples: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 24px; max-width: 400px;">
        <bzm-waiting-state message="Wachten op spelers..." />
        <bzm-waiting-state message="Wachten tot de host begint..." spinnerSize="md" />
        <bzm-waiting-state message="Verbinden..." spinnerSize="sm" />
      </div>
    `,
    moduleMetadata: {
      imports: [BzmWaitingStateComponent],
    },
  }),
};
