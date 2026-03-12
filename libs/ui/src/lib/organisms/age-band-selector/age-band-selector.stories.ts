import type { Meta, StoryObj } from '@storybook/angular';
import { BzmAgeBandSelectorComponent } from './age-band-selector.component';

const meta: Meta<BzmAgeBandSelectorComponent> = {
  title: 'Organisms/AgeBandSelector',
  component: BzmAgeBandSelectorComponent,
  tags: ['autodocs'],
  argTypes: {
    selectedBand: {
      control: { type: 'select' },
      options: [null, '8-10', '11-13', '14-16', '17-20'],
    },
  },
  args: {
    selectedBand: null,
  },
  decorators: [
    (story) => ({
      ...story(),
      styles: [`:host { display: block; max-width: 560px; padding: 24px; }`],
    }),
  ],
};

export default meta;
type Story = StoryObj<BzmAgeBandSelectorComponent>;

export const Default: Story = {
  args: {
    selectedBand: null,
  },
};

export const DiscovererSelected: Story = {
  args: {
    selectedBand: '8-10',
  },
};

export const AdventurerSelected: Story = {
  args: {
    selectedBand: '11-13',
  },
};

export const ChallengerSelected: Story = {
  args: {
    selectedBand: '14-16',
  },
};

export const ChampionSelected: Story = {
  args: {
    selectedBand: '17-20',
  },
};
