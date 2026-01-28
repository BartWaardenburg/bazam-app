import type { Meta, StoryObj } from '@storybook/angular';
import { BzmActionBarComponent } from './action-bar.component';
import { BzmButtonComponent } from '../../atoms/button/button.component';

const meta: Meta<BzmActionBarComponent> = {
  title: 'Molecules/ActionBar',
  component: BzmActionBarComponent,
  tags: ['autodocs'],
  argTypes: {
    align: { control: 'select', options: ['left', 'center', 'right', 'space-between'] },
    direction: { control: 'select', options: ['row', 'column'] },
  },
  args: {
    align: 'center',
    direction: 'row',
  },
  decorators: [
    (story) => ({
      ...story(),
      styles: [`:host { display: block; max-width: 500px; }`],
    }),
  ],
};

export default meta;
type Story = StoryObj<BzmActionBarComponent>;

export const Center: Story = {
  render: (args) => ({
    props: args,
    template: `
      <bzm-action-bar [align]="align" [direction]="direction">
        <bzm-button variant="primary">Quiz starten</bzm-button>
        <bzm-button variant="secondary">Meedoen</bzm-button>
      </bzm-action-bar>
    `,
    moduleMetadata: {
      imports: [BzmActionBarComponent, BzmButtonComponent],
    },
  }),
};

export const SpaceBetween: Story = {
  args: { align: 'space-between' },
  render: (args) => ({
    props: args,
    template: `
      <bzm-action-bar [align]="align">
        <bzm-button variant="ghost">Terug</bzm-button>
        <bzm-button variant="primary">Volgende</bzm-button>
      </bzm-action-bar>
    `,
    moduleMetadata: {
      imports: [BzmActionBarComponent, BzmButtonComponent],
    },
  }),
};

export const Column: Story = {
  args: { direction: 'column' },
  render: (args) => ({
    props: args,
    template: `
      <bzm-action-bar [direction]="direction">
        <bzm-button variant="primary" [fullWidth]="true">Quiz starten</bzm-button>
        <bzm-button variant="secondary" [fullWidth]="true">Meedoen</bzm-button>
        <bzm-button variant="ghost" [fullWidth]="true">Uitleg</bzm-button>
      </bzm-action-bar>
    `,
    moduleMetadata: {
      imports: [BzmActionBarComponent, BzmButtonComponent],
    },
  }),
};

export const ThreeButtons: Story = {
  render: () => ({
    template: `
      <bzm-action-bar>
        <bzm-button variant="primary">Opnieuw</bzm-button>
        <bzm-button variant="secondary">Overzicht</bzm-button>
        <bzm-button variant="ghost">Home</bzm-button>
      </bzm-action-bar>
    `,
    moduleMetadata: {
      imports: [BzmActionBarComponent, BzmButtonComponent],
    },
  }),
};
