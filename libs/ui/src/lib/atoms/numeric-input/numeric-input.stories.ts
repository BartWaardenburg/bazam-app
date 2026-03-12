import type { Meta, StoryObj } from '@storybook/angular';
import { BzmNumericInputComponent } from './numeric-input.component';

const meta: Meta<BzmNumericInputComponent> = {
  title: 'Atoms/NumericInput',
  component: BzmNumericInputComponent,
  tags: ['autodocs'],
  argTypes: {
    value: { control: 'number' },
    placeholder: { control: 'text' },
    min: { control: 'number' },
    max: { control: 'number' },
    disabled: { control: 'boolean' },
    size: { control: 'select', options: ['md', 'lg'] },
  },
  args: {
    value: null,
    placeholder: 'Typ je gok...',
    min: null,
    max: null,
    disabled: false,
    size: 'lg',
  },
  decorators: [
    (story) => ({
      ...story(),
      styles: [`:host { display: block; max-width: 420px; padding: 24px; }`],
    }),
  ],
  render: (args) => ({
    props: {
      ...args,
      onValueChange(val: number | null) {
        this['value'] = val;
      },
    },
    template: `
      <bzm-numeric-input
        [value]="value"
        [placeholder]="placeholder"
        [min]="min"
        [max]="max"
        [disabled]="disabled"
        [size]="size"
        (valueChange)="onValueChange($event)"
      />
    `,
  }),
};

export default meta;
type Story = StoryObj<BzmNumericInputComponent>;

export const Default: Story = {};

export const WithValue: Story = {
  args: {
    value: 42,
  },
};

export const WithMinMax: Story = {
  args: {
    value: 50,
    min: 0,
    max: 100,
  },
};

export const Disabled: Story = {
  args: {
    value: 123,
    disabled: true,
  },
};

export const SmallSize: Story = {
  args: {
    size: 'md',
    placeholder: 'Gok...',
  },
};
