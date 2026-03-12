import type { Meta, StoryObj } from '@storybook/angular';
import { BzmShopItemComponent } from './shop-item.component';

const meta: Meta<BzmShopItemComponent> = {
  title: 'Molecules/ShopItem',
  component: BzmShopItemComponent,
  tags: ['autodocs'],
  argTypes: {
    name: { control: 'text' },
    type: {
      control: { type: 'select' },
      options: ['brain', 'study-card', 'wildcard', 'voucher'],
    },
    description: { control: 'text' },
    price: { control: 'number' },
    icon: { control: 'text' },
    rarity: {
      control: { type: 'select' },
      options: [undefined, 'common', 'uncommon', 'rare', 'epic', 'legendary'],
    },
    sold: { control: 'boolean' },
    affordable: { control: 'boolean' },
  },
  decorators: [
    (story) => ({
      ...story(),
      styles: [`:host { display: block; max-width: 240px; }`],
    }),
  ],
};

export default meta;
type Story = StoryObj<BzmShopItemComponent>;

export const BrainCommon: Story = {
  args: {
    name: 'Science Brain',
    type: 'brain',
    description: '1.5x multiplier op Science vragen',
    price: 100,
    icon: 'brain',
    rarity: 'common',
    sold: false,
    affordable: true,
  },
};

export const BrainUncommon: Story = {
  args: {
    name: 'Galaxy Brain',
    type: 'brain',
    description: '2x multiplier op Science vragen',
    price: 200,
    icon: 'brain',
    rarity: 'uncommon',
    sold: false,
    affordable: true,
  },
};

export const StudyCard: Story = {
  args: {
    name: 'Quick Study',
    type: 'study-card',
    description: 'Verwijder 1 fout antwoord bij de volgende vraag',
    price: 75,
    icon: 'book-open',
    sold: false,
    affordable: true,
  },
};

export const Wildcard: Story = {
  args: {
    name: 'Lucky Guess',
    type: 'wildcard',
    description: 'Krijg 50% van de punten bij een fout antwoord',
    price: 125,
    icon: 'clover',
    sold: false,
    affordable: true,
  },
};

export const Voucher: Story = {
  args: {
    name: 'Tijdbonus',
    type: 'voucher',
    description: '+5 seconden extra tijd bij de volgende vraag',
    price: 50,
    icon: 'ticket',
    sold: false,
    affordable: true,
  },
};

export const Sold: Story = {
  args: {
    name: 'Galaxy Brain',
    type: 'brain',
    description: '2x multiplier op Science vragen',
    price: 200,
    icon: 'brain',
    rarity: 'uncommon',
    sold: true,
    affordable: true,
  },
};

export const NotAffordable: Story = {
  args: {
    name: 'Lucky Guess',
    type: 'wildcard',
    description: 'Krijg 50% van de punten bij een fout antwoord',
    price: 500,
    icon: 'clover',
    sold: false,
    affordable: false,
  },
};

export const AllTypes: Story = {
  render: () => ({
    template: `
      <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; max-width: 500px;">
        <bzm-shop-item
          name="Science Brain"
          type="brain"
          description="1.5x multiplier op Science vragen"
          [price]="100"
          icon="brain"
          rarity="common"
        />
        <bzm-shop-item
          name="Quick Study"
          type="study-card"
          description="Verwijder 1 fout antwoord"
          [price]="75"
          icon="book-open"
        />
        <bzm-shop-item
          name="Lucky Guess"
          type="wildcard"
          description="50% punten bij fout antwoord"
          [price]="125"
          icon="clover"
        />
        <bzm-shop-item
          name="Tijdbonus"
          type="voucher"
          description="+5 seconden extra tijd"
          [price]="50"
          icon="ticket"
        />
      </div>
    `,
    moduleMetadata: {
      imports: [BzmShopItemComponent],
    },
  }),
};

export const AllStates: Story = {
  render: () => ({
    template: `
      <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; max-width: 720px;">
        <bzm-shop-item
          name="Galaxy Brain"
          type="brain"
          description="2x multiplier"
          [price]="200"
          icon="brain"
          rarity="uncommon"
          [affordable]="true"
        />
        <bzm-shop-item
          name="Galaxy Brain"
          type="brain"
          description="2x multiplier"
          [price]="200"
          icon="brain"
          rarity="uncommon"
          [sold]="true"
        />
        <bzm-shop-item
          name="Galaxy Brain"
          type="brain"
          description="2x multiplier"
          [price]="200"
          icon="brain"
          rarity="uncommon"
          [affordable]="false"
        />
      </div>
    `,
    moduleMetadata: {
      imports: [BzmShopItemComponent],
    },
  }),
};
