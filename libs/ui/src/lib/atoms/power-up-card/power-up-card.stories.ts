import type { Meta, StoryObj } from '@storybook/angular';
import { BzmPowerUpCardComponent } from './power-up-card.component';

const meta: Meta<BzmPowerUpCardComponent> = {
  title: 'Atoms/PowerUpCard',
  component: BzmPowerUpCardComponent,
  tags: ['autodocs'],
  argTypes: {
    name: { control: 'text' },
    icon: { control: 'text' },
    type: {
      control: 'select',
      options: ['chaos', 'boost'],
    },
    rarity: {
      control: 'select',
      options: ['common', 'uncommon', 'rare', 'epic', 'legendary'],
    },
    description: { control: 'text' },
    disabled: { control: 'boolean' },
    compact: { control: 'boolean' },
    selected: { control: 'boolean' },
  },
  args: {
    name: 'Shield',
    icon: 'shield',
    type: 'boost',
    rarity: 'common',
    description: 'Beschermt je tegen chaos power-ups.',
    disabled: false,
    compact: false,
    selected: false,
  },
  decorators: [
    (story) => ({
      ...story(),
      styles: [`:host { display: block; max-width: 180px; }`],
    }),
  ],
};

export default meta;
type Story = StoryObj<BzmPowerUpCardComponent>;

export const Default: Story = {};

export const ChaosType: Story = {
  args: {
    name: 'Scramble',
    icon: 'shuffle',
    type: 'chaos',
    description: 'Gooit de antwoorden door elkaar.',
  },
};

export const BoostType: Story = {
  args: {
    name: 'Shield',
    icon: 'shield',
    type: 'boost',
    description: 'Beschermt je tegen chaos power-ups.',
  },
};

export const Rare: Story = {
  args: {
    name: 'Peek',
    icon: 'eye',
    type: 'boost',
    rarity: 'rare',
    description: 'Bekijk een hint voordat de vraag verschijnt.',
  },
};

export const Epic: Story = {
  args: {
    name: 'Double Down',
    icon: 'arrow-fat-lines-up',
    type: 'boost',
    rarity: 'epic',
    description: 'Verdubbel je punten voor deze vraag.',
  },
};

export const Compact: Story = {
  args: {
    name: 'Shield',
    icon: 'shield',
    type: 'boost',
    compact: true,
  },
  decorators: [
    (story) => ({
      ...story(),
      styles: [`:host { display: block; max-width: 200px; }`],
    }),
  ],
};

export const Selected: Story = {
  args: {
    name: 'Shield',
    icon: 'shield',
    type: 'boost',
    rarity: 'rare',
    selected: true,
    description: 'Beschermt je tegen chaos power-ups.',
  },
};

export const Disabled: Story = {
  args: {
    name: 'Shield',
    icon: 'shield',
    type: 'boost',
    disabled: true,
    description: 'Beschermt je tegen chaos power-ups.',
  },
};

export const AllPowerUps: Story = {
  render: () => ({
    template: `
      <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; max-width: 600px;">
        <bzm-power-up-card name="Scramble" icon="shuffle" type="chaos" rarity="common" description="Gooit de antwoorden door elkaar." />
        <bzm-power-up-card name="Fog of War" icon="cloud-fog" type="chaos" rarity="rare" description="Verbergt een deel van de vraag." />
        <bzm-power-up-card name="Time Crunch" icon="timer" type="chaos" rarity="epic" description="Halveert de tijd voor iedereen." />
        <bzm-power-up-card name="Shield" icon="shield" type="boost" rarity="common" description="Beschermt tegen chaos power-ups." />
        <bzm-power-up-card name="Peek" icon="eye" type="boost" rarity="rare" description="Bekijk een hint vooraf." />
        <bzm-power-up-card name="Double Down" icon="arrow-fat-lines-up" type="boost" rarity="epic" description="Verdubbel je punten." />
        <bzm-power-up-card name="Second Chance" icon="arrow-counter-clockwise" type="boost" rarity="rare" description="Nog een poging." />
        <bzm-power-up-card name="Freeze Frame" icon="snowflake" type="boost" rarity="common" description="Pauzeert de timer even." />
        <bzm-power-up-card name="Equalizer" icon="equals" type="boost" rarity="epic" description="Iedereen krijgt dezelfde tijd." />
      </div>
    `,
    moduleMetadata: {
      imports: [BzmPowerUpCardComponent],
    },
  }),
};
