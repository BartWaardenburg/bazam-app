import type { Meta, StoryObj } from '@storybook/angular';
import { BzmBossModifierComponent } from './boss-modifier.component';

const meta: Meta<BzmBossModifierComponent> = {
  title: 'Molecules/BossModifier',
  component: BzmBossModifierComponent,
  tags: ['autodocs'],
  argTypes: {
    modifier: {
      control: { type: 'select' },
      options: [
        'Blackout',
        'Time Crunch',
        'Scrambler',
        'Fog of War',
        'Taxman',
        'Silent Treatment',
        'Trickster',
        'Flip',
      ],
    },
    description: { control: 'text' },
    compact: { control: 'boolean' },
  },
  decorators: [
    (story) => ({
      ...story(),
      styles: [`:host { display: block; max-width: 360px; }`],
    }),
  ],
};

export default meta;
type Story = StoryObj<BzmBossModifierComponent>;

export const Blackout: Story = {
  args: {
    modifier: 'Blackout',
    description: 'Antwoordopties worden na 3 seconden verborgen',
    compact: false,
  },
};

export const TimeCrunch: Story = {
  args: {
    modifier: 'Time Crunch',
    description: 'Timer loopt 2x zo snel',
    compact: false,
  },
};

export const Scrambler: Story = {
  args: {
    modifier: 'Scrambler',
    description: 'Antwoorden wisselen halverwege van positie',
    compact: false,
  },
};

export const FogOfWar: Story = {
  args: {
    modifier: 'Fog of War',
    description: 'Vraag is gedeeltelijk verborgen',
    compact: false,
  },
};

export const Taxman: Story = {
  args: {
    modifier: 'Taxman',
    description: 'Verlies 50 Sparks per fout antwoord',
    compact: false,
  },
};

export const SilentTreatment: Story = {
  args: {
    modifier: 'Silent Treatment',
    description: 'Geen feedback of het antwoord correct was',
    compact: false,
  },
};

export const Trickster: Story = {
  args: {
    modifier: 'Trickster',
    description: 'Eén antwoord is stiekem gewijzigd',
    compact: false,
  },
};

export const Flip: Story = {
  args: {
    modifier: 'Flip',
    description: 'Score wordt omgekeerd — foute antwoorden geven punten',
    compact: false,
  },
};

export const CompactBlackout: Story = {
  args: {
    modifier: 'Blackout',
    description: 'Antwoordopties worden na 3 seconden verborgen',
    compact: true,
  },
};

export const CompactTimeCrunch: Story = {
  args: {
    modifier: 'Time Crunch',
    description: 'Timer loopt 2x zo snel',
    compact: true,
  },
};

export const AllModifiers: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px; max-width: 360px;">
        <bzm-boss-modifier modifier="Blackout" description="Antwoordopties worden na 3 seconden verborgen" />
        <bzm-boss-modifier modifier="Time Crunch" description="Timer loopt 2x zo snel" />
        <bzm-boss-modifier modifier="Scrambler" description="Antwoorden wisselen halverwege van positie" />
        <bzm-boss-modifier modifier="Fog of War" description="Vraag is gedeeltelijk verborgen" />
        <bzm-boss-modifier modifier="Taxman" description="Verlies 50 Sparks per fout antwoord" />
        <bzm-boss-modifier modifier="Silent Treatment" description="Geen feedback of het antwoord correct was" />
        <bzm-boss-modifier modifier="Trickster" description="Eén antwoord is stiekem gewijzigd" />
        <bzm-boss-modifier modifier="Flip" description="Score wordt omgekeerd — foute antwoorden geven punten" />
      </div>
    `,
    moduleMetadata: {
      imports: [BzmBossModifierComponent],
    },
  }),
};

export const AllCompact: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-wrap: wrap; gap: 8px; max-width: 480px;">
        <bzm-boss-modifier modifier="Blackout" description="Verborgen opties" [compact]="true" />
        <bzm-boss-modifier modifier="Time Crunch" description="Snellere timer" [compact]="true" />
        <bzm-boss-modifier modifier="Scrambler" description="Shuffled antwoorden" [compact]="true" />
        <bzm-boss-modifier modifier="Fog of War" description="Verborgen vraag" [compact]="true" />
        <bzm-boss-modifier modifier="Taxman" description="Sparks verlies" [compact]="true" />
        <bzm-boss-modifier modifier="Silent Treatment" description="Geen feedback" [compact]="true" />
        <bzm-boss-modifier modifier="Trickster" description="Gewijzigd antwoord" [compact]="true" />
        <bzm-boss-modifier modifier="Flip" description="Omgekeerde score" [compact]="true" />
      </div>
    `,
    moduleMetadata: {
      imports: [BzmBossModifierComponent],
    },
  }),
};
