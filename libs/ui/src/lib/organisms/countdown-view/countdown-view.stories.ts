import type { Meta, StoryObj } from '@storybook/angular';
import { BzmCountdownViewComponent } from './countdown-view.component';

const meta: Meta<BzmCountdownViewComponent> = {
  title: 'Organisms/CountdownView',
  component: BzmCountdownViewComponent,
  tags: ['autodocs'],
  argTypes: {
    text: { control: 'text' },
  },
  args: {
    text: 'Maak je klaar!',
  },
};

export default meta;
type Story = StoryObj<BzmCountdownViewComponent>;

export const Default: Story = {};

export const ThreeSeconds: Story = {
  args: { text: '3' },
};

export const Go: Story = {
  args: { text: 'GO!' },
};

export const CustomText: Story = {
  args: { text: 'Volgende vraag...' },
};

export const AllStates: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px;">
        <bzm-countdown-view text="Maak je klaar!" />
        <bzm-countdown-view text="3" />
        <bzm-countdown-view text="2" />
        <bzm-countdown-view text="1" />
        <bzm-countdown-view text="GO!" />
      </div>
    `,
    moduleMetadata: {
      imports: [BzmCountdownViewComponent],
    },
  }),
};
