import type { Meta, StoryObj } from '@storybook/angular';
import { BzmStarRatingComponent } from './star-rating.component';

const meta: Meta<BzmStarRatingComponent> = {
  title: 'Atoms/StarRating',
  component: BzmStarRatingComponent,
  argTypes: {
    stars: {
      control: 'select',
      options: [1, 2, 3],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
  },
  args: {
    stars: 2,
    size: 'md',
  },
};

export default meta;
type Story = StoryObj<BzmStarRatingComponent>;

export const OneStar: Story = {
  args: {
    stars: 1,
  },
};

export const TwoStars: Story = {
  args: {
    stars: 2,
  },
};

export const ThreeStars: Story = {
  args: {
    stars: 3,
  },
};

export const SmallSize: Story = {
  args: {
    stars: 3,
    size: 'sm',
  },
};

export const LargeSize: Story = {
  args: {
    stars: 3,
    size: 'lg',
  },
};

export const AllDifficulties: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 12px;">
        <div style="display: flex; align-items: center; gap: 12px;">
          <span style="width: 80px; font-weight: bold;">Easy</span>
          <bzm-star-rating [stars]="1" />
        </div>
        <div style="display: flex; align-items: center; gap: 12px;">
          <span style="width: 80px; font-weight: bold;">Medium</span>
          <bzm-star-rating [stars]="2" />
        </div>
        <div style="display: flex; align-items: center; gap: 12px;">
          <span style="width: 80px; font-weight: bold;">Hard</span>
          <bzm-star-rating [stars]="3" />
        </div>
      </div>
    `,
    moduleMetadata: {
      imports: [BzmStarRatingComponent],
    },
  }),
};

export const AllSizes: Story = {
  render: () => ({
    template: `
      <div style="display: flex; align-items: center; gap: 24px;">
        <bzm-star-rating [stars]="3" size="sm" />
        <bzm-star-rating [stars]="3" size="md" />
        <bzm-star-rating [stars]="3" size="lg" />
      </div>
    `,
    moduleMetadata: {
      imports: [BzmStarRatingComponent],
    },
  }),
};
