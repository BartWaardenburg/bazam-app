import type { Meta, StoryObj } from '@storybook/angular';
import { BzmCategoryHandComponent, CategoryCardData } from './category-hand.component';

const explorerHand: CategoryCardData[] = [
  { id: '1', category: 'Science', stars: 2 },
  { id: '2', category: 'History', stars: 1 },
  { id: '3', category: 'Film', stars: 3 },
  { id: '4', category: 'Music', stars: 1 },
  { id: '5', category: 'Animals', stars: 2 },
];

const championHand: CategoryCardData[] = [
  { id: '1', category: 'Science', stars: 3 },
  { id: '2', category: 'History', stars: 2 },
  { id: '3', category: 'Geography', stars: 1 },
  { id: '4', category: 'Film', stars: 2 },
  { id: '5', category: 'Music', stars: 3 },
  { id: '6', category: 'Sports', stars: 1 },
  { id: '7', category: 'Gaming', stars: 2 },
];

const meta: Meta<BzmCategoryHandComponent> = {
  title: 'Organisms/CategoryHand',
  component: BzmCategoryHandComponent,
  tags: ['autodocs'],
  argTypes: {
    maxSelections: { control: 'number' },
  },
  args: {
    cards: explorerHand,
    maxSelections: 3,
    selectedIds: [],
  },
  decorators: [
    (story) => ({
      ...story(),
      styles: [`:host { display: block; max-width: 700px; padding: 24px; }`],
    }),
  ],
};

export default meta;
type Story = StoryObj<BzmCategoryHandComponent>;

export const Default: Story = {};

export const WithSelections: Story = {
  args: {
    selectedIds: ['1', '3'],
  },
};

export const MaxReached: Story = {
  args: {
    selectedIds: ['1', '3', '5'],
  },
};

export const ChampionMode: Story = {
  args: {
    cards: championHand,
    maxSelections: 5,
    selectedIds: [],
  },
};

export const ChampionWithSelections: Story = {
  args: {
    cards: championHand,
    maxSelections: 5,
    selectedIds: ['1', '2', '5', '6', '7'],
  },
};

export const TwoCards: Story = {
  args: {
    cards: explorerHand.slice(0, 2),
    maxSelections: 1,
    selectedIds: [],
  },
};
