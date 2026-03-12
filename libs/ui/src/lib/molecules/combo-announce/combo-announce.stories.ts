import type { Meta, StoryObj } from '@storybook/angular';
import { BzmComboAnnounceComponent } from './combo-announce.component';

const meta: Meta<BzmComboAnnounceComponent> = {
  title: 'Molecules/ComboAnnounce',
  component: BzmComboAnnounceComponent,
  tags: ['autodocs'],
  argTypes: {
    comboName: { control: 'text' },
    bonus: { control: 'text' },
    flavorText: { control: 'text' },
    visible: { control: 'boolean' },
  },
  args: {
    comboName: 'Nature Explorer',
    bonus: '+3x',
    flavorText: 'You know this planet inside out!',
    visible: true,
  },
  decorators: [
    (story) => ({
      ...story(),
      styles: [`:host { display: block; max-width: 500px; }`],
    }),
  ],
};

export default meta;
type Story = StoryObj<BzmComboAnnounceComponent>;

export const Default: Story = {
  args: {
    comboName: 'Nature Explorer',
    bonus: '+3x',
    flavorText: 'You know this planet inside out!',
    visible: true,
  },
};

export const LabPartners: Story = {
  args: {
    comboName: 'Lab Partners',
    bonus: '+2x',
    flavorText: 'Science and tech go hand in hand!',
    visible: true,
  },
};

export const WorldTour: Story = {
  args: {
    comboName: 'World Tour',
    bonus: '+2x',
    flavorText: 'You have been around the globe!',
    visible: true,
  },
};

export const ScreenTime: Story = {
  args: {
    comboName: 'Screen Time',
    bonus: '+2x',
    flavorText: 'Movies, series, games — you know them all!',
    visible: true,
  },
};

export const Rockstar: Story = {
  args: {
    comboName: 'Rockstar',
    bonus: '+2x',
    flavorText: 'Music runs through your veins!',
    visible: true,
  },
};

export const Blockbuster: Story = {
  args: {
    comboName: 'Blockbuster',
    bonus: '+3x',
    flavorText: 'A true film connoisseur!',
    visible: true,
  },
};

export const TimeTraveler: Story = {
  args: {
    comboName: 'Time Traveler',
    bonus: '+3x',
    flavorText: 'Past, present, future — you master them all!',
    visible: true,
  },
};

export const PopStar: Story = {
  args: {
    comboName: 'Pop Star',
    bonus: '+3x',
    flavorText: 'Pop culture has no secrets for you!',
    visible: true,
  },
};

export const WildSafari: Story = {
  args: {
    comboName: 'Wild Safari',
    bonus: '+3x',
    flavorText: 'The animal kingdom is your domain!',
    visible: true,
  },
};

export const FullHouse: Story = {
  args: {
    comboName: 'Full House',
    bonus: '+3x',
    flavorText: 'A true all-rounder!',
    visible: true,
  },
};

export const Hidden: Story = {
  args: {
    comboName: 'Nature Explorer',
    bonus: '+3x',
    flavorText: 'You know this planet inside out!',
    visible: false,
  },
};

export const AllCombos: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 24px; max-width: 500px;">
        <bzm-combo-announce
          comboName="Lab Partners"
          bonus="+2x"
          flavorText="Science and tech go hand in hand!"
          [visible]="true"
        />
        <bzm-combo-announce
          comboName="Nature Explorer"
          bonus="+3x"
          flavorText="You know this planet inside out!"
          [visible]="true"
        />
        <bzm-combo-announce
          comboName="Full House"
          bonus="+3x"
          flavorText="A true all-rounder!"
          [visible]="true"
        />
      </div>
    `,
    moduleMetadata: {
      imports: [BzmComboAnnounceComponent],
    },
  }),
};
