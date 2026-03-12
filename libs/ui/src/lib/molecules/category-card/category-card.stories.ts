import type { Meta, StoryObj } from '@storybook/angular';
import { BzmCategoryCardComponent } from './category-card.component';

const meta: Meta<BzmCategoryCardComponent> = {
  title: 'Molecules/CategoryCard',
  component: BzmCategoryCardComponent,
  tags: ['autodocs'],
  argTypes: {
    category: {
      control: { type: 'select' },
      options: [
        'Science & Nature',
        'History',
        'Geography',
        'Film & TV',
        'Music',
        'Sports',
        'Animals & Nature',
        'Gaming & Internet',
      ],
    },
    stars: {
      control: { type: 'select' },
      options: [1, 2, 3],
    },
    selected: { control: 'boolean' },
    disabled: { control: 'boolean' },
    played: { control: 'boolean' },
  },
  decorators: [
    (story) => ({
      ...story(),
      styles: [`:host { display: block; max-width: 120px; }`],
    }),
  ],
};

export default meta;
type Story = StoryObj<BzmCategoryCardComponent>;

export const Default: Story = {
  args: {
    category: 'Science & Nature',
    stars: 2,
    selected: false,
    disabled: false,
    played: false,
  },
};

export const History: Story = {
  args: {
    category: 'History',
    stars: 1,
    selected: false,
    disabled: false,
    played: false,
  },
};

export const Geography: Story = {
  args: {
    category: 'Geography',
    stars: 3,
    selected: false,
    disabled: false,
    played: false,
  },
};

export const FilmAndTv: Story = {
  args: {
    category: 'Film & TV',
    stars: 2,
    selected: false,
    disabled: false,
    played: false,
  },
};

export const Music: Story = {
  args: {
    category: 'Music',
    stars: 1,
    selected: false,
    disabled: false,
    played: false,
  },
};

export const Sports: Story = {
  args: {
    category: 'Sports',
    stars: 3,
    selected: false,
    disabled: false,
    played: false,
  },
};

export const Selected: Story = {
  args: {
    category: 'Science & Nature',
    stars: 2,
    selected: true,
    disabled: false,
    played: false,
  },
};

export const Disabled: Story = {
  args: {
    category: 'History',
    stars: 1,
    selected: false,
    disabled: true,
    played: false,
  },
};

export const Played: Story = {
  args: {
    category: 'Geography',
    stars: 2,
    selected: false,
    disabled: false,
    played: true,
  },
};

export const ThreeStars: Story = {
  args: {
    category: 'Gaming & Internet',
    stars: 3,
    selected: false,
    disabled: false,
    played: false,
  },
};

export const AllCategories: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-wrap: wrap; gap: 12px;">
        <bzm-category-card category="Science & Nature" [stars]="2" />
        <bzm-category-card category="History" [stars]="1" />
        <bzm-category-card category="Geography" [stars]="3" />
        <bzm-category-card category="Film & TV" [stars]="2" />
        <bzm-category-card category="Music" [stars]="1" />
        <bzm-category-card category="Sports" [stars]="3" />
        <bzm-category-card category="Animals & Nature" [stars]="2" />
        <bzm-category-card category="Gaming & Internet" [stars]="1" />
      </div>
    `,
    moduleMetadata: {
      imports: [BzmCategoryCardComponent],
    },
  }),
};

export const AllStates: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-wrap: wrap; gap: 12px;">
        <bzm-category-card category="Science & Nature" [stars]="2" />
        <bzm-category-card category="History" [stars]="1" [selected]="true" />
        <bzm-category-card category="Geography" [stars]="3" [disabled]="true" />
        <bzm-category-card category="Film & TV" [stars]="2" [played]="true" />
      </div>
    `,
    moduleMetadata: {
      imports: [BzmCategoryCardComponent],
    },
  }),
};
