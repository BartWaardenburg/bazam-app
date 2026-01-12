import type { Meta, StoryObj } from '@storybook/angular';
import { BzmInputComponent } from './input.component';

const meta: Meta<BzmInputComponent> = {
  title: 'Atoms/Input',
  component: BzmInputComponent,
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
    placeholder: { control: 'text' },
    value: { control: 'text' },
    type: { control: 'select', options: ['text', 'email', 'password', 'number'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    disabled: { control: 'boolean' },
    error: { control: 'text' },
    maxLength: { control: 'number' },
  },
  args: {
    placeholder: 'Typ hier...',
    size: 'md',
    disabled: false,
  },
  decorators: [
    (story) => ({
      ...story(),
      styles: [`:host { display: block; max-width: 360px; }`],
    }),
  ],
  render: (args) => ({
    props: args,
    template: `
      <bzm-input
        [label]="label"
        [placeholder]="placeholder"
        [value]="value"
        [type]="type"
        [size]="size"
        [disabled]="disabled"
        [error]="error"
        [maxLength]="maxLength"
      />
    `,
  }),
};

export default meta;
type Story = StoryObj<BzmInputComponent>;

export const Default: Story = {
  args: {
    placeholder: 'Typ hier...',
  },
};

export const WithLabel: Story = {
  args: {
    label: 'Naam',
    placeholder: 'Jouw naam...',
  },
};

export const Small: Story = {
  args: {
    size: 'sm',
    placeholder: 'Klein',
  },
};

export const Large: Story = {
  args: {
    size: 'lg',
    placeholder: 'Groot',
  },
};

export const WithError: Story = {
  args: {
    label: 'Naam',
    value: '',
    error: 'Naam is verplicht',
  },
};

export const Disabled: Story = {
  args: {
    label: 'Naam',
    value: 'Uitgeschakeld',
    disabled: true,
  },
};

export const WithMaxLength: Story = {
  args: {
    label: 'Bijnaam',
    placeholder: 'Max 20 tekens',
    maxLength: 20,
  },
};

export const AllSizes: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px; max-width: 360px;">
        <bzm-input size="sm" placeholder="Klein" label="Small" />
        <bzm-input size="md" placeholder="Medium" label="Medium" />
        <bzm-input size="lg" placeholder="Groot" label="Large" />
      </div>
    `,
    moduleMetadata: {
      imports: [BzmInputComponent],
    },
  }),
};

export const AllStates: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px; max-width: 360px;">
        <bzm-input label="Normaal" placeholder="Typ hier..." />
        <bzm-input label="Met waarde" value="Bart" />
        <bzm-input label="Met fout" value="" error="Dit veld is verplicht" />
        <bzm-input label="Uitgeschakeld" value="Kan niet bewerken" [disabled]="true" />
      </div>
    `,
    moduleMetadata: {
      imports: [BzmInputComponent],
    },
  }),
};
