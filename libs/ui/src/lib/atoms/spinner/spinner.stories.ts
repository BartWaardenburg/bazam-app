import type { Meta, StoryObj } from '@storybook/angular';
import { BzmSpinnerComponent } from './spinner.component';

const meta: Meta<BzmSpinnerComponent> = {
  title: 'Atoms/Spinner',
  component: BzmSpinnerComponent,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    ariaLabel: { control: 'text' },
  },
  args: {
    size: 'md',
    ariaLabel: 'Laden...',
  },
};

export default meta;
type Story = StoryObj<BzmSpinnerComponent>;

export const Default: Story = {};

export const Small: Story = {
  args: { size: 'sm' },
};

export const Large: Story = {
  args: { size: 'lg' },
};

export const AllSizes: Story = {
  render: () => ({
    template: `
      <div style="display: flex; gap: 24px; align-items: center;">
        <div style="text-align: center; font-family: var(--bzm-font-family);">
          <bzm-spinner size="sm" />
          <p style="margin: 8px 0 0; font-size: 0.75rem; color: var(--bzm-color-text-muted);">Small</p>
        </div>
        <div style="text-align: center; font-family: var(--bzm-font-family);">
          <bzm-spinner size="md" />
          <p style="margin: 8px 0 0; font-size: 0.75rem; color: var(--bzm-color-text-muted);">Medium</p>
        </div>
        <div style="text-align: center; font-family: var(--bzm-font-family);">
          <bzm-spinner size="lg" />
          <p style="margin: 8px 0 0; font-size: 0.75rem; color: var(--bzm-color-text-muted);">Large</p>
        </div>
      </div>
    `,
    moduleMetadata: {
      imports: [BzmSpinnerComponent],
    },
  }),
};
