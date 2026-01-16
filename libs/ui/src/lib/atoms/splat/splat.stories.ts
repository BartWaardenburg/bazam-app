import type { Meta, StoryObj } from '@storybook/angular';
import { BzmSplatComponent } from './splat.component';

const meta: Meta<BzmSplatComponent> = {
  title: 'Atoms/Splat',
  component: BzmSplatComponent,
  tags: ['autodocs'],
  argTypes: {
    shape: { control: 'select', options: ['burst', 'star'] },
    color: { control: 'color' },
    size: { control: 'text' },
  },
  args: {
    shape: 'burst',
    color: 'var(--bzm-color-primary)',
    size: '120px',
  },
  decorators: [
    (story) => ({
      ...story(),
      styles: [`:host { display: block; padding: 40px; background: var(--bzm-color-bg); }`],
    }),
  ],
};

export default meta;
type Story = StoryObj<BzmSplatComponent>;

export const Burst: Story = {
  args: { shape: 'burst' },
};

export const Star: Story = {
  args: { shape: 'star', color: 'var(--bzm-color-accent)' },
};

export const Large: Story = {
  args: { size: '200px', color: 'var(--bzm-color-answer-a)' },
};

export const Small: Story = {
  args: { size: '60px' },
};

export const AllVariants: Story = {
  render: () => ({
    template: `
      <div style="display: flex; gap: 32px; align-items: center; flex-wrap: wrap;">
        <div style="text-align: center; font-family: var(--bzm-font-family);">
          <bzm-splat shape="burst" color="var(--bzm-color-primary)" size="100px" />
          <p style="margin: 8px 0 0; font-size: 0.75rem; color: var(--bzm-color-text-muted);">Burst / Red</p>
        </div>
        <div style="text-align: center; font-family: var(--bzm-font-family);">
          <bzm-splat shape="star" color="var(--bzm-color-accent)" size="100px" />
          <p style="margin: 8px 0 0; font-size: 0.75rem; color: var(--bzm-color-text-muted);">Star / Yellow</p>
        </div>
        <div style="text-align: center; font-family: var(--bzm-font-family);">
          <bzm-splat shape="burst" color="var(--bzm-color-answer-a)" size="100px" />
          <p style="margin: 8px 0 0; font-size: 0.75rem; color: var(--bzm-color-text-muted);">Burst / Cyan</p>
        </div>
        <div style="text-align: center; font-family: var(--bzm-font-family);">
          <bzm-splat shape="star" color="var(--bzm-color-success)" size="100px" />
          <p style="margin: 8px 0 0; font-size: 0.75rem; color: var(--bzm-color-text-muted);">Star / Green</p>
        </div>
      </div>
    `,
    moduleMetadata: {
      imports: [BzmSplatComponent],
    },
  }),
};
