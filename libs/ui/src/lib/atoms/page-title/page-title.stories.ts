import type { Meta, StoryObj } from '@storybook/angular';
import { BzmPageTitleComponent } from './page-title.component';

const meta: Meta<BzmPageTitleComponent> = {
  title: 'Atoms/PageTitle',
  component: BzmPageTitleComponent,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg', 'xl'] },
    color: { control: 'color' },
    align: { control: 'select', options: ['left', 'center', 'right'] },
  },
  args: {
    size: 'md',
    color: 'var(--bzm-color-primary)',
    align: 'center',
  },
  render: (args) => ({
    props: args,
    template: `<bzm-page-title [size]="size" [color]="color" [align]="align">Quiz Starten</bzm-page-title>`,
  }),
};

export default meta;
type Story = StoryObj<BzmPageTitleComponent>;

export const Default: Story = {};

export const AccentColor: Story = {
  args: { color: 'var(--bzm-color-accent)' },
  render: (args) => ({
    props: args,
    template: `<bzm-page-title [size]="size" [color]="color">Bazam!</bzm-page-title>`,
  }),
};

export const LeftAligned: Story = {
  args: { align: 'left' },
  render: (args) => ({
    props: args,
    template: `<bzm-page-title [size]="size" [color]="color" [align]="align">Maak Een Quiz</bzm-page-title>`,
  }),
};

export const AllSizes: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px;">
        <bzm-page-title size="sm">Small Title</bzm-page-title>
        <bzm-page-title size="md">Medium Title</bzm-page-title>
        <bzm-page-title size="lg">Large Title</bzm-page-title>
        <bzm-page-title size="xl">XL Title</bzm-page-title>
      </div>
    `,
    moduleMetadata: {
      imports: [BzmPageTitleComponent],
    },
  }),
};

export const ColorVariants: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 12px;">
        <bzm-page-title color="var(--bzm-color-primary)">Rood</bzm-page-title>
        <bzm-page-title color="var(--bzm-color-accent)">Geel</bzm-page-title>
        <bzm-page-title color="var(--bzm-color-answer-a)">Cyan</bzm-page-title>
        <bzm-page-title color="var(--bzm-color-success)">Groen</bzm-page-title>
      </div>
    `,
    moduleMetadata: {
      imports: [BzmPageTitleComponent],
    },
  }),
};
