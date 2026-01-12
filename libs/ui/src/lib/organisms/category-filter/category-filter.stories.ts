import type { Meta, StoryObj } from '@storybook/angular';
import { BzmCategoryFilterComponent } from './category-filter.component';

const meta: Meta<BzmCategoryFilterComponent> = {
  title: 'Organisms/CategoryFilter',
  component: BzmCategoryFilterComponent,
  decorators: [
    (story) => ({
      ...story(),
      template: `<div style="max-width: 400px;">${story().template ?? '<bzm-category-filter [categories]="categories" [activeCategory]="activeCategory" (categoryChange)="categoryChange($event)" />'}</div>`,
    }),
  ],
  args: {
    categories: ['All', 'Science', 'Math', 'History', 'Geography', 'Art', 'Music'],
    activeCategory: 'All',
  },
};

export default meta;
type Story = StoryObj<BzmCategoryFilterComponent>;

export const Default: Story = {};

export const ScienceSelected: Story = {
  args: {
    activeCategory: 'Science',
  },
};

export const FewCategories: Story = {
  args: {
    categories: ['All', 'Easy', 'Medium', 'Hard'],
    activeCategory: 'All',
  },
};

export const ManyCategories: Story = {
  args: {
    categories: [
      'All', 'Science', 'Math', 'History', 'Geography',
      'Art', 'Music', 'Sports', 'Literature', 'Technology',
      'Nature', 'Languages',
    ],
    activeCategory: 'All',
  },
};
