import type { Meta, StoryObj } from '@storybook/angular';
import { BzmButtonComponent } from './button.component';

const meta: Meta<BzmButtonComponent> = {
  title: 'Atoms/Button',
  component: BzmButtonComponent,
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'accent', 'ghost'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    disabled: { control: 'boolean' },
    fullWidth: { control: 'boolean' },
  },
  args: {
    variant: 'primary',
    size: 'md',
    disabled: false,
    fullWidth: false,
  },
  render: (args) => ({
    props: args,
    template: `<bzm-button [variant]="variant" [size]="size" [disabled]="disabled" [fullWidth]="fullWidth">Click me</bzm-button>`,
  }),
};

export default meta;
type Story = StoryObj<BzmButtonComponent>;

export const Primary: Story = {
  args: { variant: 'primary' },
};

export const Secondary: Story = {
  args: { variant: 'secondary' },
};

export const Accent: Story = {
  args: { variant: 'accent' },
  render: (args) => ({
    props: args,
    template: `<bzm-button [variant]="variant" [size]="size" [disabled]="disabled">Let's go!</bzm-button>`,
  }),
};

export const Ghost: Story = {
  args: { variant: 'ghost' },
};

export const Small: Story = {
  args: { size: 'sm' },
};

export const Large: Story = {
  args: { size: 'lg' },
};

export const Disabled: Story = {
  args: { disabled: true },
};

export const FullWidth: Story = {
  args: { fullWidth: true },
  render: (args) => ({
    props: args,
    template: `
      <div style="width: 320px;">
        <bzm-button [variant]="variant" [size]="size" [disabled]="disabled" [fullWidth]="fullWidth">Full Width Button</bzm-button>
      </div>
    `,
  }),
};

export const AllVariants: Story = {
  render: () => ({
    template: `
      <div style="display: flex; gap: 12px; align-items: center; flex-wrap: wrap;">
        <bzm-button variant="primary">Primary</bzm-button>
        <bzm-button variant="secondary">Secondary</bzm-button>
        <bzm-button variant="accent">Let's go!</bzm-button>
        <bzm-button variant="ghost">Ghost</bzm-button>
      </div>
    `,
  }),
};

export const AllSizes: Story = {
  render: () => ({
    template: `
      <div style="display: flex; gap: 12px; align-items: center;">
        <bzm-button size="sm">Small</bzm-button>
        <bzm-button size="md">Medium</bzm-button>
        <bzm-button size="lg">Large</bzm-button>
      </div>
    `,
  }),
};
