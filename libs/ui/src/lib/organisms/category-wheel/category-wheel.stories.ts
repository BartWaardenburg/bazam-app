import type { Meta, StoryObj } from '@storybook/angular';
import { BzmCategoryWheelComponent, CategoryWheelOption } from './category-wheel.component';

const fourCategories: CategoryWheelOption[] = [
  { id: 'science', name: 'Wetenschap', color: '#6C5CE7', icon: 'flask' },
  { id: 'history', name: 'Geschiedenis', color: '#E17055', icon: 'scroll' },
  { id: 'geography', name: 'Aardrijkskunde', color: '#00B894', icon: 'globe-hemisphere-west' },
  { id: 'music', name: 'Muziek', color: '#0984E3', icon: 'music-notes' },
];

const sixCategories: CategoryWheelOption[] = [
  ...fourCategories,
  { id: 'sports', name: 'Sport', color: '#FDCB6E', icon: 'soccer-ball' },
  { id: 'film', name: 'Film & TV', color: '#E84393', icon: 'film-strip' },
];

const eightCategories: CategoryWheelOption[] = [
  ...sixCategories,
  { id: 'animals', name: 'Dieren', color: '#00CEC9', icon: 'paw-print' },
  { id: 'gaming', name: 'Gaming', color: '#A29BFE', icon: 'game-controller' },
];

const meta: Meta<BzmCategoryWheelComponent> = {
  title: 'Organisms/CategoryWheel',
  component: BzmCategoryWheelComponent,
  argTypes: {
    categories: { control: 'object' },
    spinning: { control: 'boolean' },
    selectedCategoryId: { control: 'text' },
    showVoteButton: { control: 'boolean' },
    mode: {
      control: 'select',
      options: ['spin', 'vote'],
    },
  },
  args: {
    categories: sixCategories,
    spinning: false,
    selectedCategoryId: null,
    showVoteButton: false,
    mode: 'spin',
  },
};

export default meta;
type Story = StoryObj<BzmCategoryWheelComponent>;

export const Default: Story = {
  args: {
    categories: sixCategories,
  },
};

export const Spinning: Story = {
  args: {
    categories: sixCategories,
    spinning: true,
  },
};

export const ResultSelected: Story = {
  args: {
    categories: sixCategories,
    selectedCategoryId: 'geography',
  },
};

export const VoteMode: Story = {
  args: {
    categories: sixCategories,
    mode: 'vote',
  },
};

export const FourCategories: Story = {
  args: {
    categories: fourCategories,
  },
};

export const EightCategories: Story = {
  args: {
    categories: eightCategories,
  },
};

export const WithVoteButton: Story = {
  args: {
    categories: sixCategories,
    showVoteButton: true,
  },
};

export const VoteModeSelected: Story = {
  args: {
    categories: sixCategories,
    mode: 'vote',
    selectedCategoryId: 'science',
  },
};

export const AllModes: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 32px;">
        <div>
          <h4 style="margin: 0 0 8px; color: #999;">Spin Mode (default)</h4>
          <bzm-category-wheel [categories]="cats" />
        </div>
        <div>
          <h4 style="margin: 0 0 8px; color: #999;">Spin Mode (result)</h4>
          <bzm-category-wheel [categories]="cats" selectedCategoryId="geography" />
        </div>
        <div>
          <h4 style="margin: 0 0 8px; color: #999;">Vote Mode</h4>
          <bzm-category-wheel [categories]="cats" mode="vote" />
        </div>
      </div>
    `,
    moduleMetadata: {
      imports: [BzmCategoryWheelComponent],
    },
    props: {
      cats: sixCategories,
    },
  }),
};
