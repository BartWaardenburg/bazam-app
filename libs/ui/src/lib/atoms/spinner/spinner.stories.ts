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
      <div style="display: flex; gap: 48px; align-items: end; padding: 32px; font-family: var(--bzm-font-family);">
        <div style="text-align: center;">
          <bzm-spinner size="sm" />
          <p style="margin: 12px 0 0; font-size: 0.75rem; color: var(--bzm-color-text-muted); font-weight: 600;">Small</p>
        </div>
        <div style="text-align: center;">
          <bzm-spinner size="md" />
          <p style="margin: 12px 0 0; font-size: 0.75rem; color: var(--bzm-color-text-muted); font-weight: 600;">Medium</p>
        </div>
        <div style="text-align: center;">
          <bzm-spinner size="lg" />
          <p style="margin: 12px 0 0; font-size: 0.75rem; color: var(--bzm-color-text-muted); font-weight: 600;">Large</p>
        </div>
      </div>
    `,
    moduleMetadata: {
      imports: [BzmSpinnerComponent],
    },
  }),
};

export const OnDarkBackground: Story = {
  render: () => ({
    template: `
      <div style="background: var(--bzm-gray-800); border-radius: 8px; padding: 48px; display: flex; align-items: center; justify-content: center;">
        <bzm-spinner size="lg" />
      </div>
    `,
    moduleMetadata: {
      imports: [BzmSpinnerComponent],
    },
  }),
};
