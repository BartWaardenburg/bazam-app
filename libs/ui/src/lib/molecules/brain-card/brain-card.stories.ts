import type { Meta, StoryObj } from '@storybook/angular';
import { BzmBrainCardComponent } from './brain-card.component';

const meta: Meta<BzmBrainCardComponent> = {
  title: 'Molecules/BrainCard',
  component: BzmBrainCardComponent,
  tags: ['autodocs'],
  argTypes: {
    name: { control: 'text' },
    rarity: {
      control: { type: 'select' },
      options: ['common', 'uncommon', 'rare', 'epic', 'legendary'],
    },
    description: { control: 'text' },
    icon: { control: 'text' },
    equipped: { control: 'boolean' },
    interactive: { control: 'boolean' },
    price: { control: 'number' },
  },
  decorators: [
    (story) => ({
      ...story(),
      styles: [`:host { display: block; max-width: 160px; }`],
    }),
  ],
};

export default meta;
type Story = StoryObj<BzmBrainCardComponent>;

export const Default: Story = {
  args: {
    name: 'Quick Thinker',
    rarity: 'common',
    description: '+3 seconden per vraag',
    icon: 'lightning',
    equipped: false,
    interactive: true,
    price: undefined,
  },
};

export const Uncommon: Story = {
  args: {
    name: 'Ice Shield',
    rarity: 'uncommon',
    description: 'Bevriest de timer voor 5 seconden',
    icon: 'snowflake',
    equipped: false,
    interactive: true,
    price: undefined,
  },
};

export const Equipped: Story = {
  args: {
    name: 'Quick Thinker',
    rarity: 'uncommon',
    description: '+3 seconden per vraag',
    icon: 'lightning',
    equipped: true,
    interactive: true,
    price: undefined,
  },
};

export const WithPrice: Story = {
  args: {
    name: 'Lucky Guess',
    rarity: 'common',
    description: '10% kans op gratis correct antwoord',
    icon: 'clover',
    equipped: false,
    interactive: true,
    price: 150,
  },
};

export const UncommonWithPrice: Story = {
  args: {
    name: 'Double Down',
    rarity: 'uncommon',
    description: 'Verdubbel score bij correct antwoord',
    icon: 'arrows-out',
    equipped: false,
    interactive: true,
    price: 300,
  },
};

export const NonInteractive: Story = {
  args: {
    name: 'Quick Thinker',
    rarity: 'common',
    description: '+3 seconden per vraag',
    icon: 'lightning',
    equipped: false,
    interactive: false,
    price: undefined,
  },
};

export const AllVariants: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-wrap: wrap; gap: 16px;">
        <bzm-brain-card
          name="Quick Thinker"
          rarity="common"
          description="+3 seconden per vraag"
          icon="lightning"
        />
        <bzm-brain-card
          name="Ice Shield"
          rarity="uncommon"
          description="Bevriest timer 5s"
          icon="snowflake"
          [equipped]="true"
        />
        <bzm-brain-card
          name="Lucky Guess"
          rarity="common"
          description="10% kans gratis correct"
          icon="clover"
          [price]="150"
        />
        <bzm-brain-card
          name="Double Down"
          rarity="uncommon"
          description="Verdubbel score"
          icon="arrows-out"
          [price]="300"
        />
      </div>
    `,
    moduleMetadata: {
      imports: [BzmBrainCardComponent],
    },
  }),
};
