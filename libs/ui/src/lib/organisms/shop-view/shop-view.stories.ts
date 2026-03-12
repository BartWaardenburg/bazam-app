import type { Meta, StoryObj } from '@storybook/angular';
import { BzmShopViewComponent, ShopSlot } from './shop-view.component';

const defaultItems: ShopSlot[] = [
  {
    id: 's1',
    name: 'Snelle Denker',
    type: 'brain',
    description: '+2s extra tijd per vraag',
    price: 30,
    icon: 'ph-lightning',
    rarity: 'common',
  },
  {
    id: 's2',
    name: 'Dubbelslag',
    type: 'brain',
    description: 'Dubbele Sparks bij streak ≥ 3',
    price: 55,
    icon: 'ph-copy',
    rarity: 'uncommon',
  },
  {
    id: 's3',
    name: 'Hint Kaart',
    type: 'study-card',
    description: 'Verwijdert 1 fout antwoord',
    price: 15,
    icon: 'ph-lightbulb',
  },
  {
    id: 's4',
    name: 'Tijdbevriezing',
    type: 'wildcard',
    description: 'Pauzeert de timer voor 1 vraag',
    price: 20,
    icon: 'ph-snowflake',
  },
  {
    id: 's5',
    name: 'Extra Leven',
    type: 'voucher',
    description: 'Krijg 1 extra hart terug',
    price: 40,
    icon: 'ph-heart',
  },
];

const meta: Meta<BzmShopViewComponent> = {
  title: 'Organisms/ShopView',
  component: BzmShopViewComponent,
  tags: ['autodocs'],
  argTypes: {
    playerSparks: { control: 'number' },
    rerollCost: { control: 'number' },
  },
  args: {
    items: defaultItems,
    playerSparks: 120,
    rerollCost: 5,
  },
  decorators: [
    (story) => ({
      ...story(),
      styles: [`:host { display: block; max-width: 600px; padding: 24px; }`],
    }),
  ],
};

export default meta;
type Story = StoryObj<BzmShopViewComponent>;

export const Default: Story = {};

export const LowBudget: Story = {
  args: {
    playerSparks: 18,
  },
};

export const RichPlayer: Story = {
  args: {
    playerSparks: 500,
  },
};

export const WithSoldItems: Story = {
  args: {
    items: [
      { ...defaultItems[0], sold: true },
      defaultItems[1],
      { ...defaultItems[2], sold: true },
      defaultItems[3],
      defaultItems[4],
    ],
  },
};

export const AllSold: Story = {
  args: {
    items: defaultItems.map((item) => ({ ...item, sold: true })),
  },
};

export const ExpensiveReroll: Story = {
  args: {
    rerollCost: 15,
  },
};

export const BrokeCantReroll: Story = {
  args: {
    playerSparks: 3,
    rerollCost: 5,
  },
};

export const OnlyBrains: Story = {
  args: {
    items: defaultItems.filter((i) => i.type === 'brain'),
    playerSparks: 80,
  },
};
